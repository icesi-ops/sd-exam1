#!/bin/bash


echo 'Deploying consul'
docker-compose -f consul.yml up -d

sleep 5

echo 'Deploying services'
docker-compose -f services.yml up -d