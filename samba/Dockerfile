# Utilizar la imagen de Samba de Docker Hub
FROM dperson/samba

# Instalar openssl (necesario para smbpasswd)
RUN apk --no-cache add openssl

# Crear usuario 'admin' con contraseña 'password' y agregarlo al grupo 'smb'
RUN adduser -D -H -G smb admin \
    && echo -e "password\npassword\n" | smbpasswd -a -s admin

# Copiar el archivo smb.conf desde el directorio del Dockerfile al directorio de configuración de Samba
COPY smb.conf /etc/samba/smb.conf

# Crear la carpeta compartida en /sambashare y establecer permisos
RUN mkdir -p /sambashare && chown admin:smb /sambashare

# Exponer los puertos necesarios para Samba
EXPOSE 137/udp 138/udp 139 445

# Definir /sambashare como volumen
VOLUME /sambashare
