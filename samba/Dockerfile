# Usa una imagen base de Samba
FROM dperson/samba:latest

# Copia el archivo de configuración de Samba al contenedor
COPY smb.conf /etc/samba/smb.conf

# Comprueba si la carpeta compartida existe antes de crearla
RUN test -d /home/storage_data_smb || mkdir -p /home/storage_data_smb

# Expone el puerto de Samba
EXPOSE 139 445

# Comando para ejecutar el servicio de Samba
CMD ["smbd", "--foreground", "--no-process-group"]
