// src/components/FileList.tsx
import React, { useState, useEffect } from 'react';
import '../assets/FileList.css';  // Adjusted import path based on your project structure



interface FileListProps {
  onFileSelected: (file: File) => void;
}

const FileList: React.FC<FileListProps> = ({ }) => {
  const [showList, setShowList] = useState(false);
  const [pdfList, setPdfList] = useState<string[]>([]);

  const toggleList = () => {
    setShowList(!showList);
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
    if (showList) {
      getPdfList();
    }
  }, [showList]);

  return (
    <div className="file-list-container">
      <button onClick={toggleList} className="toggle-list-button">
        {showList ? 'Ocultar Lista' : 'Mostrar Lista'}
      </button>

      {showList && (
        <div>
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

export default FileList;
