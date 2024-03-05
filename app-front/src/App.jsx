import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Función para obtener la lista de archivos cargados
  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/files');
      if (response.ok) {
        const data = await response.json();
        setUploadedFiles(data);
      } else {
        console.error('Error al obtener archivos del servidor');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  // Cargar la lista de archivos al cargar la página
  useEffect(() => {
    fetchUploadedFiles();
  }, []); // Empty array as the dependency to run once on component mount

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await fetch('http://localhost:8080/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          console.log('Archivo enviado con éxito al servidor');
          // Refetch the list of uploaded files after successful upload
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

  return (
    <div className="App">
      <h1>Sube tu archivo</h1>
      <div className="card">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleSubmit}>Subir archivo</button>
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
