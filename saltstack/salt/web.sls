file: 
  file.managed: 
    - name: /home/vagrant/installWebServer.sh 
    - source: salt://utils/web/installWebServer.sh  

run script:
   cmd.run:
    - name: sudo sh /home/vagrant/installWebServer.sh

webfile:
  file.recurse:
    - name: /home/vagrant
    - source: salt://utils/web
    - include_empty: True

run script1:
  cmd.run:
    - name: sudo node /home/vagrant/server.js
