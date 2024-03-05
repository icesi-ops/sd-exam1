from flask import Flask, request, jsonify
from smb.SMBConnection import SMBConnection

app = Flask(__name__)

# Configuración del servidor Samba
'''
samba_config = {
    'server': 'tu_servidor_samba',
    'share': 'tu_share',
    'username': 'tu_usuario',
    'password': 'tu_contraseña',
    'domain': 'tu_dominio',
}
'''

def upload_to_samba(file_stream, remote_file_name):
    try:
        '''
        # Conexión al servidor Samba
        conn = SMBConnection(**samba_config)
        conn.connect(samba_config['server'], 445)

        # Carga el contenido del archivo en el servidor Samba
        conn.storeFile(samba_config['share'], remote_file_name, file_stream)

        # Cierra la conexión
        conn.close()

        return True
    except Exception as e:
        print(f"Error al cargar el archivo en Samba: {str(e)}")
        return False
        '''
        # Simulando carga en el servidor Samba
        print(f"Simulando carga del archivo {remote_file_name} en el servidor Samba")
        return True
    except Exception as e:
        print(f"Error al simular la carga del archivo en Samba: {str(e)}")
        return False


@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        print(request.files)
        file = request.files['file']
        print(file.filename)
        print(request.headers)

        # Sube el archivo directamente a Samba
        if upload_to_samba(file.stream, file.filename):
            return jsonify({'message': 'Archivo cargado y almacenado en Samba exitosamente'}), 200
        else:
            return jsonify({'error': 'Error al cargar el archivo en Samba'}), 500

    except Exception as e:
        print(f"Error en la aplicación: {str(e)}")  # Agregamos esta línea para imprimir el error en la consola
        return jsonify({'error': 'Error interno del servidorr'}), 500

if __name__ == '__main__':
    app.run(debug=True)

