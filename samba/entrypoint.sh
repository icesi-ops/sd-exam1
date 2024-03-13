#!/bin/bash

# Crear el usuario backend_user
adduser --disabled-password --gecos "" backend_user

# Establecer la contraseña del usuario backend_user
echo "backend_user:password1" | chpasswd

# Agregar el usuario backend_user a Samba
echo -e "password1\npassword1" | smbpasswd -s -a backend_user

# Iniciar el servicio de Samba
exec smbd --foreground --no-process-group
