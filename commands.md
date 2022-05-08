#### Create network parcial1
docker network create parcial1
#### Build and run the two frontends
docker build -t uploader .
docker run -d -p 5000:5000 --network parcial1 --name uploader uploader
docker build -t show .
docker run -d -p 3030:3030 --network parcial1 --name show show
#### Build and run the backend
docker build -t backend .
docker run -d -p 8080:8080 --network parcial1 --name backend backend
#### samba

#### consul

docker run -d -p 8500:8500 -p 8600:8600/udp --network parcial1 --name consul consul:latest agent -server -bootstrap-expect 1 -ui -data-dir /tmp -client=0.0.0.0

### Load Balancer
docker build -t loadbalancer .
docker run -p 80:80
-p 1936:1936
--network parcial1
--name loadbalancer
-d
loadbalancer

### Application Gateway

In order to use Identity features, we need to have a data storage like Redis.

docker run --network parcial1 -d --name express-gateway-data-store \
                -v ~/docker/appgw:/var/lib/eg \
                -p 8080:8080 \
                -p 9876:9876 \
                express-gateway