FROM node:16 AS build

WORKDIR /app

COPY package*.json /app
RUN npm install

COPY . /app

RUN npm run build

FROM nginx:alpine

ENV BACKEND_ADDRESS=http://backend:8005

COPY --from=build /app/dist /usr/share/nginx/html

# Instalar Consul
RUN apk add --no-cache consul

# Crear un directorio para los datos de Consul
RUN mkdir /consul-data

EXPOSE 8006

# Cambiar la configuración de Nginx para escuchar en el puerto 8082
RUN echo "server { listen 8006; root /usr/share/nginx/html; }" > /etc/nginx/conf.d/default.conf

# Copiar el archivo de definición de servicio de Consul al contenedor
COPY frontend-service.json /etc/consul.d/

# Comando para iniciar Nginx y Consul
CMD nginx && consul agent -data-dir=/consul-data -retry-join=consul -config-dir=/etc/consul.d/
