import React from 'react';
import { Button, Input } from "@nextui-org/react";

function FileChooser({ onFileSelected }) {
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && selectedFile.name.endsWith('.pdf')) {
      onFileSelected(selectedFile);

      // Crear un objeto FormData para enviar el archivo al backend
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        // Realizar la solicitud al endpoint del backend
        const response = await fetch('http://127.0.0.1:5000/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
        } else {
          console.error('Error en la carga del archivo:', response.statusText);
        }
      } catch (error) {
        console.error('Error en la carga del archivo:', error);
      }
    } else {
      alert('Por favor, selecciona un archivo PDF.');
    }
  };

  const handleFileButtonClick = () => {
    document.querySelector('input[type="file"]').click();
  };

  return (
    <div>
      <div style={{ display: 'none' }}>
        <Input type="file" accept=".pdf" onChange={handleFileChange} style={{ width: 0, height: 0, opacity: 0, overflow: 'hidden', position: 'absolute', zIndex: -1 }} />
      </div>
      <Button type="button" onClick={handleFileButtonClick}>
        Seleccionar Archivo
      </Button>
    </div>
  );
}

export default FileChooser;
