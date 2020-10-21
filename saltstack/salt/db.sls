file:
 file.managed:
   - name: /home/vagrant/installDataBase.sh
   - source: salt://utils/db/installDataBase.sh

run script:
 cmd.run:
   - name: sudo sh /home/vagrant/installDataBase.sh

run stop:
 cmd.run:
   - name: sudo systemctl stop mongod

run mongod:
 cmd.run:
   - name: sudo rm /etc/mongod.conf

mongoConf:
 file.managed:
   - name: /etc/mongod.conf
   - source: salt://utils/db/mongod.conf

run startmongod:
 cmd.run:
   - name: sudo systemctl start mongod
