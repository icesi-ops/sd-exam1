# sd-exam1

#### Alejandro Barrera Lozano - A
#### Santiago Figueroa Aguirre - A
#### Ernesto Betancourt Ramirez - A00049172

# Documentación del sistema centralizado de almacenamiento

Para el sistema centralizado de almacenamiento se implementó GlusterFs, haciendo una replica del volumen. Se usaron tres discos, uno para ser el nodo maestro(db machine) y los otros dos para ser los nodos esclavos(web-1, web-2 machines), estos discos fueron creados y asignados a las respectivas maquinas en el Vagrantfile. Del mismo modo, despues de la asignacion de los discos se efectua la instalacion y configuracion de GlusterFs en las maquinas db, web-1 y web-2, haciendo uso de los scrips glusterfs.sh y configuration.sh. 

Para unir los nodos (peering) se usó un playbook llamado glusterConfig.yml el cual se encarga de hacer el peering desde el nodo maestro a sus esclavos, de crear el volumen de tipo replica quien va a sincronizar los dos nodos esclavos y de iniciar dicho volumen. El archivo glusterConfig.yml hace uso de dos scrips, uno para el grupo "databases" (db) llamado masterConfig.sh y otro para el grupo "servers" (web-1 y web-2) llamado slaveConfig.sh.

Para probar su funcionamiento se probó agregando varios archivos a web-1 y efectivamente se replicaban en web-2.

