# -*- mode: ruby -*-
# vi: set ft=ruby :
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  os = "bento/ubuntu-18.04"
  net_ip = "192.168.130"

  config.vm.define :master, primary: true do |master_config|
    master_config.vm.provider "virtualbox" do |vb|
        vb.memory = "2048"
        vb.cpus = 1
        vb.name = "master"
    end
    
    master_config.vm.box = "#{os}"
    master_config.vm.host_name = 'master'
    master_config.vm.network "private_network", ip: "#{net_ip}.10"
    master_config.vm.synced_folder "saltstack/salt/", "/srv/salt"
    master_config.vm.synced_folder "saltstack/pillar/", "/srv/pillar"

    master_config.vm.provision :salt do |salt|
      salt.master_config = "saltstack/etc/master"
      salt.master_key = "saltstack/keys/master_minion.pem"
      salt.master_pub = "saltstack/keys/master_minion.pub"
      salt.minion_key = "saltstack/keys/master_minion.pem"
      salt.minion_pub = "saltstack/keys/master_minion.pub"
      salt.seed_master = {
                          "minionwebserver1" => "saltstack/keys/minionwebserver1.pub",
                          "minionloadbalancer" => "saltstack/keys/minionloadbalancer.pub",
                          "minionmongodb" => "saltstack/keys/minionmongodb.pub",  
                          "minionwebserver2" => "saltstack/keys/minionwebserver2.pub"
                         }

      salt.install_type = "stable"
      salt.install_master = true
      salt.no_minion = true
      salt.verbose = true
      salt.colorize = true
      salt.bootstrap_options = "-P -c /tmp"
    end
  end


  [
    ["minionmongodb",    "#{net_ip}.20",    "1024",    os ],
    ["minionwebserver1",    "#{net_ip}.30",    "1024",    os ],
    ["minionwebserver2",    "#{net_ip}.40",    "1024",    os ],
    ["minionloadbalancer",    "#{net_ip}.50",    "1024",    os ]
     
  ].each do |vmname,ip,mem,os|
    config.vm.define "#{vmname}" do |minion_config|
      minion_config.vm.provider "virtualbox" do |vb|
          vb.memory = "#{mem}"
          vb.cpus = 1
          vb.name = "#{vmname}"
      end

      minion_config.vm.box = "#{os}"
      minion_config.vm.hostname = "#{vmname}"
      minion_config.vm.network "private_network", ip: "#{ip}"
   

      minion_config.vm.provision :salt do |salt|
        salt.minion_config = "saltstack/etc/#{vmname}"
        salt.minion_key = "saltstack/keys/#{vmname}.pem"
        salt.minion_pub = "saltstack/keys/#{vmname}.pub"
        salt.install_type = "stable"
        salt.verbose = true
        salt.colorize = true
        salt.bootstrap_options = "-P -c /tmp"
      end
    end
  end
end

