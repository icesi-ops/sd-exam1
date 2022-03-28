from flask import Flask, render_template, request, redirect

import os

from werkzeug.utils import secure_filename

app = Flask(__name__)

app.config["IMAGE_UPLOADS"] = "/home/anamvgd/Documents/Parcial1_Distribuidos/app/static/img/uploads"
app.config["ALLOW_IMAGE_EXTENSIONS"] = ["PNG", "JPG", "JPEG", "GIF"]
app.config["MAX_IMAGE_FILESIZE"] = 50 * 1024 *1024

def allowed_image(filename):

    if not "." in filename:
        return False

    ext = filename.rsplit(".", 1)[1]
 
    if ext.upper() in app.config["ALLOW_IMAGE_EXTENSIONS"]:
        return True
    else:
        return False


def allowed_image_filesize(filesize):

    if int(filesize) <= app.config["MAX_IMAGE_FILESIZE"]:
        return True
    else:
        return False


@app.route("/upload-image")
def upload_image():

        if request.files:
            '''
            if not allowed_image_filesize(request.cookies.get("filesize")):
                print("File exceeded maximum size")
                return redirect(request.url)
            '''

            image = request.files["image"]

            if image.filename == "":
                print("Image must have a name")
                return redirect(request.url)

            if not allowed_image(image.filename):
                print("That image extension is not allowed")
                return redirect(request.url)
            
            else:
                filename = secure_filename(image.filename)
                
                image.save(os.path.join(app.config["IMAGE_UPLOADS"], filename))
            
            print("Image saved")

            return redirect(request.url)


if __name__ == '__main__':
    app.run(host='127.0.0.1',port=5010)