FROM node:lts-alpine

# hacer la carpeta 'app' el directorio de trabajo actual
WORKDIR /app

# copiar 'package.json' y 'package-lock.json' (si están disponibles)
COPY package*.json ./

# instalar dependencias del proyecto
RUN npm install

RUN apk add --update \
    samba-common-tools \
    samba-client \
    && rm -rf /var/cache/apk/*

# copiar los archivos y carpetas del proyecto al directorio de trabajo actual (es decir, la carpeta 'app')
COPY . .

EXPOSE 5000

CMD [ "npm", "start" ]