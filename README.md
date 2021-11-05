# sd-exam1
  
## Universidad ICESI  
**Curso:** Sistemas Distribuidos.  
**Docente:** Joan S. Garcia D.  
**Tema:** Infraestructura como código (Aprovisionamiento-CM).  


### **Objetivos**  
- Realizar de forma autónoma el aprovisionamiento automático de infraestructura.  
- Diagnosticar y ejecutar de forma autónoma las acciones necesarias para lograr infraestructuras estables.  

### **Tecnologías sugeridas para el desarrollo del examen.**   
- Vagrant.  
- Box del sistema operativo CentOS7.  
- Repositorio Github.  
- Ansible.  
- Lenguaje de programación:  __Go__.  
- Nginx.  
- Glusterfs.  
- Bases de datos: *Cockroach*.  

### **Descripción.**  
Deberá desplegar una plataforma que cumpla con los siguientes requerimientos:  

- Debe tener un repositorio de Github que corresponda a un fork del repositorio sd-exam1.  
- El repositorio debe tener un Vagrantfile que permita el despliegue de cuatro máquinas virtuales que cumpliran las siguientes funciones:  
  - CentOS7 Load Balancer.  
  - CentOS7 Webserver 1.  
  - CentOS7 Webserver 2.  
  - CentOS7 Database.  
- La gestión de la configuración se deberá realizar de forma remota sobre las máquinas virtuales ya desplegadas con Vagrant, empleando Ansible como herramienta de gestion de configuración.  
- El usuario desde la consola o navegador web realiza peticiones al balanceador CentOS7 Load Balancer.  
- El CentOS7 Load Balancer redireccionará las peticiones HTTP a HTTPS.  
- El CentOS7 Load Balancer deberá redireccionar las peticiones entrantes hacia uno de los servidores web CentOS7 Webserver 1 y CentOS7 Webserver 2. Incluir un mensaje que indique el servidor que responde la petición.  
- Los servidores web recibirán imágenes/videos/archivos o cualquier cosa que desee guardar la persona en un servicio de almacenamiento centralizado.  
- Los archivos cargados a través de los servidores web, deberán guardar a lo mínimo los siguientes valores en la base de datos: ID, nombre, path, tipo.  
- Los servidores web mostrarán la capacidad actual de almacenamiento.  
- Los servidores web en su frontend, también mostrarán la lista de archivos ya cargados actualmente.  
- La CentOS7 Database deberá ser persistente con los datos, es decir, en caso de fallo del servidor de base de datos, este se podrá recuperar con la información que existía.  
- Solo existe un servidor de base de datos CentOS7 Database.  
## Documentacion del servidor web

Para el servidor web se implemento un endpoint en Go, usando cockroachDB como base de datos. Al momento de provisionar estas maquinas se hace build del binario de go y se copia a los respectivos web servers. En el caso de la base de datos se instala cockroachDB y se inicializa como un nodo singular. Todas las vm's comparten una red privada para poder conectarlas los servidores web con la base de datos.

Para ejecutar el binario de Go e inicar el webserver se debe usar una variable de entorno asi,

`DBADDRESS=root@localhost:26257 ./main`

Donde DBADDRESS sera la direccion de la maquina que ejecute la db

## Documentación del sistema centralizado de almacenamiento

Para el sistema centralizado de almacenamiento se implementó GlusterFs, haciendo una replica del volumen. Se usaron tres discos, uno para ser el nodo maestro(db machine) y los otros dos para ser los nodos esclavos(web-1, web-2 machines), estos discos fueron creados y asignados a las respectivas maquinas en el Vagrantfile. Del mismo modo, despues de la asignacion de los discos se efectua la instalacion y configuracion de GlusterFs en las maquinas db, web-1 y web-2, haciendo uso de los scrips glusterfs.sh y configuration.sh. 

Para unir los nodos (peering) se usó un playbook llamado glusterConfig.yml el cual se encarga de hacer el peering desde el nodo maestro a sus esclavos, de crear el volumen de tipo replica quien va a sincronizar los dos nodos esclavos y de iniciar dicho volumen. El archivo glusterConfig.yml hace uso de dos scrips, uno para el grupo "databases" (db) llamado masterConfig.sh y otro para el grupo "servers" (web-1 y web-2) llamado slaveConfig.sh.

Para probar su funcionamiento se probó agregando varios archivos a web-1 y efectivamente se replicaban en web-2.


### **Problemas durante el aprovisionamiento de la infraestructura.**  
- **Automatización del gluster:** no se logró que quedase automatico la configuración del gluster, por lo que cuando se hace el "vagrant up", toca hacer un "ansible-playbook playbooks/glusterConfig.yml" y con eso quedan las maquinas configuradas con el glusterfs.    
- **Automatizacion de la ejecucion del binario de go en los servidores web"** Se intento usar un task que ejecutara el binario en segundo plano pero no funciono, como otra posible solucion se considero correr como un servicio usando las utils de systemd. Por cuestiones de tiempo no se logro esta implementacion e iniciamos la aplicacion de forma manual despues de provisionar los webservers.
  

### **Integrantes.**
- Alejandro Barrera Lozano - A00351328.  
- Ernesto Betancourt Ramirez - A00049172.  
- Santiago Figueroa Aguirre - A00347950.  

