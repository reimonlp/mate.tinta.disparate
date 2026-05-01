# Etapa 1: Build
FROM node:22-alpine AS build
WORKDIR /app

# Copiamos package.json y package-lock.json (si existe)
COPY package*.json ./
RUN npm install

# Copiamos el resto del código y construimos el sitio estático
COPY . .
RUN npm run build

# Etapa 2: Serve
FROM nginx:alpine
# Copiamos la configuración de Nginx optimizada para producción
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos generados por Astro (carpeta dist/) al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
