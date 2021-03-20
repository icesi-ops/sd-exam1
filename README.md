# Midterm 1

## Participants
- Carlos Eduardo Lizalda Valencia
- Brayan S. Garces
- Carlos Heyder Gonzales

## Gluster Configuration

### First we created a folder to save the playbook
```bash
# Create ansible playbooks folder
mkdir ./playbooks
# create subfolder to glusterfs playbooks
mkdir ./playbooks/glusterfs
# Create inportant subfolders
mkdir ./playbooks/glusterfs/vars
mkdir ./playbooks/glusterfs/templates
```
### Then create the glusterfs variables file 🧾 
Open the file with any editor (in this example  I use VSCode)
``` bash
code ./playbooks/glusterfs/vars/variables.yml
```
Here we storage the IPs of the master node (database), its workers  (web-servers) and the mount folder for the sdb1 filesystem
```yaml
master: "192.168.33.50"
node1: "192.168.33.11"
node2: "192.168.33.12"
fsMount: "/gluster/data"
volumeName: "gv0"
sharedFolder: "/mnt/shared"
```
### Now we need to set up the /etc/hosts file with the nodes hostnames
We need to create a templeate to generate this file
Open the file whith any editor (in this example  I use VSCode)
``` bash
code ./playbooks/glusterfs/templates/hosts.j2
```
We need to define hname in vagrant file, we will do this later
```jinja
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
127.0.1.1 {{ hname }} {{ hname }}
{{ master }}	master
{{ node1 }}	node1
{{ node2 }}	node2
``` 
### Now we are ready to install and configure gluster in all the nodes (includig master)

First we need to create the glusterfs yaml file
Open the file with any editor (in this example  I use VSCode)
``` bash
code ./playbooks/glusterfs/glusterfs.yml
```
First we created the partition and filesystem as pretasks
```yaml
---
- hosts: all
  become: true
  vars_files:
    - vars/variables.yml
  pre_tasks:
    - name: create partition
      parted:
        device: /dev/sdb
        number: 1
        state: present
    - name: create filesystem
      filesystem:
        fstype: xfs
        dev: /dev/sdb1
    - name: Create a directory if it does not exist
      file:
        path: "{{ fsMount }}"
        state: directory
        mode: '0755'
```

Then we installed all the glusterfs packages using yum and started the service

```yaml
    - name: Install glusterfs
      yum:
        name:
          - "{{ item }}"
      with_items:
        - centos-release-gluster
        - glusterfs-server
        - xfsprogs
    - name: Ensure the GlusterFS service is running (CentOS)
      service: name=glusterd state=started
```

Finally we mounted the file system and loaded the hosts file

```yaml
  tasks:
    - name: mount filesystem
      mount:
        path: "{{ fsMount }}"
        src: /dev/sdb1
        fstype: xfs
        state: mounted
    - name: Set /etc/hosts using template
      action: template dest=/etc/hosts src=templates/hosts.j2 owner=root group=root
```



```yaml
- hosts: db
  become: true
  vars_files:
    - ../vars/variables.yml
  tasks:
    - name: create gluster volume
      gluster_volume:
        state: present
        name: "{{ volumeName }}"
        bricks: "{{ fsMount }}/{{ volumeName }}"
        replicas: 3
        cluster: ["node1", "node2", "master"]
      run_once: true
    - name: Start Gluster volume
      gluster_volume: name={{ volumeName }} state=started
```

Then after having installed gluster in the hosts the following files are necessary: client.yml, glusterfs.ym and master.yml

```yaml
---
- hosts: all
  become: true
  vars_files:
    - ../vars/variables.yml
  pre_tasks:
    - name: Create a directory if it does not exist
      file:
        path: "{{ sharedFolder }}"
        state: directory
        mode: '0755'
  tasks:
    - name: Start Gluster volume
      shell: mount.glusterfs localhost:/{{ volumeName }} {{ sharedFolder }}
      run_once: true
```

In the pretask the sharedFolder is created, a directory with 755 permissions for it to execute the tasks, which consists in start the gluster and mount the defined volumes.
On the other hand, the master.yml file is executed on the db type hosts, creating a gluster volume, with 3 copies of it, and then, execute that gluster volume

```yaml
- hosts: db
  become: true
  vars_files:
    - ../vars/variables.yml
  tasks:
    - name: create gluster volume
      gluster_volume:
        state: present
        name: "{{ volumeName }}"
        bricks: "{{ fsMount }}/{{ volumeName }}"
        replicas: 3
        cluster: ["node1", "node2", "master"]
      run_once: true
    - name: Start Gluster volume
      gluster_volume: name={{ volumeName }} state=started
```
To be able to run the Ansible playbooks the following file is necessary:
Variables.yml

```yaml
master: "192.168.33.50"
node1: "192.168.33.11"
node2: "192.168.33.12"
fsMount: "/gluster/data"
volumeName: "gv0"
sharedFolder: "/mnt/shared"
```
This file contains a set of variables which Ansible will use for:
1. Be able to reach those machines provisioned with Vagrant
2. The variables needed in order to create the set of gluster volumes 


Then, Vagrant is in charge (using the playbook db) of:
1. Create a directory which will be the shared folder between the db host
2. Create, using docker, a container with the last mongodb image, and the shared folder  


```yaml
---
- hosts: db
  become: true
  vars_files:
    - ../vars/variables.yml
  pre_tasks:
    - name: Create a directory if it does not exist
      file:
        path: "{{sharedFolder}}/db"
        state: directory
        mode: '0755'
  tasks:  
    - name: Stop docker db container
      shell: docker stop db || true
    - name: remove docker db container
      shell: docker rm db || true
    - name: Start docker back continer
      shell: docker run -d --name db -v {{sharedFolder}}/db:/data/db -p 27017:27017 mongo:latest
```


### Vagrant file

First we need to create two things:
- A function that gives disk names for webservers
- The path of the db disks

```ruby
def webDisk(num)
  return "./storage/Disk#{num}.vdi"
end

dbDisk = './storage/dbDisk.vdi'
```

then on the web servers block we need to create and atach the storage

```ruby
web.vm.provider "virtualbox" do |vb|
    vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "web-#{i}"]
    unless File.exist?(webDisk(i))
        vb.customize ['createhd', '--filename', webDisk(i), '--variant', 'Fixed', '--size', 2 * 1024]
    end
    vb.customize ['storageattach', :id,  '--storagectl', 'IDE', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', webDisk(i)]
end
```

then we add the playbook and pass the hname variable

```ruby
web.vm.provision "ansible" do |ansible|
    ansible.playbook = "playbooks/glusterfs/glusterfs.yml"
    ansible.extra_vars = {
        hname: "web-#{i}"
    }
end
```

now in the db block we need to do the same above
```ruby
db.vm.provider "virtualbox" do |vb|
    vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "db"]
    unless File.exist?(dbDisk)
    vb.customize ['createhd', '--filename', dbDisk, '--variant', 'Fixed', '--size', 2 * 1024]
    end
    vb.customize ['storageattach', :id,  '--storagectl', 'IDE', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', dbDisk]
end 
db.vm.provision "ansible" do |ansible|
    ansible.playbook = "playbooks/glusterfs/glusterfs.yml"
    ansible.extra_vars = {
        hname: "db"
    }
end  
```


