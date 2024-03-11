# SD Exam 1 2024-1
### Authors
* Martin Perez Lopez - A00370027
* Carlos Arturo Diaz Artiaga - A00368987
### Deployment
![Deployment Diagram](https://i.ibb.co/hWyQCRp/midter1-drawio.png)  

**Figure 1**. Deployment diagram

#### Technologies used
* Express API gateway
* HA Proxy Load Balancer
* Consul Service Registry and Discovery
* Vue frontend
* Ruby backend
* ArangoDB
* Samba SMB file share

Components will run in docker containers. Images will be built using Docker Compose. The [script](deploy.sh) will create the network, build the images, and deploy the containers with the appropriate configuration.

In order to deploy this project into production, this will have to be migrated into a cluster, that can manage more or less instances of the different services. The API Gateway will have to be published onto the internet.

### Development branching strategies
![Diagram of GitFlow branching strategy](https://nvie.com/img/fb@2x.png)

**Figure 2**. GitFlow branching strategy 

During development, we used the GitFlow branching strategy. This allowed us to work on different features of this project simultaneously and then merge them. We used a development branch, and for each feature we developed, we created a new branch to work on that feature, that would later be merged onto the master branch when the assignment was ready. This can be evidenced in the repository [PR and Commit history](https://github.com/ArturoDiaz02/sd-exam1/pulls?q=is%3Apr+is%3Aclosed).

### Problems during development
While developing this project, we ran into many problems utilizing the Ruby framework and integrating it with the other services.
* Ruby did not have a well documented library to integrate directly with the Consul service. Instead, we studied the Consul API and communicated directly with it for service registry and discovery.
* We also had issues integrating the Ruby backend with the SMB fileshare (Samba). For this, we resolved issues by investigating the different client and server versions, and we decided to implement the SMB v1 protocol. We had to work and research thoroughly in order to resolve all the issues with the different Ruby framework plugins that enabled the interface and connection to the SMB fileshare.