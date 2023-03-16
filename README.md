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
* Vagrant
* Box del sistema operativo CentOS7
* Repositorio Github
* Ansible
* Lenguaje de programación (Libre opción)
* Nginx
* Glusterfs
* HAProxy
* Bases de datos: to be define

### Descripción
Deberá desplegar una plataforma que cumpla con los siguientes requerimientos:

* Debe tener un repositorio de Github que corresponda a un fork del repositorio **sd-exam1**.
* El repositorio debe tener un Vagrantfile que permita el despliegue de cuatro máquinas virtuales que cumpliran las siguientes funciones:
  * CentOS7 Load Balancer - Reverse proxy
  * CentOS7 Webserver 1
  * CentOS7 Webserver 2
  * CentOS7 Database
* La gestión de la configuración  se deberá realizar de forma remota sobre las máquinas virtuales ya desplegadas con Vagrant, empleando Ansible como herramienta de gestion de configuración.
* El usuario desde la consola o navegador web realiza peticiones al Reverse proxy **CentOS7 Reverse proxy**
* El **CentOS7 Reverse proxy** redireccionará las peticiones HTTP a HTTPS.
* El **CentOS7 Load Balancer** deberá redireccionar las peticiones entrantes hacia uno de los servidores web **CentOS7 Webserver 1** **CentOS7 Webserver 2** **CentOS7 Webserver N**. Incluir un mensaje que indique el servidor que responde la petición.
* Los servidores web recibirán 2 tipos de archivos .html y un .txt.
* El archivo .html será un archivo index.html el cual una vez cargado se podrá ver en la ruta
http://hostname/name_web_page/index_upload.html. también puede ser manejado como subdominios si así lo desea, es decir:
http://subdomain.hostname/index_uploaded.html
* El archivo .txt manejará el estado de tu infraestructura y es el que definirá la cantidad de nodos que existan, es decir, es el que permitirá que escale tu infraestructura.
  * Ejemplo: Si el archivo tiene definido nodes_count=4 una vez que yo cargue el archivo se deberán levantar el número de máquians faltantes para cumplir con el estado deseado.
* Los archivos cargados a través de los servidores web, deberán guardar a lo mínimo los siguientes valores en la base de datos: ID, nombre, path, tipo.
* Los servidores web mostrarán la capacidad actual de almacenamiento (bonus).
* Los servidores web en su frontend, también mostrarán la lista de archivos ya cargados actualmente (bonus).
* La **CentOS7 Database** deberá ser persistente con los datos, es decir, en caso de fallo del servidor de base de datos, este se podrá recuperar con la información que existía.
* Solo existe un servidor de base de datos **CentOS7 Database**.
* Documentacipon de as tareas de integracion y evidencias de la integración.
* El informe debe publicarse en un repositorio de github el cual debe ser un fork de https://github.com/icesi-ops/sd-exam1 y para la entrega deberá hacer un Pull Request (PR) al upstream. Tenga en cuenta que el repositorio debe contener todos los archivos necesarios para el aprovisionamiento.
* Documente algunos de los problemas encontrados y las acciones efectuadas para su solución al aprovisionar la infraestructura y aplicaciones
* El almacenamiento de archivos debe ser usando un sistema centralizado de almacenamiento como GlusterFS.

![](https://i.ibb.co/YQ8gdYd/diagram.png)
**Figura 1**. Diagrama de Despliegue

### Opcional  
* Los servidores web pueden hacer UPDATE Y DELETE de los datos en la base de datos.
* Exponer el servicio a internet.


### Fuentes
Mayami me lo confirmó
De los deseos



