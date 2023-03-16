#!/usr/bin/python3

from flask import Flask, request, render_template
import os

app = Flask(__name__, template_folder='templates')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():

    username = request.form['username']

    file1 = request.files['file1']
    file2 = request.files['file2']

    os.mkdir(username)

    file1.save(f'{username}/{file1.filename}')
    file2.save(f'{username}/{file2.filename}')
    return "Files uploaded successfully"

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
