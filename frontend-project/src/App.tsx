// src/App.tsx
import React, { useState } from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import FileList from './components/FileList';

const App: React.FC = () => {
  const [showLibrary] = useState(false);


  const handleFileSelected = (file: File) => {
    // Lógica para manejar el archivo seleccionado, si es necesario
    console.log('Archivo seleccionado:', file.name);
  };

  return (
    <div className="container">
      <h1>Bienvenido a la biblioteca Luchops & Danilops</h1>
      <p>Esta biblioteca te permite guardar libros y consultar los que ya se encuentran.</p>

      <FileUploader onFileSelected={handleFileSelected} />
      

      <div className="separation-text">
        <p>Da click abajo para ver los libros que se encuentran almacenados</p>
      </div>
      <FileList onFileSelected={handleFileSelected} />
   

      {showLibrary && (
        <div>
          {/* Otra lógica para mostrar la lista de libros en el contenedor principal */}
        </div>
      )}
    </div>
  );
};

export default App;
