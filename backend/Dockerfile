# Usar una imagen base de Node.js
FROM node:14

# Establecer el directorio de trabajo en /app
WORKDIR /app

# Copiar los archivos de la aplicación al contenedor
COPY package*.json ./
COPY app.js .

# Instalar las dependencias
RUN npm install

# Exponer el puerto en el que se ejecuta la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "app.js"]
