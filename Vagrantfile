# -*- mode: ruby -*-
# vi: set ft=ruby :

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

  (1..3).each do |i|
   config.vm.define "web-#{i}" do |web|
     web.vm.box = "centos/7"
     web.vm.network "private_network", ip: "192.168.33.1#{i}"
     web.vm.hostname = "web-#{i}"
     web.vm.provider "virtualbox" do |vb|
       vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "web-#{i}"]
     end
     web.vm.provision "ansible" do |ansible|
       ansible.playbook = "playbooks/nginx/nginx.yml"
       ansible.groups = {
         "servers" => ["web-#{i}"]
       }
     end
   end
  end

  config.vm.define "db" do |db|
    db.vm.box = "centos/7"
    db.vm.hostname = "db"
    db.vm.network "private_network", ip: "192.168.33.100"
    db.vm.provision "shell", inline: "echo Iam DB server"
  end
end
