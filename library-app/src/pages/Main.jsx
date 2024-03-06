import { useState } from 'react'
import FileChooser from '../components/FileChooser.jsx';
import BookTable from '../components/Table.jsx';

function App() {
  // Define una función de manejo de envío de formulario
  const handleSubmit = (newBook) => {
    // Aquí puedes manejar la lógica de lo que quieres hacer con los datos del libro
    console.log('Nuevo libro:', newBook);
  };

  // Define los valores iniciales para el formulario
  const initialValues = {
    title: '',
    author: '',
    year: ''
  };

  // State para almacenar el archivo seleccionado
  const [selectedFile, setSelectedFile] = useState(null);

  // Función de manejo para el archivo seleccionado
  const handleFileSelected = (file) => {
    setSelectedFile(file);
  };

  return (
      <BookTable />
  );
}

export default App;