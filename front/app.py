from flask import Flask, request, render_template
import requests

app = Flask(__name__, template_folder='template')

@app.route("/")
def hello():
    return "Hello world!"

@app.route("/upload-image", methods=["GET", "POST"])
def upload():

    if request.method == "POST":
        test_url = "http://127.0.0.1:5010/upload-image"
        image = request.files

        test_response = requests.post(test_url, files = image)

    
    return render_template("upload_image.html")


if __name__ == "__main__":
    app.run(host='127.0.0.1',port = 5000)
