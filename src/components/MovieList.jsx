// src/components/MovieList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_KEY = 'd646e054c1823c4ffb54373b69954e66'; 
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        // RF01: Busca os filmes "Em Alta" (Trending)
        const response = await axios.get(
          `${API_URL}/trending/movie/week?api_key=${API_KEY}&language=pt-BR`
        );
        setMovies(response.data.results);
        setError(null);
      } catch (err) {
        setError('Falha ao buscar filmes. Verifique a chave da API.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Carregando filmes em alta...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>Erro: {error}</div>;
  }

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h2>Filmes Populares desta Semana</h2>
      <div className="movie-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {movies.map((movie) => (
          <Link key={movie.id} to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="movie-card" style={{ width: '200px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
              <img
                src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                alt={movie.title}
                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
              />
              <div style={{ padding: '10px' }}>
                <h3 style={{ fontSize: '1em', margin: '5px 0' }}>{movie.title}</h3>
                <p style={{ fontSize: '0.8em', margin: '0' }}>Avaliação: {movie.vote_average.toFixed(1)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieList;