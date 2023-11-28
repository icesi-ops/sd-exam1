# Fase de construcción
FROM node:16 AS build

WORKDIR /app

# Copia los archivos de configuración e instala las dependencias
COPY package*.json /app
RUN npm install

# Copia el código fuente
COPY . /app

# Construye la aplicación
RUN npm run build

# Fase de ejecución
FROM nginx:stable-alpine

ENV BACKEND_ADDRESS=http://backend:8005

# Copia los archivos estáticos construidos a la carpeta de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80
