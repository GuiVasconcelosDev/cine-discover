// src/components/SearchPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_KEY = 'd646e054c1823c4ffb54373b69954e66'; 
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (query.trim() === '') {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // RF02: Chamada ao endpoint de busca
      const response = await axios.get(
        `${API_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${query}`
      );

      // Filtra resultados sem poster
      const filteredResults = response.data.results.filter(
        (item) => item.poster_path && item.media_type !== 'person'
      );
      setResults(filteredResults);
    } catch (err) {
      setError('Falha ao buscar. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container" style={{ padding: '20px' }}>
      <form onSubmit={handleSearch} style={{ marginBottom: '30px', textAlign: 'center' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busque por título de filme ou série..."
          style={{ width: '80%', padding: '10px', fontSize: '1.2em', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px 20px', fontSize: '1.2em', marginLeft: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Buscar
        </button>
      </form>

      {loading && <div style={{ textAlign: 'center' }}>Carregando resultados...</div>}
      {error && <div style={{ color: 'red', textAlign: 'center' }}>Erro: {error}</div>}

      <div className="results-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {results.map((movie) => (
          <Link key={movie.id} to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="movie-card" style={{ width: '200px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
              <img
                src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                alt={movie.title}
                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
              />
              <div style={{ padding: '10px' }}>
                <h3 style={{ fontSize: '1em', margin: '5px 0' }}>{movie.title || movie.name}</h3>
                <p style={{ fontSize: '0.8em', margin: '0' }}>Avaliação: {movie.vote_average.toFixed(1)}</p>
              </div>
            </div>
          </Link>
        ))}
        
        {!loading && !error && query.trim() !== '' && results.length === 0 && (
          <p style={{ marginTop: '50px' }}>Nenhum resultado encontrado para "{query}".</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;