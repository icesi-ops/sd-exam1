#!/usr/bin/python3

from flask import Flask, request, render_template
from pymongo import MongoClient 
from secrets import secrets
import data_service


app = Flask(__name__, template_folder='templates')

client = MongoClient(secrets.mongouri)
db = client.flask_db
todos = db.todos

@app.route('/')
def home():
    hostname = data_service.get_hostname()
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():

    username = request.form['username']

    file1 = request.files['file1']
    file2 = request.files['file2']

    index, node_count = data_service.save_files(username, file1, file2)

    todos.insert_one(index)
    todos.insert_one(node_count)

    return f'Files uploaded successfully. Check {username}.192.168.56.199/{file1.filename}'

@app.route('/status')
def check_status():
    status = data_service.check_status()
    return status

@app.route('/uploaded')
def list_uploaded():
    mnt = data_service.get_uploaded()
    return mnt

@app.route("/<page>", subdomain="<username>")
def render_user_page(page, username):
    return render_template(f'{username}/{page}')
    
if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
