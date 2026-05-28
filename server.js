console.log('FCAT startup — Node.js', process.version, '— pid', process.pid);
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
let Database;
try {
  ({ DatabaseSync: Database } = require('node:sqlite'));
  console.log('node:sqlite OK');
} catch (_err) {
  console.log(`[FATAL] node:sqlite no disponible. Node: ${process.version}. Error: ${_err.message}`);
  process.stderr.write(`[FATAL] node:sqlite no disponible: ${_err.message}\n`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;
// Límite de cupos por día por taller (configurable vía .env)
const CUPOS_MAX = parseInt(process.env.CUPOS_MAX || '20', 10);

// ─── Logger ─────────────────────────────────────────────────────────────────
let logStream = null;
try {
  const logsDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
  logStream = fs.createWriteStream(path.join(logsDir, 'server.log'), { flags: 'a' });
} catch (e) {
  process.stderr.write(`[WARN] No se pudo inicializar log en disco: ${e.message}\n`);
}
function log(level, msg) {
  const line = `[${new Date().toISOString()}] [${level}] ${msg}\n`;
  process.stdout.write(line);
  if (logStream) logStream.write(line);
}
console.log('logger OK');

// ─── Manejadores de errores globales ────────────────────────────────────────
process.on('uncaughtException', (err) => {
  const msg = `[FATAL] uncaughtException: ${err.message}\n${err.stack}`;
  console.log(msg);
  process.stderr.write(msg + '\n');
  if (logStream) try { logStream.write(msg + '\n'); } catch (_) {}
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  const msg = `[FATAL] unhandledRejection: ${String(reason)}`;
  console.log(msg);
  process.stderr.write(msg + '\n');
  if (logStream) try { logStream.write(msg + '\n'); } catch (_) {}
});

// ─── Base de datos ──────────────────────────────────────────────────────────
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
const DB_PATH = path.join(dataDir, 'fcat.db');

let db;

// ─── Admin session tokens (expiración 5 min, ventana deslizante) ────────────
const adminTokens = new Map(); // token → expiresAt (ms)
const TOKEN_TTL_MS = 5 * 60 * 1000;

// ─── Tipos MIME permitidos en uploads ───────────────────────────────────────
const ALLOWED_MIME = new Set([
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
  'image/bmp', 'image/tiff', 'image/svg+xml',
  'video/mp4', 'video/quicktime', 'video/x-msvideo',
  'video/x-matroska', 'video/webm', 'video/mpeg',
  'audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/ogg', 'audio/mp4',
]);

// ─── Directorio temporal para uploads (diskStorage, sin cargar en RAM) ───────
const TEMP_DIR = path.join(__dirname, 'temp_uploads');

// ─── Multer ──────────────────────────────────────────────────────────────────
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
      cb(null, TEMP_DIR);
    },
    filename: (_req, file, cb) => {
      const safeName = path.basename(file.originalname)
        .replace(/[^\w.\-()\u00C0-\u024F ]/g, '_');
      cb(null, `${Date.now()}_${crypto.randomBytes(4).toString('hex')}_${safeName}`);
    },
  }),
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) return cb(null, true);
    log('WARN', `Upload rechazado — MIME no permitido: '${file.mimetype}'`);
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
  },
});

// ─── Auth middleware ────────────────────────────────────────────────────────
function adminAuth(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  const token = auth.slice(7);
  const expiresAt = adminTokens.get(token);
  if (!expiresAt || Date.now() > expiresAt) {
    adminTokens.delete(token);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
  adminTokens.set(token, Date.now() + TOKEN_TTL_MS); // ventana deslizante
  req.adminToken = token;
  next();
}

// ─── Helpers de validación ───────────────────────────────────────────────────
function parseIntParam(val) {
  const n = parseInt(val, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function isValidRutFormat(rut) {
  const clean = String(rut || '').replace(/[.\s]/g, '').toUpperCase();
  return /^\d{1,8}-[\dK]$/.test(clean);
}

const DATE_RE  = /^\d{4}-\d{2}-\d{2}$/;
const FECHA_RE = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

function safeCompare(a, b) {
  const bA = Buffer.from(String(a));
  const bB = Buffer.from(String(b));
  if (bA.length !== bB.length) {
    crypto.timingSafeEqual(bA, Buffer.alloc(bA.length));
    return false;
  }
  return crypto.timingSafeEqual(bA, bB);
}

// ─── Metadatos duexpre para migración ───────────────────────────────────────
const DUEXPRE_META = {
  7:  { right_text: 'PAULA REPETTO' },
  8:  { right_text: 'PAULA REPETTO' },
  18: { right_text: 'PAULA REPETTO' },
  30: { left_text: 'MÚSICA FLAMENCA', right_text: 'GUSTAVO LOPEZ' },
  31: { left_text: 'MÚSICA FLAMENCA', right_text: 'GUSTAVO LOPEZ' },
  32: { left_text: 'MÚSICA FLAMENCA', right_text: 'GUSTAVO LOPEZ' },
  33: { left_text: 'MÚSICA FLAMENCA', right_text: 'GUSTAVO LOPEZ' },
  34: { left_text: 'MÚSICA FLAMENCA', right_text: 'GUSTAVO LOPEZ' },
  39: { left_text: 'CAJON FLAMENCO',  right_text: 'MARCELO SOLAR' },
  48: { left_text: 'CONCIERTO PARA FLAUTA Y PIANO', right_text: 'ROBERTO ORELLANA' },
  49: { left_text: 'CONCIERTO PARA FLAUTA Y PIANO', right_text: 'ROBERTO ORELLANA y PAULA REPETTO', audio_file: 'PaulaRoberto.mp3' },
  50: { left_text: 'CONCIERTO PARA FLAUTA Y PIANO', right_text: 'ROBERTO ORELLANA y PAULA REPETTO' },
  68: { left_text: 'DANZA AFGANA', right_text: 'GRETA BELIMOVA' },
  69: { left_text: 'DANZA AFGANA', right_text: 'GRETA BELIMOVA' },
  70: { right_text: 'BARBARA GONZALES', side_image: 'sidePic1' },
  71: { right_text: 'BARBARA GONZALES', side_image: 'sidePic1' },
  72: { right_text: 'TOMÁS GUBBING',    side_image: 'sidePic1' },
  73: { right_text: 'CESAR BERNAL',     side_image: 'sidePic1' },
  74: { right_text: 'CESAR BERNAL',     side_image: 'sidePic1' },
  75: { right_text: 'CESAR BERNAL',     side_image: 'sidePic1' },
  76: { right_text: 'GRACIELA MUÑOZ',   side_image: 'sidePic1' },
  77: { right_text: 'CRISTIAN LOPEZ',   side_image: 'sidePic1' },
  78: { right_text: 'CRISTIAN LOPEZ',   side_image: 'sidePic1' },
  79: { right_text: 'LODE IN', side_image: 'sidePic2' },
  80: { right_text: 'LODE IN', side_image: 'sidePic2' },
};

// ─── Semillas de carruseles ──────────────────────────────────────────────────
const CAROUSEL_SEEDS = [
  { nombre: 'escuelaNinos',    carpeta: 'assets/fotos/escuelaNinos/',                         prefijo: 'esNi',  ext_default: '.JPG'  },
  { nombre: 'escuelaCine',     carpeta: 'assets/fotos/escuelaCine/carousel/',                 prefijo: 'esCi',  ext_default: '.JPG'  },
  { nombre: 'expExiPreciones', carpeta: 'assets/fotos/duexpre/',                              prefijo: 'duexp', ext_default: '.JPG'  },
  { nombre: 'materiales',      carpeta: 'assets/fotos/residencia/materiales/',                prefijo: 'mat',   ext_default: '.JPEG' },
  { nombre: 'residentes',      carpeta: 'assets/fotos/residencia/residentes/',                prefijo: null,    ext_default: null    },
  { nombre: 'ciro',            carpeta: 'assets/fotos/residentes/cirobeltran/carousel/',      prefijo: 'cb',    ext_default: '.jpg'  },
  { nombre: 'cristal',         carpeta: 'assets/fotos/residentes/cristaljacob/carousel/',     prefijo: 'cj',    ext_default: '.jpg'  },
  { nombre: 'kenji',           carpeta: 'assets/fotos/residentes/kenjisenda/carousel/',       prefijo: 'ks',    ext_default: '.JPEG' },
  { nombre: 'dafna',           carpeta: 'assets/fotos/residentes/dafnakojchen/carousel/',     prefijo: 'dk',    ext_default: '.JPEG' },
  { nombre: 'fernando',        carpeta: 'assets/fotos/residentes/fernandowanders/carousel/',  prefijo: 'fw',    ext_default: '.jpg'  },
];

// Archivos hardcodeados para carruseles sin patrón numérico
const HARDCODED_FILES = {
  residentes: ['Ciro.jpg', 'Cristal.jpg', 'Kenji.JPEG', 'Dafna.JPEG', 'Fernando.jpeg'],
  ciro:       ['YelowYuyo.mp4'],
};

function extractParenthesisNumber(filename) {
  const match = filename.match(/\((\d+)\)/);
  return match ? parseInt(match[1], 10) : null;
}

function migrateCarouselItems(db) {
  const publicDir = path.join(__dirname, 'public');
  const insItem = db.prepare(`
    INSERT INTO CarouselItem (carousel_id, order_index, file_path, left_text, right_text, audio_file, side_image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const carousels = db.prepare('SELECT * FROM Carousel').all();

  for (const carousel of carousels) {
    const folderPath = path.join(publicDir, carousel.carpeta);
    let files = [];

    if (HARDCODED_FILES[carousel.nombre]) {
      files = HARDCODED_FILES[carousel.nombre];
    } else if (carousel.prefijo && fs.existsSync(folderPath)) {
      const prefixLower = carousel.prefijo.toLowerCase();
      files = fs.readdirSync(folderPath)
        .filter(f => f.toLowerCase().startsWith(prefixLower))
        .sort((a, b) => {
          const numA = extractParenthesisNumber(a);
          const numB = extractParenthesisNumber(b);
          if (numA !== null && numB !== null) return numA - numB;
          return a.localeCompare(b);
        });
    }

    files.forEach((filename, idx) => {
      const filePath = '/' + carousel.carpeta + filename;
      let meta = {};
      if (carousel.nombre === 'expExiPreciones') {
        const num = extractParenthesisNumber(filename);
        if (num !== null && DUEXPRE_META[num]) meta = DUEXPRE_META[num];
      }
      insItem.run(
        carousel.id, idx, filePath,
        meta.left_text || null, meta.right_text || null,
        meta.audio_file || null, meta.side_image || null
      );
    });
  }
}

function initDatabase() {
  db = new Database(DB_PATH);
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA foreign_keys = ON');
  db.exec('PRAGMA encoding = "UTF-8"');

  db.exec(`
    CREATE TABLE IF NOT EXISTS Taller (
      id                 INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_taller      TEXT NOT NULL,
      nombre_tallerista  TEXT NOT NULL,
      fecha1             DATETIME NOT NULL,
      fecha2             DATETIME NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Apoderado (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre    TEXT NOT NULL,
      rut       TEXT NOT NULL UNIQUE,
      telefono  TEXT NOT NULL,
      correo    TEXT NOT NULL,
      direccion TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Nino (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre           TEXT NOT NULL,
      edad             INTEGER NOT NULL,
      rut              TEXT NOT NULL UNIQUE,
      fecha_nacimiento DATE NOT NULL,
      apoderado_id     INTEGER NOT NULL REFERENCES Apoderado(id) ON DELETE CASCADE,
      info_extra       TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS Inscripcion (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      nino_id          INTEGER NOT NULL REFERENCES Nino(id) ON DELETE CASCADE,
      taller_id        INTEGER NOT NULL REFERENCES Taller(id) ON DELETE CASCADE,
      dias_asistencia  TEXT NOT NULL,
      UNIQUE(nino_id, taller_id)
    );

    CREATE TABLE IF NOT EXISTS Carousel (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre       TEXT NOT NULL UNIQUE,
      carpeta      TEXT NOT NULL,
      prefijo      TEXT,
      ext_default  TEXT
    );

    CREATE TABLE IF NOT EXISTS CarouselItem (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      carousel_id  INTEGER NOT NULL REFERENCES Carousel(id) ON DELETE CASCADE,
      order_index  INTEGER NOT NULL,
      file_path    TEXT NOT NULL,
      left_text    TEXT,
      right_text   TEXT,
      audio_file   TEXT,
      side_image   TEXT
    );
  `);

  // Seed inicial: insertar talleres solo si la tabla está vacía
  const { cnt } = db.prepare('SELECT COUNT(*) AS cnt FROM Taller').get();
  if (cnt === 0) {
    const ins = db.prepare(
      'INSERT INTO Taller (nombre_taller, nombre_tallerista, fecha1, fecha2) VALUES (?, ?, ?, ?)'
    );
    db.transaction(() => {
      ins.run('Música',      'Cristian López',   '2026-06-22 09:00:00', '2026-06-29 09:00:00');
      ins.run('Stop Motion', 'Gonzalo Beltrán',  '2026-06-23 09:00:00', '2026-06-30 09:00:00');
      ins.run('Escultura',   'Eduardo Nova',     '2026-06-24 09:00:00', '2026-07-01 09:00:00');
      ins.run('Cerámica',    'Françoise Tixier', '2026-06-25 09:00:00', '2026-07-02 09:00:00');
      ins.run('Grabado',     'Felipe Araya',     '2026-06-26 09:00:00', '2026-07-03 09:00:00');
    })();
  }

  // Seed carruseles
  const { cnt: carouselCnt } = db.prepare('SELECT COUNT(*) AS cnt FROM Carousel').get();
  if (carouselCnt === 0) {
    const insC = db.prepare(
      'INSERT INTO Carousel (nombre, carpeta, prefijo, ext_default) VALUES (?, ?, ?, ?)'
    );
    db.transaction(() => {
      for (const c of CAROUSEL_SEEDS) insC.run(c.nombre, c.carpeta, c.prefijo, c.ext_default);
    })();
  }

  // Migrar items de carrusel desde disco si la tabla está vacía
  const { cnt: itemCnt } = db.prepare('SELECT COUNT(*) AS cnt FROM CarouselItem').get();
  if (itemCnt === 0) {
    db.transaction(() => migrateCarouselItems(db))();
    log('INFO', '✔ Migración de CarouselItem completada');
  }
}

// ─── Middleware ─────────────────────────────────────────────────────────────
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '50kb' }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    log('WARN', `Rate limit login IP ${req.ip}`);
    res.status(429).json({ error: 'Demasiados intentos. Intente en 15 minutos.' });
  },
});

const inscripcionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 7,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Demasiadas solicitudes. Intente en 1 hora.' },
});

// ─── Rutas ──────────────────────────────────────────────────────────────────
app.get('/api/talleres', (req, res) => {
  const rows = db.prepare('SELECT * FROM Taller ORDER BY fecha1').all();
  res.json(rows);
});

app.get('/api/ninos/:tallerId', (req, res) => {
  const tallerId = parseIntParam(req.params.tallerId);
  if (!tallerId) return res.status(400).json({ error: 'ID inválido' });
  const rows = db.prepare(`
    SELECT n.id, n.nombre, n.edad, n.rut, n.fecha_nacimiento, n.info_extra,
           i.dias_asistencia, i.taller_id
    FROM   Inscripcion i
    JOIN   Nino n ON n.id = i.nino_id
    WHERE  i.taller_id = ?
    ORDER  BY n.nombre
  `).all(tallerId);
  res.json(rows);
});

app.get('/api/conteo', (req, res) => {
  const rows = db.prepare(
    'SELECT taller_id, COUNT(*) AS conteo FROM Inscripcion GROUP BY taller_id'
  ).all();
  res.json(rows);
});

app.get('/api/conteo-por-dia', (req, res) => {
  const rows = db.prepare(`
    SELECT
      t.id        AS taller_id,
      t.fecha1,
      t.fecha2,
      SUM(CASE WHEN i.dias_asistencia LIKE '%' || t.fecha1 || '%' THEN 1 ELSE 0 END) AS count_dia1,
      SUM(CASE WHEN i.dias_asistencia LIKE '%' || t.fecha2 || '%' THEN 1 ELSE 0 END) AS count_dia2
    FROM Taller t
    LEFT JOIN Inscripcion i ON i.taller_id = t.id
    GROUP BY t.id
    ORDER BY t.fecha1
  `).all();
  res.json(rows);
});

app.post('/api/inscripcion', inscripcionLimiter, (req, res) => {
  const { apoderado, ninos } = req.body;
  if (!apoderado || !Array.isArray(ninos) || ninos.length === 0) {
    return res.status(400).json({ success: false, error: 'Datos incompletos' });
  }
  // ── Validación server-side ──────────────────────────────────────────────
  const vErr = [];
  const aStr = (f) => typeof apoderado[f] === 'string' ? apoderado[f].trim() : '';
  if (!aStr('nombre')   || aStr('nombre').length   > 120) vErr.push('nombre del apoderado inválido');
  if (!isValidRutFormat(apoderado.rut))                    vErr.push('RUT del apoderado inválido');
  if (!aStr('telefono') || aStr('telefono').length > 20)   vErr.push('teléfono inválido');
  if (!aStr('correo')   || !aStr('correo').includes('@') || aStr('correo').length > 100)
    vErr.push('correo inválido');
  if (!aStr('direccion') || aStr('direccion').length > 200) vErr.push('dirección inválida');
  if (ninos.length > 7) vErr.push('máximo 7 niños por inscripción');
  ninos.forEach((n, i) => {
    const p = `Niño ${i + 1}`;
    const nStr = (f) => typeof n[f] === 'string' ? n[f].trim() : '';
    if (!nStr('nombre') || nStr('nombre').length > 120)  vErr.push(`${p}: nombre inválido`);
    const edad = parseInt(n.edad, 10);
    if (!Number.isFinite(edad) || edad < 1 || edad > 17) vErr.push(`${p}: edad inválida`);
    if (!isValidRutFormat(n.rut))                        vErr.push(`${p}: RUT inválido`);
    if (!DATE_RE.test(n.fechaNacimiento))                vErr.push(`${p}: fecha de nacimiento inválida`);
    if (typeof n.infoExtra === 'string' && n.infoExtra.length > 500)
      vErr.push(`${p}: info extra demasiado larga`);
    if (!Array.isArray(n.inscripciones) || n.inscripciones.length === 0)
      vErr.push(`${p}: sin inscripciones`);
  });
  if (vErr.length > 0) {
    return res.status(400).json({ success: false, error: vErr[0] });
  }
  try {
    const upsertApoderado = db.prepare(`
      INSERT INTO Apoderado (nombre, rut, telefono, correo, direccion)
      VALUES (@nombre, @rut, @telefono, @correo, @direccion)
      ON CONFLICT(rut) DO UPDATE SET
        nombre    = excluded.nombre,
        telefono  = excluded.telefono,
        correo    = excluded.correo,
        direccion = excluded.direccion
    `);
    const getApoderado = db.prepare('SELECT id FROM Apoderado WHERE rut = ?');

    const upsertNino = db.prepare(`
      INSERT INTO Nino (nombre, edad, rut, fecha_nacimiento, apoderado_id, info_extra)
      VALUES (@nombre, @edad, @rut, @fechaNacimiento, @apoderadoId, @infoExtra)
      ON CONFLICT(rut) DO UPDATE SET
        nombre           = excluded.nombre,
        edad             = excluded.edad,
        fecha_nacimiento = excluded.fecha_nacimiento,
        apoderado_id     = excluded.apoderado_id,
        info_extra       = excluded.info_extra
    `);
    const getNino = db.prepare('SELECT id FROM Nino WHERE rut = ?');

    const insInscripcion = db.prepare(`
      INSERT OR IGNORE INTO Inscripcion (nino_id, taller_id, dias_asistencia)
      VALUES (@ninoId, @tallerId, @diasAsistencia)
    `);

    // Cuenta inscripciones para un taller+día (incluye inserciones hechas en esta transacción)
    const getCuposDia = db.prepare(
      `SELECT COUNT(*) as cnt FROM Inscripcion WHERE taller_id = ? AND dias_asistencia LIKE '%' || ? || '%'`
    );
    const getTallerNombre = db.prepare('SELECT nombre_taller FROM Taller WHERE id = ?');

    const resultados = [];

    db.transaction(() => {
      upsertApoderado.run(apoderado);
      const apoderadoId = getApoderado.get(apoderado.rut).id;

      for (const nino of ninos) {
        upsertNino.run({
          nombre:          nino.nombre,
          edad:            nino.edad,
          rut:             nino.rut,
          fechaNacimiento: nino.fechaNacimiento,
          apoderadoId,
          infoExtra:       nino.infoExtra || '',
        });
        const ninoId = getNino.get(nino.rut).id;
        const ninoResultado = { nombre: nino.nombre, detalle: [] };

        for (const insc of nino.inscripciones) {
          const diasSolicitados = Array.isArray(insc.diasAsistencia) ? insc.diasAsistencia : [];
          const diasInscritos = [];
          const diasSinCupo   = [];

          for (const fecha of diasSolicitados) {
            if (!FECHA_RE.test(fecha)) { diasSinCupo.push(fecha); continue; }
            const { cnt } = getCuposDia.get(insc.tallerId, fecha);
            if (cnt < CUPOS_MAX) {
              diasInscritos.push(fecha);
            } else {
              diasSinCupo.push(fecha);
            }
          }

          if (diasInscritos.length > 0) {
            insInscripcion.run({
              ninoId,
              tallerId:       insc.tallerId,
              diasAsistencia: diasInscritos.join(','),
            });
          }

          const tallerRow = getTallerNombre.get(insc.tallerId);
          ninoResultado.detalle.push({
            taller:       tallerRow ? tallerRow.nombre_taller : `Taller ${insc.tallerId}`,
            diasInscritos,
            diasSinCupo,
          });
        }
        resultados.push(ninoResultado);
      }
    })();

    const algunaSinCupo = resultados.some(r => r.detalle.some(d => d.diasSinCupo.length > 0));
    res.json({ success: true, resultados, algunaSinCupo });
  } catch (err) {
    log('ERROR', `POST /api/inscripcion: ${err.message}`);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// ─── Rutas públicas de carrusel ─────────────────────────────────────────────
app.get('/api/carousel-items/:nombre', (req, res) => {
  const carousel = db.prepare('SELECT * FROM Carousel WHERE nombre = ?').get(req.params.nombre);
  if (!carousel) return res.status(404).json({ error: 'Carrusel no encontrado' });
  const items = db.prepare(
    'SELECT * FROM CarouselItem WHERE carousel_id = ? ORDER BY order_index'
  ).all(carousel.id);
  res.json(items);
});

app.get('/api/carousels', (req, res) => {
  const rows = db.prepare('SELECT id, nombre, carpeta, prefijo, ext_default FROM Carousel').all();
  res.json(rows);
});

// ─── Rutas de administración ────────────────────────────────────────────────
app.post('/api/admin/login', loginLimiter, (req, res) => {
  const { username, password } = req.body || {};
  const expectedUser = process.env.ADMIN_USER || '';
  const expectedPass = (process.env.ADMIN_PASS || '').replace(/^"|"$/g, '');
  if (safeCompare(username, expectedUser) && safeCompare(password, expectedPass)) {
    const token = crypto.randomBytes(32).toString('hex');
    adminTokens.set(token, Date.now() + TOKEN_TTL_MS);
    log('INFO', `Login exitoso desde IP ${req.ip}`);
    return res.json({ success: true, token });
  }
  log('WARN', `Login fallido para usuario '${String(username || '').substring(0, 30)}' desde IP ${req.ip}`);
  res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
});

app.post('/api/admin/logout', adminAuth, (req, res) => {
  adminTokens.delete(req.adminToken);
  res.json({ success: true });
});

app.get('/api/admin/carousels', adminAuth, (req, res) => {
  const rows = db.prepare(`
    SELECT c.id, c.nombre, c.carpeta, c.prefijo, c.ext_default,
           COUNT(ci.id) AS item_count
    FROM Carousel c
    LEFT JOIN CarouselItem ci ON ci.carousel_id = c.id
    GROUP BY c.id
    ORDER BY c.id
  `).all();
  res.json(rows);
});

app.get('/api/admin/carousel/:id/items', adminAuth, (req, res) => {
  const carouselId = parseIntParam(req.params.id);
  if (!carouselId) return res.status(400).json({ error: 'ID inválido' });
  const items = db.prepare(
    'SELECT * FROM CarouselItem WHERE carousel_id = ? ORDER BY order_index'
  ).all(carouselId);
  res.json(items);
});

app.get('/api/admin/db-info', adminAuth, (req, res) => {
  const talleres = db.prepare('SELECT * FROM Taller ORDER BY fecha1').all();
  const inscripciones = db.prepare(`
    SELECT t.nombre_taller, n.nombre AS nino_nombre, n.edad, i.dias_asistencia,
           a.nombre AS apoderado_nombre, a.telefono, a.correo
    FROM Inscripcion i
    JOIN Nino n ON n.id = i.nino_id
    JOIN Apoderado a ON a.id = n.apoderado_id
    JOIN Taller t ON t.id = i.taller_id
    ORDER BY t.fecha1, n.nombre
  `).all();
  res.json({ talleres, inscripciones });
});

app.post('/api/admin/carousel/:id/upload', adminAuth, upload.array('files'), (req, res) => {
  const carouselId = parseIntParam(req.params.id);
  if (!carouselId) return res.status(400).json({ error: 'ID inválido' });
  const carousel = db.prepare('SELECT * FROM Carousel WHERE id = ?').get(carouselId);
  if (!carousel) return res.status(404).json({ error: 'Carrusel no encontrado' });
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No se recibieron archivos' });

  const destDir = path.join(__dirname, 'public', carousel.carpeta);
  fs.mkdirSync(destDir, { recursive: true });

  const existingItems = db.prepare(
    'SELECT file_path, order_index FROM CarouselItem WHERE carousel_id = ? ORDER BY order_index DESC'
  ).all(carouselId);
  let maxOrder = existingItems.length > 0 ? existingItems[0].order_index : -1;
  let maxN = 0;
  for (const item of existingItems) {
    const num = extractParenthesisNumber(path.basename(item.file_path));
    if (num !== null) maxN = Math.max(maxN, num);
  }

  const insItem = db.prepare(
    'INSERT INTO CarouselItem (carousel_id, order_index, file_path) VALUES (?, ?, ?)'
  );
  const results = [];

  try {
    db.transaction(() => {
      for (const file of req.files) {
        maxOrder++;
        let filename;
        if (carousel.prefijo) {
          maxN++;
          const ext = path.extname(file.originalname) || carousel.ext_default || '.jpg';
          filename = `${carousel.prefijo} (${maxN})${ext}`;
        } else {
          filename = path.basename(file.originalname)
            .replace(/[^\w.\-()\u00C0-\u024F ]/g, '_');
        }
        const finalPath = path.join(destDir, filename);
        fs.renameSync(file.path, finalPath);
        const filePath = '/' + carousel.carpeta + filename;
        const { lastInsertRowid } = insItem.run(carouselId, maxOrder, filePath);
        results.push({ id: lastInsertRowid, file_path: filePath, order_index: maxOrder });
      }
    })();
    res.json({ success: true, items: results });
  } catch (err) {
    for (const file of req.files) {
      try { if (fs.existsSync(file.path)) fs.unlinkSync(file.path); } catch (_) {}
    }
    log('ERROR', `Upload carousel ${carouselId}: ${err.message}`);
    res.status(500).json({ error: 'Error al procesar archivos' });
  }
});

app.delete('/api/admin/carousel-item/:itemId', adminAuth, (req, res) => {
  const itemId = parseIntParam(req.params.itemId);
  if (!itemId) return res.status(400).json({ error: 'ID inválido' });
  const item = db.prepare('SELECT * FROM CarouselItem WHERE id = ?').get(itemId);
  if (!item) return res.status(404).json({ error: 'Item no encontrado' });

  const relativePath = item.file_path.replace(/^\/+/, '');
  const publicDir = path.resolve(__dirname, 'public');
  const filePath = path.resolve(publicDir, relativePath);
  if (filePath.startsWith(publicDir + path.sep)) {
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
      log('WARN', `Error al eliminar archivo: ${err.message}`);
    }
  }

  db.prepare('DELETE FROM CarouselItem WHERE id = ?').run(itemId);

  const remaining = db.prepare(
    'SELECT id FROM CarouselItem WHERE carousel_id = ? ORDER BY order_index'
  ).all(item.carousel_id);
  const reindex = db.prepare('UPDATE CarouselItem SET order_index = ? WHERE id = ?');
  db.transaction(() => { remaining.forEach((r, idx) => reindex.run(idx, r.id)); })();

  res.json({ success: true });
});

app.put('/api/admin/carousel/:id/reorder', adminAuth, (req, res) => {
  const carouselId = parseIntParam(req.params.id);
  if (!carouselId) return res.status(400).json({ error: 'ID inválido' });
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds debe ser un array' });
  const update = db.prepare('UPDATE CarouselItem SET order_index = ? WHERE id = ? AND carousel_id = ?');
  db.transaction(() => {
    orderedIds.forEach((itemId, newIndex) => update.run(newIndex, itemId, carouselId));
  })();
  res.json({ success: true });
});

app.put('/api/admin/carousel-item/:itemId/metadata', adminAuth, (req, res) => {
  const itemId = parseIntParam(req.params.itemId);
  if (!itemId) return res.status(400).json({ error: 'ID inválido' });
  const { left_text, right_text, audio_file, side_image } = req.body;
  db.prepare(`
    UPDATE CarouselItem SET left_text = ?, right_text = ?, audio_file = ?, side_image = ?
    WHERE id = ?
  `).run(left_text || null, right_text || null, audio_file || null, side_image || null, itemId);
  res.json({ success: true });
});

// ─── Servir frontend (React build) ──────────────────────────────────────────
const buildDir = path.join(__dirname, 'build');
if (fs.existsSync(buildDir)) {
  app.use(express.static(buildDir));
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(buildDir, 'index.html'));
  });
}

// ─── Inicio ─────────────────────────────────────────────────────────────────
try {
  initDatabase();
} catch (err) {
  log('ERROR', `Error al inicializar base de datos: ${err.message}`);
  process.exit(1);
}
console.log('Intentando iniciar servidor en', PORT);
app.listen(PORT, () => {
  console.log(`Servidor escuchando en ${PORT}`);
  log('INFO', `FCAT API server → http://localhost:${PORT}`);
});
