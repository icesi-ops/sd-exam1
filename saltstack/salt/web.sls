/home/vagrant/installWebServer.sh
  file.managed:
    - source: salt://utils/web/installWebServer.sh
cmd.run:
  - name: sudo sh /home/vagrant/installWebServer.sh

/home/vagrant/web:
  file.recurse:
    - source: salt://utils/web
    - include_empty: True

cmd.run:
  -name: sudo nodejs /home/webserver/server.js
