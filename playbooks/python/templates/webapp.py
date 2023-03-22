#!/usr/bin/python3

from flask import Flask, request, render_template
from pymongo import MongoClient 
from secrets import secrets
import data_service

app = Flask(__name__, template_folder='/mnt')

client = MongoClient(secrets['mongouri'])

db = client.flask_db
todos = db.todos

@app.route('/')
def home():
    home = data_service.get_hostname()
    return home

@app.route('/upload', methods=['POST'])
def upload():

    username = request.form['username']

    file1 = request.files['file1']
    file2 = request.files['file2']

    index, node_count = data_service.save_files(username, file1, file2)

    todos.insert_one(index)
    todos.insert_one(node_count)

    return f'Files uploaded successfully. Check 192.168.56.199/{username}/{file1.filename}'

@app.route('/status')
def check_status():
    status = data_service.check_status()
    return status

@app.route('/uploaded')
def list_uploaded():
    uploaded = data_service.get_uploaded()
    return uploaded

@app.route("/<username>/<page>")
def render_user_page(username, page):
    return render_template(f'{username}/{page}')

@app.route('/logsdb')
def logs_db():
    logs = todos.find()
    dic = {}
    arr = []
    for doc in logs:
        del doc['_id']
        arr.append(doc)
    dic['data'] = arr
    return dic

    
if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)