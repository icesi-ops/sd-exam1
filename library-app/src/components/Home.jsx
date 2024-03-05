import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link de React Router

function Home() {
  return (
    <div>
      {/* Botón de navegación */}
      <Link to="/registro-datos">Ir a Registro de Datos</Link>
    </div>
  );
}

export default Home;