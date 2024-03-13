#Creating the samba image

cd samba
docker build -t sambadb:v1 .
cd ..

#Creating the backend image

cd backend-project
docker build -t backend:v1 .
cd ..

#Creating the frontend image

cd frontend-project
docker build -t frontend:v1 .
cd ..

#Creating the loadbalancer image
cd haproxy
docker build -t loadbalancer:v1 .
cd ..

#Creating the network
docker network create projectnetwork

#Creating the docker volume
docker volume create samba_data_volume

#Now, we can build the containers

#Creating the consul container
docker run -d -p 8500:8500 -p 8600:8600/udp --network projectnetwork --name consulParcial  consul:1.15 agent -server -bootstrap-expect 1 -ui -data-dir /tmp -client=0.0.0.0

#Creating samba container
docker run -dit -p 139:139 -p 445:445 --name sambadb --network projectnetwork -v samba_data_volume:/home/storage_data_smb sambadb:v1

#Creating backend container
docker run -d -p 5000:5000 --network projectnetwork --name backend backend:v1

#Creating frontend container
docker run -d -p 5173:5173 --network projectnetwork --name frontend1 frontend2:v1

#Creating second frontend container
#docker run -d -p 5174:5173  --network projectnetwork --name frontend2 frontend:v1

#Creating loadbalancer container
docker run -d -p 9000:80 -p 1936:1936 --network projectnetwork --name loadbalancer loadbalancer:v1

#Creating apigateway container
docker run --network projectnetwork -d --name eg-data-store-parcial -p 6379:6379  redis:alpine
docker run -d --name eg-parcial  --network projectnetwork -v .:/var/lib/eg  -p 8080:8080 -p 9876:9876  express-gateway

