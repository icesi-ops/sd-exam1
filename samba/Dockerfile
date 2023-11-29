# FROM alpine:latest
# COPY create-users.sh /create-users.sh
# RUN apk update && apk add samba && chmod +x /create-users.sh
# CMD sh /create-users.sh && chmod -R 777 /mnt && sleep infinity

# Utilizar la imagen de Samba de Docker Hub
FROM dperson/samba

# Instalar openssl (necesario para smbpasswd)
RUN apk --no-cache add openssl

# Crear usuario 'admin' con contraseña 'password' y agregarlo al grupo 'smb'
RUN adduser -D -H -G smb admin \
    && echo -e "admin\nadmin\n" | smbpasswd -a -s admin

# Copiar el archivo smb.conf desde el directorio del Dockerfile al directorio de configuración de Samba
COPY smb.conf /etc/samba/smb.conf

# Crear la carpeta compartida en /sambashare y establecer permisos
RUN mkdir -p /data && chown admin:smb /data

# Exponer los puertos necesarios para Samba
EXPOSE 137/udp 138/udp 139 445

# Definir /sambashare como volumen
VOLUME /data
