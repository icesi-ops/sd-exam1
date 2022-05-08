from flask import Flask, request, render_template
from threading import Thread
import requests
import consul

app = Flask(__name__, template_folder='template')

@app.route("/")
def hello():
    return "Hello world!"

@app.route("/upload-image", methods=["GET", "POST"])
def upload():
    return render_template("upload_image.html")

if __name__ == "__main__":
    c = consul.Consul(host='consul', port=8500)
    # Register Service
    c.agent.service.register('upload-image',
                            service_id='upload-image',
                            address='172.20.0.7',
                            port=5000,
                            tags=['upload'])
    app.run(host='0.0.0.0',port = 5000) 
    
