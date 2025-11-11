// src/components/ActorDetails.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const API_KEY = 'd646e054c1823c4ffb54373b69954e66'; 
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const ActorDetails = () => {
  const { id: actor_id } = useParams();
  const [actor, setActor] = useState(null);
  const [filmography, setFilmography] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!actor_id) return;
      try {
        setLoading(true);

        // RF04: 1. Busca os detalhes do ator (Biografia)
        const actorResponse = await axios.get(
          `${API_URL}/person/${actor_id}?api_key=${API_KEY}&language=pt-BR`
        );
        setActor(actorResponse.data);

        // RF04: 2. Busca a filmografia (créditos)
        const creditsResponse = await axios.get(
          `${API_URL}/person/${actor_id}/movie_credits?api_key=${API_KEY}&language=pt-BR`
        );
        
        const filteredFilmography = creditsResponse.data.cast
          .filter(item => item.poster_path)
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 10);
          
        setFilmography(filteredFilmography);
        setError(null);
      } catch (err) {
        setError('Falha ao buscar dados do ator. ID inválido ou erro de API.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [actor_id]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando dados do ator...</div>;
  }

  if (error || !actor) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>Erro: {error || 'Dados não disponíveis.'}</div>;
  }

  return (
    <div className="actor-details-container" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        <img
          src={actor.profile_path ? `${IMAGE_BASE_URL}${actor.profile_path}` : 'https://via.placeholder.com/300x450?text=Sem+Foto'}
          alt={actor.name}
          style={{ width: '300px', height: '450px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }}
        />
        <div>
          <h1>{actor.name}</h1>
          <p>🎂 **Nascimento:** {actor.birthday ? new Date(actor.birthday).toLocaleDateString('pt-BR') : 'Desconhecido'}</p>
          <p>🌍 **Local de Nascimento:** {actor.place_of_birth || 'Desconhecido'}</p>

          <h2>Biografia</h2>
          <p style={{ lineHeight: '1.6' }}>{actor.biography || 'Biografia não disponível em português.'}</p>
        </div>
      </div>

      <h2 style={{ marginTop: '40px' }}>Filmografia Popular</h2>
      <div className="filmography-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'flex-start' }}>
        {filmography.map((movie) => (
          <Link key={movie.id} to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
             <div className="movie-card" style={{ width: '150px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
              <img
                src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                alt={movie.title}
                style={{ width: '100%', height: '225px', objectFit: 'cover' }}
              />
              <div style={{ padding: '5px' }}>
                <p style={{ fontSize: '0.9em', margin: '5px 0', fontWeight: 'bold' }}>{movie.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ActorDetails;