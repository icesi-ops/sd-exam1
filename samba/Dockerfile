FROM dperson/samba

RUN apk --no-cache add openssl

# Se crea el user 'admin' pass 'password' se agrega al grupo 'smb'
RUN adduser -D -H -G smb admin \
    && echo -e "password\npassword\n" | smbpasswd -a -s admin


COPY smb.conf /etc/samba/smb.conf

# Se crea la carpeta compartida en /sambashare y establecer permisos
RUN mkdir -p /sambashare && chown admin:smb /sambashare

# Exponer los puertos necesarios para Samba
EXPOSE 137/udp 138/udp 139 445

# Definir /sambashare como volumen
VOLUME /sambashare