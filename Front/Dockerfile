# Usa una imagen base con soporte para un servidor web
FROM nginx:alpine

# Elimina el archivo de configuración predeterminado de Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copia los archivos necesarios al contenedor
COPY index.html /usr/share/nginx/html/
COPY index.js /usr/share/nginx/html/
# Asegúrate de copiar otros archivos y carpetas necesarios

# Expone el puerto 80 para el servidor web
EXPOSE 80

# Comando para iniciar el servidor Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
