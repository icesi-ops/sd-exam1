# Usar una imagen base de Nginx
FROM nginx:alpine

# Instalar Consul
RUN apk add --no-cache consul

# Crear un directorio para los datos de Consul
RUN mkdir /consul-data

# Copiar los archivos del proyecto al directorio de Nginx para servir archivos estáticos
COPY . /usr/share/nginx/html

# Exponer el puerto 8082
EXPOSE 8082

# Cambiar la configuración de Nginx para escuchar en el puerto 8082
RUN echo "server { listen 8082; root /usr/share/nginx/html; }" > /etc/nginx/conf.d/default.conf

# Copiar el archivo de definición de servicio de Consul al contenedor
COPY frontend-service.json /etc/consul.d/

# Comando para iniciar Nginx y Consul
CMD nginx && consul agent -data-dir=/consul-data -retry-join=consul -config-dir=/etc/consul.d/
