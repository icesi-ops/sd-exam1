# -*- mode: ruby -*-
# vi: set ft=ruby :


firstDisk = './storage/firstDisk.vdi'
secondDisk = './storage/secondDisk.vdi'
thirdDisk = './thirdDisk.vdi'

Vagrant.configure("2") do |config|

  config.vm.define "db" do |db|
    db.vm.box = "centos/7"
    db.vm.hostname = "db"
    db.vm.network "private_network", ip: "192.168.33.50"
    db.vm.provider "virtualbox" do |vb|
      vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "db"]
      unless File.exist?(firstDisk)
        vb.customize ['createhd', '--filename', firstDisk, '--variant', 'Fixed', '--size', 2 * 1024]
      end
      vb.customize ['storageattach', :id,  '--storagectl', 'IDE', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', firstDisk]
    end 
    db.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/db/db.yml"
      ansible.groups = {
         "glusterfs" => ["db"]
       }
    end  
  end

  (1..2).each do |i|
    config.vm.define "web-#{i}" do |web|
      web.vm.box = "centos/7"
      web.vm.hostname = "web-#{i}"
      web.vm.network "private_network", ip: "192.168.33.1#{i}"
      web.vm.provider "virtualbox" do |vb|
        vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "web-#{i}"]
        if i == 1
          unless File.exist?(secondDisk)
            vb.customize ['createhd', '--filename', secondDisk, '--variant', 'Fixed', '--size', 2 * 1024]
          end
          vb.customize ['storageattach', :id,  '--storagectl', 'IDE', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', secondDisk]
        else
          unless File.exist?(thirdDisk)
            vb.customize ['createhd', '--filename', thirdDisk, '--variant', 'Fixed', '--size', 2 * 1024]
          end
          vb.customize ['storageattach', :id,  '--storagectl', 'IDE', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', thirdDisk]
        end
      end
      web.vm.provision "ansible" do |ansible|
       ansible.playbook = "playbooks/webserver/webserver.yml"
       ansible.groups = {
         "webservers" => ["web-#{i}"],
         "glusterfs" => ["web-#{i}"]
       }
      end
    end
   end

  config.vm.define "lb" do |lb|
    lb.vm.box = "centos/7"
    lb.vm.hostname = "lb"
    lb.vm.network "private_network", ip: "192.168.33.200"
    lb.vm.provider "virtualbox" do |vb|
     vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "lb"]
    end
    lb.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/nginx/main.yml"
      ansible.extra_vars = {
         "web_servers" => [
          {"name": "web-1","ip":"192.168.33.11"},
          {"name": "web-2","ip":"192.168.33.12"}
         ] 
    	}
    end  
  end

end

