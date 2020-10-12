Obtener script:
  file.managed:
    - name: /home/vagrant/webserver.sh
    - source: salt://scripts/webserver.sh

correr:
  cmd.run:
    - name: sudo sh /home/vagrant/webserver.sh .


Obtener configuracion:
  file.managed:
    - name: /home/webserver/servidor.js
    - source: salt://sources/servidor.js

Obtener pagina:
  file.managed:
    - name: /home/webserver/index.html
    - source: salt://sources/index.html


correr script:
  cmd.run:
    - name: sudo nodejs /home/webserver/servidor.js
