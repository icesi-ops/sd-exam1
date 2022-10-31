### Examen 2
**Universidad ICESI**  
**Curso:** Sistemas Distribuidos  
**Docente:** Joan S. Garcia D.  
**Tema:** Orquestación de Contenedores (k8s)
**Correo:** josegar0218@gmail.com

El sistema de ToDos trabajado para la primera parte del semestre ha dado sus frutos y la compañía "MyPlanning" ha decidido comprar el código fuente y contratarlo a usted para
el desarrollo del despliegue de los servicios usando Kubernetes como herramienta de orquestación de contenedores. Por lo que en una fase inicial ha solicitado hacer un PoC de como sería el despliegue de un microservicio asignado de la app microservice-app-example

La compañía basada en su experiencia y en una consultoría pagada, ha determinado los siguientes requerimientos para el despliegue de lo anteriormente mencionado y considera que puede ser entregado en 2 horas de trabajo:
- Un namespace propio para el sistema

- Un recurso de tipo deployment para el despliegue de uno de los microservicios:
  - El deployment debe declarar minimo 2 replicas
  - La estrategia de deployment es un RollingUpdate con máximo 1 pods unvailable y 1 maxSurge
- Un recurso de tipo service para el tráfico hacia el microservicio:
  - El servicio debe ser de tipo LoadBalancer
  - Cada microservicio debe utilizar su popia imagen hosteada en dockerhub



Se tendrá en cuenta los siguientes items como criterios de aceptación:
- Cada deployment se inicializa de forma correcta, es decir, los pods corren sin problemas.
- El microservicio puede ser alcanzado via internet a través del servicio LoadBalancer.
- Hay pull request
- Las imágenes deben estar en el dockerhub de cada estudiante

La entrega debe ser un PULL REQUEST hacia https://github.com/icesi-ops/sd-exam2, conteniendo un README con el nombre, código y evidencias de funcionamiento.


BONUS
- Si llegas hasta aquí, preguntar por él :) 

