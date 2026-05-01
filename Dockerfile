FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
# No copiamos los archivos aquí para poder montarlos como volumen y tener live-reload real
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
