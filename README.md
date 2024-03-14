# sd-exam1
## <b> *Microservicios* </b>
### Requisitos previos:
- Docker instalado en tu máquina virtual (o WSL).
- Docker Desktop (si tienes WSL).
- Visual Studio Code.

## Descripción de requerimientos
Deberá desplegar una plataforma que cumpla con los siguientes requerimientos:

1. Debe tener un repositorio de Github que corresponda a un fork del repositorio sd-exam1.

2. El repositorio debe tener varios Dockerfile que permita el despliegue de los contenedores especificados en el diagrama.

3. El usuario desde la consola o navegador web realiza peticiones al API Gateway.

4. El API GATEWAY redireccionará las peticiones hacia el LOAD BALANCER.

5. El Load Balancer deberá redireccionar las peticiones entrantes hacia el servicio de Registry and Discovery.

6. El servicio de Registry and Discovery debera ser capaz de resolver la comunicación hacia el frontend.

7. El frontend recibirá imágenes/videos/archivos o cualquier cosa que desee guardar la persona en un servicio de almacenamiento centralizado.

8. El backend recibe el archivo desde el frontend y almacena el archivo en el servico de almacenamiento centralizado.

9. El frontend debería de mostrar a lo mínimo una lista de archivos ya cargados actualmente.

10. El sistema de almacenamiento centralizado deberá ser persistente con los datos, es decir, en caso de fallo del servidor de almacenamiento centralizado, este podrá recuperar información que existía previamente.

11. Emplee tecnologías para frontend y backend diferentes a las empleadas en clase.

12. El contexto de la app es LIBRE, es decir, el grupo le puede dar el enfoque que desea (libros, juegos, inventario, musica, videos, etc). pero NO debe haber un mismo lenguaje backend entre dos grupos.

13. Endpoint /health con información del sistema.

###Bonus

14. Script para lanzar todo el ambiente desde un solo comando. (Docker compose es valido)
15. Se puede hacer update y delete de un archivo, tener db.


## Solución
### Estrategía de branching

**master:**  Es la rama donde cada commit refleja un estado listo para uso por parte del cliente, todas las funcionalidades han pasado las pruebas y han sido revisadas por todos los administradores del proyecto.

**develop:**  Es la rama principal de  **trabajo**, cualquier cambio, adelanto, mejora o arreglo pasa primero por aquí antes de llegar a  _Master_. Aquí están los últimos avances en el desarrollo, todas las funcionalidades listas, etc. 

## Como correr la app

<p>Para ejecutar la aplicación, simplemente es necesario ejecutar el archivo Docker Compose proporcionado. Este archivo contiene la configuración necesaria para iniciar todos los servicios y componentes requeridos para que la aplicación funcione correctamente. Al ejecutar Docker Compose, se encargará de crear y configurar los contenedores Docker según las especificaciones definidas en el archivo YAML. Una vez que los contenedores estén en funcionamiento, la aplicación estará lista para ser utilizada. </p>

``` docker-compose up ```


## Problemas encontrados

- <p>El usuario en Samba no contaba con los permisos necesarios para modificar cualquier elemento dentro de la carpeta donde estaba almacenado en Samba. Como consecuencia, al intentar guardar algo dentro de Samba, el sistema rechazaba la solicitud.</p>

- <p>El inconveniente con haproxy se debía a que no podía levantarse o crearse correctamente debido a un problema con el archivo de configuración, el cual no especificaba adecuadamente el final de línea. Esto resultaba en un mal funcionamiento del servicio, impidiendo su correcta inicialización.</p>

- <p>Otro desafío fue familiarizarse con la base de datos CouchDB. Aprender sus particularidades y cómo interactuar con ella supuso un proceso de aprendizaje adicional para el equipo.</p>

## A mejorar

<p>Una mejora importante sería la implementación de un servicio DNS para eliminar la necesidad de consultar todo a través de localhost y aprovechar los nombres de los servicios disponibles. Además, si contáramos con más tiempo, dedicaríamos esfuerzos al frontend, especialmente para mejorar su apariencia gráfica, la paleta de colores y la experiencia de navegación del usuario.</p>

<p>Para llevar nuestro software a producción de manera efectiva, es fundamental asegurarnos de adquirir los nombres de dominio adecuados para garantizar una presencia sólida en línea. Además, debemos invertir en mejorar la seguridad cibernética del sistema, implementando medidas robustas para proteger los datos y la infraestructura de posibles amenazas. Esto incluye la implementación de prácticas de seguridad, como la autenticación de usuarios, el cifrado de datos y la monitorización constante del sistema para detectar y responder rápidamente a posibles intrusiones o vulnerabilidades.</p>


## <b> Construido con </b> 🛠


+ [Docker](https://www.docker.com/) - Docker is an open platform for developing, shipping, and running applications.


## **Versionamiento** 📌

<div style="text-align: left">
    <a href="https://git-scm.com/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/2ae2a900d2f041da66e950e4d48052658d850630/icons/git/git-original.svg" height="60" width = "60" alt="Git"></a> 
    <a href="https://github.com/" target="_blank"> <img src="https://img.icons8.com/fluency-systems-filled/344/ffffff/github.png" height="60" width = "60" alt="GitHub"></a>
</div>


## <b> Demostración </b> 💻🕹





## <b> Por </b>


+ [Nicolas Gomez Botero](https://github.com/nicolasg1911 "Nicolas G.") - A00365529
+ [Camilo González Velasco](https://github.com/camilogonzalez7424 "Camilo G.") - A00370263
+ [Alexander Sanchez Sanchez](https://github.com/alexandersanchezjr "Alex S.") - A00368238


## Documentación
- https://www.npmjs.com/package/samba-client


[![forthebadge](https://forthebadge.com/images/badges/docker-container.png)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)


