# 🏫Icesi Pages

This is a static web hosting service using a combination of technologies. The service is based on a load balancer that distributes traffic between two web servers running a Flask application, allowing efficient traffic management and high availability of the website. 
In addition, a MongoDB database has been integrated to store and manage relevant website information. This database is persistent, ensuring that data is secure and available in case of server failure. In short, a secure and scalable web hosting service has been created that uses modern technologies to ensure high performance and a seamless user experience.


# 👥Team

 - Esteban Yunsuguaira López 
 - Jose Luís Restrepo Obando 
 - Anderson Cárdenas Guaca
 
## 📚Prerequisites

- Vagrant `2.2.19`
- Ansible `2.14.2`
- Virtualbox `6.1.38`

## ✅How to run

1. Clone the repository and enter the *sd-exam1* folder
2. Run `chmod +x scripts/nodes_gluster.sh`
3. Run `chmod +x scripts/runflask.sh`
4. Add the `secrets.py` file into the python templates with the database connnection string
5. Run `vagrant up`


This will automatically provision all necesary infraestructure  and configure all the nodes in it. 

![Diagrama](https://camo.githubusercontent.com/2373b9f8c6a1f1bdd84295995672de1815806704e4ff274d2485a974cbe6deb0/68747470733a2f2f692e6962622e636f2f595138676459642f6469616772616d2e706e67)

In this system, we have five nodes: 
 - ReverseProxy that redirects http request to https request using Nginx and self-signed certificates
 - LoadBalancer that evenly distributes incomming traffic accross the webservers using the round robin algorithm
 - WebServers (2) that serves both front and backend of the system functionalities. 
	- Uses Python and Flask to handle the user webpage uploading and rendering
	- All uploaded files are stored in a distributed file system built with glusterfs. The status report of this distributed file system can be accessed through the webpage as well as the list of files
	- The webservers are connected to a MongoDb database that stores metedata from the uploaded files
 - Database that acts as the master node for the gluster file system and runs the MongoDb database using docker

## 📌  Provisioning Process

All virtual machines run CentOs7 as SO, have 512Mb ram (except for the database that uses 1024Mb) and 1 CPU

- **Reverse Proxy Provisioning**

The nginx virtual machine defined in the vagrantfile has a forwarded port that allows the host to access the reverse proxy, ideally by using the web browser.
It runs an ansible playbook that configurates the self-signed certificates, the reverse proxy and its connection with the load balancer. 

The loadbalancer ip is configured as an extra variable so the configuration file `(nginx.conf.j2)` can use it.
```ruby
config.vm.define "nginx"  do |nginx|
	nginx.vm.box = "centos/7"
	nginx.vm.hostname = "IcesiPages"
	nginx.vm.network "private_network", ip: "192.168.56.199"
	nginx.vm.network "forwarded_port", guest:80, host:80
	nginx.vm.provider "virtualbox"  do |vb|
		vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "nginx"]
	end

	nginx.vm.provision "ansible"  do |ansible|
		ansible.playbook = "playbooks/nginx/main.yaml"
		ansible.groups = {
			"nginx" => ["nginx"]
		}

	ansible.extra_vars ={
		"loadbalancer_ip": "192.168.56.200"
	}
	end
end
```


- **Load Balancer Provisioning**

It runs an ansible playbook that configurates the load balancer using the round robin algorithm and its connection with the webservers. The extra variables are used in the `haproxy.j2` configuration file. 

```ruby
config.vm.define "lb"  do |lb|
	lb.vm.box = "centos/7"
	lb.vm.hostname = "lb"
	lb.vm.network "private_network", ip: "192.168.56.200"

	lb.vm.provider "virtualbox"  do |vb|
		vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "lb"]
	end

	lb.vm.provision "ansible"  do |ansible|
		ansible.playbook = "playbooks/haproxy/loadbalancer.yaml"
		ansible.extra_vars = {
			"web_servers" => [
				{"name": "web-1","ip":"192.168.56.101"},
				{"name": "web-2","ip":"192.168.56.102"}
			]
		}
	end
end
```
- **Web servers Provisioning**

Creates two VMs with the hostnames `web-1` and `web-2`. The VMs are configured with private network IP addresses `192.168.56.101` and `192.168.56.102`, respectively. 

The VMs are also configured with custom storage settings using `VirtualBox`, including 512MB of memory, and a 1GB virtual hard drive. The code checks if the virtual hard drive exists before creating it.
```ruby
(1..2).each do |i|
     config.vm.define "web-#{i}" do |web|

      disk_dir = "./disk#{i}.vdi"
      web.vm.box = "centos/7"
      web.vm.hostname = "web-#{i}"
      web.vm.network "private_network", ip: "192.168.56.10#{i}"
      web.vm.provider "virtualbox" do |vb|
       vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "web-#{i}"]
       unless File.exist?(disk_dir)
        vb.customize ['createhd', '--filename', disk_dir, '--variant', 'Fixed', '--size', 1 * 1024]
       end #end unless
      vb.customize ['storageattach', :id,  '--storagectl', 'IDE', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', disk_dir]
      end #end vb

      web.vm.provision "ansible" do |ansible|
        ansible.playbook = "playbooks/python/flask.yaml"
        ansible.groups = {
         "webservers" => ["web-#{i}"]
        }
      end #end ansible 

      web.vm.provision "ansible" do |ansible|
        ansible.playbook = "playbooks/glusterfs/glusterfsconfig.yaml"
        ansible.groups = {
         "webservers" => ["web-#{i}"]
        }
      end #end ansible 

     end # end define
    end #end for
```
- **Database Provisioning**

This code creates a single VM with the hostname `db`. The VM is configured with a private network IP address of `192.168.56.198`. The VM is also configured with custom storage settings using VirtualBox, including 1GB of memory, and a 1GB virtual hard drive. The code checks if the virtual hard drive exists before creating it.
```ruby
config.vm.define "db" do |db|
      disk_dir = "diskdb.vdi"
      db.vm.box = "centos/7"
      db.vm.hostname = "db"
      db.vm.network "private_network", ip: "192.168.56.198"
      db.vm.provider "virtualbox" do |vb|
       vb.customize ["modifyvm", :id, "--memory", "1024", "--cpus", "1", "--name", "db"]
       unless File.exist?(disk_dir)
        vb.customize ['createhd', '--filename', disk_dir, '--variant', 'Fixed', '--size', 1 * 1024]
       end #end unless
      vb.customize ['storageattach', :id,  '--storagectl', 'IDE', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', disk_dir]
      end
      db.vm.provision "ansible" do |ansible|
        ansible.playbook = "playbooks/glusterfs/glusterfsconfig.yaml"
      end 
      db.vm.provision "ansible" do |ansible|
        ansible.playbook = "playbooks/db/db.yaml"
      end 
    end
```
## 🧰 Configuration Management

- **Reverse Proxy**

The playbook installs and configures the Nginx server on a remote machine. It performs tasks such as installing dependencies, creating a self-signed SSL certificate, configuring the firewall, and copying necessary files for the web page, among others. Finally, it ensures that the Nginx service is running correctly.

`playbooks/nginx-proxy/main.yaml →Reverse proxy provisioning`

- **Load Balancer**

The first task, named `"Install haproxy"`, uses the `yum` module to install `haproxy`. 
```yaml
- name: "Install haproxy"
  yum:
	name:
	- haproxy
```
The second task, named `"Configure haproxy"`, uses the `template` module to copy a Jinja2 template file located at `templates/haproxy.j2` to `/etc/haproxy/haproxy.cfg` on the target host. This task also sets the owner, group, and file mode of the copied file using the `owner`, `group`, and `mode` keywords. 
```yaml
- name: "Configure haproxy"
  template:
    src: templates/haproxy.j2
    dest: /etc/haproxy/haproxy.cfg
    owner: root
    group: wheel
    mode: '0644'
```
The third task, named `"Restart and enable haproxy"`, uses the `service` module to restart and enable the haproxy service on the target host. 
```yaml
- name: "Restar and enabled haproxy"
  service:
  name: haproxy
  state: restarted
  enabled: yes
```

`playbooks/haproxy/loadbalancer.yaml →Load balancer provisioning`
		
- **Glusterfs**

This is an Ansible playbook that provisions GlusterFS nodes and sets up a master node for creating a replicated volume. The first part of the playbook provisions the nodes by installing GlusterFS and creating a partition for the GlusterFS data. It also mounts the partition and adds hosts entries for the nodes.

The second part of the playbook sets up the master node by running a script that creates a replicated volume using the GlusterFS nodes that were provisioned in the previous step.

`playbooks/glusterfs/glusterfsconfig.yaml →Reverse proxy provisioning`


- **Python**

The file you presented is an Ansible playbook in YAML format that is used to configure Python web servers. This playbook contains a series of tasks, such as installing Python, the pip package, and the Flask and MongoDB Connector Python libraries, creating a directory, and configuring files necessary to run a Flask web application. The playbook also installs the "tree" package and configures secrets and data service files. Overall, this playbook sets up a basic environment for hosting a Flask web application.

`playbooks/python/flask.yaml →Reverse proxy provisioning`

	
## 🔨Team work
- **Esteban:** backend development with flask
- **Jose Luís:** database configuration and backend
- **Anderson:** provisioning and integration of services (database, backend, loadbalancer, reverseproxy)

## 🔗Branching

We tried to follow Gitflow Workflow as branching strategy but because of the way the team worked and the equipment limitations, we had a huge backend branch in which the project was basically entirely developed.

The first commit in the *master* branch contained all the fully working infrastructure.
The `development` branch contained all the working and stable increments.
The `backend` branch contained all the code involving the flask application.
The `db` branch contained all the code involving the db configuration.

## 👺Postmortem

- It was difficult to work in this project because of the equipment limitations. None of the team members had a linux machine powerful enough to test the system in a reasonable time (less than 1 hour). We had to use the laboratory machines in non-class hours and connnect to them remotely.
- The selected SO (CentOs7) had multiple configuration problems with the tested databases (mysql, sqlite3, mongodb and redis), so we used a docker container instead of running the database as a linux service.
- We enountered different problems while trying to run the http server for the flask app. None of the tested technologies (gunicorn and uWSGI)  were working as expected, so we decided to run the app without any http server other than flask (this must need to be changed in a production environment).
- Ansible variable indicators are the same as jinja, so there was always conflict while configuring the webservers html templates. In order to rapidly test the system, we decided to render the html files as strings in the data_service.py. It worked, but it's a horrible practice that needs to be changed.

## 📈Future work

- Improve the UI/UX of the webapp.
- Refactor the Python backend in order to follow best practices
	- Implement a clear service, database, ui controllers, etcetera separation
	- Implement a http webserver technology to run the flask app.
	- Implement html templates.
- Add authentication to the mondodb database

## 👾Demo
[Start Demo](https://clipchamp.com/watch/d7D5BFzhvRV)





