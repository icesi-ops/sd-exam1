// BookDetail.js
import React from 'react';

function BookDetail({ book }) {
  return (
    <div>
      <h2>{book.title}</h2>
      <p>Autor: {book.author}</p>
      <p>Año de Publicación: {book.year}</p>
    </div>
  );
}

export default BookDetail;