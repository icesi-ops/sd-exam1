import React, { useState, useEffect } from 'react';
import './App.css';
import FileUploader from './components/FileUploader';

const App: React.FC = () => {
  const [showLibrary, setShowLibrary] = useState(false);
  const [pdfList, setPdfList] = useState<string[]>([]);

  const toggleLibrary = () => {
    setShowLibrary(!showLibrary);
  };

  const handleFileSelected = (file: File) => {
    // Lógica para manejar el archivo seleccionado, si es necesario
    console.log('Archivo seleccionado:', file.name);
  };

  const getPdfList = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/get_pdf_list');
      if (response.ok) {
        const data = await response.json();
        setPdfList(data.pdfList);
      } else {
        console.error('Error al obtener la lista de archivos PDF.');
      }
    } catch (error) {
      console.error('Error en la llamada al backend:', error);
    }
  };

  useEffect(() => {
    if (showLibrary) {
      getPdfList();
    }
  }, [showLibrary]);

  return (
    <div className="container">
      <h1>Bienvenido a la biblioteca Luchops & Danilops</h1>
      <p>Esta biblioteca te permite guardar libros y consultar los que ya se encuentran.</p>

      <FileUploader onFileSelected={handleFileSelected} />

      <div className="separation-text">
        <p>Da click abajo para ver los libros que se encuentran almacenados</p>
      </div>

      <button onClick={toggleLibrary}>
        {showLibrary ? 'Ocultar Biblioteca' : 'Mostrar Biblioteca'}
      </button>

      {showLibrary && (
        <div>
          <p>Lista de libros:</p>
          <ul>
            {pdfList.map((pdf, index) => (
              <li key={index}>{pdf}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
