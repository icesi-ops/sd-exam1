### Examen 1
**Universidad ICESI**  
**Curso:** Sistemas Distribuidos  
**Docente:** Joan S. Garcia D.  
**Tema:** Infraestructura como código (Aprovisionamiento-CM)  
**Correo:** joan.garcia1 at correo.icesi.edu.co

### Integrantes

| Nombre | Código |
|----------|----------|
| Santiago Gutierrez   | A00369145   |
| Jhorman Mera    | A00369206   |

### Tecnologías sugeridas para el desarrollo del examen
* Docker
* Docker compose
* .NET
* REACT
* Redis
* Express-gateway
* Firestore
* Postgres SQL
* Volúmenes de docker (Persistencia de datos)
### Estrategia de Branching

* #### Gitflow:
Gitflow proporciona una estructura clara y flexible para la gestión del flujo de trabajo en proyectos de desarrollo de software, lo que lo hace adecuado tanto para el backend como para el frontend. Facilita la colaboración entre equipos, la gestión de versiones y la resolución de problemas, lo que contribuye a un desarrollo más eficiente y organizado en ambos aspectos del software.

* #### Rama por ambiente (Branch by environment):
La estrategia de rama por ambiente es una opción sólida para gestionar los datos de integración de varios microservicios, ya que proporciona aislamiento, facilita la implementación continua, mejora la visibilidad y trazabilidad, simplifica las pruebas y depuración, y ofrece un mayor control sobre el despliegue en cada ambiente.

#### Repositorios complementarios
* [Frontend](https://github.com/SGutierrez-11/backend-library-app.git)
* [Backend](https://github.com/SGutierrez-11/frontend-library-app.git)

#### Arquitectura del despliegue
![alt text](/resources/img/image.png)
````Por inconvenientes en el funcionamiento, e integración con .NET, el almacenamiento centralizado se manejó en nube usando los servicios de firestore````
#### Arquitectura final:
![alt text](/resources/img/arquitectura-nueva.jpg)


### Servicios Implementados:
* Api Gateway 
* Balanceador de carga
* Registro y descubrimiento (Consul)
* Frontend
* Backend
* Base de datos
* Almacenamiento centralizado (en nube)    

### Cosas por añadir

* Parametrizar las tecnologías a utilizar en este tipo de esquemas en importante. Se desconocìa el framework web de .NET por lo que algunas herramientas e implementaciones no funcionaron por desconocer el tema de dependencias y librerías usadas por dicho framework.
* De cierta manera, es importante el uso de herramientas que incluyan todo el sistema de comunicación y replicamiento, tales cómo kebernetes.
* Mantener un control de direcciones y puertos, de cierta manera reglamentar los usos de la red, y la asignación de direcciones.
* Usar herramientas de despliegue continuo para hacer correcciones de código eficientemente

#### Para ejecutar los microservicios

* Es necesario tener ````docker y docker compose```` instalado en el sistema
* Dentro de la carpeta principal "sd-exam1" ejecutar el comando ````docker-compose up -d```` para levantar todos los servicios al mismo tiempo 

#### En local

Para correr el proyecto en local es necesario tener instalado:
* Node.js
* Visual Studio 2022