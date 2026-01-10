// src/App.jsx

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import ActorDetails from './components/ActorDetails';
import DiscoveryPage from './components/DiscoveryPage';
import SearchPage from './components/SearchPage';
import './App.css';

function App() {
  return (
    <>
      <header>
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          <h1>CineDiscover</h1>
        </Link>
        <nav>
          <Link to="/" style={{ color: 'white', margin: '0 15px', textDecoration: 'none' }} class="cx" id="caixa1">Home</Link>
          <Link to="/search" style={{ color: 'white', margin: '0 15px', textDecoration: 'none' }} class="cx" id="caixa2">Buscar</Link>
          <Link to="/discover" style={{ color: 'white', margin: '0 15px', textDecoration: 'none' }} class="cx" id="caixa3">Descobrir</Link>
        </nav>
      </header>

      <main>
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