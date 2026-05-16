#!/bin/sh

# Manejo de señales para un apagado limpio
trap "echo 'Apagando servidor...'; kill \$NODE_PID; exit" SIGTERM SIGINT

echo "--- MATE TINTA DISPARATE DIAGNOSTIC ---"
echo "User: $(whoami) (UID: $(id -u))"
echo "Dir: $(pwd)"
echo "---------------------------------------"

# Configuración global de Git
git config --global --add safe.directory /app
git config --global --add safe.directory '*'

# Sistema de auto-recuperación
if [ ! -f "package.json" ]; then
  echo "AVISO: package.json no encontrado. Restaurando desde backup..."
  cp -r /app_backup/. /app/
fi

# Sincronizar dependencias
if [ ! -d "node_modules/.bin" ]; then
  echo "Sincronizando dependencias..."
  npm install --prefer-offline --no-audit
fi

# Construir si no existe
if [ ! -f "./dist/server/entry.mjs" ]; then
  echo "Build inicial no detectado, construyendo..."
  npm run build
fi

# Función para iniciar el servidor
start_server() {
  echo "Iniciando servidor Node.js en puerto 80..."
  HOST=0.0.0.0 PORT=80 node ./dist/server/entry.mjs &
  NODE_PID=$!
}

# Función para realizar el update completo
do_update() {
  echo "--- INICIANDO ACTUALIZACIÓN ---"
  git pull origin main
  npm install --prefer-offline --no-audit
  npm run build
  echo "Reiniciando servidor..."
  kill $NODE_PID
  wait $NODE_PID 2>/dev/null
  start_server
  # Limpiar trigger si existe
  rm -f .git-update-trigger
}

start_server

# Loop de sincronización (Webhook + Polling de seguridad)
while true; do
  # 1. Verificar Webhook Trigger (Instantáneo)
  if [ -f ".git-update-trigger" ]; then
    echo "Webhook detectado."
    do_update
  fi

  # 2. Polling de seguridad (Cada 5 minutos por si el Webhook falla)
  if [ -d ".git" ]; then
    git fetch origin main > /dev/null 2>&1
    LOCAL=$(git rev-parse HEAD 2>/dev/null)
    REMOTE=$(git rev-parse origin/main 2>/dev/null)
    
    if [ ! -z "$LOCAL" ] && [ ! -z "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
      echo "Cambios detectados por polling."
      do_update
    fi
  fi
  
  sleep 10 & 
  wait $!
done
