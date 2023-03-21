# Getting started

Prerequisites:

* NPM and NodeJS

# Get started

~~~bash
# Create storage folder 
mkdir storage
sudo chmod 0777 ./storage
docker network create sd-p1

cd frontend
docker build -t sd-p1-frontend . && cd ..

cd backend 
docker build -t sd-p1-backend . && cd ..

cd haproxy
docker build -t sd-p1-loadbalancer . && cd ..

# Consul
docker run \
      -p 8500:8500 \
      -p 8600:8600/udp \
      -d \
      --network sd-p1\
      --hostname consul-server\
      --name frontend-consul \
      consul:latest \
      agent -server -bootstrap-expect 1 -ui -data-dir /tmp -client=0.0.0.0

docker run \
      --name sd-p1-frontend-2 \
      --network sd-p1\
      -p 8081:8080\
      -d\
      sd-p1-frontend

docker run \
      --name sd-p1-backend \
      --network sd-p1 \
      -p 5000:5000 \
      -v ${PWD}/storage:/app/storage \
      -d\
      sd-p1-backend

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


docker run -p 8085:80 --name loadbalancer --network sd-p1 -d sd-p1-loadbalancer


# Register frontend service in the consul server
docker exec -d sd-p1-frontend consul agent -config-file=consul.json
cd haproxy
docker build -t sd-p1-loadbalancer . && cd ..
~~~

## Development 
### Frontend 

~~~bash
# Check that vue-cli is installed globally:
npm i -g @vue/cli 
cd frontend 
npm install
npm run serve
~~~
### Backend

~~~bash
cd backend
npm install
npm start
~~~

# Exam statement 
### Examen 1
**Universidad ICESI**  
**Curso:** Sistemas Distribuidos  
**Docente:** Joan S. Garcia D.  
**Tema:** Infraestructura como código (Aprovisionamiento-CM)  
**Correo:** joan.garcia1 at correo.icesi.edu.co

### Objetivos
* Realizar de forma autónoma el aprovisionamiento automático de infraestructura
* Diagnosticar y ejecutar de forma autónoma las acciones necesarias para lograr infraestructuras estables
* Integrar servicios ejecutándose en nodos distintos


### Tecnologías sugeridas para el desarrollo del examen
* docker

### Descripción
Deberá desplegar una plataforma que cumpla con los siguientes requerimientos:

* Debe tener un repositorio de Github que corresponda a un fork del repositorio **sd-exam1**.
* El repositorio debe tener varios Dockerfile que permita el despliegue de los contenedores especificados en el diagrama.
* El usuario desde la consola o navegador web realiza peticiones al API Gateway **API GATEWAY**
* El **API GATEWAYr** redireccionará las peticiones hacia el **LOAD BALANCER**
* El **Load Balancer** deberá redireccionar las peticiones entrantes hacia el servicio de **Registry and Discovery**
* El servicio de **Registry and Discovery** debera ser capaz de resolver la comunicación hacia el **frontend**
* El **frontend** recibirá imágenes/videos/archivos o cualquier cosa que desee guardar la persona en un servicio de **almacenamiento centralizado**
* El **backend** recibe el archivo desde el **frontend** y almacena el archivo en el servico de **almacenamiento centralizado**
* El **frontend** debería de mostrar a lo mínimo una lista de archivos ya cargados actualmente.
* El sistema de **almacenamiento centralizado** deberá ser persistente con los datos, es decir, en caso de fallo del servidor de almacenamiento centralizado, este podrá recuperar información que existía previamente.
* Emplee tecnologías para frontend y backend diferentes a las empleadas en clase.
* El contexto de la app es LIBRE, es decir, el grupo le puede dar el enfoque que desea (libros, juegos, inventario, musica, videos, etc). pero NO debe haber un mismo lenguaje backend entre dos grupos.

![](https://i.ibb.co/hWyQCRp/midter1-drawio.png)  
**Figura 1**. Diagrama de Despliegue

* Deberá incluir un README.md con los sgntes puntos:

Desglose claro de los pasos: se supone que alguien que no esté familiarizado con su desarrollo debería ser capaz de leer los documentos y ejecutar los pasos necesarios para correr el ambiente de su app.
Si necesitas poner este servicio en producción, ¿qué crees que puede faltar? ¿que le falta? ¿Qué le añadirías si tuvieras más tiempo?

### Opcional (Bonus)
* Endpoint /health con información del sistema.
* Se puede hacer update y delete de un archivo.
* Script para lanzar todo el ambiente desde un solo comando. (Docker compose es valido)


### Actividades
1. Documento README.md en formato markdown:  
  * Formato markdown.
  * Nombre y código de los estudiantes.
  * Ortografía y redacción.
2. Documentación de las tareas de integración y evidencias de la integración (Estrategia de branching).
3. El parcial debe publicarse en un repositorio de github el cual debe ser un fork de https://github.com/icesi-ops/sd-exam1 y para la entrega deberá hacer un Pull Request (PR) al upstream. Tenga en cuenta que el repositorio debe contener todos los archivos necesarios para el aprovisionamiento.
. Documente algunos de los problemas encontrados y las acciones efectuadas para su solución al aprovisionar la infraestructura y aplicaciones.

### Fuentes
Mayami me lo confirmó  
De los deseos

# Authors

Sebastián García

Javier Torres 

Christian Gallo 

resolvers consul
    nameserver consul 127.0.0.1:8600
    accepted_payload_size 8192
    hold valid 5s