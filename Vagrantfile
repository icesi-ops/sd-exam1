
# -*- mode: ruby -*-
# vi: set ft=ruby :

firstDisk = '.firstDisk.vdi'
secondDisk = './secondDisk.vdi'
thirdDisk = './thirdDisk.vdi'

Vagrant.configure("2") do |config|  

  config.ssh.insert_key = false
  config.vm.define "lb" do |lb|
    lb.vm.box = "centos/7"
    lb.vm.hostname = "lb"
    lb.vm.network "private_network", ip: "192.168.33.200"
    lb.vm.provider "virtualbox" do |vb|
      vb.customize []
    end
    lb.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/haproxy/loadbalancer.yml"
      ansible.playbook = "playbooks/nginx-proxy/main.yml"
      ansible.extra_vars = {
        "web_servers" =>[
           {"name": "web-1", "ip": "192.168.33.11"},
           {"name": "web-2", "ip": "192.168.33.12"},
           {"name": "web-3", "ip": "192.168.33.13"}
          ]
      }
    end
  end

  config.vm.define "web-1" do |web1|
    web1.vm.box = "centos/7"
    web1.vm.hostname = "WebServer1"
    web1.vm.network "private_network", ip: "192.168.33.11"
    web1.vm.provider "virtualbox" do |vb|
      vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "web-1"]
    unless File.exist?(firstDisk)
      vb.customize ['createhd', '--filename', firstDisk, '--variant', 'Fixed', '--size', 2 * 1024]
     end
    vb.customize ['storageattach', :id, '--storagectl', 'IDE', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', firstDisk]
    end
    web1.vm.provision "shell", path: "scripts/glusterfs.sh"
    web1.vm.provision "shell", path: "scripts/configuration.sh"
    web1.vm.provision "ansible" do |ansible|
       ansible.playbook = "playbooks/nginx/nginx.yml"
       ansible.groups = {
         "servers" => ["web-1"]
       }
     end
  end

  config.vm.define "web-2" do |web2|
    web2.vm.box = "centos/7"
    web2.vm.hostname = "WebServer2"
    web2.vm.network "private_network", ip: "192.168.33.12"
    web2.vm.provider "virtualbox" do |vb|
      vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "web-2"]
    unless File.exist?(secondDisk)
      vb.customize ['createhd', '--filename', secondDisk, '--variant', 'Fixed', '--size', 2 * 1024]
     end
    vb.customize ['storageattach', :id, '--storagectl', 'IDE', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', secondDisk]
    end
    web2.vm.provision "shell", path: "scripts/glusterfs.sh"
    web2.vm.provision "shell", path: "scripts/configuration.sh"
    web2.vm.provision "ansible" do |ansible|
       ansible.playbook = "playbooks/nginx/nginx.yml"
       ansible.groups = {
         "servers" => ["web-2"]
       }
     end
  end

  config.vm.define "db" do |db|
    db.vm.box = "centos/7"
    db.vm.hostname = "db"
    db.vm.network "private_network", ip: "192.168.33.100"
    db.vm.provision "shell", inline: "echo Iam DB server"
    db.vm.provider "virtualbox" do |vb|
      vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "db"]
    unless File.exist?(thirdDisk)
      vb.customize ['createhd', '--filename', thirdDisk, '--variant', 'Fixed', '--size', 2 * 1024]
     end
    vb.customize ['storageattach', :id, '--storagectl', 'IDE', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', thirdDisk]
    end
    db.vm.provision "shell", path: "scripts/glusterfs.sh"
    db.vm.provision "shell", path: "scripts/configuration.sh"

    db.vm.provision "ansible" do |ansible|
       ansible.playbook = "playbooks/nginx/nginx.yml"
       ansible.groups = {
         "databases" => ["db"]
       }
     end
  end
  
#  config.vm.provision "ansible" do |ansible|
#   ansible.playbook = "playbooks/glusterConfig.yml"
#   ansible.limit = "all"
#  end


end
