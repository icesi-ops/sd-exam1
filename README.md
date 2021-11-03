# Centralized Storage System

# 📚 Team members

<aside>
💡 Sebastián Becerra Zapata A00352804 |
Daniel Alejandro Gómez Páramo A00305232 |
Maria Camila Lenis Restrepo A00351598

</aside>

# 🧮 Tech stack

- Programming language: Javascript
- Database: Postgresql
- Provisioning and CM tools: Vagrant and Ansible

# ⚠️ Before we start

- You need to have Vagrant installed in your pc. You can follow [this](https://learn.hashicorp.com/tutorials/vagrant/getting-started-install) tutorial to do that. And remember to have installed VirtualBox too.
- Also you need to have Ansible installed. You can follow [this](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) tutorial as well.

# ✅ Application Set Up

1. Clone this repository and enter to sd-exam1 folder. 
2. Run the following command to make the provisioning 

```bash
vagrant up
```

This will create an infrastructure like this:

![](https://i.ibb.co/YQ8gdYd/diagram.png)

<aside>
💡 There will be four virtual machines running in different ports, where we will get one working as a loadbalancer with a reverse proxy that will be redirecting HTTP requests to HTTPS. Two virtual machines working as web servers and one working as a database. 
	
The loadbalancer will route the requests and the webservers will perform the storage of a file that the user can upload. 
	
**The files uploaded will be accesible from any node** 😁

</aside>

1. Once the provisioning is ready, you need to run this command as well to finish with the set up of centralized storage. We will explain this futher.

```bash
bash scripts/glusterconfig.sh
```

1. Access the app opening in a navigator the url [https://sistemasdistribuidosparcial.com/](https://sistemasdistribuidosparcial.com/) 
2. Upload your files and see how it works. 

# 📌 Provisioning Process

## 1️⃣ Load Balancer and Reverse Proxy Provisioning

To make the provisioning of load balancer and reverse proxy we have to create two different playbooks. One to do the loadbalancer provisioning and other to do the reverse proxy provisioning. 

playbooks/haproxy/loadbalancer.yml →Load balancer provisioning

playbooks/nginx-proxy/main.yml →Reverse proxy provisioning

Executed in that other

The steps were the following:

### Load Blancer Provisioning

1. Configure an haproxy service in the Virtual Machine 
    
    ![Untitled](Centralized%20Storage%20System%201e1c4d5677c54d05820e5f7cc0acecce/Untitled.png)
    

Make the haproxy config to listen from 8083 port and route the request to webservers node in their port 8080

![Untitled](Centralized%20Storage%20System%201e1c4d5677c54d05820e5f7cc0acecce/Untitled%201.png)

1. Restart and enable haproxy service 

You can see the full configuration in the playbooks/haproxy/templates/haproxy.j2 file

### Reverse Proxy Provisioning

1. Install dependencies as open-ssl and pip
2. Turn on the firewalld
3. Generate a self signed certificate 
4. Install nginx in the Virtual Machine
5. Enable firewalld to redirect HTTP to HTTPS
6. Copy the configuration of nginx to listen from 8080 port and redirect to 8083 port (where is the loadbalancer listening) in the Virtual Machine
7. Restart nginx service
8. Enable firewall to connect to 8083 port
9. Enable the haproxy to recieve requests
10. Restart haproxy service

You can see the full configuration in the playbooks/nginx-proxy/templates/nginx.conf.j2 file

## 2️⃣ Web Servers Provisioning

The two web severs were in charge of running the Node.js application (in each Virtual Machine). I will look like this:

![Untitled](Centralized%20Storage%20System%201e1c4d5677c54d05820e5f7cc0acecce/Untitled%202.png)

The steps to run the app are the following:

1. Install and set up Node.js (prestasks in the playbooks/node/webserver.yml file)
2. Copy the main.js app file in the root of the virtual machine
3. Install formidable 
4. Run the Node.js app in background

## 3️⃣ Centralized Storage System Provisioning

This part is responsibility of the two werbservers and the database as shown in the architecture. 

1. Provision a hard disk para for each webserver and attach it to the virtual machine. This is done in the Vagrantfile

```bash
unless File.exist?("./partition_#{i}.vdi")
        vb.customize ['createhd', '--filename', "./partition_#{i}.vdi", '--size', 5 * 1024]
      end
      vb.customize ['storageattach', :id, '--storagectl', 'IDE', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', "./partition_#{i}.vdi"]
```

1. Provision a hard disk for the database as well

```bash
unless File.exist?("./partition_db.vdi")
      vb.customize ['createhd', '--filename', "./partition_db.vdi", '--size', 5 * 1024]
    end
    vb.customize ['storageattach', :id, '--storagectl', 'IDE', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', "./partition_db.vdi"]
   end
```

1. The order of execution matters here. So first in a for loop the two webservers are provisioned. For each of the we did the following steps: 

```bash
# Format the disk created in the partition 
sudo mkfs.xfs -i size=512 /dev/sdb 

# Create the mount point for sdb
sudo mkdir -p /bricks/brick

# Add this file to the /etc/fstab file to configure it to mount the sdb in the bricks/brick with the xfs format
/dev/sdb /bricks/brick xfs defaults 1 2

# Run the fstab config, now we will have the storage we need 
sudo mount -a && sudo mount

# Install gluster
sudo yum install centos-release-gluster
sudo yum install glusterfs-server

# Enable and start the Gluster deamon
sudo systemctl enable glusterd
sudo systemctl start glusterd

```

This steps should be done in the database too, but the database will do this additional tasks:

```bash
# Fetch the nodes of webservers
sudo gluster peer probe 192.168.33.11 #web-1
sudo gluster peer probe 192.168.33.12 #web-2

# Create the gluster volumen and the type of replica
sudo gluster volume create glustertest replica 2 transport tcp 192.168.33.11:/brick 192.168.33.12:/brick force

#Start the gluster volume
sudo gluster volume start glustertest

#Create a filepath in /mnt/glusterfs
sudo mkdir /mnt/glusterfs && sudo mount -t glusterfs 192.168.33.11:/glustertest /mnt/glusterfs
```

To finish the provisioning of the Centralized Storage System, it's necessary to run those commands: 

```bash
# Mount the volume in the missing nodes
vagrant ssh web-1 -c 'sudo mkdir /mnt/glusterfs && sudo mount -t glusterfs 192.168.33.11:/glustertest /mnt/glusterfs'
vagrant ssh web-2 -c 'sudo mkdir /mnt/glusterfs && sudo mount -t glusterfs 192.168.33.12:/glustertest /mnt/glusterfs'
```

This is done running the /scripts/glusterconfig.sh file

## 4️⃣ Database Provisioning

We made the provisioning of the database in the playbooks/database/database.yml file. In that playbook we install Node.js to manage the database, install pg with npm to manage the postgresql client and the postgresql11 server.

This part was not connected to the node.js app running in the webservers, but we do a manual task to verify and work with the database: 

```bash
#Get into "db" machine using ssh
vagrant ssh db

#Access with root user 
sudo su

#Access to postgrest console "psql"
access postgres psql

#Create a user and password
create user userDB with encrypted password 'password'

#Create our database 
CREATE DATABASE databsePG;

#Grant all privileges to the user 
grant all privileges on database databsePG to userDB;

#Create the TABLE "data" with the params (id, nombre, path y tipo)
CREATE TABLE data (
	id VARCHAR ( 50 ) PRIMARY KEY,
	nombre VARCHAR ( 50 ) UNIQUE NOT NULL,
	path VARCHAR ( 50 ) NOT NULL,
	tipo VARCHAR ( 50 ) UNIQUE NOT NULL, 
);

#This is an example of add a register in the TABLE "data"
INSERT INTO data (id, nombre, path, tipo) VALUES ('1', 'archivo', '/mnt/glusterfs/archivo.txt', 'txt');

# This is an example to show the registers of the TABLE "data"
SELECT * FROM data;
```

After running those commands we can see the table createad and its registers. 

![Untitled](Centralized%20Storage%20System%201e1c4d5677c54d05820e5f7cc0acecce/Untitled%203.png)

# 🔍 Branching Strategy

## Team work

To be able to iterate fast we had regular meetings to discuss the blockers and often in that meetings we did pair programming. 

We break the system in three parts: Reverse proxy config, Gluster config and database config. Each team member was owner of one of them, but often two or more member helped other to solve problems and to keep working in the lastest stable version. 

- **Camila Lenis:** Mostly with Reverse Proxy, Node JS app work, and Gluster config work.
- **Daniel Gómez:** Research and scripts to do the Gluster config and Database provisioning.
- **Sebastian Becerra:** Mostly with database provisioning and node js app work.

## Branching

We follow the strategy of creating branches for features or bug fixes needed and when they are ready and working merge it with master.

We also create an staging branch to merge changes first with it, test and then merge with master. This was done because some branches were out of sync a long time ago.

We use kebak case to name branches for consistency

Some examples of the strategy are:

- add-reverse-proxy: branch used to make the provisioning of load balancer and reverse proxy
- fix-shared-storage: branch used to fix the Gluster provisioning

The branches were not delete once merged with master because we made little increments and we continue using them. 

# 🆘 Troubles Found In The Process

- Problems with the two playblooks provisioning. For the loadbalancer machine we need to run two different playbooks but we realize only one of them were executed. We need to make a little change in the Vagrantfile to run the two playbooks.
- Running the app in the loadbalancer and not in the webservers. This problem was more related to an understanding problem. We strated running the app in the loadbalancer but this is wrong, the loadbalancer will not run the app, just balancing the request for the two servers. Then we need to run the app in the servers in background.
- Problems with the SOs of the diferents devices  from teammates and system capacity (to be able to run Zoom, Visual Studio and do the vagrant up of four virtual machines at the same time). We encountered various problems and challenges when working with the virtual machines that we created. Some of these problems were presented by the host machines that each of the team members had. One member had a computer without dual boot (windows / Linux), and his solution was working with in Linux from a USB, therefore the information processing speeds are quite low, executing the vagrant up command was an expense quite long time. This colleague also had errors because the files of the virtual machines created were not completely erased, and that produced different errors when wanting to run vagrant up again.
- The timeup of the command: "vagrant up", complicated the development and testing time of the midtern
- Firewall was bloking the 8083 port, so we need to add it to him.
- The haproxy service wasn't enable to recieve requests, so it was blocking them. We need to enable it.
- In the creation of the Glusterfs service, we found differents problems. One of the most important was, now that the disk partitions are not being created (sfdisk /dev/sdb) on each virtual machine (db, web-1, web-2). This was solved with the first commands in the Centralized Storage System Provisioning part.
- The Node.js application were throwing permission errores while trying to rename the temporary file uploaded. We use a copy function instead to copy as a string the file from the temporary files to the shared path. Files are strings in the end.

# 👍🏼 Next Steps

- Find a way to execute the steps that were in the scripts/glusterconfig.sh file. Maybe doing a ssh calling from db machine to be able to do this without human interaction
- Automate the provisioning of the database
- Connect the database queries with the Node.js app in the webservers
