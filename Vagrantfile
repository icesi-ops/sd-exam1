# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  nodes_count = 5

  

  config.vm.define "nginx" do |nginx|
    nginx.vm.box = "centos/7"
    nginx.vm.hostname = "sistemasdistribuidos"
    nginx.vm.network "private_network", ip: "192.168.56.199"
    nginx.vm.network "forwarded_port", guest: 80, host: 80
    nginx.vm.provider "virtualbox" do |vb|
      vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "nginx"]
    end
    nginx.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/nginx/main.yml"
      ansible.groups = {
        "nginx" => ["nginx"]
      }
      ansible.extra_vars = {
        "loadbalancer": "192.168.56.200"
      }
    end
  end

  config.vm.define "lb" do |lb|
    lb.vm.box = "centos/7"
    lb.vm.hostname = "loadbalancer"
    lb.vm.network "private_network", ip: "192.168.56.200"
    lb.vm.provider "virtualbox" do |vb|
      vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "loadbalancer"]
    end
    lb.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/haproxy/loadbalancer.yml"
      ansible.extra_vars = {
        "web_servers" => [
          {"name": "node-1", "ip": "192.168.56.11"},
          {"name": "node-2", "ip": "192.168.56.12"}
        ]
      }
    end
  end

  nodes_count.times do |i|
   config.vm.define "web-#{i}" do |web|

    disk_var = "./disks/disk#{i}.dvi"
    node_name = "node#{i}"

    web.vm.box = "centos/7"
    web.vm.hostname = node_name
    web.vm.network "private_network", ip: "192.168.56.1#{i}"
    web.vm.provider "virtualbox" do |vb|
     vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", node_name]
     unless File.exist?(disk_var)
      vb.customize ['createhd', '--filename', disk_var, '--variant', 'Fixed', '--size', 5 * 1024]
     end
     vb.customize ['storageattach', :id,  '--storagectl', 'IDE', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', disk_var]
    end
    web.vm.provision "shell", path: "playbooks/scripts/glusterfs.sh"
    web.vm.provision "shell", path: "playbooks/scripts/configuration.sh"
    web.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/httpd/webserver.yml"
      ansible.groups = {
        "webservers" => ["web-#{i}"]
      }
    end
   end
  end

  config.vm.define "database" do |database|
    database.vm.box = "centos/7"
    database.vm.hostname = "database"
    database.vm.network "private_network", ip: "192.168.56.201"
    database.vm.provider "virtualbox" do |vb|
     vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "database"]
     unless File.exist?("./disks/disk_master.dvi")
      vb.customize ['createhd', '--filename', "../disks/disk_master.dvi", '--variant', 'Fixed', '--size', 5 * 1024]
     end
     vb.customize ['storageattach', :id,  '--storagectl', 'IDE', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', "../disks/disk_master.dvi"]
    end
    database.vm.provision "shell", path: "playbooks/scripts/glusterfs.sh"
    database.vm.provision "shell", path: "playbooks/scripts/configuration.sh"
    database.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/gluster/main.yml"
    end
    database.vm.provision "ansible" do |ansible|
      ansible.inventory_path = "ansible_hosts"
#      ansible.config_file = "ansible.cfg"
      ansible.playbook = "playbooks/gluster/webservers_mount.yml"
      ansible.limit = "webservers"
    end
    database.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/mariadb/mariadb.yml"
      ansible.extra_vars = {
        "db" => [
          {"name": "database", "ip": "192.168.56.201"},
        ]
      }
    end
    database.vm.provision "shell", path: "playbooks/mariadb/sh-docker.sh"
  end
end
