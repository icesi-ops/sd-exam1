import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    handleSubmit();
  };

  const handleSubmit = () => {
    if (selectedFile) {
      // Simulación del archivo cargado
      const newFile = {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      };
      setUploadedFiles([...uploadedFiles, newFile]);
      console.log('Archivo seleccionado:', selectedFile);
    } else {
      alert('Por favor selecciona un archivo');
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
