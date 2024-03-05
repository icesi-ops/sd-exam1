// BookList.js
import React from 'react';

function BookList({ books, onEdit, onDelete }) {
  return (
    <ul>
      {books.map(book => (
        <li key={book.id}>
          <div>{book.title}</div>
          <div>{book.author}</div>
          <div>{book.year}</div>
          <button onClick={() => onEdit(book)}>Editar</button>
          <button onClick={() => onDelete(book)}>Eliminar</button>
        </li>
      ))}
    </ul>
  );
}

export default BookList;