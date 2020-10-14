# Parcial 1 - Sistemas distribuidos 2020-2

## Integrantes

Juan David Paz Dorado - **A00328036**

German Andrés Carvajal - **A00134280**	

Este es el repositorio correspondiente al primer parcial de sistemas distribuidos. [https://github.com/JuanDoradoP/copiaparcial1](https://github.com/JuanDoradoP/copiaparcial1)
Incluye los archivos necesarios para poder realizar el aprovisionamiento de la plataforma requerida en el enunciado principal. La cual consta de un servidor web (Backend - Frontend), Que realiza peticiones a una base de datos. Ademas de un balanceador de carga para las peticiones. 


## Descripción general 

Para realizar exitosamente el parcial, se necesitó de cuatro maquinas que corresponden a: 

**1.** Maquina balanceador de carga.  **-->** 192.168.50.14

**2.** Maquina base de datos.      **-->**         192.168.50.13

**3.** Maquina servidor web 1 		 **-->**		192.168.50.11

**4.** Maquina servidor web 2. 	 **-->**		192.168.51.12

Para el despliegue automático de estas maquinas se utilizó la herramienta **Vagrant**. Para la gestión de la configuración se uso la herramienta **SaltStack**. 

El sistema operativo de las maquinas anteriormente mencionadas fue **Ubuntu 18.04**, Esto debido al exceso de tiempo que tomaba el despliegue de las maquinas con CentOS. Ahora, con ubuntu, el tiempo aproximado de despliegue es al rededor de 10 minutos.

**Uso de Vagrant**
Para hacer uso de esta herramienta se debe saber  compaginar con SaltStack. Pues en el archivo Vagrantfile se declara la creación de las 4 maquinas,  a partir de una maquina master. 

Ya con el archivo Vagrantfile creado, se procede a ejecutar el siguiente comando

    vagrant up 


**Uso de SaltStack**
Para hacer uso de esta herramienta se debe tener en cuenta los siguientes items:

**1. Forma de uso** : SaltStack permite trabajar de manera grupal con un master (Maestro - esclavo). El cual se encarga de gestionar el resto de minions. O de trabajar sin el master (Masterless), es decir, sin que se requiera una maquina específica para la gestión. En nuestro caso, debido a la búsqueda de información que realizamos previamente, decidimos usar el modelo maestro - esclavo, pues nos parecio mas intuitivo y con mas información detallada.

**2. Archivos de configuración** 

Es necesario conocer la manera en como se debe configurar en    SaltStack. Para ello, es necesario reconocer los archivos .sls pues    estos será los archivos de configuración que ejecutarán. Para este    parcial, se tiene en la carpeta *salt* el archivo top.sls el cual nos    esta definiendo otros cuatro archivos .sls que se ejecutaran de  acuerdo al tipo de maquina que se deseé configurar.

**3. Comandos principales de los archivos de configuración**

Es importante también conocer la manera en como podremos dar indicaciones en los archivos .sls. En este trabajo se hizo uso de los siguientes comandos:
 

       file.managed:
       
    - name: <ruta destino>
    - source: <ruta origen>

El cual nos permite transferir archivos desde nuestra maquina host hacia los minions requeridos.

    cmd.run:
    - name: <ruta del archivo>
  
  El cual nos permite ejecutar comandos/archivos, por ejemplo: de tipo .sh

    pkg.installed:
    - pkg: <nombre del paquete> 

El cual nos permite instalar paquetes en nuestros minions.


**4. Comandos para la gestión de la configuración**

Reconocimos los dos comandos principales requeridos para poder gestionar la configuración de manera adecuada. El primero de ellos nos indica que la comunicacion entre el master y los minions es exitosa. Y el segundo pone en funcionamiento las configuraciones designadas en nuestros archivos .sls

    sudo salt '*' test.ping
    
    sudo salt '*' apply.state 



## Balanceador de carga
La herramienta que se escogió  para el balanceador de carga fue haproxy.  es un proxy inverso que distribuye el tráfico de red o de una aplicación a varios servidores. Esta herramienta ya había sido trabajada en el workshop-2 de sistemas distribuidos. En el archivo de configuración del balanceador (balancer.sls) Se define lo siguiente:

**1.** Se instala el paquete haproxy por medio del pkg.installed.

**2.** Se añade al  archivo haproxy.cfg la configuración del balanceador de carga. Esto define el puerto por el cual recibirá peticiones el balanceador y las direcciones de los servidores donde deberá redireccionar las peticiones.

**3.**  reiniciar el servicio de haproxy para que se cargue la configuración.



## Servidores web

La realización de los servidores web se hizo sobre el minion 1 y minion2. Para el backend se utilizo el lenguaje GO. Y  para el frontend el lenguaje React.

**1.**	Primero, se desarrolló el servicio REST en el backend utilizando el framework GIN. Se establecieron dos métodos GET. Uno que permite obtener todos los registros guardados en la base de datos, y otro para filtrar por nombre. La base de datos tiene que estar previamente desplegada. Para manejar los paquetes utilizados, se utiliza la tecnología de módulos de Go, que descarga e instala todas las dependencias necesarias al momento de correr el archivo.

**2.**	Después, se desarrolló el frontend utilizando la librería Axios, que permite hacer peticiones al backend. Las dependencias necesarias se cargan en el archivo package.json, y se utiliza el manejador de paquetes Yarn para que las instale al momento de ejecución.

**3.**	Estos dos proyectos preconstruidos se pasan a los minions mediante las carpetas compartidas de Vagrant.

**4.**	Se ejecuta el estado de Salt, el cual instala los programas necesarios, carga las variables de entorno al React, en las cuales están las direcciones IP de cada dispositivo, y ejecuta el servidor frontend y backend.



## Base de datos

Para la realización de la base de datos se utilizo la herramienta postgresql. La base de datos consiste en una tabla celulares, en donde se pueden hacer consultas de tipo SELECT por medio de los servidores web. 

**1.** Lo primero que se realizó fue instalar el paquete postgresql por medio del pkg.installed.

**2.** Posteriormente se procede a ejectuar comandos propios de postgresql que nos permiten crear el usuario, la base de datos, etc.

**3.** Por ultimo se ejecuta el script  *scriptdb*, el cual contiene la creación de la tabla de datos y los INSERT de los celulares de prueba que podrán consultar por medio de los servidores web.



## Integración

Para integrar todos los servicios implementados en cada minion se hizo uso del archivo top.sls, en el cual se define los estados que se deben aplicar dependiendo de cada maquina. 

- Para el miniondb, se definió el archivo balancer.sls 

- Para el minionlb, se definió el archivo database.sls

- Y para el minion1 minion2 se definió el archivo minion.sls 


En cada uno de estos archivos de configuración estan los comandos y scripts necesarios para correr los servicios correspondientes. 

Posteriormente se ejecuta el comando:

    sudo salt '*' apply.state 

Que aprovisiona todas las maquinas con las configuraciones hechas anteriormente. Es importante mencionar que durante el proceso de construcción del parcial, se uso el aprovisionamiento individual para comprobar que todo iba perfectamente, tal como se muestra a continuación.

    sudo salt 'miniondb' apply.state 

    sudo salt 'minionlb' apply.state 

    sudo salt 'minion1' apply.state 

    sudo salt 'minion2' apply.state 

Cuando termine de ejecutar el comando. Se puede ingresar por medio del navegador a la pagina web designada en el front. Y comprobar el funcionamiento de la plataforma. Se puede hacer uso del botón ***mostrar todos***  para ver los celulares de prueba que estan. Y posteriormente buscar individualmente cada celular por  su nombre. 



## Problemas encontrados

**1.** El primer problema con el que nos encontramos fue el desconocimiento que teníamos sobre algunas herramientas. Aunque ya habiamos tenido acercamiento con haproxy, React,  Vagrant y  postgresql. Era la primera vez que trabajabamos con **SaltStack** y **Go**. Con lo cual antes de comenzar a gestionar el código de la solución, fue un reto aprender sobre el funcionamiento  de dichas herramientas. 

**2.** Hubo un problema con la nomenclatura de los archivos de configuración de SaltStack. Pues no era solamente conocer cuales comandos utilizar, sino también la escritura de ellos. Por ejemplo: las comillas simples para definir los estados. Los espacios entre cada instrucción. o el guion antes de cada estado.

**3.** También tuvimos problemas de sintaxis en la construcción de la tabla de datos.  Pues no habíamos escrito de la manera correcta las comillas para los INSERT. 

**4** Al final, tuvimos un problema con las direcciones ip de los servidores web. Pues teníamos que pasar individualmente cada dirección al minion1 y minion2 respectivamente. Intentamos varias opciones, pero al final logramos esta configuración por medio de variables entorno. En donde se designa dinámicamente la dirección a cada minion.

