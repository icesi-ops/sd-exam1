# Exámen 1 Sistemas Distribuidos Icesi

### Integrantes
- **Marcela Hormaza** -->  A00310504

- **Bryan Medina** --> A00328416

- **Jessica Sánchez** --> A00030124


### Condiciones del exámen 
- Backend con NodeJS


## Aprovisionamiento del balanceador
Se presentaron tres opciones para la gestión de la configuración, las cuales eran SaltStack, Puppet, Chef.
Tras un concenso grupal se determinó usar SaltStack, aprovechando un demo bastante entendible encontrado en : 

Referencía: https://docs.saltstack.com/en/getstarted/fundamentals/

Este implicaba modificar el Vagrant file y añadir unos archivos para indicar los minion y master correspondientes.

Información que necesitabamos

**¿Qué es un minion en SaltStack?**

Referencía: https://docs.saltstack.com/en/latest/ref/cli/salt-minion.html

**¿Qué es un master en SaltStack?**

Referencía: https://docs.saltstack.com/en/latest/ref/cli/salt-master.html

**Instalación SaltStack**

Referencía: https://docs.saltstack.com/en/latest/topics/tutorials/walkthrough.html

**Configuración Vagrant-SaltStack**

Referencía: https://www.vagrantup.com/docs/provisioning/sa

Referencía: https://medium.com/@Joachim8675309/vagrant-provisioning-with-saltstack-50dab12ce6c7

Referencía: https://docs.saltstack.com/en/latest/topics/cloud/vagrant.html

Referencía: https://hittaruki.info/post/vagrant-saltstack-tutorial/

Referencía: https://www.imagescape.com/blog/2015/08/24/testing-saltstack-vagrant/

Referencía: https://subscription.packtpub.com/book/virtualization_and_cloud/9781789138054/14/ch14lvl1sec68/provisioning-vagrant-with-salt

En nuestro caso, el **Salt master** fue considerado el Load balancer para poder tener como **Salt minion** a los web server 1  y 2.

La rama baseConVagrant, indicaba lo aprendido en clase y que sería útil para el desarrollo del exámen.

En la rama Vagrant_salt, en el primer intento/versión no funcional que se realizó. Este intento consistía en comprender y aplicar los términos y conceptos consultados. Además de aprovechar el ejemplo brindado por el demo. Sin embargo surgieron varias incognitas.

- ¿Debia algún archivo autogenerarse? 
- ¿Las direcciones IP debian ser cambiadas manualmente?
- ¿Cómo determinar que función cumplía el db? ¿Era un minion o un master?
- Entre otros

**Generar keys**

Cómo anteriormente se mencionó, se tenia dudas sobre que archivos deberían autogenerarse. Tras consultar, se comprendió
que las llaves de cada minion y master debían generarse por medio de un comando.

Referencía: https://docs.saltstack.com/en/master/topics/tutorials/preseed_key.html

En el segundo intento, se encontró la ausencia de dos keys para minionlb y miniondb. Por tanto, se procedió a su creación, logrando ejecutar efectivamente el Vagrantfile. Aquí habia quedado pendiente:

- Indicar a db y los web server que instalar.
- Configurar la db
- Archivos del webserver.

### Procedimiento ###

- Instalar Vagrant y SaltStack.
- Definir master y minion a usar.
- Definir configuración de master y minion.
- Generar las llaves para cada uno de los daemons minion y master.
- Modificar el archivo Vagrantfile de acuerdo a las necesidades.


## Aprovisionamiento de servidores web ##

Información consultada:

- https://codeburst.io/build-a-weather-website-in-30-minutes-with-node-js-express-openweather-a317f904897b
- https://youtu.be/VZBaahkZk5M?list=PLty0cFLf07jX4NuX99u3lZT4xEELJoaqc
- https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module-es
- https://www.tutorialsteacher.com/nodejs/expressjs-web-application

El procedimiento para aprovisionar los servidores web fue:

En la rama webserver, se tomó como base la primer versión de vagrant_salt y continuo a ello, se creo un directorio llamado webserver dónde se creo dos archivos:

- index.html
- server.js

Dando como resultado la siguiente visualización. (Tenga en cuenta que esta fue la primer prueba, y era básica)

https://raw.githubusercontent.com/alejajessi/sd-exam1/images/images/webbasic.png

Luego se hizo otro adelanto, este consistió en la realización de un html más avanzado y alcanzando el objetivo de este exámen. Este html debía mostrar la tabla:

https://raw.githubusercontent.com/alejajessi/sd-exam1/images/images/tabla.png
(Se creo un archivo plus llamado styles para que el html tuviera mejor presentación a la anterior)

También se añadió el archivo .html llamado add_book_form siendo este un formulario para añadir libros.

En otra fase o adelanto, se realizo el archivo showTableApp.js el cual se encarga de leer los datos de la tabla desde un archivo json y los escribe al index.html para poder ser visualizados en el Frontend.

**Procedimiento** 

- Instalar Node js
- Instalar modulos necesarios, a parte de los de node. (Ejemplo: express, path, entre otros)
- Crear un servidor básico 
- Crear el formulario para tener orden al momento de ingresar datos.
- Crear un archivo style para generar estetica en el html ***nota*** no se coloco en el mismo html por buenas prácticas.
- Crear un archivo para lectura de datos y asignación en el html principal (index.html en nuestro caso)
- ***En nuestro caso modificamos en un commit el archivo server.js para comprobar el funcionamiento, mientras se realizaba la unión con la base de datos***
- Conectar con la base de datos

**Dificultades**

-  **Caso 1** ¡No teniamos acceso a los html!---> En esta situación, aunque habían varios archivos sólo teníamos acceso al index.html. Esto se solucionó modificando una línea en el archivo server.js que define el espacio que puede ser utilizado por el servidor. Consideramos fue un error que llamamos "capa 8" puesto que se había colocado la ruta de un archivo y no la de un directorio.

- **Caso 2** ¡Pruebas fallidas! ---> En este caso, gracias a la división de tareas aún no se tenía implementación de una base de datos y se instaló una "mini base de datos", pero al momento de trabajar con la real, el método fallo y tuvo que tener arreglos. Se cambio la forma en que añadia elementos a la tabla porque el json de prueba realizado y el json de la base de datos tienen estructuras distintas.




