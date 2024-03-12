# sd-exam1

**Integrantes:**
* Daniela Bonilla Caceres
* Esteban Mendoza Oliveros
* Paula Andrea Trujillo Mejía

### Descripción de requerimientos
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
14. Script para lanzar todo el ambiente desde un solo comando. (Docker compose es valido)

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

Para correr el ambiente de la app se cuenta con un script el cual corre el docker compose y el script para levantar el almacenamiento centralizado.

1. Ingresar a la carpeta del proyecto:
   ```bash
   cd deploy
   ```
   
2. Dar permisos para poder ejecutar el script de deploy:
   ```bash
   chmod +x ./deploy.sh
   ```
   
3. Ejecutar el script de deploy:
   ```bash
   ./deploy.sh
   ```
  

### Problemas encontrados

- Desafío con el lenguaje Go: Nos enfrentamos a dificultades debido a nuestra falta de experiencia con Go. Sin embargo, superamos este obstáculo buscando activamente documentación y probando diferentes enfoques. Esta investigación y experimentación nos permitió adquirir el conocimiento necesario para avanzar en el desarrollo de la aplicación.

- Subir archivos al almacenamiento centralizado: Al intentar implementar la función de subir archivos al almacenamiento centralizado (SAMBA), enfrentamos dos desafíos principales: inicialmente, no se encontraba la ruta adecuada para guardar la información y, además, el sistema no localizaba el archivo que debíamos almacenar. Para abordar esta situación, nos dedicamos a investigar la manera correcta de conectar el cliente SMB a la carpeta de almacenamiento centralizado en Go. Una vez resuelto este paso, descubrimos que era necesario crear primero un archivo vacío dentro del almacenamiento centralizado para luego completarlo con el contenido del archivo original. Con estas acciones, logramos implementar con éxito la funcionalidad de subir archivos al sistema centralizado.

- Mandar peticiones del fronted al backend: Para enviar las request desde el fronted, se estaba utilizando 'FETCH' que es la forma nativa de Javascript para mandar peticiones a API's, sin embargo, al hacerlo de esta manera nos encontramos con muchos erroes principalmente de 'headers' los cuales no eran muy claros y enorpecieron este proceso de gran manera. Por eso, se hizo una busqueda exhaustiva de solucionar este problema y se hayó la alernativa de hacerlo con 'Axios' con la versión 0.24 especificamente. De esta manera se procedió a reemplazar el fetch por la versión 0.24 del axios para poder que lo sarchivos se mandaran bien.

