# Usar una imagen base de Node.js
FROM node:20.7-alpine

# Establecer el directorio de trabajo en /app
WORKDIR /app

# Copiar los archivos de la aplicación al contenedor
COPY . .

# Instalar las dependencias
RUN npm install
RUN npm install cors

# Exponer el puerto en el que se ejecuta la aplicación
EXPOSE 3500

# Comando para iniciar la aplicación
CMD ["npm", "start"]
