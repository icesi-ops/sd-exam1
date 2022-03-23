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



