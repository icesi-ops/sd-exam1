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
      end
      web.vm.provision "ansible" do |ansible|
       ansible.playbook = "playbooks/httpd/webserver.yml"
       ansible.groups = {
         "webservers" => ["web-#{i}"]
       }
      end
    end
   end

   
end
