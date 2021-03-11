Vagrant.configure("2") do |config|

	config.vm.define "nginx" do |nginx|
	    nginx.vm.box = "centos/7"
	    nginx.vm.hostname = "nginx"
	    nginx.vm.network "private_network", ip: "192.168.33.200"
	    nginx.vm.provider "virtualbox" do |vb|
	     vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "nginx"]
	    end
	    
	    nginx.vm.provision "ansible" do |ansible|
	      ansible.playbook = "playbooks/nginx/main.yml"
	      ansible.extra_vars = {
		 "web_servers" => [
		  {"name": "web-1","ip":"192.168.33.11"},
		  {"name": "web-2","ip":"192.168.33.12"}
		 ] 
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
		end
	    web.vm.provision "ansible" do |ansible|
        	ansible.playbook = "playbooks/golang/webserver.yml"
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
		db.vm.provider "virtualbox" do |vb|
		  vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "db"]
		end
		db.vm.provision "ansible" do |ansible|
		  ansible.playbook = "playbooks/database/database.yml"
		  ansible.groups = {
			"database" => ["db"]
		  }
		end
	end
end
