# Importamos todo lo necesario
import os
from flask import Flask, render_template, request
from werkzeug.utils import secure_filename

# instancia del objeto Flask
app = Flask(__name__)
# Carpeta de subida
app.config['UPLOAD_FOLDER'] = './subidos'

@app.route("/")
def upload_file():
 # renderiamos la plantilla "formulario.html"
 return render_template('index.j2')

@app.route("/upload", methods=['POST'])
def uploader():
 if request.method == 'POST':
  # obtenemos el archivo del input "archivo"
  f = request.files['archivo']
  filename = secure_filename(f.filename)
  # Guardamos el archivo en el directorio "Archivos PDF"
  f.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
  # Retornamos una respuesta satisfactoria
  return "<h1>Archivo subido exitosamente</h1>"

if __name__ == '__main__':
 # Iniciamos la aplicación
 app.run(host="0.0.0.0", port="80")
