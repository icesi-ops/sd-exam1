# sd-exam1

### Proceso 
Para este examen implementamos un balanceador de carga con un reverse proxy que conecta dos servidores web que a su vez estan conectados a un sistema de almacenamniento compartido y a una base de datos en MariaDB. 

***
### Problemas
- Ansible nos generó problemas instalando Docker y al no especificar los puertos, Docker no nos permitia conectarnos al contenedor. 
- No sabiamos como programar en Node.js 
- No sabiamos como montar los volumnes de Gluster 
- No sabiamos como enviar una variable de un archivo de texto al Vagrantfile de forma global. 

***
### Soluciones
- Solucionamos el problema de Docker instalandolo usando Shell. 
- Usamos Chatgpt para guiarnos a la hora de programar el backend
- Encontramos que se producia error al ejecutar varios Ansible, por lo tanto lo divimos en bloques diferentes. 
