Obtener script:
  file.managed:
    - name: /home/vagrant/database.sh
    - source: salt://scripts/database.sh

correr script:
  cmd.run:
    - name: sudo chmode777 /home/vagrant/database.sh
    - name: sudo sh /home/vagrant/database.sh .

Obtener Configuracion:
  file.managed:
    - name: /etc/mongodb.conf
    - source: salt://sources/mongodb.conf

correr database:
  cmd.run:
    - name: sudo systemctl start mongodb

