file:
  file.managed:
    - name: /home/vagrant/scriptweb.sh
    - source: salt://scriptweb.sh

Run myscript:
  cmd.run:
    - name: sudo sh /home/vagrant/scriptweb.sh .

Run echo:
  cmd.run:
    - name: echo 'Finished loading minion'

