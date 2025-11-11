// src/App.jsx

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import ActorDetails from './components/ActorDetails';
import DiscoveryPage from './components/DiscoveryPage';
import SearchPage from './components/SearchPage';
import './App.css'; // Opcional: Para estilos globais

function App() {
  return (
    <>
      <header style={{ backgroundColor: '#333', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Link para a Home/Página Inicial */}
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          <h1>CineDiscover</h1>
        </Link>
        <nav>
          <Link to="/" style={{ color: 'white', margin: '0 15px', textDecoration: 'none' }}>Home</Link>
          <Link to="/search" style={{ color: 'white', margin: '0 15px', textDecoration: 'none' }}>Buscar</Link>
          <Link to="/discover" style={{ color: 'white', margin: '0 15px', textDecoration: 'none' }}>Descobrir</Link>
        </nav>
      </header>

      <main>
        {/* Definição das Rotas */}
        <Routes>
          <Route path="/" element={<MovieList />} /> 
          <Route path="/search" element={<SearchPage />} /> 
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/actor/:id" element={<ActorDetails />} />
          <Route path="/discover" element={<DiscoveryPage />} />
          <Route path="*" element={<h2>404 - Página Não Encontrada</h2>} />
        </Routes>
      </main>
    </>
  );
}

export default App;