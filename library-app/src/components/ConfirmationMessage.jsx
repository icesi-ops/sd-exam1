// ConfirmationMessage.js
import React from 'react';

function ConfirmationMessage({ onConfirm, onCancel }) {
  return (
    <div>
      <p>¿Estás seguro de que deseas eliminar este libro?</p>
      <button onClick={onConfirm}>Sí</button>
      <button onClick={onCancel}>No</button>
    </div>
  );
}

export default ConfirmationMessage;