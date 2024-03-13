
FROM dperson/samba:latest

COPY smb.conf /etc/samba/smb.conf
COPY entrypoint.sh /entrypoint.sh

# Comprueba si la carpeta compartida existe antes de crearla
RUN test -d /home/storage_data_smb || mkdir -p /home/storage_data_smb
RUN chmod -R 777 /home/storage_data_smb

RUN chmod +x /entrypoint.sh

EXPOSE 139 445

ENTRYPOINT ["/entrypoint.sh"]


