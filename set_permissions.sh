#!/bin/bash

chmod +x set_permissions.sh

# Crear la carpeta compartida si no existe
mkdir -p /lordpedal

# Cambiar los permisos de la carpeta compartida
chmod 777 -R /lordpedal

# Iniciar el servicio de Samba
exec "$@"
