
'''
app = Flask(__name__)

# Configuración del servidor Samba

samba_config = {
    'server': 'tu_servidor_samba',
    'share': 'tu_share',
    'username': 'tu_usuario',
    'password': 'tu_contraseña',
    'domain': 'tu_dominio',
}


def upload_to_samba(file_stream, remote_file_name):
    try:
        # Configuración del servidor Samba
        samba_config = {
            'server_name': '127.0.0.1',
            'share_name': 'centralized_storage',
            'username': 'backend_user',
            'password': 'password1',  # Contraseña del usuario backend_user
            'domain_name': 'WORKGROUP',
        }

        # Crea la conexión SMB
        conn = SMBConnection(samba_config['username'],
                             samba_config['password'],
                             'backend_client',  # Nombre del cliente
                             samba_config['server_name'],
                             use_ntlm_v2=True,
                             domain=samba_config['domain_name'],
                             is_direct_tcp=True)

        conn.connect(samba_config['server_name'], 445)  # Conéctate al servidor Samba

        # Configura la ruta del archivo remoto
        
        remote_file_path = f'/{remote_file_name}'

        # Sube el contenido del archivo al servidor Samba
        conn.storeFile(samba_config['share_name'], remote_file_path, file_stream)
        print(f"Ruta completa del archivo local: {os.path.abspath(file_stream.name)}")
        print(f"Tamaño del archivo local: {os.path.getsize(file_stream.name)} bytes")
        # Cierra la conexión
        conn.close()

        return True
    except Exception as e:
        print(f"Error al cargar el archivo en Samba: {str(e)}")
        return False


@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        print(request.files)
        file = request.files['file']
        print(file.filename)
        print(request.headers)

        # Verifica si file.content_type es 'application/pdf' o el tipo de archivo adecuado
        if file.content_type == 'application/pdf':
            # Obtiene el contenido del archivo usando request.get_data()
            file_content = request.get_data()

            # Sube el archivo directamente a Samba
            if upload_to_samba(file_content, file.filename):
                return jsonify({'message': 'Archivo cargado y almacenado en Samba exitosamente'}), 200
            else:
                return jsonify({'error': 'Error al cargar el archivo en Samba'}), 500
        else:
            return jsonify({'error': 'Tipo de archivo no admitido'}), 400

    except Exception as e:
        print(f"Error en la aplicación: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

if __name__ == '__main__':
    app.run(debug=True)


app = Flask(__name__)

def save_file_locally(file_content, local_file_path):
    try:
        with open(local_file_path, 'wb') as local_file:
            local_file.write(file_content)
        return True
    except Exception as e:
        print(f"Error al guardar el archivo localmente: {str(e)}")
        return False
    
@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        print(request.files)
        file = request.files['file']
        print(file.filename)
        print(request.headers)

        # Verifica si file es None
        if file is not None:
            # Lee el contenido del archivo
            file_content = file.read()

            # Guarda el archivo localmente en la carpeta especificada
            local_file_path = '/home/dani/Distribuidos/storage_data/' + file.filename
            if save_file_locally(file_content, local_file_path):
                return jsonify({'message': 'Archivo cargado y almacenado localmente exitosamente'}), 200
            else:
                return jsonify({'error': 'Error al guardar el archivo localmente'}), 500
        else:
            return jsonify({'error': 'El archivo no se ha recibido correctamente'}), 400

    except Exception as e:
        print(f"Error en la aplicación: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

if __name__ == '__main__':
    app.run(debug=True)



app = Flask(__name__)

def save_file_locally(file_content, local_file_path):
    try:
        with open(local_file_path, 'wb') as local_file:
            local_file.write(file_content)
        return True
    except Exception as e:
        print(f"Error al guardar el archivo localmente: {str(e)}")
        return False
    
def upload_to_samba(local_file_path, remote_file_name):
    try:
        # Configuración del servidor Samba
        samba_config = {
            'server_name': '127.0.0.1',
            'share_name': 'centralized_storage',
            'username': 'backend_user',
            'password': 'password1',  # Contraseña del usuario backend_user
            'domain_name': 'WORKGROUP',
        }

        # Crea la conexión SMB
        conn = SMBConnection(samba_config['username'],
                             samba_config['password'],
                             'backend_client',  # Nombre del cliente
                             samba_config['server_name'],
                             use_ntlm_v2=True,
                             domain=samba_config['domain_name'],
                             is_direct_tcp=True)

        conn.connect(samba_config['server_name'], 445)  # Conéctate al servidor Samba

        # Configura la ruta del archivo remoto
        remote_file_path = f'/{samba_config["share_name"]}/{remote_file_name}'

        # Sube el contenido del archivo al servidor Samba
        with open(local_file_path, 'rb') as local_file:
            conn.storeFile(samba_config['share_name'], remote_file_path, local_file)

        # Cierra la conexión
        conn.close()

        return True
    except Exception as e:
        print(f"Error al cargar el archivo en Samba: {str(e)}")
        return False

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        print(request.files)
        file = request.files['file']
        print(file.filename)
        print(request.headers)

        # Verifica si file es None
        if file is not None:
            # Lee el contenido del archivo
            file_content = file.read()

            # Guarda el archivo localmente
            local_file_path = '/home/dani/Distribuidos/storage_data/' + file.filename
            if save_file_locally(file_content, local_file_path):
                # Sube el archivo a Samba
                if upload_to_samba(local_file_path, file.filename):
                    return jsonify({'message': 'Archivo cargado y almacenado en Samba exitosamente'}), 200
                else:
                    return jsonify({'error': 'Error al cargar el archivo en Samba'}), 500
            else:
                return jsonify({'error': 'Error al guardar el archivo localmente'}), 500
        else:
            return jsonify({'error': 'El archivo no se ha recibido correctamente'}), 400

    except Exception as e:
        print(f"Error en la aplicación: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500
if __name__ == '__main__':
    app.run(debug=True)


'''
import os
from flask import Flask, request, jsonify
from smb.SMBConnection import SMBConnection
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route('/health')
def health():
    # Lógica de verificación de salud (puedes personalizar según tus necesidades)
    return "OK", 200
# Configuración del servidor Samba

samba_config = {
    'server_name': 'sambadb',  # Cambiado de 'server_name' a 'host'
    'share': 'centralized_storage',
    'username': 'backend_user',
    'password': 'password1',
    'domain_name': 'WORKGROUP',
}

def upload_to_samba(file_stream, remote_file_name):
    try:
        
        # Conexión al servidor Samba
        
               # Crea la conexión SMB
        conn = SMBConnection(samba_config['username'],
                             samba_config['password'],
                             'backend_user',  # Nombre del cliente
                             samba_config['server_name'],
                             use_ntlm_v2=True,
                             domain=samba_config['domain_name'],
                             is_direct_tcp=True)
        conn.connect(samba_config['server_name'], 445)

        # Carga el contenido del archivo en el servidor Samba
        conn.storeFile(samba_config['share'], remote_file_name, file_stream)

        # Cierra la conexión
        conn.close()

        return True
    except Exception as e:
        print(f"Error al cargar el archivo en Samba: {str(e)}")
        return False
        
    
def save_file_locally(file_stream, local_file_path):
    try:
        # Save the file locally
        with open(local_file_path, 'wb') as local_file:
            local_file.write(file_stream.read())
        return True
    except Exception as e:
        print(f"Error saving the file locally: {str(e)}")
        return False    

@app.route('/get_pdf_list', methods=['GET'])
def get_pdf_list():
    try:
        # Conexión al servidor Samba
        conn = SMBConnection(samba_config['username'],
                             samba_config['password'],
                             'backend_user',
                             samba_config['server_name'],
                             use_ntlm_v2=True,
                             domain=samba_config['domain_name'],
                             is_direct_tcp=True)
        conn.connect(samba_config['server_name'], 445)

        # Listar archivos PDF en la carpeta compartida del servidor Samba
        pdf_list = [file.filename for file in conn.listPath(samba_config['share'], '/')]
        pdf_list = [pdf for pdf in pdf_list if pdf.endswith('.pdf')]

        # Cierra la conexión
        conn.close()

        return jsonify({'pdfList': pdf_list}), 200
    except Exception as e:
        print(f"Error al obtener la lista de archivos PDF desde Samba: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500
    
    
@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        print(request.files)
        file = request.files['file']
        print(file.filename)
        print(request.headers)


        # Sube el archivo directamente a Samba
        if upload_to_samba(file.stream, file.filename):
            pdf_list = get_pdf_list()
            return jsonify({'message': 'Archivo cargado y almacenado en Samba exitosamente'}), 200
        else:
            return jsonify({'error': 'Error al cargar el archivo en Samba'}), 500

        '''
        local_file_path = f'/home/dani/Distribuidos/storage_data/{file.filename}'

        # Save the file locally
        if save_file_locally(file.stream, local_file_path):
            return jsonify({'message': f'Archivo guardado localmente en {local_file_path}'}), 200
        else:
            return jsonify({'error': 'Error al guardar el archivo localmente'}), 500
        '''

    except Exception as e:
        print(f"Error en la aplicación: {str(e)}")  # Agregamos esta línea para imprimir el error en la consola
        return jsonify({'error': 'Error interno del servidorr'}), 500

if __name__ == '__main__':
    os.environ['FLASK_ENV'] = 'production'
    app.run(debug=True, port=5000 ,host='0.0.0.0')