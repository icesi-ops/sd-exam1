#!/bin/bash

echo 'Creating network libraryapp'
docker network create libraryapp

echo 'Deploying consul'
docker-compose -f consul.yml up -d

sleep 5
echo 'Creating samba container'
chmod +x ../samba/samba.sh
../samba/samba.sh

sleep 5
echo 'Deploying services'
docker-compose -f service.yml up -d

sleep 10
echo 'Creating load balancer and api gateway'
docker-compose -f lb-agw.yml up -d