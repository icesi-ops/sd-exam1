### Examen 1
**Universidad ICESI**  
**Curso:** Sistemas Distribuidos  
**Docente:** Joan S. Garcia D.  
**Tema:** Infraestructura como código (Aprovisionamiento-CM)  
**Correo:** josegar0218 at gmail.com

## Integrantes
---
### Jhoan David Fiat Restrepo
### Jaime Andrés Mayor Aldana
### Alejandra Díaz Parra
---


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





## Primer Paso

Definimos una estrategia de branching, tomando la decisón de cómo será la división de trabajos y responsabilidades en las funciones de cada integrante. Definiendo que se va a trabajar utilizando Git y Github, y vamos a dividir tres etapas principales en ramas para evitar conflictor y separar el trabajo.

![](https://i.imgur.com/S6gfVOe.png)

De esa decisión, se define que el siguiente proceso es, basado en los requerimientos realizar el diseño de la infraestructura en donde será alojada la aplicación. 

Posteriormente a este paso, se propone dividir el trabajo en cuatro etapas principales:

- ### Documentation: 
    Se toma como parte importante del proceso, en donde se van documentando los procesos de cada etapa, las dificultades encontradas y las conclusiones de cada etapa. Se presenta a través del README del proyecto en git.
- ### Frontend:
    Se presenta como una rama dentro del repositorio en Github, se propone que una persona trabaje en el front, ya que se considera no es una labor extensa por la naturaliza de la solución, se utiliza React para realizarlo.
- ### Backend:
    Al igual que el frontend, se divide en una rama del repositorio en Github, y del mismo modo una persona se va a encargar de la implementación del backend utilizando Java como lenguaje de programación, logrando división en el trabajo y agilidad en el proceso. 
    #### * Unión de Ramas: es importante aclarar que al tener las ramas de frontend y backend listas, se procede a realizar un merge de ambas ramas, teniendo debidamente implementada la aplicación y esperando que sea dotada de su infraestructura en una rama Application.
- ### Provisioning:
    Se realiza en una rama individual, también lo realiza una sola persona utilizando Terraform y Azure para dotar la aplicación de una infraestructura alojada en la nube. Y permitiendo su configuración posterior.
    
---
Después de realizado el trabajo de estas ramas, se realiza: 

- ### Configuration Management: 
    Se crea una rama en donde se trae lo implementado en la rama de Provisioning, logrando continuar el trabajo anterior y realizar las respectivas pruebas y conexión con la infraestructura, la rama Provisioning es destruída al traer todo a la rama de Configuration Management.
    Se realiza la configuración de la infraestructura de forma remota a través de Ansible, logrando que cumpla todos los requerimientos para permitir la debida ejecución de la aplicación. 
    
   #### * Unión de Ramas: Al finalizar provisioning y configuration management, se realiza un merge de esta rama con la rama Application, en donde se planea llevar a cabo las pruebas de todo el sistema funcionando llevando a cabo ajustes menores. Finalmente se lleva todo a la rama de Production o Development.

