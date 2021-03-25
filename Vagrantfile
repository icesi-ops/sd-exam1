# -*- mode: ruby -*-
# vi: set ft=ruby :

# creacion de los discos brick1 y brick2 son para los web servers
# masterbrick es para la db.
brick1 = './brick1.vdi'
brick2 = './brick2.vdi'
masterbrick = './masterbrick.vdi'

Vagrant.configure('2') do |config|
  # creacion del load balancer con nginx
  config.vm.define 'lb' do |lb|
    lb.vm.box = 'centos/7'
    lb.vm.hostname = 'sistemasdistribuidos'
    lb.vm.network 'private_network', ip: '192.168.33.200'
    lb.vm.provider 'virtualbox' do |vb|
      vb.customize ['modifyvm', :id, '--memory', '512', '--cpus', '1', '--name', 'lb']
    end
    lb.vm.provision 'ansible' do |ansible|
      ansible.playbook = 'playbooks/nginx/main.yml'
    end
  end

  config.vm.define 'db' do |db|
    db.vm.box = 'centos/7'
    db.vm.hostname = 'dbserver'
    db.vm.network 'private_network', ip: '192.168.33.100'
    db.vm.provider 'virtualbox' do |vb|
      vb.customize ['modifyvm', :id, '--memory', '512', '--cpus', '1', '--name', 'db']
      unless File.exist?(masterbrick)
        vb.customize ['createhd', '--filename', masterbrick, '--variant',
                      'Fixed', '--size', 2 * 1024]
      end
      vb.customize ['storageattach', :id, '--storagectl', 'IDE',
                    '--port', 1, '--device', 0, '--type', 'hdd',
                    '--medium', masterbrick]
    end
    db.vm.provision 'ansible' do |ansible|
      ansible.playbook = 'playbooks/db/main.yml'
      ansible.inventory_path = 'ansible_hosts'
    end
  end

  # creacion de las maquinas web-1 y web-2
  config.ssh.insert_key = false
  (1..2).each do |i|
    config.vm.define "web-#{i}" do |web|
      web.vm.box = 'centos/7'
      web.vm.hostname = "web-#{i}"
      web.vm.network 'private_network', ip: "192.168.33.1#{i}"
      web.vm.provider 'virtualbox' do |vb|
        vb.customize ['modifyvm', :id, '--memory', '512', '--cpus',
                      '1', '--name', "web-#{i}"]
        unless File.exist?("./brick#{i}.vdi")
          vb.customize ['createhd', '--filename', "./brick#{i}.vdi",
                        '--variant', 'Fixed', '--size', 2 * 1024]
        end
        vb.customize ['storageattach', :id, '--storagectl', 'IDE',
                      '--port', 1, '--device', 0, '--type', 'hdd',
                      '--medium', "./brick#{i}.vdi"]
      end
      # do configuration ...
      web.vm.provision 'ansible' do |ansible|
        ansible.playbook = 'playbooks/http/main.yml'
        ansible.inventory_path = 'ansible_hosts'
        ansible.groups = {
          'webservers' => ["web-#{i}"]
        }
      end
      if i == 2
        web.vm.provision 'ansible' do |ansible|
          ansible.playbook = 'playbooks/glusterfs/master-node.yml'
          ansible.inventory_path = 'ansible_hosts'
        end
        web.vm.provision 'ansible' do |ansible|
          ansible.playbook = 'playbooks/glusterfs/shared-config.yml'
          ansible.inventory_path = 'ansible_hosts'
        end
      end
    end
  end

end
