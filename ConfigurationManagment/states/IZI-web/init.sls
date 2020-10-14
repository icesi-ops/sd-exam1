nstall_front_npm_dependencies:
    cmd.run:
      - name: "cd /home/vagrant/ds-exams/app/http/app && sudo npm install"

run_front:
    cmd.run:
      - name: "cd /home/vagrant/ds-exams/app/http/app/ && nohup sudo npm start > /dev/null 2>&1 &"

run_back:
    cmd.run:
      - name: "cd /home/vagrant/ds-exams/ && nohup FLASK_APP=$PWD/app/http/api/endpoints.py FLASK_ENV=development pipenv run python2 -m flask run --port 4433 > /dev/null 2>&1 &"
