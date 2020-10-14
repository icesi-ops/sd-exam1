postgresql:
  pkg.installed: 
    - pkg: postgresql

file:
  file.managed:
    - name: /home/vagrant/scriptdb.sh
    - source: salt://scriptdb.sh

/etc/postgresql/10/main/postgresql.conf:
  file.append:
    - text: |
        listen_addresses = '*'   

remove db if exists:
  cmd.run:
    - name: sudo -u postgres -H -i sh -c "psql -c 'DROP DATABASE IF EXISTS pg_ds;'"

drop user if exists:
  cmd.run:
    - name: sudo -u postgres -H -i sh -c "psql -c 'DROP USER IF EXISTS remote;'"

create user:
  cmd.run:
    - name: sudo -u postgres psql -c "CREATE USER remote WITH PASSWORD 'remote';"

create db:
  cmd.run:
    - name: sudo -u postgres -H -i sh -c "psql -c 'CREATE DATABASE pg_ds OWNER=remote;'"

grant all privileges db:
  cmd.run:
    - name: sudo -u postgres -H -i sh -c "psql -c 'GRANT ALL PRIVILEGES ON DATABASE pg_ds TO remote;'"

Run myscript:
  cmd.run:
    - name: sudo sh /home/vagrant/scriptdb.sh

/etc/postgresql/10/main/pg_hba.conf:
  file.append:
    - text: |
        host    all             all             0.0.0.0/0               md5
        host    all             all             ::/0                    md5
restart postgres:
  cmd.run:
    - name: sudo systemctl restart postgresql
