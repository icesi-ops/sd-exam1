
import React, { useState } from 'react';
import '../assets/FileChooser.css';
import FileChooser from './FileChooser'; // Importamos el componente FileChooser

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);

  // Función para manejar la selección de archivo
  const handleFileSelected = (file) => {
    console.log(selectedFile)
    setSelectedFile(file);
  };

  return (
    <div>
      <h2>Bienvenido a My Library App</h2>
      <p>Esta es una aplicación para gestionar tu biblioteca personal.</p>
      <p>Puedes agregar nuevos libros, y ver los libros existentes!</p>

      {/* Renderizamos el componente FileChooser y le pasamos la función de manejo */}
      <FileChooser onFileSelected={handleFileSelected} />

      {/* Muestra el nombre del archivo seleccionado */}
      {selectedFile && <p>Archivo seleccionado: {selectedFile.name}</p>}
    </div>
  );
}


export default Home;