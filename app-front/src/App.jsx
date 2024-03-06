import React, { useState, useEffect } from 'react';
import { API_URL } from "./config/constants.js";
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (event) => {
    console.log(event)
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Por favor selecciona un archivo');
      return;
    }

    console.log('Archivo seleccionado:', selectedFile);
    const newFile = {
      name: selectedFile.name,
      size: String(selectedFile.size),
      type: selectedFile.type,
    };
    console.log('Archivo a enviar:', newFile)
    console.log(JSON.stringify(newFile))

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFile),
      });

      console.log('Respuesta del servidor:', response);

      if (response.ok) {
        console.log('Archivo enviado con éxito al servidor');
        fetchUploadedFiles();
      } else {
        console.error('Error al enviar archivo al servidor');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch(`${API_URL}/api/books`);
      if (!response.ok) {
        console.error('Error al obtener archivos del servidor');
        return;
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
          <button onClick={handleSubmit}>Enviar Archivo</button>
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