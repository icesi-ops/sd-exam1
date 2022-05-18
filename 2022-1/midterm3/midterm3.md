### Examen 3 - Proyecto final
**Universidad ICESI**  
**Curso:** Sistemas Distribuidos  
**Docente:** Joan S. Garcìa D.  
**Tema:** Kubernetes  
**Correo:** josegar0218 at gmail.com

## Objetivos
* Realizar el despliegue de una aplicación a través de Kubernetes
* Integrar servicios ejecutándose en nodos distintos

### Introduction
This test should demonstrate the automation necessary to package an app using helm and deploy it to a Kubernetes cluster. 

### Task
A simple REST-based python application has been builded by a expert engineer. He has provided you the source code, Dockerfile and a image already pushed a to Dockerhub (too generous engineer) but him didn't have time to packing the application using helm and deploy it in k8s. So it trust on you that you can make the best effort to achieve the next requirements. 

docker image: icesiops/midterm3app:0.1.0

Create the nexts k8s objects for the application:

• Defines a deployment 2 or more pods
• Defines a health check on the deployment that makes sure /liveness is responding with a 200
• Defines a health check on the deployment that makes sure /readiness is responding with a 200
• Defines a kubernetes service using ClusterIP
• Defines a kubernetes loadbalancer or kubernetes ingress (it give bonus) to allow traffic on to the pods vía internet.
For create the loadbalancer in a Local Cluster keep in mind that you have to install a add-ons that allow you simulate the LoadBalancer services.
For microk8s refer to -> https://microk8s.io/docs/addon-metallb

Create the nexts k8s objects for the database:
• Defines a deployment 2 or more pods
• Defines a kubernetes service using ClusterIP

Create a Helm Chart to packing the k8s resources created previously. The helm chart must templating all values used by k8s resources to be configured from the values.yaml. Example:

Maybe you have the next code for the deployment of database:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  labels:
    app: redis
spec:
  selector:
    matchLabels:
      app: redis
  replicas: 1
  strategy:
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
        - name: redis
          image: 'redis:alpine'
          ports:
            - containerPort: 6379
              protocol: TCP
```
it should templated via helm to avoid harcode values, example
```yaml
containers:
        - name: {{ .Values.services.redis.container_name }}
          image: {{ .Values.services.redis.container_image }}
          ports:
            - containerPort: {{ .Values.services.redis.container_port }}
              protocol: {{ {{ .Values.services.redis.container_protocol }}}}
```
each value hardcoded and configurable by consideration of your teacher, will drop points.

--- (Little Bonus) ---
- Define a deployment strategy rolling update
--- (end little bonus)

--- (BONUS) -----
Create a script (either a standalone script or using Make, Rake, etc..) that automates building
and deploying the application to a k8s cluster.
The script should include the following options for performing the specific subtasks of an endtoend deployment:
• Build
• Local unit or integration tests
• Package
• Deploy
• Smoke test

note: test phases should be executed using a test framework for your script language.
--- (END BONUS) ---

Include a README with the following:

• Clear breakdown of steps - assume that someone unfamiliar with your team's
environments, tooling should be able to read the docs and be able to execute the
different steps in their environment
• If you needed to put this service into production, what do you think it may be
missing? What would you add to it given more time?

Tools Needed

• Docker
• Kubernetes cluster available (can use a local cluster / docker-desktop / minikube / microk8s)
• Your scripting / programming language of choice
• Your favorite text editor

Hints
Add comments & documentation to your code! It's important that we understand not just
what was done, but why!
Google is your best friend, plagiarism is not.
After you're done, test this out in a clean environment from scratch, since we will want to try
and reproduce it if possible!

Judging criteria:
• Correctness. Does it do what we asked?
• Simplicity. Does the design match the task?
• Clarity. Can any competent programmer easily understand what's going on?
• Generality. It shouldn't be all hardcoded, but don't make it too abstract either.
• Tests and testability. It would be really great if you have tests. If not, it should be at
least possible to test this.
• Documentation:

• Can a junior developer get this running? Are requirements listed, including how to
install them? What platform did you develop and test your solution on? 
• Is there just enough documentation, to tell us why the program works this way?
• If you tried to do something and weren't successful, that's fine! Just document as clearly
as possible what you were aiming to do, what research you did, what you tried, where
you hit issues, etc.

TIP: do you remember how to connect apps in k8s? remember that each SVC created in K8s expose 7 environment variable to reach a SVC. So read the python code to know what is the environment variable used by the code to reach the REDIS and according it, set a ENV in youy deployment of app passing as value the SVC Env. 