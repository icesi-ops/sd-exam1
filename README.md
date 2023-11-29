# Documentación del Proyecto sd-exam1

## Descripción del Proyecto

Este proyecto es una aplicación que se fundamenta en una arquitectura de microservicios, compuesta por un frontend web desarrollado con tecnologías como Angular, un backend implementado en Node.js, y un sistema de almacenamiento centralizado basado en Samba. Con el objetivo de mejorar la robustez, escalabilidad y seguridad de la arquitectura, se han integrado tres componentes esenciales:

- Express Gateway: Este componente desempeña un papel crucial como gateway de API, proporcionando funcionalidades de autenticación, autorización, limitación de velocidad y enrutamiento. Garantiza un control centralizado y seguro sobre el acceso a los microservicios, mejorando la seguridad de la aplicación.

- HAProxy: Se ha incorporado como balanceador de carga para distribuir de manera equitativa la carga entre múltiples instancias del frontend. HAProxy mejora la disponibilidad y redundancia al dirigir las solicitudes de manera eficiente, contribuyendo así a una distribución óptima del tráfico y a una mayor estabilidad del sistema.

- Consul: Este servicio de registro y descubrimiento ha sido implementado para simplificar la gestión de la arquitectura de microservicios. Permite el registro dinámico de servicios, incluido el frontend, y facilita la identificación automática de servicios disponibles. Consul optimiza la comunicación entre los diversos componentes del sistema, eliminando la necesidad de configuraciones estáticas y contribuyendo a la escalabilidad y resiliencia de la aplicación.

## Contexto del Sistema

Este sistema fue desarrollado con la finalidad de atender las historias clínicas de los pacientes en formato .pdf, este maneja un alto volumen de archivos por lo que requiere ser escalable, distribuido y garantizar la recuperación rápida en caso que algo falle, especialmente a nivel de almacenamiento.

## Equipo de Desarrollo

- **Kevin Alejandro Mera (A00364415)**
- **Andrés Orozco (A00355202)**

## Tecnologías Utilizadas

- **Frontend:**
  - Angular: es un marco de desarrollo web de código abierto desarrollado por Google. Se utiliza para construir aplicaciones web de una sola página (SPA), empleando una arquitectura basada en componentes reutilizables. Angular facilita la sincronización automática entre la interfaz de usuario y el modelo de datos mediante enlace bidireccional. Utiliza TypeScript como lenguaje principal para mejorar la robustez del código y proporciona herramientas integradas para tareas comunes, como pruebas unitarias y enrutamiento.

- **Backend:**
  - Node.js: Entorno de tiempo de ejecución de JavaScript para el servidor.

- **Almacenamiento:**
  - Samba: es una herramienta de código abierto que permite compartir archivos e impresoras entre sistemas Unix/Linux y Windows en una red. Al utilizarlo como sistema de almacenamiento centralizado, se configura en un servidor para que los usuarios de diferentes sistemas operativos accedan y compartan archivos de manera centralizada. Facilita la colaboración en entornos mixtos, garantizando la interoperabilidad entre sistemas. Además, Samba proporciona funciones de autenticación y control de acceso para mantener la seguridad de los datos compartidos.


## Estructura del Proyecto

El proyecto consta de 5 carpetas (appgw, backend, haproxy, samba y upload-file-front).

- **upload-file-front**
  - Contiene todo lo relacionado al proyecto de Angular y su Dockerfile.

- **Backend**
  - Contiene todo lo relacionado al backend hecho en NodeJS y su Dockerfile.

- **Samba**
  - Contiene la carpeta de almacenamiento compartido (sambashare), el archivo de configuración de Samba (smb.conf) y su Dockerfile.

- **Haproxy**
  - Contiene la configuración del haproxy (haproxy.cfg) y su Dockerfile.

- **appwg**
  - Contiene la configuración del express-gateway (gateway.config.yml).


## Instrucciones de Ejecución

A continuación, se proporcionan las instrucciones paso a paso para ejecutar la aplicación:

**Crear la red**

1. Crear la red llamada exam1:
```bash
docker network create exam1
```


**Samba**
1. Pararse dentro de la carpeta de samba

2. Ejecutar el build de la imagen con el siguiente comando:
```bash
docker build -t chigui794/samba:1.0.0 .
```

3. Correr el contenedor del samba:
```bash
docker run -it -p 139:139 -p 446:445 -v ${PWD}/sambashare:/sambashare --network exam1 --name samba -d chigui794/samba:1.0.0
```

4. Revisar la conexión de samba, user:admin y contraseña:password
```bash
smbclient -L //localhost/sambashare
```


**Backend**

1. Pararse dentro de la carpeta backend

2. Ejecutar el build de la imagen con el siguiente comando:
```bash
docker build -t chigui794/exam1-backend:1.1.1 .
```

3. Correr el contenedor del backend:
```bash
docker run -d --network exam1 -p 3500:3500 --name exam1-backend chigui794/exam1-backend:1.1.1
```


**Frontend**

1. Pararse dentro de la carpeta upload-file-front

2. Hacer el build del Frontend:
```bash
docker build -t chigui794/exam1-frontend:1.1.1 .
```

3. Levantar el frontend:
```bash
docker run -d --network exam1 -p 8085:80 --name exam1-frontend chigui794/exam1-frontend:1.1.1
```


**Consul**
1. Pull a la imagen de consul
```bash
docker pull consul:1.15.4
```

2. Levantar el servidor de consul
```bash
docker run -d -p 8500:8500 -p 8600:8600/udp --network exam1 --name=badger consul:1.15.4 agent -server -ui -node=server-1 -bootstrap-expect=1 -client 0.0.0.0
```

3. Revisar que el servidor de consul haya levantado al ejecutar el comando:
```bash
docker exec badger consul members
```

4. Levantar un agente de consul y suscribirlo al servidor de consul reemplazando su nombre, en este caso, "badger".
```bash
docker run --network exam1 --name=fox consul:1.15.4 agent -node=client-1 -retry-join="badger"
```

5. Revisar que el servidor de consul y el agente suscrito en el paso anterior estén arriba:
```bash
docker exec badger consul members
```

6. Suscribir el servicio de frontend al cliente consul, reemplazar IP-CONTENEDOR-FRONTEND por la ip del contenedor del frontend
```bash
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' exam1-frontend
```

```bash
docker exec fox /bin/sh -c "echo '{\"service\": {\"name\": \"frontend\", \"tags\": [\"angular\"], \"port\": 80, \"address\": \"IP-CONTENEDOR-FRONTEND\"}}' >> /consul/config/frontend.json"
```

7. Reiniciar el servicio de consul agent para aplicar los cambios
```bash
docker exec fox consul reload
```

8. Revisar la resolución del consul
```bash
dig @127.0.0.1 -p 8600 frontend.service.consul
```


**HA Proxy / LOAD BALANCER**
1. Pararse dentro de la carpeta haproxy

2. Ejecutar el build de la imagen con el siguiente comando:
```bash
docker build -t chigui794/loadbalancer:0.3.0 .
```

3. Correr el contenedor:
```bash
docker run -d -p 80:80 --network exam1 --name loadbalancer chigui794/loadbalancer:0.3.0
```

4. Probar el servicio desde el L/B:
```bash
curl http://localhost:80/frontend/
```


**Express Gateway**
1. Pararse dentro de la carpeta appgw

2. Levantar el servicio de almacenamiento redis para el gateway
```bash
docker run --network exam1 -d --name express-gateway-data-store -p 6379:6379 redis:alpine
```

3. Levantar el express gateway
```bash
docker run -d --name express-gateway --network exam1 -v .:/var/lib/eg -p 8090:8080 -p 9876:9876 express-gateway
```

4. Probar un curl desde el gateway
```bash
curl http://localhost:8090/frontend/
```


**Prueba en ejecución de la subida de un archivo**
1. Click en Seleccionar archivo, el sistema sólo permite subir archivos en formato .pdf
2. Una vez guardado el archivo, este se guardará en el la ruta del volumen asociado al Samba.


## Fuentes

- https://developer.hashicorp.com/consul/tutorials/day-0/docker-container-agents
- https://www.npmjs.com/package/samba-client
- Arial 12