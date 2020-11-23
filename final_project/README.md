# Final Project Distributed System

**Universidad ICESI**  
**Curso:** Sistemas Distribuidos  
**Docente:** Joan S. Garcìa D.  
**Tema:** Automatización de infraestructura (Docker)  
**Correo:** joan.garcia1 at correo.icesi.edu.co

### **Objective:**
This test should demonstrate the creation of a simple service and the automation necessary to package and deploy it to a Kubernetes cluster. Submit a PR that we can access to check out your work!

### Pre-requisites
- Docker
- Kubernetes Cluster on GCP
- Your scripting / programming language of choice 
- Your favorite text editor 

## Tasks 

- Build a simple REST-based either python, nodejs, golang, dart, ruby, java, application (a 'hello world' app is fine) 
- Build a Dockerfile that builds a working image that execute the App that you created above.
- Create a Helm chart for the application that:  
• Defines a deployment 2 or more pods  
• Defines a health check on the deployment that makes sure /health is responding with a 200  
• Defines a kubernetes service using ClusterIP  
• Defines a kubernetes ingress to allow traffic on to the pods 

- Create a script (either a standalone script or using Make, Rake, etc..) that automates building and deploying the application to a k8s cluster.
The script should include the following options for performing the specific subtasks of an endtoend deployment:  
• Build  
• Local unit or integration tests  
• Package  
• Deploy  
• Smoke test (Optional)

note: test phases should be executed using a test framework for your script language.  

Include a README with the following:  
• Format markdown, names, good spelling  
• Clear breakdown of steps - assume that someone unfamiliar with your team's environments, tooling should be able to read the docs and be able to execute the different steps in their environment  
• If you needed to put this service into production, what do you think it may be missing? What would you add to it given more time?  

## Hints

Google is your best friend, plagiarism is not. 
After you're done, test this out in a clean environment from scratch, since we will want to try and reproduce it if possible! 

## Definition of done:
- 2 or more pods are running. 
- I can reach the pods througth public IP  
- I can change the version of the image and the pipeline deploy the new version automatically.  

## Acceptance criteria:  

• Correctness. Does it do what we asked?  
• Simplicity. Does the design match the task?  
• Clarity. Can any competent programmer easily understand what's going on?  
• Generality. It shouldn't be all hardcoded, but don't make it too abstract either.  
• Tests and testability. It would be really great if you have tests. If not, it should be at least possible to test this.  
• Documentation  
