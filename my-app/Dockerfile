# Usa una imagen de Node.js como base
FROM node:14

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Construye la aplicación Nuxt.js
RUN npm run build

# Expone el puerto 3000 para que la aplicación sea accesible desde fuera del contenedor
EXPOSE 3000

# Comando para iniciar la aplicación cuando el contenedor se ejecute
CMD [ "node", "server.js" ]
