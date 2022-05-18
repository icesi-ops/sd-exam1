### Introducción a docker-compose
Universidad ICESI  
Curso: Sistemas Distribuidos
Docente: Daniel Barragán C.  
Tema: Introducción a despliegue de ambientes con docker-compose  
Correo: daniel.barragan at correo.icesi.edu.co

### Objetivos
* Desplegar ambientes empleando docker-compose

### Introducción
La tecnología docker-compose permite el despliegue de ambientes conformados por contenedores virtuales. Se emplea un archivo en formato yaml para la especificación de la infraestructura a desplegar.

### Desarrollo

#### Instalación 

Siga los siguientes pasos para la instalación de docker-compose en Linux
```
$ sudo curl -L https://github.com/docker/compose/releases/download/1.16.1/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
```

En el siguiente enlace encuentra mas información para la instalación de docker-compose
https://docs.docker.com/compose/install/

#### Comandos comunes

| Comando   | Descripción   |
|---|---|
| docker-compose up | ejecutar el ambiente |
| docker-compose up -d | ejecutar el ambiente en modo desligado |
| docker-compose ps | listar los contenedores del ambiente |
| docker-compose run web env | |
| docker-compose stop | detener el ambiente |
| docker-compose down --volumes | destruir el ambiente |
