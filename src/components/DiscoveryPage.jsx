// src/components/DiscoveryPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_KEY = 'd646e054c1823c4ffb54373b69954e66'; 
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const DiscoveryPage = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Busca a lista de géneros (para popular o dropdown)
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`
        );
        setGenres(response.data.genres);
      } catch (err) {
        console.error('Falha ao buscar géneros:', err);
      }
    };
    fetchGenres();
  }, []);

  // 2. Busca os filmes com base nos filtros (RF05)
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        let url = `${API_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&sort_by=${sortBy}&include_adult=false&include_video=false&page=1`;

        if (selectedGenre) {
          url += `&with_genres=${selectedGenre}`;
        }

        const response = await axios.get(url);
        setMovies(response.data.results);
      } catch (err) {
        setError('Falha ao aplicar filtros. Tente novamente mais tarde.');
        console.error(err)
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenre, sortBy]); // Roda sempre que o género ou a ordem mudam

  return (
    <div className="discovery-container" style={{ padding: '20px' }}>
      <h1>Página de Descoberta e Filtros</h1>
      
      {/* Controlo de Filtros */}
      <div style={{ marginBottom: '30px', display: 'flex', gap: '20px', alignItems: 'center', border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
        
        {/* Filtro por Género */}
        <label>
          Filtrar por Género:
          <select 
            value={selectedGenre} 
            onChange={(e) => setSelectedGenre(e.target.value)}
            style={{ padding: '10px', marginLeft: '10px', borderRadius: '5px' }}
          >
            <option value="">-- Todos os Géneros --</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
        </label>

        {/* Ordenação */}
        <label>
          Ordenar por:
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '10px', marginLeft: '10px', borderRadius: '5px' }}
          >
            <option value="popularity.desc">Mais Populares (Decrescente)</option>
            <option value="vote_average.desc">Melhor Avaliados (Decrescente)</option>
            <option value="primary_release_date.desc">Data de Lançamento (Recente)</option>
            <option value="title.asc">Título (A-Z)</option>
          </select>
        </label>
      </div>

      {loading && <div style={{ textAlign: 'center' }}>Carregando filmes com filtros...</div>}
      {error && <div style={{ color: 'red', textAlign: 'center' }}>Erro: {error}</div>}

      {/* Exibição dos Filmes */}
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

export default DiscoveryPage;