// src/components/MovieDetails.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // 👈 Hook para pegar o ID da URL

// ⚠️ USE A MESMA CHAVE QUE USOU EM MOVIELIST.JSX
const API_KEY = 'd646e054c1823d4ffb54373b69954e66'; 
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'; // Imagem maior para a página de detalhes

const MovieDetails = () => {
  // Obtém o parâmetro 'id' da URL (ex: se o URL for /movie/1234, movie_id será '1234')
  const { id: movie_id } = useParams(); 
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movie_id) return;

      try {
        setLoading(true);
        // Chamada à API para os detalhes de um filme específico
        const response = await axios.get(
          `${API_URL}/movie/${movie_id}?api_key=${API_KEY}&language=pt-BR`
        );
        setMovie(response.data);
        setError(null);
      } catch (err) {
        setError('Filme não encontrado ou falha na ligação.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movie_id]); // 👈 Dependência: o useEffect corre sempre que o movie_id muda

  // RNF02: Lógica de Carregamento
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando detalhes do filme...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>Erro: {error}</div>;
  }

  if (!movie) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Nenhum filme selecionado.</div>;
  }

  // RNF03: Exibição dos Detalhes
  return (
    <div className="movie-details-container" style={{ padding: '40px' }}>
      <img
        src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
        alt={movie.title}
        style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '10px' }}
      />
      <h1 style={{ marginTop: '20px' }}>{movie.title}</h1>
      <p style={{ fontSize: '1.2em', color: '#666' }}>{movie.tagline}</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <p>⭐ **Avaliação Média:** {movie.vote_average.toFixed(1)} / 10 ({movie.vote_count} votos)</p>
        <p>📅 **Lançamento:** {new Date(movie.release_date).toLocaleDateString('pt-BR')}</p>
        <p>⌛ **Duração:** {movie.runtime} minutos</p>
      </div>

      <h2>Sinopse</h2>
      <p>{movie.overview}</p>

      {/* Implementação dos links para o Elenco (RF04) deve vir aqui */}
      {/* Implementação de Filmes Similares (RF03) deve vir aqui */}
    </div>
  );
};

export default MovieDetails;