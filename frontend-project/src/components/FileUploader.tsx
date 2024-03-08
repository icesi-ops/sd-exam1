import React, { useState } from 'react';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelected }) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      onFileSelected(file);
      setSelectedFile(file);
      setFileName(file.name);
      setShowSuccessMessage(true);

      // Oculta automáticamente el mensaje después de 2 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    }
  };

  const handleSaveFile = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await fetch('http://127.0.0.1:5000/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          console.log('Archivo enviado al backend correctamente.');

          // Muestra una notificación al usuario
          if ('Notification' in window) {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                new Notification('Éxito', {
                  body: 'El archivo se ha enviado al backend correctamente.',
                });
              }
            });
          }
        } else {
          console.error('Error al enviar el archivo al backend.');
        }
      } catch (error) {
        console.error('Error en la llamada al backend:', error);
      }

      // Limpiar el estado después de guardar el archivo
      setFileName(null);
    }
  };

  return (
    <div>
      <input
        id="file-input"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button onClick={() => document.getElementById('file-input')?.click()} className="file-upload-button">
        Seleccionar Archivo
      </button>
      {showSuccessMessage && <p>PDF seleccionado con éxito</p>}
      {fileName && (
        <div>
          <p>Archivo seleccionado: {fileName}</p>
          <button onClick={handleSaveFile}>Guardar Archivo</button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
