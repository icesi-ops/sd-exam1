# Usa la imagen oficial de Node.js como base
FROM node:14

# Establece el directorio de trabajo en la carpeta de la aplicación dentro del contenedor
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación al directorio de trabajo
COPY . .

# Compila la aplicación (esto puede variar dependiendo de cómo esté configurada tu aplicación Angular)
RUN npm run build

# Expone el puerto 80 para que la aplicación pueda ser accesible desde fuera del contenedor
EXPOSE 80

# Inicia la aplicación
CMD ["npm", "start"]
