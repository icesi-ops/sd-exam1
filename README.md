# SD-Exam1 Duvan Garcia y Samuel Viviescas

## Descripción
Este proyecto es una implementación de una aplicación distribuida con un frontend en Vue.js y un backend en Node.js. Originalmente se planificó desarrollar el backend en Kotlin, pero debido a problemas con los frameworks y la facilidad de configuración, se optó por Node.js. El proyecto utiliza Docker para el despliegue de los servicios, Consul para el descubrimiento de servicios y HAProxy como balanceador de carga.

### Prerrequisitos

Node.js
Docker
Vue CLI (para desarrollo frontend)
Configuración Inicial

### Clonar el Repositorio
Para empezar, clona el repositorio y navega al directorio del proyecto:
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio

### Configuración de Docker

Crear la Red Docker
Primero, crea una red Docker para que los contenedores puedan comunicarse entre sí: \
docker network create sd-p1

### Cree una carpeta llamada storage 
mkdir storage \
sudo chmod 0777 ./storage

### Construir Contenedores

#### Frontend 
Construya el contenedor para el frontend: \
cd frontend \
docker build -t sd-p1-frontend . \

#### Backend
Construya el contenedor para el backend:
cd backend
docker build -t sd-p1-backend .
cd ..

##### HAProxy (Load Balancer)
Construya  el contenedor para el balanceador de carga HAProxy:
cd haproxy
docker build -t sd-p1-loadbalancer .
cd ..

### Ejecutar contenedores

#### Consul
docker run \
      -p 8500:8500 \
      -p 8600:8600/udp \
      -d \
      --network sd-p1\
      --hostname consul-server\
      --name frontend-consul \
      consul:1.15.4 \
      agent -server -bootstrap-expect 1 -ui -data-dir /tmp -client=0.0.0.0

#### Frontend
docker run \
      --name sd-p1-frontend-2 \
      --network sd-p1\
      -p 8081:8080\
      -d\
      sd-p1-frontend
#### Backend
docker run \
      --name sd-p1-backend \
      --network sd-p1 \
      -p 5000:5000 \
      -v ${PWD}/storage:/app/storage \
      -d\
      sd-p1-backend 
#### Samba
docker run \
      --name samba\
      --hostname samba\
      --network sd-p1 \
      -p 139:139\
      -p 445:445 \
      -v ${PWD}/storage:/storage \
      -d \
      dperson/samba -p \
      -u "backend;backend" \
      -s "storage;/storage;yes;no;yes;all;backend;backend"
#### Haproxy
docker run -p 8085:80 --name loadbalancer --network sd-p1 -d sd-p1-loadbalancer

### Registrar frontend en consul
docker exec -d sd-p1-frontend consul agent -config-file=consul.json
cd haproxy
docker build -t sd-p1-loadbalancer . && cd ..
      
## Desarrollo Local

### Frontend
Instala Vue CLI y las dependencias, y ejecuta el servidor de desarrollo local:
npm install -g @vue/cli
cd frontend
npm install
npm run serve

#### Backend
Instala las dependencias y ejecuta el servidor backend:
cd backend
npm install
npm start

### Problemas Encontrados y Soluciones

Cambio de Kotlin a Node.js
Se describen los desafíos enfrentados al intentar usar Kotlin y por qué se optó por Node.js.

### Consideraciones para Producción

Falta de API Gateway
Se discute la necesidad de un API Gateway para la implementación en producción y cómo esto podría mejorar la gestión de solicitudes y la seguridad.

Mejoras Futuras
Se explora qué mejoras o características adicionales podrían añadirse si hubiera más tiempo disponible, como volver a intentar la implementación en Kotlin.

