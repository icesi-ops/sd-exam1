#!/bin/bash

echo 'Creatin network parcial'
docker network create parcial


echo 'Deploying consul'
docker-compose -f consul.yml up -d

sleep 5
echo 'Creating samba container'
chmod +x ../storage/script.sh
../storage/script.sh

sleep 5
echo 'Deploying storage'
docker-compose -f storage.yml up -d

sleep 5
echo 'Deploying services'
docker-compose -f services.yml up -d

sleep 10
echo 'Creating load balancer and api gateway'
docker-compose -f loadbalancer-apigw.yml up -d