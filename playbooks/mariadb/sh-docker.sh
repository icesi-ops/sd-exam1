#!/bin/bash

# Instalar Docker
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose

# Agregar usuario actual al grupo docker
sudo usermod -aG docker vagrant

# Reiniciar el servicio de Docker
sudo systemctl restart docker.service

# Permite que Docker se inicialice siempre
sudo systemctl enable docker

# Agrega al usuario 
sudo usermod -aG docker vagrant

# Despliega el contenedor
sudo cd /home/vagrant/
sudo docker compose up -d

# Accede al contenedor
# docker exec -it vagrant-db-1 /bin/bash
# cd /docker-entrypoint-initdb.d/

#docker cp vagrant-db-1:/docker-entrypoint-initdb.d/init.sql ./resources/docker-sql/init.sql
#docker cp ./resources/docker-sql/init.sql vagrant-db-1:/docker-entrypoint-initdb.d/init.sql


# Ingresa a la db
# mysql -uweb -picesi2023 webmariadb

# Accede a la db
# use webmariadb;

# INSERT INTO storage (name, path, type) VALUES ( 'Alejo', '/mnt/alejo/index.html', 'html');