#!/usr/bin/python3

from flask import Flask, request, render_template
from database import DatabaseManager
from secrets import secrets
import data_service


app = Flask(__name__, template_folder='templates')

db = DatabaseManager(host=secrets.host, user=secrets.user, password=secrets.password, database=secrets.database)
db.connect()

@app.route('/')
def home():
    hostname = data_service.get_hostname()
    return render_template('index.html', hostname=hostname)

@app.route('/upload', methods=['POST'])
def upload():

    username = request.form['username']

    file1 = request.files['file1']
    file2 = request.files['file2']

    index, node_count = data_service.save_files(username, file1, file2)

    db.insert(table='logs', data=index)
    db.insert(table='logs', data=node_count)

    return f'Files uploaded successfully. Check {username}.192.168.56.199/{file1.filename}'

@app.route('/status')
def check_status():
    status = data_service.check_status()
    return status

@app.route('/uploaded')
def list_uploaded():
    mnt = data_service.get_uploaded()
    return mnt
    
if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
