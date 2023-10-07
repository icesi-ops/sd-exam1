const express = require('express');
const fileUpload = require('express-fileupload');
const Docker = require('dockerode');

const app = express();
const docker = new Docker();

// Configurar middleware para subida de archivos
app.use(fileUpload());

// Ruta para recibir archivos del frontend
app.post('/upload', async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No se ha seleccionado ningún archivo.');
    }

    const archivo = req.files.archivo; // "archivo" es el nombre del campo del formulario

    // Conectar y enviar el archivo al contenedor de almacenamiento centralizado (Docker)
    const container = docker.getContainer('nombre_del_contenedor'); // Reemplaza con el nombre del contenedor de almacenamiento centralizado

    await container.putArchive(archivo.data, { path: '/ruta_en_el_contenedor' }); // Reemplaza con la ruta en el contenedor

    res.send('Archivo subido con éxito.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor.');
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
