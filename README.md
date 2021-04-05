## Integrantes 
#### Nelson López  - A00347546
#### Jair Aguirre  - A00346739
#### Juan Camilo Vélez  - A00345791

# Documentación
 ## Reverse proxy y balanceador de carga
 En primera instancia, se aprovisiona una máquina virtual especificándola en el archivo de  [Vagrantfile](https://github.com/juanchovelezpro/sd-exam1/blob/master/Vagrantfile"), con una box centOS 7, la dirección IP 192.168.33.200 y el playbook para la configuración de los servicios:
 

```ruby
	config.vm.define "nginx" do |nginx|
	    nginx.vm.box = "centos/7"
	    nginx.vm.hostname = "nginx"
	    nginx.vm.network "private_network", ip: "192.168.33.200"
	    nginx.vm.provider "virtualbox" do |vb|
	     vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "nginx"]
	    end
	    
	    nginx.vm.provision "ansible" do |ansible|
	      ansible.playbook = "playbooks/nginx/main.yml"
	    end  
	 end
```

Luego se especifican las variables que requiere la tarea de crear el certificado autofirmado, en el archivo [main.yml](https://github.com/juanchovelezpro/sd-exam1/blob/master/playbooks/nginx/vars/main.yml"):
```ruby
certificate_dir: /etc/ssl/private
server_hostname: sistemasdistribuidos
nginx_docroot: /usr/share/nginx/html
pip_install_packages: ['pyopenssl']
```
Posteriormente se definen las pre-tasks en donde se instala la libreria de pyopenssl con sus dependencias y se ejecuta el servicio de firewalld.

```yaml
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

Estas pre-tasks se ejecutan para poder obtener el certificado autofirmado mediante la tarea [self-signed-cert.yml](https://github.com/juanchovelezpro/sd-exam1/blob/master/playbooks/nginx/tasks/self-signed-cert.yml"). Inicialmente se comprueba que el directorio en donde se guardará el certificado aotufirmado exista, para luego generar la llave privada, generar el archivo csr con el que se solicita el certificado a la entidad certificadora (que en nuestro caso será un certificado autofirmado) y por último se genera el certificado autofirmado.

```yaml

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

Para configurar el servidor nginx, se crea el template de configuración. Con el paramentro upstream se nombra al grupo de servidores a los que va a apuntar el balanceador de carga, luego se especifica la dirección IP de cada servidor. A través del parámetro proxy_pass se redirige todo el tráfico http a los webservers especificados y usando el certificado autofirmado para hacer la redirección a https.



```j2
## Load balancer
upstream webservers {
    server 192.168.33.11;
    server 192.168.33.12;
}

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
        proxy_pass http://webservers;
    }

    ssl_certificate {{ certificate_dir }}/{{ server_hostname }}/fullchain.pem;
    ssl_certificate_key {{ certificate_dir }}/{{ server_hostname }}/privkey.pem;
}
}
```
Luego de haber configurado el template del servidor, se definen las tasks en el playbook. Primeramente se importa la task para crear el certificado autofirmado, se instala el servicio nginx, se crean las reglas de firewall para aceptar el tráfico http y https, se inicia el servicio de firewall y por último se carga el template de configuración en el servidor y se reinicia para cargar los cambios en el archivo de configuración.

```yaml
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
```


 ## Servidores web 
 En primera instancia, se aprovisionan las dos  máquinas virtuales en el archivo de  [Vagrantfile](https://github.com/juanchovelezpro/sd-exam1/blob/master/Vagrantfile"), con una box centOS 7, las direcciones IP 192.168.33.11 y 192.168.33.12  y el playbook [webserver.yml](https://github.com/juanchovelezpro/sd-exam1/blob/master/playbooks/golang/webserver.yml") para la configuración dell servicio web:
 

```ruby
	(1..2).each do |i|
	 config.vm.define "web-#{i}" do |web|
	    web.vm.box = "centos/7"
        web.vm.hostname = "web-#{i}"
        web.vm.network "private_network", ip: "192.168.33.1#{i}"
     	web.vm.provider "virtualbox" do |vb|
        	vb.customize ["modifyvm", :id, "--memory", "512", "--cpus", "1", "--name", "web-#{i}"]
			file_to_disk = "diskweb#{i}.vdi"
			unless File.exist?(file_to_disk)
			vb.customize ['createhd', '--filename', file_to_disk,'--variant', 'Fixed', '--size', 2 * 1024]
			end
			vb.customize ['storageattach', :id,  '--storagectl', 'IDE', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', file_to_disk]
		end

	    web.vm.provision "ansible" do |ansible|
        	ansible.playbook = "playbooks/golang/webserver.yml"
            ansible.groups = {
             "servers" => ["web-#{i}"]
            }
        	end
		end
	end
```

El servicio web se desarrolla en el lenguaje de Go, ejecutando en archivo [main.go](https://github.com/juanchovelezpro/sd-exam1/blob/master/playbooks/nginx/vars/main.yml") .

La función uploadHandler permite manejar los tipos de solicitud http que lleguen al endpoint, en donde ante una petición GET se devuelve el archivo upload.html en donde se muestra la lista de los documentos guardados, obtenidos al leer dicha información de la base de datos, desde la función getFiles() y también ejecutando el comando df -h | grep gfs | awk '{print $4}' para obtener la cantidad de espacio libre en el almacenamiento centralizado.  Para subir un archivo, se ejecuta la función uploadFile(), en donde se hace un insert a la base de datos con la información del archivo subido y luego se refresca la página para actualizar la lista de archivos almacenados. 

```go
func uploadHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		display(w, "upload", nil)
	case "POST":
		uploadFile(w, r)
	}
}

func getNames() []string {
	var files = getFiles()
	names := make([]string, len(files))

	for i := 0; i < len(files); i++ {
		names[i] = (files[i].Nombre) + "." + (files[i].Tipo)
	}

	return names
}

// Display the named template
func display(w http.ResponseWriter, page string, data interface{}) {

    var err, out, err2 = getStorage("df -h | grep gfs | awk '{print $4}'")

    if err != nil {
		fmt.Println("Error in command")
		fmt.Println(err)
	}
    if err2 != "" {
		fmt.Println("Error executing command")
		fmt.Println(err2)
	}

	var files = getNames()
	
	as := tp{Title: "Saved files: ", Storage: out, Body: files}
	t := template.Must(template.ParseFiles("upload.html"))
	t.Execute(w, as)
}

func insertFile(name string) {
	clientOptions := options.Client().ApplyURI("mongodb://192.168.33.100:27017")
	client, err := mongo.Connect(context.TODO(), clientOptions)
	collection := client.Database("mongo").Collection("files")

	split := strings.Split(name, ".")

	newFile := File{uuid.New().String(), split[0], "/home/vagrant/", split[1]}
	insertResult, err := collection.InsertOne(context.TODO(), newFile)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("File inserted: ", insertResult.InsertedID)

}

func uploadFile(w http.ResponseWriter, r *http.Request) {
	// Maximum upload of 10 MB files
	//10 << multiplicar 10 *2, 20 veces
	r.ParseMultipartForm(10 << 20)

	// Get handler for filename, size and headers
	file, handler, err := r.FormFile("myFile")
	if err != nil {
		fmt.Println("Error Retrieving the File")
		fmt.Println(err)
		return
	}

	defer file.Close()
	fmt.Printf("Uploaded File: %+v\n", handler.Filename)
	fmt.Printf("File Size: %+v\n", handler.Size)
	fmt.Printf("MIME Header: %+v\n", handler.Header)

	// Create file
	dst, err := os.Create("/mnt/glusterfs/" + handler.Filename)
	defer dst.Close()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Copy the uploaded file to the created file on the filesystem
	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	insertFile(handler.Filename)

	http.Redirect(w, r, "https://192.168.33.200", http.StatusSeeOther)
}
```

Luego de haber desarrollado el servicio web en go, se definen las tareas para configurar este servicio.  En principio, se instala el repositorio de paquetes de Epel para luego instalar Go. Posteriormente se incluye en el ambiente de Go, el driver que aprovisiona la interfaz para hacer el CRUD a la base de datos. La instalación del bson es necesaria para poder tomar cada elemento guardado en la base de datos, teniendo en cuenta que MongoDB los guarda en formato bson, es decir, en una representación binaria de JSON.

Para guardar un elemento en la base de datos, se le asigna un id generado a partir del paquete uuid que se instala previamente.  En la siguiente tarea se copia  desde el host el archivo main.go a cada servidor web, así como los estilos CSS y una imagen usada en la página que se retorna al usuario.   

Por último se guarda la dirección IP de cada servidor para luego incluirla en el archivo html, el cual se carga a partir de la plantilla [upload.j2](https://github.com/juanchovelezpro/sd-exam1/blob/master/playbooks/golang/templates/upload.j2")  y finalmente se ejecuta el archivo main.go en segundo plano para habilitar el servicio web.

``` yaml
  - name: "Install Epel-Release to install Go"
            yum:
                    name: epel-release
                    state: present
                    
          - name: "Install Go"
            yum:
                    name: golang
                    state: present

          - name: "Install MongoDB Driver"
            shell: "go get go.mongodb.org/mongo-driver/mongo"
            
          - name: "Install MongoDB Driver bson"
            shell: "go get go.mongodb.org/mongo-driver/bson"
            
          - name: "Install UUID package"
            shell: "go get github.com/google/uuid"
            
          - name: "Copy go file"
            copy:
                   src: frontend/main/main.go
                   dest: /home/vagrant/main.go
                   owner: root
                   group: wheel
                   mode: '0644'

          - name: "Copy css "
            copy:
                   src: frontend/css
                   dest: /home/vagrant
                   owner: root
                   group: wheel
                   mode: '0644'

          - name: "Copy image "
            copy:
                   src: frontend/image
                   dest: /home/vagrant
                   owner: root
                   group: wheel
                   mode: '0644'

          - name: "know ip"
            shell: "ip addr | grep 'state UP' -A2 | tail -n1 | awk '{print $2}' | cut -f1  -d'/'"
            register: print_ip
                   
          - name: "Configure html template"
            template:
                  src: templates/upload.j2
                  dest: /home/vagrant/upload.html
                  owner: root
                  group: wheel                   

          - name: "Install lsof to debug"
            yum:
                    name: lsof
                    state: present

          - name: "Run web service"
            shell: "nohup go run main.go </dev/null >/dev/null 2>&1 &"
```
## Aprovisionamiento Base de Datos y Sistema centralizado de almacenamiento

Para la base de datos se utiliza la VM *db* que se declara en el Vagrantfile. Una vez la VM está lista se realiza la configuración de una MongoDB, esta configuración se hace con el playbook [database.yml](https://github.com/juanchovelezpro/sd-exam1/blob/master/playbooks/database/database.yml "database.yml") en la cual se copia el repositorio para poder instalar MongoDB y luego se procede a la instalación, configuración e iniciar el servicio. Para el aprovisamiento del sistema centralizado de almacenamiento, se utilizó GlusterFS, una vez que las VM *db, web-1 y web-2*  están arriba con sus discos duros adicionales para usarlos en el Gluster, en sus playbooks correspondientes ([database.yml](https://github.com/juanchovelezpro/sd-exam1/blob/master/playbooks/database/database.yml "database.yml") y [webserver.yml](https://github.com/juanchovelezpro/sd-exam1/blob/master/playbooks/golang/webserver.yml "webserver.yml")) se encuentra la instrucción de ejecutar el script según el hostname para la instalación y configuración del GlusterFS. El nodo *master* es la *db*  y los bricks son *web-1 y web-2*. La VM *web-2* al ser la última en aprovisionarse, se encarga de hacer ping a los demás nodos del gluster e iniciar el servicio para que todos los nodos se conecten y tener el sistema centralizado de almacenamiento. El script de *web-2*  es el siguiente [web-2.sh](https://github.com/juanchovelezpro/sd-exam1/blob/master/playbooks/golang/scripts/web-2.sh "web-2.sh"), los scripts de *db* y *web-1* son parecidos con la única diferencia que cambian los hostnames para identificarse en el gluster y que *web-2* tiene unas cuantas líneas demás para iniciar el servicio.

## Estrategia de integración. 
La estrategia de branching utilizada para el desarrollo del respectivo parcial fue Trunkbased development. Ésta se decidió debido a su fácil manejo en grupos de trabajo pequeños. Y en este caso encajó perfectamente para las necesidades que teníamos como equipo. Todos los cambios que cada miembro efectuó desde los repositorios locales, se añadían posteriormente de forma directa a la rama master del repositorio alojado en github.
Como equipo, se trabajó conjuntamente en la mayoría de las funcionalidades requeridas para la actividad, pero cada uno tuvo énfasis en las siguientes funcionalidades:
- Nelson Lopez: Aprovisionamiento del balanceador de carga y el reverse proxy.
- Camilo Velez: Aprovisionamiento de la base de datos y el sistemas centralizado de almacenamiento.
- Melqui Aguirre: conexión de backend a frontend y desarrollo de frontend.
Las respectivas evidencias se pueden observar en el repositorio de github, en los comentarios añadidos por los miembros a la rama master.

 ## Problemas encontrados
 - Al momento de subir un nuevo archivo, no era posible actualizar de forma dinámica el archivo html. Para solucionar esto, se hizo uso del método Execute para un template, que permite pasar por parametro variables desde Go hacia el archivo html. Además, se ejecuta la función  http.Redirect, para apuntar nuevamente hacia el balanceador de carga y actualizar el contenido de la página.

- Cuando en la plantilla upload.j2 se quería llamar una variable pasada por parámetro desde Go, esta variable se tomaba como una variable guardada desde Ansible, por tanto generaba problemas dado que dicha variable pertenecia al archivo Go y no alguna declarada en el playbook. Para solucionar el problema, se colocaron las líneas correspondientes al llamado de dichas variables, en un  wrapper {%raw%}, de modo que cuando se intentara cargar la plantilla, ya no se reconociera esa parte del codigo como una variable registrada por el playbook, sino como código html.

- Para iniciar el servicio del GlusterFS, todos los nodos ya deben de tener cierta configuración, en caso contrario lanza un error. Para solucionar esto, la VM web-2 al ser la última en aprovisonarse, es la encargada de iniciar el servicio ya que los demás nodos ya se encuentran listos para ser parte del gluster, por ello también, desde web-2 se accede via ssh a db y a web-2 para montar el glusterfs una vez el servicio ya se encuentra inicializado en el directorio asignado.








