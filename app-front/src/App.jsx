import React, { useState, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';
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
    console.log('useEffect');
    fetchUploadedFiles();
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Por favor selecciona un archivo');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('name', selectedFile.name);
    formData.append('size', String(selectedFile.size));
    formData.append('type', selectedFile.type);

    for (var pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]);
    }



    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=--${Date.now().toString()}`,
        },
        body: formData,
      });

      console.log('Respuesta del servidor:', response);

      if (response.ok) {
        fetchUploadedFiles();

      } else {
        alert('Error al enviar archivo al servidor');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch(`${API_URL}/api/books`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },

      });
      if (!response.ok) {
        console.error('Error al obtener archivos del servidor');
        return;
      }
      const data = await response.json();
      if (Array.isArray(data)){
        setUploadedFiles(data);
      }

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
