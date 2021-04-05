#Exam 1
####Integrantes
#####Jaime Eduardo Cardona Buenaventura A00145492
#####Daniel Alejandro Cerquera Castro A00347354
#####Francisco Javier Restrepo Castañeda A00292796
**Table of Contents**

[TOCM]

[TOC]

#Reserve proxy
Por medio del Vagrantfile se realizo el aprovisionamiento de una maquina virtual, la cual posee una box centox/7, direccion ip 192.168.33.200.
```Vagrant
	config.vm.define "loadbalancer" do |loadbalancer|
		loadbalancer.vm.box = "centos/7"
		loadbalancer.vm.hostname = "loadbalancer"
		loadbalancer.vm.network "private_network", ip: "192.168.33.200"
		loadbalancer.vm.provider "virtualbox" do |vb|
			vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "lb"]
			end
		loadbalancer.vm.provision "ansible" do |ansible|
			ansible.playbook = "playbooks/nginx/main.yml"
			ansible.extra_vars = {"web_servers" => [{"name": "webserver-1", "ip":"192.168.33.11"},{"name": "webserver-2", "ip":"192.168.33.12"}]}
		end
	end
```
Con ansible en el playbook definimos lo siguiente:
Variables a usar en el certificado autofirmado:
```yml
certificate_dir: /etc/ssl/private
server_hostname: sistemasdistribuidos
nginx_docroot: /usr/share/nginx/html
pip_install_packages: ['pyopenssl']
```
En las pre task instalamos lo necesario para poder obtener el certificado, generar una llave privada y el archivo csr para conseguir el certificado autofirmado y usar correctamente el HTTPS.
```yml
---
- hosts: all
  become: true
  vars_files:
    - vars/main.yml
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
```
Luego de realizar la instalacion pasamos a las task:
```yml
  tasks:
    - import_tasks: tasks/self-signed-cert.yml
    - name: Install nginx 
      yum:
        name:
          - nginx
    - name: Enable firewall
      shell: "firewall-cmd --permanent --add-service={http,https}"
    - name: Start firewall rule
      shell: "firewall-cmd --reload"
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
Como primera tarea cargamos las tareas del self-signed-cert.yml para generar el certificado autofirmado:
```yml
---
- name: Ensure directory exists for self-signed certs
  file:
    path: "{{ certificate_dir }}/{{ server_hostname }}"
    state: directory

- name: Generate Private key
  openssl_privatekey:
    path: "{{ certificate_dir }}/{{server_hostname}}/privkey.pem"
- name: Generate CSR
  openssl_csr:
    path: "{{ certificate_dir}}/{{server_hostname}}.csr"
    privatekey_path: "{{certificate_dir}}/{{server_hostname}}/privkey.pem"
    common_name: "{{ server_hostname }}"

- name: Generate self signeed certificate
  openssl_certificate:
    path: "{{certificate_dir}}/{{server_hostname}}/fullchain.pem"
    privatekey_path: "{{ certificate_dir}}/{{server_hostname}}/privkey.pem"
    csr_path: "{{certificate_dir}}/{{server_hostname}}.csr"
    provider: selfsigned
```
Luego instalamos el Nginx, activamos e iniciamos el firewall y cargamos la configuracion del Nginx ( Balanceador de carga y redireccionamiento HTTP -> HTTPS) para luego reiniciarlo y activar el redireccionamiento HTTP a HTTPS junto con el balanceador de carga.
Codigo de configuracion Nginx:
```nginx
events {
   worker_connections	1024;
}

http {
   include	mime.types;
   default_type	application/octet-stream;
   keepalive_timeout	65;
   
##Load balancer
upstream webservers {
    server 192.168.33.11:5000;
    server 192.168.33.12:5000;
}

# HTTPS Test server configuration.
# Redirect HTTP traffic to HTTPS
server {
    listen 80;
    return 301 https://$host$request_uri;
}

# Proxy HTTPS traffic using a self-signed certificate.
server {
    listen 443 ssl default_server;
    server_name {{ server_hostname }};

    location / {
	proxy_set_header Host $http_host;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass          http://webservers;
        proxy_read_timeout  90s;
        proxy_redirect      http://localhost:8083 {{ server_hostname }};
    }

    ssl_certificate {{ certificate_dir }}/{{ server_hostname }}/fullchain.pem;
    ssl_certificate_key {{ certificate_dir }}/{{ server_hostname }}/privkey.pem;
}
}
```

#Servidores Web
Para los servidores web usamos la siguiente configuración en vagrant:
```vagrant
(1..2).each do |i|
            config.vm.define "webserver-#{i}" do |webserver|
             webserver.vm.box = "centos/7"
	     webserver.vm.hostname = "webserver-#{i}"
	     webserver.vm.network "private_network", ip: "192.168.33.1#{i}"
	     webserver.vm.provider "virtualbox" do |vb|
	      vb.customize  ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "webserver-#{i}"]
	      unless File.exist?("./Disco#{i}.vdi")
          vb.customize ['createhd', '--filename', "./Disco#{i}.vdi", '--variant', 'Fixed', '--size', 2 * 1024]
	      end
          vb.customize ['storageattach', :id,  '--storagectl', 'IDE', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', "./Disco#{i}.vdi"]
          end
             webserver.vm.provision "ansible" do |ansible|
              ansible.playbook = "playbooks/httpd/webserver.yml"
              ansible.groups = {
                "webserver" => ["webserver-#{i}"]
              }
              		end
              		webserver.vm.provision "shell", path: 'scripts/glusterfs.sh'
                    webserver.vm.provision "shell", path: 'scripts/configuration.sh'
             	end
             end
```
Especificamos que las máquinas van a ser 2 y que los servidores web usarán una box centos/7, con unos hostname webserver-1 y webserver-2 con las direcciones IP 192.168.33.11 y 192.168.33.12 respectivamente.
Usamos ansible para la configuración de las máquinas, en la configuración instalamos Python3-pip3, ya teniendo instalados estás dos herramientas con el pip3 procedemos a instalar el Flask (herramienta que usaremos para conecta y renderizar el HTML con el código python3) y el pymongo para la conexión a la base de datos.
El archivo YML con las tareas de configuración es el siguiente:
```yml
---
- hosts: webserver
  become: true
  pre_tasks:
    - name: install pip
      yum: name=python3-pip state=latest
    - name: install wheel
      shell: pip3 install wheel
    
  tasks:
  
    - name: Install flask
      shell: pip3 install Flask
    - name: Install Werkzeug
      shell: pip3 install Werkzeug
    - name: "Moving the web file"
      copy:
        src: templates/templates
        dest: /home/vagrant
        mode: 0755
    - name: "Moving the python file"
      copy:
        src: templates/webserver.py
        dest: /home/vagrant
        mode: 0755
    - name: Run python server
      shell: "(sudo python3 /home/vagrant/webserver.py >/dev/null 2>&1 &)"
      async: 45
      poll: 0
    - name: Install pymongo
      shell: pip3 install pymongo
    - name: Install Flask-PyMongo
      shell: pip3 install Flask-PyMongo
    - name: Install waitress
      shell: pip3 install waitress
    - name: Install MongoEngine
      shell: pip3 install flask-mongoengine 
    - name: Create directory static
      shell: mkdir static
    - name: Create directory img
      shell: mkdir static/img
```
En la configuración luego de instalar las herramientas necesarias, procedemos a mover el archivo HTML y el código python a un directorio específico de la máquina virtual para luego ser ejecutado con el comando "(sudo python3 /home/vagrant/webserver.py >/dev/null 2>&1 &)", el servidor web se ejecutará en cada una de las dos máquinas virtuales y para acceder a ella usamos la dirección IP del load balancer y el se encarga de usar el webserver-1 o el webserver-2.
El código python para las páginas web es el siguiente:
```python
import os
from flask import Flask, render_template, request, jsonify, Response, flash, redirect
from flask_pymongo import PyMongo
from bson import json_util
from bson.objectid import ObjectId
from flask_mongoengine import MongoEngine
import json
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from waitress import serve
import urllib.request

# instancia del objeto Flask
app = Flask(__name__)
app.secret_key = 'myawesomesecretkey'
app.config['MONGODB_SETTINGS'] = {
    'db': 'BaseDeDatosExamen1',
    'host': '192.168.33.100',
    'port': 27017
}
db = MongoEngine()
db.init_app(app)  


#UPLOAD FOLDER
UPLOAD_FOLDER = 'static/img'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

def allowed_file(filename):
 return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
 
 class FileDB(db.Document):
    name = db.StringField()

@app.route("/")
def upload_file():
  return render_template('index.j2')

@app.route("/upload", methods=['POST'])
def uploader():
    file = request.files['inputFile']
    filename = file.filename

    if file and allowed_file(file.filename):
       file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
       filesavedb = (name=filename)
       filesavedb.save()
       flash('File successfully uploaded ' + file.filename + ' to the database!')
       return redirect('/')
    else:
       flash('Invalid Uplaod only txt, pdf, png, jpg, jpeg, gif')
    return redirect('/')

if __name__ == '__main__':
 # Iniciamos la aplicación
    app.run(host="0.0.0.0", port="80")
```
Para la obtención del archivo a subir para la base de datos usamos un método POST el cual recolecta el archivo brindado por el usuario y lo sube a la base de datos mongo, colocamos como host la dirección IP 0.0.0.0 para que pueda ser accedían por medio de cualquier IP propia de las máquinas webserver, el puerto que definimos es el puerto 80.

#Dificultades
Para el desarrollo de este proyecto tuvimos varias dificultades, la primer y más grande dificultad fue la configuración de la herramienta vagrant en la máquina de uno de nuestros compañeros, puesto que, el tenía un problema con un bloqueo de la BIOS lo cual le impedía el lanzamiento de las máquinas virtuales con VirtualBox.
Ya con la herramienta Vagrant bien configurada comenzamos a realizar el proyecto, como primera instancia intentamos hacer el load balancer con la herramienta Haproxy, porque está herramienta la habíamos usado en clase pero a la hora de realizar el redireccionamiento http a https nos generaba una gran dificultad debido a que la clave autocertificada no era detectada, así que investigamos si se podía elaborar el load balancer con Nginx ( herramienta que ya tenía la parte del redireccionamiento de http a https ) y nos dimos cuenta que si era viable elaborar el balanceador con Nginx.
Luego del correcto funcionamiento de el balanceador procedimos a investigar cómo hacer una página web con python y descubrimos que se podía elaborar con flask pero cuando lo implementamos las tareas no podían ejecutar el código python y esta situación generaba que el balanceador nos indicara que no era posible acceder a la página web, le preguntamos al tutor el porque no se ejecutaba la página web a lo que el nos brindó un comando para poder ejecutarlo el cual fue 
`(sudo python3 /home/vagrant/webserver.py >/dev/null 2>&1 &)` 
ya con esto pudimos ejecutar la página correctamente en los dos web servers.
Para la base de datos intentamos hacer una conexión tcp para el envío de los archivos para su almacenamiento sin el uso de mongodb, pero vimos que era mucho mejor usar mongodb el cual nos permitía crear una tabla con la información de los archivos guardados, logramos hacer una base de datos local pero no necesitábamos que fuera local sino que pudiera ser usada por los webserver así que la implementación de este requerimiento fue lo que más presento inconvenientes porque no lograba una correcta conexión y generó inconvenientes en la ejecución de la página web ( tarea que ya teníamos elaborada )

