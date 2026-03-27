import React from 'react';
import UnQuien from '../components/unQuien';
import './quienes.css';

// Pilar themes
const PILARES = {
  creacion:      { color: 'rgba(255, 255, 0, 0.58)',  border: '#a46e1b',  text: 'white' },
  difusion:      { color: 'rgba(0, 176, 240, 0.5)',   border: '#212121',  text: '#f1c232' },
  educacion:     { color: 'rgba(240, 0, 154, 0.5)',   border: 'magenta',  text: '#93c47d' },
  investigacion: { color: 'rgba(173, 173, 173, 0.4)', border: '#212121',  text: 'white' },
};

// quienesData — 8 miembros (actualizar con info real)
const quienesData = [
  {
    name: 'Carlos',
    role: 'Director',
    info: 'Fundador de FCAT. Gestor cultural y artista visual con trayectoria en el territorio costero.',
    photo: require('../assets/fotos/quienes/carlos.jpg'),
    pilar: 'creacion',
  },
  {
    name: 'Cristal',
    role: 'Coordinación Artística',
    info: 'Artista interdisciplinar enfocada en residencias y gestión de proyectos culturales.',
    photo: require('../assets/fotos/quienes/cristal.jpg'),
    pilar: 'difusion',
  },
  {
    name: 'Ingrid',
    role: 'Educación',
    info: 'Educadora artística a cargo de la Escuela Artística para Niños y programas pedagógicos.',
    photo: require('../assets/fotos/quienes/ingrid.jpg'),
    pilar: 'educacion',
  },
  {
    name: 'Javier',
    role: 'Investigación',
    info: 'Investigador cultural y documentalista del patrimonio artístico del territorio de Tunquén.',
    photo: require('../assets/fotos/quienes/javier.jpg'),
    pilar: 'investigacion',
  },
  {
    name: 'Luz',
    role: 'Comunicaciones',
    info: 'Encargada de comunicaciones, redes y difusión de las actividades de FCAT.',
    photo: require('../assets/fotos/quienes/luz.jpg'),
    pilar: 'creacion',
  },
  {
    name: 'Marcos',
    role: 'Producción',
    info: 'Productor ejecutivo de eventos y actividades culturales de la fundación.',
    photo: require('../assets/fotos/quienes/Marcos.jpg'),
    pilar: 'difusion',
  },
  {
    name: 'Roberto',
    role: 'Tecnología',
    info: 'Responsable de plataformas digitales e infraestructura tecnológica de FCAT.',
    photo: require('../assets/fotos/quienes/roberto.jpg'),
    pilar: 'educacion',
  },
  {
    name: 'Susan',
    role: 'Administración',
    info: 'Encargada de administración y finanzas de la Fundación Cultural Artística de Tunquén.',
    photo: require('../assets/fotos/quienes/susan.jpg'),
    pilar: 'investigacion',
  },
];

// Posiciones zigzag: col A izquierda, col B derecha, cada col desplazada verticalmente
const zigzagPositions = [
  { top: '8%',    left: '6%'  },  // 0 — col A
  { top: '22%',   left: '56%' },  // 1 — col B
  { top: '36%',   left: '6%'  },  // 2 — col A
  { top: '50%',   left: '56%' },  // 3 — col B
  { top: '64%',   left: '6%'  },  // 4 — col A
  { top: '78%',   left: '56%' },  // 5 — col B
  { top: '92%',   left: '6%'  },  // 6 — col A
  { top: '106%',  left: '56%' },  // 7 — col B
];

const Quienes = () => {
  return (
    <div className="quienes-page">
      <div className="quienes-header">
        <h1 className="quienes-title">QUIENES SOMOS</h1>
      </div>
      <div className="quienes-canvas">
        {quienesData.map((m, i) => {
          const pilar = PILARES[m.pilar];
          const pos = zigzagPositions[i];
          return (
            <UnQuien
              key={m.name}
              name={m.name}
              role={m.role}
              info={m.info}
              photoSrc={m.photo}
              pilarColor={pilar.color}
              borderColor={pilar.border}
              textColor={pilar.text}
              style={{
                top: pos.top,
                left: pos.left,
                width: 'clamp(160px, 16vw, 220px)',
                height: 'clamp(160px, 16vw, 220px)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Quienes;
