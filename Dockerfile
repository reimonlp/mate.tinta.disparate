FROM node:22-alpine

# Instalar git para el script de sincronización
RUN apk add --no-cache git bash

WORKDIR /app

# Copiar el script de entrada (asegurarse que tenga permisos de ejecución)
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Exponer el puerto por defecto de Astro SSR
EXPOSE 4321

# Configurar el punto de entrada
ENTRYPOINT ["/entrypoint.sh"]
