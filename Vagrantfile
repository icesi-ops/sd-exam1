# -*- mode: ruby -*-
# vi: set ft=ruby :

brick1 = './brick1.vdi'
brick2 = './brick2.vdi'
brick3 = './brick3.vdi'

Vagrant.configure("2") do |config|

  config.vm.define "nginx" do |nginx|
    nginx.vm.box = "centos/7"
    nginx.vm.hostname = "sistemasdistribuidos"
    nginx.vm.network "private_network", ip: "192.168.33.200"
    nginx.vm.provider "virtualbox" do |vb|
     vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "nginx"]
    end
    nginx.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/nginx/main.yml"
    end  
  end

  (1..2).each do |i|
    config.vm.define "web-#{i}" do |web|
      web.vm.box = "centos/7"
      web.vm.hostname = "web-#{i}"
      web.vm.network "private_network", ip: "192.168.33.1#{i}"
      web.vm.provider "virtualbox" do |vb|
       vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "web-#{i}"]
       unless File.exists?("brick#{i}")
         vb.customize ['createhd', '--filename', "brick#{i}", '--variant', 'Fixed', '--size', 2 * 1024]
       end
       vb.customize ['storageattach', :id, '--storagectl', 'IDE', '--port', 1, '--divice', 0, '--type', 'hdd', '--medium', "brick#{i}"]
       end
      # do configuration ... 
      web.vm.provision "ansible" do |ansible|
       ansible.playbook = "playbooks/httpd/webserver.yml"
       ansible.playbook = "playbooks/nginx/tasks/glusterfs-config.yml"
       ansible.groups = {
         "webservers" => ["web-#{i}"]
       }
      end
    end
   end
   
end
