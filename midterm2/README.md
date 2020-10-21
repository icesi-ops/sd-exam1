### Examen 2
**Universidad ICESI**  
**Curso:** Sistemas Distribuidos  
**Docente:** Joan S. Garcìa D.  
**Tema:** Automatización de infraestructura (Docker)  
**Correo:** joan.garcia1 at correo.icesi.edu.co

### Objetivos
* Realizar de forma autónoma el aprovisionamiento automático de infraestructura
* Diagnosticar y ejecutar de forma autónoma las acciones necesarias para lograr infraestructuras estables
* Integrar servicios ejecutándose en nodos distintos

### Prerrequisitos
* docker
* docker swarm
* glusterfs
* Ansible

### Descripción

Deberá desplegar una plataforma que cumpla con los siguientes requerimientos:

* Debe tener un repositorio de Github que corresponda a un fork del repositorio **sd-exam2**.
* El repositorio debe tener un Vagrantfile que permita el despliegue de cuatro máquinas virtuales que cumpliran las siguientes funciones:
  * CentOS7 Master
  * CentOS7 Worker
  * CentOS7 Worker
  * CentOS7 Worker
* El aprovisionamiento inicial con las dependencias necesarias se deberá realizar empleando la herramienta Ansible sobre las máquinas virtuales desplegadas con vagrant.
* Cada máquina virtual debe tener un disco extra de 5 Gigabytes para las configuraciones del sistema de ficheros distribuido (volumen) donde se almacenaran los datos de la base de datos.
* Desplegar una aplicación compuesta por un contenedor para el backend y un contenedor para la base de datos. Defina un limite de 10% cpu y 20Mb de memoria RAM para cada contenedor.
* Emplear la solución de discovery service de docker swarm por defecto y demostrar que la aplicación puede escalar.

### Nota Importante
El parcial debe realizarse en los grupos asignados. La evaluación sera en forma individual. En caso de encontrar copia a otros grupos se anulará el examen al grupo con los commits mas antiguos. Podrá usar cualquier material de clase o realizar consultas en Internet. Se pedirá a cada estudiante que realice la respectiva sustentación de su solución.

### Actividades
1. Documento README.md en formato markdown:  
  * Formato markdown (5%).
  * Nombre y código del estudiante (5%).
  * Ortografía y redacción (5%).
2. Documentación del procedimiento para el aprovisionamiento backend (10%). Evidencias del funcionamiento (5%).
3. Documentación del procedimiento para el aprovisionamiento la base de datos (10%). Evidencias del funcionamiento (5%).
4. Documentación de las tareas de integración (10%). Evidencias de la integración, escalamiento y persistencia de datos (10%).
5. El informe debe publicarse en un repositorio de github el cual debe ser un fork de https://github.com/icesi-ops/sd-exam2 y para la entrega deberá hacer un Pull Request (PR) al upstream (10%). Tenga en cuenta que el repositorio debe contener todos los archivos necesarios para el aprovisionamiento.
6. Documente algunos de los problemas encontrados y las acciones efectuadas para su solución al aprovisionar la infraestructura y aplicaciones (10%).
7. Sustentación TÉCNICA (15%)

### References
* https://www.draw.io
* https://training.play-with-docker.com/swarm-service-discovery/
* https://botleg.com/stories/log-management-of-docker-swarm-with-elk-stack/
* https://www.udemy.com/docker-swarm-advanced-centralized-logging-and-monitoring/

