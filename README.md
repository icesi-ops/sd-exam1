# sd-exam1

**Integrantes:**
* Christian Flor
* Manuel Castaño
* Mateo Loaiza

### Descripción de requerimientos
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

## Solución
### Estrategía de branching

![enter image description here](https://www.bitbull.it/blog/git-flow-come-funziona/gitflow-1.png)


**Master:**  Es la rama donde cada commit refleja un estado listo para uso por parte del cliente, todas las funcionalidades han pasado las pruebas y han sido revisadas por todos los administradores del proyecto.

**Development:**  Es la rama principal de  **trabajo**, cualquier cambio, adelanto, mejora o arreglo pasa primero por aquí antes de llegar a  _Master_. Aquí están los últimos avances en el desarrollo, todas las funcionalidades listas, etc. Se puede definir otra rama cómo por ejemplo “Releases” para realizar las pruebas, pero consideramos que no es necesario y que las pruebas se pueden implementar aquí.

**Feature-branches:**  Estas son las ramas más abundantes en la vida del proyecto, se crean cada vez que surge una nueva funcionalidad o tema que incluir. Se derivan directamente de la rama  _Development_  y se integran nuevamente a esta misma rama, una vez se ha terminado de trabajar en la nueva funcionalidad y se considera lista para probar.

**Hotfix:**  Estas ramas surgen cada vez que se detecta una falla en la rama de producción (_Master_)que debe ser solucionada lo más pronto posible. Cuando se termine de solucionar el inconveniente se debe integrar de nuevo tanto a  _Master_  como a  _Development_
