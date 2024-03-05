// BookDetail.js
import React from 'react';

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
        {/* Renderiza el componente BookDetail */}
        <BookDetail />
      </div>
    );
  }
  
  export default App;