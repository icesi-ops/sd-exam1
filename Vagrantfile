# -*- mode: ruby -*-
# vi: set ft=ruby :

def webDisk(num)
  return "./storage/Disk#{num}.vdi"
end

dbDisk = './storage/dbDisk.vdi'

VAGRANT_VM_PROVIDER = "virtualbox"
ANSIBLE_RAW_SSH_ARGS = []

Vagrant.configure("2") do |config|

  (1..2).each do |i|
    config.vm.define "web-#{i}" do |web|
      web.vm.box = "centos/7"
      web.vm.hostname = "web-#{i}"
      web.vm.network "private_network", ip: "192.168.33.1#{i}"
      web.vm.provider "virtualbox" do |vb|
        vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "web-#{i}"]
        unless File.exist?(webDisk(i))
          vb.customize ['createhd', '--filename', webDisk(i), '--variant', 'Fixed', '--size', 2 * 1024]
        end
        vb.customize ['storageattach', :id,  '--storagectl', 'IDE', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', webDisk(i)]
      end
      web.vm.provision "ansible" do |ansible|
        ansible.playbook = "playbooks/glusterfs/glusterfs.yml"
        ansible.extra_vars = {
          hname: "web-#{i}"
        }
      end
    end
   end

  config.vm.define "db" do |db|
    db.vm.box = "centos/7"
    db.vm.hostname = "db"
    db.vm.network "private_network", ip: "192.168.33.50"
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
    db.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/glusterfs/master.yml"
      ansible.inventory_path = 'hosts_inventory'
    end  
    db.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/glusterfs/client.yml"
      ansible.limit = 'all'
      ansible.inventory_path = 'hosts_inventory'
    end 
    db.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/docker/docker.yml"
      ansible.limit = 'all'
      ansible.inventory_path = 'hosts_inventory'
    end
    db.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/db/db.yml"
    end  
    db.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/webserver/webserver.yml"
      ansible.limit = 'all'
      ansible.inventory_path = 'hosts_inventory'
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

