Vagrant.configure("2") do |config|

  config.vm.define "lb" do |lb|
    lb.vm.box = "centos/7"
    lb.vm.hostname = "lb"
    lb.vm.network "private_network", ip: "192.168.33.200"
    lb.vm.provider "virtualbox" do |vb|
     vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "lb"]
    end
    lb.vm.provision "shell", inline: "echo LB ready"
  end

  (1..2).each do |i|
   config.vm.define "web-#{i}" do |web|
    web.vm.box = "centos/7"
    web.vm.hostname = "web#{i}"
    web.vm.network "private_network", ip: "192.168.33.1#{i}"
    web.vm.provider "virtualbox" do |vb|
     vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "web-#{i}"]
    end
    web.vm.provision "shell", inline: "echo web#{i} ready"
   end
  end

  config.vm.define "db" do |db|
   db.vm.box = "centos/7"
   db.vm.hostname = "db"
   db.vm.network "private_network", ip: "192.168.33.100"
   db.vm.provision "shell", inline: "echo DB ready"
  end

end
