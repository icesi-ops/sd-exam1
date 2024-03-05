import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import BookForm from './components/BookForm.jsx';
import BookList from './components/BookList.jsx';
import BookDetail from './components/BookDetail.jsx';
import ConfirmationMessage from './components/ConfirmationMessage.jsx';


import './App.css'

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

  return (
    <div>
      <h1>My Library App</h1>
      {/* Renderiza el componente BookForm y pasa la función handleSubmit y los valores iniciales como props */}
      <BookForm onSubmit={handleSubmit} initialValues={initialValues} />
    </div>
  );
}

export default App;





