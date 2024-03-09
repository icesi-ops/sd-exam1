# Stage 1: Build Angular application
FROM node:16-alpine AS build
WORKDIR /app

# Copia solo los archivos necesarios para instalar las dependencias
COPY package*.json /app
RUN npm install

# Copia todos los archivos al directorio de trabajo
COPY . /app
# Compila la aplicación Angular
RUN npm run build

# Stage 2: Serve Application using Nginx Server
FROM nginx:alpine

# Copia solo los archivos necesarios para ejecutar la aplicación Angular
COPY --from=build /app/dist/angular-file-upload/ /usr/share/nginx/html

# Exponer el puerto en el que se ejecutará la aplicación Angular
EXPOSE 80