# Midterm 1

## Participants
- Carlos Eduardo Lizalda Valencia
- Brayan S. Garces
- Carlos Heyder Gonzales

## Gluster Configuration

### Firs we create a folder to save the playbook
```bash
# Create ansible playbooks folder
mkdir ./playbooks
# create subfolder to glusterfs playbooks
mkdir ./playbooks/glusterfs
# Create inportant subfolders
mkdir ./playbooks/glusterfs/vars
mkdir ./playbooks/glusterfs/templates
```
### then create the glusterfs variables file 🧾 
Open the file whit any editor (in this example  I use VSCode)
``` bash
code ./playbooks/glusterfs/vars/variables.yml
```
here we storage the ips of the master node (database), their workers  (web-servers) and the mount folder for the sdb1 filesystem
```yaml
master: "192.168.33.50"
node1: "192.168.33.11"
node2: "192.168.33.12"
fsMount: "/gluster/data"
volumeName: "gv0"
sharedFolder: "/mnt/shared"
```
### Now we need to set up the /etc/hosts file whit the nodes hostnames
We need to create a templeate to generate this file
Open the file whit any editor (in this example  I use VSCode)
``` bash
code ./playbooks/glusterfs/templates/hosts.j2
```
we need to define hname in vagrant file, we will do this later
```jinja
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
127.0.1.1 {{ hname }} {{ hname }}
{{ master }}	master
{{ node1 }}	node1
{{ node2 }}	node2
``` 
### Now we are ready to instal and configure gluster in all the nodes (includig master)

First we need to create the glusterfs yaml file
Open the file whit any editor (in this example  I use VSCode)
``` bash
code ./playbooks/glusterfs/glusterfs.yml
```
first we create the partition and filesystem as pretasks
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

then we install all the glusterfs packages using yum and start the service

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

finally we mount the file system and load the hosts file

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

### Vagrant file

first we need to create two things:
- a function that gives disk name for webservers
- the path of db disks

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

now in the db block we need to do the sabe above
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