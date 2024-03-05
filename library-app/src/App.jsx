import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import RegistroDatos from './components/RegistroDatos';
import Home from './components/Home.jsx';

import './assets/App.css'

function App() {

  return (
    <Router>
      <div>
        <nav className="navbar">
          <ul>
            <Link to="/registro-datos">Libros Guardados</Link>
            <br></br>
            <Link to="/">Elegir Libro A Guardar</Link>
          </ul>
        </nav>

        {/* Define las rutas */}
        <Routes>
          <Route path="/registro-datos" element={<RegistroDatos />} />
          <Route path="/" element={<Home />} />
        </Routes>

        

        <br />

        
      </div>
    </Router>
  );
}

export default App;
