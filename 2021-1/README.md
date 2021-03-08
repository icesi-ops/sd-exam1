### Examen 1
**Universidad ICESI**  
**Curso:** Sistemas Distribuidos  
**Docente:** Joan S. Garcia D.  
**Tema:** Infraestructura como código (Aprovisionamiento-CM)  
**Correo:** joan.garcia1 at correo.icesi.edu.co

### Objetivos
* Realizar de forma autónoma el aprovisionamiento automático de infraestructura
* Diagnosticar y ejecutar de forma autónoma las acciones necesarias para lograr infraestructuras estables

### Tecnologías sugeridas para el desarrollo del examen
* Vagrant
* Box del sistema operativo CentOS7
* Repositorio Github
* Ansible
* NodeJS - Python - Go - Kotlin
* Nginx
* Glusterfs

### Descripción
Deberá desplegar una plataforma que cumpla con los siguientes requerimientos:

* Debe tener un repositorio de Github que corresponda a un fork del repositorio **sd-exam1**.
* El repositorio debe tener un Vagrantfile que permita el despliegue de cuatro máquinas virtuales que cumpliran las siguientes funciones:
  * CentOS7 Load Balancer
  * CentOS7 Webserver 1
  * CentOS7 Webserver 2
  * CentOS7 Database
* La gestión de la configuración  se deberá realizar de forma remota sobre las máquinas virtuales ya desplegadas con Vagrant, empleando Ansible como herramienta de gestion de configuración.
* El usuario desde la consola o navegador web realiza peticiones al balanceador **CentOS7 Load Balancer**
* El **CentOS7 Load Balancer** redireccionará las peticiones HTTP a HTTPS.
* El **CentOS7 Load Balancer** deberá redireccionar las peticiones entrantes hacia uno de los servidores web **CentOS7 Webserver 1** y **CentOS7 Webserver 2**. Incluir un mensaje que indique el servidor que responde la petición.
* Los servidores web recibirán imágenes/videos/archivos o cualquier cosa que desee guardar la persona en un servicio de almacenamiento centralizado. 
* Los archivos cargados a través de los servidores web, deberán guardar a lo mínimo los siguientes valores en la base de datos: ID, nombre, path, tipo.
* Los servidores web mostrarán la capacidad actual de almacenamiento.
* Los servidores web en su frontend, también mostrarán la lista de archivos ya cargados actualmente.
* La **CentOS7 Database** deberá ser persistente con los datos, es decir, en caso de fallo del servidor de base de datos, este se podrá recuperar con la información que existía.
* Solo existe un servidor de base de datos **CentOS7 Database**. 
* Emplee tecnologías para frontend y backend diferentes a las empleadas en clase.

![](https://i.ibb.co/YQ8gdYd/diagram.png)
**Figura 1**. Diagrama de Despliegue

### Opcional  
* Se recomienda desplegar un servidor DHCP que asigne IPs automáticamente a los nodos de la red y emplear una herramienta de service discovery para actualizar dinámicamente la configuración del balanceador.
* Los servidores web pueden hacer UPDATE Y DELETE de los datos en la base de datos.
* Exponer el servicio a internet.

### Actividades
1. Documento README.md en formato markdown (10%):  
  * Formato markdown.
  * Nombre y código de los estudiantes.
  * Ortografía y redacción.
2. Documentación del procedimiento para el aprovisionamiento del balanceador y el reverse proxy (5%). Evidencias del funcionamiento (15%).
   - El reverse proxy redirecciona peticiones HTTP a HTTPS
   - El balanceador de carga funciona (envía las peticiones a los servidores web)
3. Documentación del procedimiento para el aprovisionamiento de los servidores web (5%). Evidencias del funcionamiento (15%).
   - Los servidores web funcionan según los requerimientos.
4. Documentación del procedimiento para el aprovisionamiento de la base de datos y el sistema centralizado de almacenamiento (5%). Evidencias del funcionamiento (25%).
   - Es posible hacer consultas a la base de datos.
   - El almacenamiento de archivos es replicado y centralizado.
   - Se pueden obtener los archivos desde cualquier nodo.
5. Documentación de las tareas de integración y evidencias de la integración (10%) (Estrategia de branching).
6. El informe debe publicarse en un repositorio de github el cual debe ser un fork de https://github.com/icesi-ops/sd-exam1 y para la entrega deberá hacer un Pull Request (PR) al upstream (5%). Tenga en cuenta que el repositorio debe contener todos los archivos necesarios para el aprovisionamiento.
7. Documente algunos de los problemas encontrados y las acciones efectuadas para su solución al aprovisionar la infraestructura y aplicaciones (5%).

### Fuentes
Mayami me lo confirmó
De los deseos



