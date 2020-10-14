/home/vagrant/installDataBase.sh:
 file.managed:
   - source: salt://utils/db/installDataBase.sh
cmd.run:
  - name: sudo sh /home/vagrant/installDataBase.sh

cmd.run:
  - name: sudo systemctl stop mongod

/etc/mongod.conf:
 file.managed:
   - source: salt://utils/db/mongod.conf

cmd.run:
  -name: sudo systemctl start mongod