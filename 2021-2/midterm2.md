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
* docker-compose
* Algún lenguaje de programación
* Alguna base de datos

### Descripción
En este parcial demostrará la creación de un simple servicio y la automatización necesaria para empaquetar y desplegar este en un ambiente contenerizado usando docker-compose 

### Requerimientos
Deberá desplegar una plataforma que cumpla con los siguientes requerimientos:

## PARCIAL PARA 1 PERSONA

Construir un API REST (en cualquier lenguaje de programación) que se conecte con una base de datos MYSQL, POSTGRES, MONGO, COCKROACH, o la base de datos de su preferencia
El contexto de la app es LIBRE, es decir, el estudiante o grupo le puede dar el enfoque que desea (libros, juegos, estudiantes, inventario, etc).

- La aplicación deberá hacer SELECT, UPDATE, INSERT, DELETE, desde llamadas de endpoint.
- La aplicación debe estar dockerizada y almacenada en un repositorio de imágenes de docker.
- La aplicación debe tener un endpoint /health que devuelva un JSON con el estado de salud del servicio. 
- La base de datos debe de utilizar volumenes de docker para que sus datos sean persistentes.
- Todo el ambiente de la app debe ser desplegado con docker-compose.
- Las replicas del contenedor y de la base de datos deben ser mayor a 2
- Los contenedores de la app deberan tener recursos limitados de máximo 1cpu y máximo 500mb de memoria.
- EL API solo debe devolver respuestas en formato JSON.
- Debe existir delante de la aplicación un NGINX que funcione como proxy para el redireccionamiento HTTP a HTTPS.

Deberá incluir un README.md con los sgntes puntos:
- Desglose claro de los pasos: se supone que alguien que no esté familiarizado con su desarrollo debería ser capaz de leer los documentos y ejecutar los pasos necesarios para correr el ambiente de su app.
- Si necesitas poner este servicio en producción, ¿qué crees que puede faltar? ¿que le falta? ¿Qué le añadirías si tuvieras más tiempo?

## PARCIAL PARA 2-3 PERSONAS (BONUS PARA 1 PERSONA)

Además debera crear un script en bash que automatice todo el proceso de construcción y despliegue de la app con docker-compose.
El script debe incluir las siguientes etapas para realizar el build y el despliegue del ambiente.
- Construir
- Pruebas unitarias o de integración locales
- Empaquetar
- Despliegue

Deberá incluir un README.md con los sgntes puntos:
- Desglose claro de los pasos: se supone que alguien que no esté familiarizado con su desarrollo debería ser capaz de leer los documentos y ejecutar los pasos necesarios para correr el ambiente de su app.
- Si necesitas poner este servicio en producción, ¿qué crees que puede faltar? ¿que le falta? ¿Qué le añadirías si tuvieras más tiempo?

# BONUS (para parcial en grupo)
- Montar una ec2 y desplegar el parcial en una ec2.
- Utilizar un dominio gratis como .tk para el consumo de la aplicación corriendo en la ec2
- Crear el script de despliegue usando JENKINS.
