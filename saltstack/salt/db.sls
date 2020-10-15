file:
 file.managed:
   - name: /home/vagrant/installDataBase.sh
   - source: salt://utils/db/installDataBase.sh
cmd.run:
  - name: sudo sh /home/vagrant/installDataBase.sh

cmd.run:
  - name: sudo systemctl stop mongod

cmd.run:
  - name: sudo rm /etc/mongod.conf

mongoConf:
 file.managed:
   - name: /etc/mongod.conf
   - source: salt://utils/db/mongod.conf

cmd.run:
  -name: sudo systemctl start mongod