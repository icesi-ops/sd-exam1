import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import BookForm from './components/BookForm.jsx';
import BookList from './components/BookList.jsx';
import ConfirmationMessage from './components/ConfirmationMessage.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FileChooser from './components/FileChooser.jsx';
import { Link } from 'react-router-dom';
import RegistroDatos from './components/RegistroDatos';
import Home from './components/Home.jsx';

import './assets/App.css'

/*function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}*/


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
    <Router>
      <div>
        <nav>
          <ul>
            
              <Link to="/registro-datos">Ir a Registro de Datos</Link>
            
          </ul>
        </nav>

        {/* Define las rutas */}
        <Routes>
          <Route path="/registro-datos" element={<RegistroDatos />} />
          
        </Routes>

        <div>
          <h1>My Library App</h1>
          {/* Renderiza el componente FileChooser y pasa la función de manejo para el archivo seleccionado */}
          <FileChooser onFileSelected={handleFileSelected} />

          {/* Muestra el nombre del archivo seleccionado */}
          {selectedFile && <p>Archivo seleccionado: {selectedFile.name}</p>}
        </div>

        <nav>
          <ul>
            
              <Link to="/home">Volver</Link>
            
          </ul>
        </nav>

        <Routes>
          <Route path="/home" element={<Home />} />
          
        </Routes>

      </div>
    </Router>
  );
}

export default App;