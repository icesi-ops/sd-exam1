from flask import Flask, request, render_template
import requests

app = Flask(__name__, template_folder='template')

@app.route("/")
def hello():
    return "Hello world!"

@app.route("/upload-image", methods=["GET", "POST"])
def upload():
    
    return render_template("upload_image.html")

if __name__ == "__main__":
    app.run(host='0.0.0.0',port = 5000)
