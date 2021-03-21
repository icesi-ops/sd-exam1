# DOCUMENTATION OF ICESI HEALTH

Authors:

- Santiago Chasqui Córdoba    - A00347050
- Nicolás Javier Salazar      - A00348466
- Sebastian Rebolledo Meneses - A00310476
- Paola Veloza Naranjo        - A00349107

___

## THE SYSTEM

![](sources/parcial1-distribuidos.png)
**Figure 1.** -  System architecture

## Reverse proxy

#### Vagrantfile

Firts we create the Loandbalancer with vagrant

```ruby
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
```

This machine was configure, with ansible with the file `playbooks/nginx/main.yml`, in this file we install openssl and dependencies, see bellow 

```yaml
[...]
  pre_tasks:
    - name: Ensure epel repository exists
      yum: name=epel-release
    - name: Install openssl dependencies
      yum: 
        name:
          - openssl-devel
    - name: Turn on firewalld
      service: name=firewalld state=started enabled=yes
    - name: install pip
      yum: name=python-pip state=latest
    - name: upgrade pip
      shell: pip install --upgrade "pip < 21.0"
    - name: Install pip3 depden
      pip:
        name: pyopenssl
[...]
```

In the same file we call the task to make the self certifificated in: `playbooks/nginx/tasks/self-signed-cert.yml`

```yaml
TODO: put content here... 
```

Then we install Nginx and copy configuration from `playbooks/nginx/templates/nginx.conf.j2`, redirect http trafic to https trafic, and (of course) configure the loadbalancer between webservers (by default the nginx use round‑robin algorith).

```yaml
  tasks:
    - import_tasks: tasks/self-signed-cert.yml
    - name: Install nginx 
      yum:
        name:
          - nginx
    - name: Enable firewall
      shell: "firewall-cmd --permanent --add-service={http,https}"
    - name: Firewall rule
      shell: "firewall-cmd --zone=public --add-port=8083/tcp"
    - name: Start firewall rule
      shell: "firewall-cmd --reload"
    - name: Ensure docroot exists
      file:
        path: "{{nginx_docroot}}"
        state: directory
    - name: Nginx configuration server
      template:
        src: templates/nginx.conf.j2
        dest: /etc/nginx/nginx.conf
        mode: 0644
    - name: Restart nginx
      service: name=nginx state=restarted enabled=yes
    - name: COnfigure SO to allow to nginx make the proxyredirect
      shell: setsebool httpd_can_network_connect on -P
```

The file `nginx.conf.j2` have this content: 

```jinja2
events {
   worker_connections	1024;
}

http {
   include	mime.types;
   default_type	application/octet-stream;
   keepalive_timeout	65;

    # HTTPS Test server configuration.
    # Redirect HTTP traffic to HTTPS.
    server {
        listen 80 default_server;
        server_name _;
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET,HEAD,PUT,PATCH,POST,DELETE";
        index index.html;   
    }
}
```



## Web Servers

TODO

```ruby
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
        ansible.groups = {
          'webservers' => ["web-#{i}"]
        }
      end
    end
  end
```

## Storage (DS and DB)

 TODO

```ruby
  config.vm.define 'db' do |db|
    db.vm.box = 'centos/7'
    db.vm.hostname = 'dbserver'
    db.vm.network 'private_network', ip: '192.168.33.100'
    db.vm.provider 'virtualbox' do |vb|
      vb.customize ['modifyvm', :id, '--memory', '512', '--cpus', '1', '--name', 'db']
      unless File.exist?(masterbrick)
        vb.customize ['createhd', '--filename', masterbrick, '--variant',
                      'Fixed', '--size', 5 * 1024]
        vb.customize ['storageattach', :id,  '--storagectl', 'IDE',
                      '--port', 1, '--device', 0, '--type', 'hdd',
                      '--medium', masterbrick]
      end
    end
    db.vm.provision 'ansible' do |ansible|
      ansible.playbook = 'playbooks/db/main.yml'
    end
    db.vm.provision 'shell', inline: 'ansible-playbook ./playbooks/glusterfs/shared-config.yml'
  end
```

## Branchind strategy
