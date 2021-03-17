Vagrant.configure("2") do |config|

	config.ssh.insert_key = false

	config.vm.define "loadbalancer" do |loadbalancer|
           loadbalancer.vm.box = "centos/7"
	   loadbalancer.vm.hostname = "loadbalancer"
	   loadbalancer.vm.network "private_network", ip: "192.168.33.200"
	   loadbalancer.vm.provider "virtualbox" do |vb|
	      vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "lb"]
	   end
           loadbalancer.vm.provision "ansible" do |ansible|
	     ansible.playbook = "playbooks/nginx/main.yml"
	      ansible.extra_vars = {
	         "web_servers" => [
                   {"name": "webserver-1", "ip":"192.168.33.11"},
	           {"name": "webserver-2", "ip":"192.168.33.12"}
                  ]
                 }
            end
           end
           (1..2).each do |i|
            config.vm.define "webserver-#{i}" do |webserver|
             webserver.vm.box = "centos/7"
	     webserver.vm.hostname = "webserver-#{i}"
	     webserver.vm.network "private_network", ip: "192.168.33.1#{i}"
	     webserver.vm.provider "virtualbox" do |vb|
	      vb.customize  ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "webserver-#{i}" ]
             end
             webserver.vm.provision "ansible" do |ansible|
              ansible.playbook = "playbooks/httpd/webserver.yml"
              ansible.groups = {
                "webserver" => ["webserver-#{i}"]
              }
              end
             end
            end
	config.vm.define "database" do |database|
          database.vm.box = "centos/7"
          database.vm.hostname = "db"
          database.vm.network "private_network", ip: "192.168.33.100"
          database.vm.provision "shell", inline: "echo Iam DB server"
        end
       end 
   
     
