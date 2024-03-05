import React, { useState } from 'react';

function BookForm({ onSubmit, initialValues }) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [author, setAuthor] = useState(initialValues.author || '');
  const [year, setYear] = useState(initialValues.year || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, author, year });
    // Limpia los campos después de enviar el formulario
    setTitle('');
    setAuthor('');
    setYear('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Autor" value={author} onChange={(e) => setAuthor(e.target.value)} />
      <input type="text" placeholder="Año de Publicación" value={year} onChange={(e) => setYear(e.target.value)} />
      <button type="submit">Guardar</button>
    </form>
  );
}

export default BookForm;
