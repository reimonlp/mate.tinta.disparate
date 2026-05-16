#!/bin/bash

echo "--- MATE TINTA DISPARATE DIAGNOSTIC ---"
echo "Current user: $(whoami)"
echo "Current directory: $(pwd)"
echo "Files in /app:"
ls -la /app
echo "---------------------------------------"

# Forzar Git a confiar en /app
git config --global --add safe.directory /app

# Verificar package.json
if [ ! -f "package.json" ]; then
  echo "FATAL ERROR: No se encontró package.json en $(pwd)"
  exit 1
fi

# Instalar dependencias si faltan
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/astro" ]; then
  echo "Instalando dependencias necesarias para Alpine..."
  npm install --no-audit
else
  echo "Dependencias detectadas, sincronizando cambios menores..."
  npm install --prefer-offline --no-audit
fi

# Construir Astro
echo "Ejecutando build de producción..."
npm run build

# Verificar que el build generó la entrada
if [ ! -f "./dist/server/entry.mjs" ]; then
  echo "ERROR: Falló el build. No existe ./dist/server/entry.mjs"
  ls -R ./dist
  exit 1
fi

# Iniciar servidor Node
echo "Iniciando servidor Node.js en puerto 80..."
HOST=0.0.0.0 PORT=80 node ./dist/server/entry.mjs &
NODE_PID=$!

# Loop de sincronización con Git (cada 60 segs para no saturar)
while true; do
  if [ -d ".git" ]; then
    git fetch origin main > /dev/null 2>&1
    LOCAL=$(git rev-parse HEAD 2>/dev/null)
    REMOTE=$(git rev-parse origin/main 2>/dev/null)
    
    if [ ! -z "$LOCAL" ] && [ ! -z "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
      echo "--- CAMBIOS DETECTADOS EN GITHUB ---"
      git pull origin main
      npm install --prefer-offline --no-audit
      npm run build
      
      echo "Reiniciando servidor..."
      kill $NODE_PID
      sleep 2
      HOST=0.0.0.0 PORT=80 node ./dist/server/entry.mjs &
      NODE_PID=$!
    fi
  fi
  sleep 60
done
