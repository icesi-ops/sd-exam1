# sd-exam1

**Integrantes:**
* Daniela Bonilla Caceres
* Esteban Mendoza Oliveros
* Paula Andrea Trujillo Mejía

### Descripción de requerimientos
Deberá desplegar una plataforma que cumpla con los siguientes requerimientos:

Debe tener un repositorio de Github que corresponda a un fork del repositorio sd-exam1.
El repositorio debe tener varios Dockerfile que permita el despliegue de los contenedores especificados en el diagrama.
El usuario desde la consola o navegador web realiza peticiones al API Gateway API GATEWAY
El API GATEWAYr redireccionará las peticiones hacia el LOAD BALANCER
El Load Balancer deberá redireccionar las peticiones entrantes hacia el servicio de Registry and Discovery
El servicio de Registry and Discovery debera ser capaz de resolver la comunicación hacia el frontend
El frontend recibirá imágenes/videos/archivos o cualquier cosa que desee guardar la persona en un servicio de almacenamiento centralizado
El backend recibe el archivo desde el frontend y almacena el archivo en el servico de almacenamiento centralizado
El frontend debería de mostrar a lo mínimo una lista de archivos ya cargados actualmente.
El sistema de almacenamiento centralizado deberá ser persistente con los datos, es decir, en caso de fallo del servidor de almacenamiento centralizado, este podrá recuperar información que existía previamente.
Emplee tecnologías para frontend y backend diferentes a las empleadas en clase.
El contexto de la app es LIBRE, es decir, el grupo le puede dar el enfoque que desea (libros, juegos, inventario, musica, videos, etc). pero NO debe haber un mismo lenguaje backend entre dos grupos.
Endpoint /health con información del sistema.
Script para lanzar todo el ambiente desde un solo comando. (Docker compose es valido)

![image](https://github.com/DaniBonica001/sd-exam1/assets/71205932/3a25abc9-6dac-4646-832a-1947882c3332)

Figura 1. Diagrama de Despliegue

## Solución
### Estrategía de branching

**Master:**  Es la rama donde cada commit refleja un estado listo para uso por parte del cliente, todas las funcionalidades han pasado las pruebas y han sido revisadas por todos los administradores del proyecto.

**Development:**  Es la rama principal de  **trabajo**, cualquier cambio, adelanto, mejora o arreglo pasa primero por aquí antes de llegar a  _Master_. Aquí están los últimos avances en el desarrollo, todas las funcionalidades listas, etc. 

#### Feature-branches:
* back: Para el desarrollo del backend. 
* front: Para el desarrollo del frontend.

#### Pasos necesarios para correr el ambiente de la app
- Ingresar a la carpeta del proyecto:
  *cd deploy
- chmod +x ./deploy.sh
- sudo ./deploy.sh

### Problemas encontrados


