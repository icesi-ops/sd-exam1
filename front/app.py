from flask import Flask, request, render_template
from threading import Thread
import requests
import consul
import socket

app = Flask(__name__, template_folder='template')

SERVICE_ADDRESS = socket.gethostbyname(socket.gethostname())

@app.route("/")
def hello():
    response = requests.get("http://backapp:5010/images")
    sambaList = response.text.split('\n')
    return str(sambaList)

@app.route("/upload-image", methods=["GET", "POST"])
def upload():
    return render_template("upload_image.html")

def register():
    c = consul.Consul(host='consul', port=8500)
    c.agent.service.register(
        name='upload-image',
        service_id='upload-image' + SERVICE_ADDRESS[len(SERVICE_ADDRESS)-1],
        tags=['upload'],
        address=SERVICE_ADDRESS,
        port=5000)

if __name__ == "__main__":
    # Register Service
    register()
    app.run(host='0.0.0.0',port = 5000) 
    
