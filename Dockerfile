FROM node:22-alpine

# Instalar git y bash
RUN apk add --no-cache git bash

WORKDIR /app

# Copiar archivos de configuración primero para aprovechar caché
COPY package*.json ./
COPY astro.config.mjs ./
COPY tsconfig.json ./

# Copiar el resto del código (incluyendo entrypoint)
COPY . .

# Dar permisos de ejecución al entrypoint
RUN chmod +x /app/entrypoint.sh

# Exponer puerto de Astro
EXPOSE 80

# Usar el entrypoint desde /app
ENTRYPOINT ["/app/entrypoint.sh"]
