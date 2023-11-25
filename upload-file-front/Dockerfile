# Stage 1: Build Angular application
FROM node:16-alpine AS build
WORKDIR /app

# Copia solo los archivos necesarios para instalar las dependencias
COPY package*.json ./
RUN npm install

# Copia todos los archivos al directorio de trabajo
COPY . .

# Compila la aplicación Angular
RUN npm run build

# Stage 2: Serve Application using Nginx Server
FROM nginx:alpine

# Copia solo los archivos necesarios para ejecutar la aplicación Angular
COPY --from=build /app/dist/angular-file-upload/ /usr/share/nginx/html

# Exponer el puerto en el que se ejecutará la aplicación Angular
EXPOSE 80

# Configuración adicional de Nginx (si es necesario)
# COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

# CMD ["nginx", "-g", "daemon off;"]  # Este CMD no es necesario ya que la imagen nginx:alpine ya tiene un CMD por defecto
