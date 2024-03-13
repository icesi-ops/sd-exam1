// src/App.tsx
import React from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import FileList from './components/FileList';

const App: React.FC = () => {
  const handleFileSelected = (file: File) => {
    // Lógica para manejar el archivo seleccionado
    console.log('Archivo seleccionado:', file.name);
  };

  return (
    <div className="container">
      <h1>Bienvenido a la biblioteca Luchops & Danilops</h1>
      <p>Esta biblioteca te permite guardar libros y consultar los que ya se encuentran.</p>

      {/* Pasamos la función handleFileSelected como prop a FileUploader */}
      <FileUploader onFileSelected={handleFileSelected} />

      <div className="separation-text">
        <p>Da click abajo para ver los libros que se encuentran almacenados</p>
      </div>
      <FileList />
    </div>
  );
};

export default App;
