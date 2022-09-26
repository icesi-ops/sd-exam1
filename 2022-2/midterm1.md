### Examen 1
**Universidad ICESI**  
**Curso:** Sistemas Distribuidos  
**Docente:** Joan S. Garcia D.  
**Tema:** Infraestructura como código (Aprovisionamiento-CM)  
**Correo:** josegar0218 at gmail.com

### Objetivos
* Realizar de forma autónoma el aprovisionamiento automático de infraestructura
* Diagnosticar y ejecutar de forma autónoma las acciones necesarias para lograr infraestructuras estables

### Tecnologías sugeridas para el desarrollo del examen
* Azure
* Ubuntu
* Github
* Ansible
* Terraform

### Descripción
Deberá desplegar una plataforma que cumpla con los siguientes requerimientos:

* Debe tener un repositorio de Github que corresponda a un fork del repositorio **sd-exam1**.
* Diseñar y proponer una arquitectura cloud para la app desarrollada. Teniendo en cuenta atributos como alta disponibilidad, networking, seguridad, escalamiento.
* Realizar aprovisionamiento de la infrasestructura cloud usando herramientas como Terraform, Pulumi, ARM templates. 
* La gestión de la configuración se deberá realizar de forma remota sobre la infraestructura ya desplegada, empleando herramientas para la gestión de la configuración como Ansible, SaltStack, Puppet, Chef.
* El usuario desde la consola o navegador web realiza peticiones a la aplicación.
* La aplicación deberá imprimir un string que indique el host que responde.
* La aplicación recibirá imágenes/videos/archivos o cualquier cosa que desee guardar la persona en un servicio de almacenamiento centralizado. 
* La aplicación deberá de guardar de guardar a lo mínimo los siguientes valores en una base de datos: ID, nombre, path, tipo. De los archivos cargados.
* La aplicación mostrará la capacidad actual de almacenamiento.
* La aplicación en su frontend deberá cargar la lista de archivos ya cargados.
* Cualquier tecnología para frontend y backend es recibida.
* Automatización del despliegue de una nueva versión de la aplicación.
* Documento README.md:  
  * Formato markdown.
  * Nombre y código de los estudiantes.
  * Ortografía y redacción.
*  Documentación de las tareas de integración y evidencias de la integración (10%) (Estrategia de branching).
*  El informe debe publicarse en un repositorio de github el cual debe ser un fork de https://github.com/icesi-ops/sd-exam1 y para la entrega deberá hacer un Pull Request (PR) al upstream. Tenga en cuenta que el repositorio debe contener todos los archivos necesarios para el aprovisionamiento.
* Documente algunos de los problemas encontrados y las acciones efectuadas para su solución al aprovisionar la infraestructura y aplicaciones.


## Opcional
* Los servidores web pueden hacer UPDATE Y DELETE de los datos en la base de datos.
* Tenes un nombre de dominio para la aplicación.
