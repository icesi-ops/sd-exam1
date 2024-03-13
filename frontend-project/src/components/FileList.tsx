import React, { useState, useEffect } from 'react';
import '../assets/FileList.css';  // Ajusta la importación de CSS según la estructura de tu proyecto

interface FileListProps {}

const FileList: React.FC<FileListProps> = () => {
  const [showList, setShowList] = useState(false);
  const [pdfList, setPdfList] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  const toggleList = () => {
    setShowList(!showList);
    setSelectedFile(null); // Restablecer el archivo seleccionado cuando se oculta la lista
    setMessage(''); // Limpiar el mensaje cuando se oculta la lista
  };

  const getPdfList = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/get_pdf_list');
      if (response.ok) {
        const data = await response.json();
        setPdfList(data.pdfList);
      } else {
        setMessage('Error al obtener la lista de archivos PDF.');
      }
    } catch (error) {
      setMessage('Error en la llamada al backend.');
    }
  };

  const handleFileClick = (filename: string) => {
    setSelectedFile(filename);
    setMessage(`Archivo seleccionado: ${filename}`);
  };

  const handleDeleteClick = async () => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('filename', selectedFile);
  
        const response = await fetch('http://127.0.0.1:5000/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Establece el tipo de contenido como JSON
          },
          body: JSON.stringify({ filename: selectedFile }), // Convierte los datos a JSON
        });
  
        if (response.ok) {
          setMessage(`Archivo ${selectedFile} eliminado correctamente.`);
          setSelectedFile(null);
          getPdfList();
        } else {
          setMessage(`Error al eliminar el archivo ${selectedFile}.`);
        }
      } catch (error) {
        console.error('Error en la llamada al backend:', error);
        setMessage('Error interno del servidor.');
      }
    }
  };
  
  const handleUpdateClick = async () => {
    const newFileName = prompt('Ingrese el nuevo nombre del archivo:');
    if (newFileName && selectedFile) {
      // Verificar si el nuevo nombre tiene la extensión ".pdf"
      if (!newFileName.endsWith('.pdf')) {
        setMessage('El nuevo nombre del archivo debe tener la extensión ".pdf".');
        return; // Detener la ejecución si no cumple con la validación
      }
  
      try {
        const formData = new FormData();
        formData.append('current_filename', selectedFile);
        formData.append('new_filename', newFileName);
  
        const response = await fetch('http://127.0.0.1:5000/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Establece el tipo de contenido como JSON
          },
          body: JSON.stringify({
            current_filename: selectedFile,
            new_filename: newFileName,
          }), // Convierte los datos a JSON
        });
  
        if (response.ok) {
          setMessage(`Archivo ${selectedFile} actualizado a ${newFileName} exitosamente.`);
          setSelectedFile(newFileName); // Actualizar el nombre del archivo seleccionado en el estado
          getPdfList(); // Actualizar la lista de PDF después de la actualización
        } else {
          setMessage(`Error al actualizar el archivo ${selectedFile}.`);
        }
      } catch (error) {
        setMessage('Error interno del servidor.');
      }
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
              <li key={index} onClick={() => handleFileClick(pdf)}>
                {pdf}
              </li>
            ))}
          </ul>
        </div>
      )}

      {message && <p>{message}</p>}

      {selectedFile && (
        <div className="action-buttons">
          <button onClick={handleDeleteClick} className="delete-button">
            Eliminar
          </button>
          <button onClick={handleUpdateClick} className="update-button">
            Actualizar
          </button>
        </div>
      )}
    </div>
  );
};

export default FileList;

