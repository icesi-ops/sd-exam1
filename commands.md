## Create network parcial1
docker network create parcial1

## samba
docker-compose up

## consul
docker run -d -p 8500:8500 -p 8600:8600/udp --network parcial1 --name consul consul:latest agent -server -bootstrap-expect 1 -ui -data-dir /tmp -client=0.0.0.0

## Build and run the frontend
docker build -t uploader .
docker run -d -p 5000:5000 --network parcial1 --name frontend frontend

## Build and run the backend
docker build -t backend .
docker run -d -p 5050:5050 --network parcial1 --name backend backend

## Load Balancer
docker build -t loadbalancer .
docker run -p 80:80 -p 1936:1936 --network parcial1 --name loadbalancer -d loadbalancer

## Application Gateway

cd appgw

docker run --network parcial1 -d --name express-gateway-data-store -p 6379:6379 redis:alpine

docker run -d --name express-gateway --network parcial1 -v $PWD:/var/lib/eg -p 8080:8080 -p 9876:9876 express-gateway

- Write in browser to upload file: http://localhost:8080/upload-files/upload
- Write in broswer to see list of uploaded files: http://localhost:8080/upload-files/