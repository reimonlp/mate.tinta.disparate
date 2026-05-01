#!/bin/bash

echo "Starting Mate Tinta Disparate sync loop..."

# Evitar errores de Git sobre propiedad de archivos (montajes de Docker)
git config --global --add safe.directory /app

# Instalar dependencias si no existen o han cambiado
if [ ! -d "node_modules" ]; then
  echo "Instalando dependencias iniciales..."
  npm install
fi

# Construir el proyecto la primera vez
echo "Ejecutando build inicial..."
npm run build

# Iniciar el servidor de Node.js en background
echo "Iniciando servidor Node.js..."
HOST=0.0.0.0 PORT=80 node ./dist/server/entry.mjs &
NODE_PID=$!

# Bucle infinito para sincronización con Git
while true; do
  # Actualizar referencias remotas
  git fetch origin main > /dev/null 2>&1
  
  # Comparar commit local con commit remoto
  LOCAL=$(git rev-parse HEAD)
  REMOTE=$(git rev-parse origin/main)
  
  if [ "$LOCAL" != "$REMOTE" ]; then
    echo "Nuevos cambios detectados en GitHub. Sincronizando..."
    git pull origin main
    
    echo "Reinstalando dependencias por si acaso..."
    npm install
    
    echo "Reconstruyendo Astro..."
    npm run build
    
    echo "Reiniciando servidor Node.js..."
    kill $NODE_PID
    sleep 2
    HOST=0.0.0.0 PORT=80 node ./dist/server/entry.mjs &
    NODE_PID=$!
  fi
  
  sleep 10
done
