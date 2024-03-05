import React, { useState } from 'react';
import '../assets/FileChooser.css';

function FileChooser({ onFileSelected }) {
    // Función para manejar la selección de archivo
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        // Verifica si se ha seleccionado un archivo y si su extensión es PDF
        if (selectedFile && selectedFile.name.endsWith('.pdf')) {
          onFileSelected(selectedFile); // Llama a la función de manejo de archivo seleccionado
        } else {
          // Muestra un mensaje de error si el archivo seleccionado no es un PDF
          alert('Por favor, selecciona un archivo PDF.');
        }
      };
    
      // Función para activar el evento de clic en el botón de selección de archivo invisible
      const handleFileButtonClick = () => {
        document.querySelector('input[type="file"]').click();
      };
    
      return (
        <div>
          {/* Input de tipo file oculto */}
          <input type="file" accept=".pdf" onChange={handleFileChange} style={{ width: 0, height: 0, opacity: 0, overflow: 'hidden', position: 'absolute', zIndex: -1 }} />
          {/* Botón personalizado para cargar el archivo */}
          <button type="button" onClick={handleFileButtonClick}>
            Seleccionar Archivo
          </button>
        </div>
      );
  }
  
  export default FileChooser;