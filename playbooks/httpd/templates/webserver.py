# Imports
import os
from flask import Flask, render_template, request, jsonify, Response, flash, redirect
from flask_pymongo import PyMongo
from bson import json_util
from bson.objectid import ObjectId
from flask_mongoengine import MongoEngine
import json
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from waitress import serve
import urllib.request

# instancia del objeto Flask
app = Flask(__name__)
app.secret_key = 'myawesomesecretkey'
app.config['MONGODB_SETTINGS'] = {
    'db': 'BaseDeDatosExamen1',
    'host': '192.168.33.100',
    'port': 27017
}
db = MongoEngine()
db.init_app(app)  


#UPLOAD FOLDER
UPLOAD_FOLDER = 'static/img'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

def allowed_file(filename):
 return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
 
@app.route("/")
def upload_file():
  return render_template('index.j2')

@app.route("/upload", methods=['POST'])
def uploader():
    file = request.files['inputFile']
    filename = file.filename

    if file and allowed_file(file.filename):
       file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
       flash('File successfully uploaded ' + file.filename + ' to the database!')
       return redirect('/')
    else:
       flash('Invalid Uplaod only txt, pdf, png, jpg, jpeg, gif')
    return redirect('/')

if __name__ == '__main__':
 # Iniciamos la aplicación
    app.run(host="0.0.0.0", port="80")
