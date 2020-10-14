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

En nuestro caso, el **Salt master** fue la vm para poder tener como **Salt minion** a los web server 1  y 2.

La rama baseConVagrant, indicaba lo aprendido en clase y que sería útil para el desarrollo del exámen.

En el primer intento/versión de la rama Vagrant_salt fue no funcional. Este intento consistía en comprender y aplicar los términos y conceptos consultados. Además de aprovechar el ejemplo brindado por el demo. Sin embargo surgieron varias incognitas.

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

**Dificultades**

- **Caso 1** Estructura según SaltStack --> Para nosotros SaltStack era una herramienta completamente nueva, lo que implicaba tener aprendizaje activo desde cero. Gracias al demo pudimos definir que los servidores web o web servers serían un minion pero no sabíamos si se podia determinar más de un master o si db y lb debian ser minion o master. Esto se resolvió a través de consultas.

- **Caso 2** Como se mencionó anteriormente, no sabiamos que archivos debían autogenerarse ya que estabamos basados en el demo y este no nos especificaba que archivos debiamos realizar o modificar manualmente y cuales no. Tras leer la documentación oficial tanto de SaltStack como de Vagrant descrubimos que las key debían ser generadas y procedimos a hacerlo. También en un "debug" manual al comentar las dos últimas minion que habíamos colocado(lb y db)se podía correr el VagrantFile ¿Por qué? porque habiamos usado las key que proveía el demo para los minion webserver 1 y 2, así que con estas no tenía ningún conflicto.




## Aprovisionamiento de servidores web ##

Información consultada:

- https://codeburst.io/build-a-weather-website-in-30-minutes-with-node-js-express-openweather-a317f904897b
- https://youtu.be/VZBaahkZk5M?list=PLty0cFLf07jX4NuX99u3lZT4xEELJoaqc
- https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module-es
- https://www.tutorialsteacher.com/nodejs/expressjs-web-application

El procedimiento nuestro para aprovisionar los servidores web fue:

En la rama webserver, se tomó como base la primer versión de vagrant_salt y continuo a ello, se creo un directorio llamado webserver dónde se añadieron dos archivos:

- index.html
- server.js

Dando como resultado la siguiente visualización. (Tenga en cuenta que esta fue la primer prueba, y era básica)

https://raw.githubusercontent.com/alejajessi/sd-exam1/images/images/webbasic.png

Luego se hizo otro adelanto, este consistió en la realización de un html más avanzado y alcanzando el objetivo de este exámen. Este html debía mostrar la tabla:

https://raw.githubusercontent.com/alejajessi/sd-exam1/images/images/tabla.png
(Se creo un archivo plus llamado styles para que el html tuviera mejor presentación a la anterior)

También se añadió el archivo .html llamado add_book_form siendo este un formulario para añadir libros.

En otra fase o adelanto, se realizo el archivo showTableApp.js el cual se encarga de leer los datos de la tabla desde un archivo json y los escribe al index.html para poder ser visualizados en el Frontend.

### Procedimiento

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


## Aprovisionamiento de la base de datos ##

Información consultada: 

- https://carlosazaustre.es/como-crear-una-api-rest-usando-node-js
- https://medium.com/@asfo/desarrollando-una-sencilla-api-rest-con-nodejs-y-express-cab0813f7e4b
- https://code.tutsplus.com/es/articles/an-introduction-to-mongoose-for-mongodb-and-nodejs--cms-29527
- https://developer.mozilla.org/es/docs/Learn/Server-side/Express_Nodejs/mongoose
- https://riptutorial.com/es/mongoose

### Procedimiento

- Instalar gnupg
- Descargar la llave de instalación de mongodb
- Descargar el repositorio de instalación de mongo
- Actualizar los repositorios
- Instalar mongo --> Referencía: https://docs.mongodb.com/manual/installation/
- Configurar IP y puerto en el archivo mongod.conf
- Correr servicio

**Dificultades**

- Según nuestra metodología de trabajo, el compañero que tenía asignada la implementación de mongo tenía problemas ya que no dispone originalmente de un sistema operativo con distribucción Linux y en Windows con maquinas virtuales le generaba varios errores como el siguiente: 

https://raw.githubusercontent.com/alejajessi/sd-exam1/images/images/errorMongo.jpeg

Esto más que solución efectiva, fue solución práctica dado el tiempo decidimos implementar lo realizado por el compañero en otro computador.

## Tareas de integración ##

Aprovechando la herramienta **git** decidimos trabajar en un formato con branches a través de reviews por los compañeros del equipo, por eso era necesario los pull request.

En total tuvimos 4 ramas a parte de la master y la images.
- **master** --> Rama principal dónde se "mergeaba" o unía lo que estaba bueno y funcional de las otras branches o ramas.
- **images** --> Rama dónde se adjunto las imagenes para este README.
- **baseConVagrant** --> Rama inicial/base con lo aprendido en clase sin incluir el tema de Ansible ya que se solicitaba implementar otra herramienta como Puppet, Chef o en nuestro caso SaltStack.
- **vagrant_salt** --> Rama con el VagrantFile modificado para aprovisionarlo con SaltStack incluyendo cnfiguración necesaria para los minion y master.
- **webserver** --> Rama con la parte de los servidores web, aqui se incluyo la parte de json y html correspondiente.
- **pruebaDB** --> Rama asignada para la configuración de la base de datos, en nuestro caso Mongo.

Orden de merge
- baseConVagrant
- vagrant_salt
- webserver
- pruebaDB
