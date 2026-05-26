#!/bin/bash
# =============================================================================
# deploy/setup.sh — Configuración inicial del VPS Hostinger para FCAT
# Sistema: Ubuntu 22.04 LTS
# Ejecutar como root o con sudo desde el directorio del proyecto:
#   bash deploy/setup.sh
# =============================================================================
set -e

DOMAIN="fcat.cl"
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
NODE_VERSION="20"

echo ""
echo "======================================================"
echo "  FCAT — Setup de servidor"
echo "  Directorio: $APP_DIR"
echo "======================================================"
echo ""

# ── 1. Actualizar paquetes del sistema ────────────────────────────────────────
echo "[1/9] Actualizando paquetes del sistema..."
apt-get update -y && apt-get upgrade -y

# ── 2. Instalar build tools (requerido por better-sqlite3) ───────────────────
echo "[2/9] Instalando build tools (gcc, python3, make)..."
apt-get install -y build-essential python3 curl

# ── 3. Instalar Node.js LTS via NodeSource ────────────────────────────────────
echo "[3/9] Instalando Node.js $NODE_VERSION LTS..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y nodejs
else
    echo "  Node.js ya instalado: $(node -v)"
fi

# ── 4. Instalar PM2 globalmente ───────────────────────────────────────────────
echo "[4/9] Instalando PM2..."
npm install -g pm2

# ── 5. Instalar Nginx ─────────────────────────────────────────────────────────
echo "[5/9] Instalando Nginx..."
apt-get install -y nginx

# Copiar configuración de Nginx
cp "$APP_DIR/deploy/nginx.conf" /etc/nginx/sites-available/fcat
ln -sf /etc/nginx/sites-available/fcat /etc/nginx/sites-enabled/fcat
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
echo "  Nginx configurado para $DOMAIN"

# ── 6. Crear .env de producción si no existe ─────────────────────────────────
echo "[6/9] Verificando archivo .env..."
if [ ! -f "$APP_DIR/.env" ]; then
    echo "  ADVERTENCIA: No se encontró .env en $APP_DIR"
    echo "  Creando .env de ejemplo — COMPLETAR ANTES DE CONTINUAR"
    cat > "$APP_DIR/.env" << 'EOF'
ADMIN_USER=CAMBIAR_ESTO
ADMIN_PASS=CAMBIAR_ESTO
CUPOS_MAX=20
REACT_APP_CUPOS_MAX=20
CORS_ORIGIN=https://fcat.cl
PORT=3001
EOF
    echo ""
    echo "  >>> EDITAR $APP_DIR/.env antes de continuar <<<"
    echo "  Usar: nano $APP_DIR/.env"
    echo "  Luego volver a ejecutar este script desde el paso 7."
    exit 1
else
    echo "  .env encontrado."
fi

# ── 7. Instalar dependencias y construir el frontend ─────────────────────────
echo "[7/9] Instalando dependencias npm..."
cd "$APP_DIR"
npm install

echo "  Construyendo frontend React..."
npm run build

# ── 8. Iniciar aplicación con PM2 ─────────────────────────────────────────────
echo "[8/9] Iniciando aplicación con PM2..."
cd "$APP_DIR"
pm2 delete fcat 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save

# Configurar PM2 para arrancar al inicio del sistema
pm2 startup systemd -u root --hp /root | tail -1 | bash || true

# ── 9. Instalar SSL con Certbot ───────────────────────────────────────────────
echo "[9/9] Instalando Certbot y SSL..."
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email admin@"$DOMAIN" --redirect

echo ""
echo "======================================================"
echo "  Setup completado."
echo "  La app está corriendo en https://$DOMAIN"
echo ""
echo "  Comandos útiles:"
echo "    pm2 status          — Ver estado del proceso"
echo "    pm2 logs fcat       — Ver logs en tiempo real"
echo "    pm2 restart fcat    — Reiniciar la app"
echo "    pm2 stop fcat       — Detener la app"
echo "======================================================"
