# Bienvenido a nuestro parcial 1!
### integrantes:
* Andres Camilo Vivas Mañunga
* Alejandro Coronel

# Contexto de la app
Capturador de fotos en tiempo real
Lenguaje Front: Javascript
Lenguaje Back: Java

# Pasos para ejecutarlo
## Forma #1
buildear y runear uno por uno los archivos Dockerfile, aqui te dejamos los comandos y el orden:

### Consul
```
docker build -t [user]/imageapp_consul:[tag] .
```
```
docker run -d -p 8500:8500 -p 8600:8600/udp --network comunicacion --name consul [user]/imageapp_consul:[tag]
```
### Samba
```
docker build -t [user]/samba:[tag] .
```
```
docker run -it -p 139:139 -p 446:445 -v ${PWD}/sambashare:/sambashare --network comunicacion --name samba -d [user]/samba:[tag]
```
### Imageapp (Backend)
```
docker build -t [user]/imageapp:[tag] .
```
```
docker run -d --name image_app --network comunicacion -p 8083:8083 [user]/imageapp:[tag]
```
### Front #1
```
docker build -t [user]/imageapp_frontend:[tag] .
```
```
docker run -d --name frontend --network comunicacion -p 8082:8082 [user]/imageapp_frontend:[tag]
```
### Front #2
```
docker build -t [user]/imageapp_frontend2:[tag] .
```
```
docker run -d --name frontend2 --network comunicacion -p 8084:8084 [user]/imageapp_frontend2:[tag]
```
### Loadbalancer (HaProxy)
```
docker build -t [user]/loadbalancer:[tag] .
```
```
docker run -d -p 80:80 --network comunicacion --name loadbalancer [user]/loadbalancer:[tag]
```
### Gateway
```
docker run --network comunicacion -d --name express-gateway-data-store -p 6379:6379 redis:alpine
```
```
docker run -d --name express-gateway --network comunicacion -v .:/var/lib/eg -p 8090:8080 -p 9876:9876 express-gateway
```
### Forma #2
hacemos uso del archivo docker-compose.yml que esta en el proyecto y lo ejecutamos con el siguiente comando:
```
docker-compose up -d
```


# Problemas encontrados
* Hacer uso del Samba ya qe no hay mucha documentacion.
* Lograr poner en ejecucion todos los servicios, ya que consumen muchos recursos.
