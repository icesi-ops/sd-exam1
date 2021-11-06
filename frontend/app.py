from flask import Flask
from flask import render_template, request, redirect
import requests

app = Flask(__name__)

@app.route("/")
def hello():
  fetched = requests.get('https://dog.ceo/api/breeds/image/random')
  files = [{'name':'asds','type':'mp3','path':'sdadas'},{'name':'2','type':'png','path':'asaaaa'}]
  print(fetched)
  return (render_template("index.html", files=files))

@app.route("/upload", methods=['POST'])
def upload():
  print(request.__dict__)
  return redirect('/')


if __name__ == "__main__":
  app.run(debug=True)