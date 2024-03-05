import React, { useState, useEffect } from 'react';
import {API_URL} from "./config/constants.js";
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (selectedFile) {

      console.log('Archivo seleccionado:', selectedFile);
      const newFile = {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      };

      try {
        const response = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Tipo de contenido JSON
          },
          body: JSON.stringify(newFile),
        });

        if (response.ok) {
          console.log('Archivo enviado con éxito al servidor');
          fetchUploadedFiles();

        } else {
          console.error('Error al enviar archivo al servidor');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }

    } else {
      alert('Por favor selecciona un archivo');
    }
  };


  // Cargar la lista de archivos al cargar la página
  useEffect(() => {
    fetchUploadedFiles();
  }, []); // Empty array as the dependency to run once on component mount


  const fetchUploadedFiles = async () => {
    try {
        const response = await fetch(`${API_URL}/api/books`);
        if (!response.ok) {
          console.error(('Error al obtener archivos del servidor'));
        }
        const data = await response.json();
        setUploadedFiles(data);
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
    }
};


  return (
    <div className="App">
      <h1>Sube tu archivo</h1>
      <div className="card">
        <input type="file" onChange={handleFileChange} />
      </div>
      <div className="table-container">
        <h2>Archivos cargados</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tamaño (bytes)</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.map((file, index) => (
              <tr key={index}>
                <td>{file.name}</td>
                <td>{file.size}</td>
                <td>{file.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
