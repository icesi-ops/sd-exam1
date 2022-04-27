### Examen 2
**Universidad ICESI**  
**Curso:** Sistemas Distribuidos  
**Docente:** Joan S. Garcia D.  
**Tema:** Orquestación de Contenedores (k8s)
**Correo:** josegar0218@gmail.com

El sistema de pagos trabajado para la primera parte del semestre ha dado sus frutos y la compañía "MyPay" ha decidido comprar el código fuente y contratarlo a usted para
el desarrollo del despliegue de los servicios usando Kubernetes como herramienta de orquestación de contenedores. Por lo que en una fase inicial ha solicitado hacer un PoC de como sería el despliegue del microservicio de config, kafka y algún otro microservicio del sistema (pay, transaction, invoices) con su respectiva DB.

La compañía basada en su experiencia y en una consultoría pagada, ha determinado los siguientes requerimientos para el despliegue de lo anteriormente mencionado y considera que puede ser entregado en 2 horas de trabajo:
- Un namespace propio para el sistema
- Un recurso de tipo deployment para el despliegue del microservicio ConfigServer:
  - El deploymente debe declarar mínimo 6 replicas
  - La estrategia de deployment es un RollingUpdate con máximo 2 pods unvailable y 3 maxSurge
- Un recurso de tipo service para el tráfico hacia el microservicio ConfigServer:
  - El servicio debe ser de tipo NodePort
- Un recurso de tipo deployment para el despliegue de uno de los microservicios:
  - El deployment debe declarar minimo 2 replicas
  - La estrategia de deployment es un RollingUpdate con máximo 1 pods unvailable y 1 maxSurge
- Un recurso de tipo service para el tráfico hacia el microservicio:
  - El servicio debe ser de tipo LoadBalancer
- Un recurso de tipo ReplicaSet para el despliegue de la base de datos del microservicio:
  - El replicata set debe declara minimo 2 replicas
- Un recurso de tipo Service para el tráfico hacia la BD
  - El servicio debe ser de tipo ClusterIP.

La empresa le ha proporcionado a usted los archivos necesarios para el despliegue del Kafka y su servicio.

Se tendrá en cuenta los siguientes items como criterios de aceptación:
- Cada deployment se inicializa de forma correcta, es decir, los pods corren sin problemas.
- Hay comunicación entre el microservicio y configserver a través de los servicios creados para ellos.
- Hay comunicación entre el microservicio y su bd a través de los servicios creados para ellos.
- Hay comunicación entre el microservicio y kafka a través de los servicios creados para ellos.
- El microservicio puede ser alcanzado via internet a través del servicio LoadBalancer.
- Hay pull request

La entrega debe ser un PULL REQUEST hacia https://github.com/icesi-ops/sd-exam2, conteniendo un README con el nombre, código y evidencias de funcionamiento.


BONUS
- Si llegas hasta aquí, preguntar por él :) 


