# Biblioteca de videojuegos

## Prerrequisitos

Tener docker instalado

## Instalación

Clonar el repositorio y ejecutar los siguientes comandos

```
docker run -p 8006:80 -d --name frontend --network parcial1 foltrest/games-frontend:0.1.0
docker run -p 8005:8005 -d --name backend --network parcial1 foltrest/games-backend:0.2.0
docker run -d -p 8500:8500 -p 8600:8600/udp --network parcial1 --name consul foltrest/consul:0.1.0
docker run -p 8080:80 --network parcial1 --name loadbalancer gonzalodevarona/loadbalancer:0.1.0
```

## Uso

El front está hecho en react y consta de las funciones de crear, editar y eliminar juegos. Para acceder al servicio se debe acceder en el navegador a la dirección http://localhost:8006. 

Para revisar el consul, accede a la dirección http://localhost:8500. 

Pare revisar el loadbalancer, accede a la dirección http://localhost:8080/frontend.

### Sobre samba

Se creó la configuración y el dockerfile, se puede ejecutar con el comando

```
docker run -it -p 139:139 -p 446:445 -v ${PWD}/data:/data --network parcial1 --name samba -d foltrest/samba:0.2.0
```

Aunque no se logró la conexión entre el back y el samba desde el endpoint (se logra conectar y puede crear un arcihvo si se ejecuta por fuera de los endpoints, pero dentro de ellos no funcionó), el contenedor de samba es funcional. Se puede acceder a él después de ejecutar el comando anterior, con el siguiente:

```
smbclient //localhost/data -U admin

**Password: admin**
```


