#!/usr/bin/python3

from flask import Flask, request, render_template
import os

app = Flask(__name__, template_folder='templates')

@app.route('/')
def home():
    hostname = os.system('hostnamectl | grep \'hostname\'')
    return render_template('index.html', hostname=hostname)

@app.route('/upload', methods=['POST'])
def upload():

    username = request.form['username']

    file1 = request.files['file1']
    file2 = request.files['file2']

    os.mkdir(username)

    file1.save(f'/mnt/{username}/{file1.filename}')
    file2.save(f'/mnt/{username}/{file2.filename}')
    return f'Files uploaded successfully. Check {username}.192.168.56.199/{file1.filename}'

@app.route('/status')
def check_status():
    status = os.system('df -hT /mnt | awk \'{print $3, $4, $5, $6}\'')
    return status

@app.route('/uploaded')
def list_uploaded():
    mnt = os.system('find . | sed -e "s/[^-][^\/]*\//  |/g" -e "s/|\([^ ]\)/|-\1/"')
    return mnt
    
if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
