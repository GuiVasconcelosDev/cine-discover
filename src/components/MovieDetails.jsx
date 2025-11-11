import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

// Chave da API Corrigida para d646e054c1823d4ffb54373b69954e66
const API_KEY = 'd646e054c1823d4ffb54373b69954e66';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // 1. Busca os detalhes do filme
                const movieResponse = await axios.get(
                    `${API_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`
                );
                setMovie(movieResponse.data);

                // 2. Busca o elenco
                const creditsResponse = await axios.get(
                    `${API_URL}/movie/${id}/credits?api_key=${API_KEY}`
                );
                // Filtra e pega os 5 primeiros membros do elenco principal
                setCast(creditsResponse.data.cast.slice(0, 5)); 

            } catch (err) {
                setError('Falha ao carregar detalhes do filme. Verifique a chave da API.');
                console.error('Erro ao buscar detalhes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.5em' }}>A carregar detalhes...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>Erro: {error}</div>;
    }

    if (!movie) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Filme não encontrado.</div>;
    }

    const backdropUrl = movie.backdrop_path ? `${IMAGE_BASE_URL}original${movie.backdrop_path}` : null;
    const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}w500${movie.poster_path}` : 'https://placehold.co/500x750/ccc/333?text=Sem+Poster';

    return (
        <div className="movie-details-container">
            {/* Background com o Backdrop */}
            {backdropUrl && (
                <div 
                    style={{
                        backgroundImage: `url(${backdropUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '40vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        textShadow: '0 0 10px rgba(0,0,0,0.8)',
                    }}
                >
                    <h1 style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px 20px', borderRadius: '10px' }}>{movie.title}</h1>
                </div>
            )}

            {/* Conteúdo Principal */}
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '40px', marginTop: '20px', flexWrap: 'wrap' }}>
                
                {/* Poster e Info */}
                <div style={{ flex: '0 0 300px' }}>
                    <img src={posterUrl} alt={movie.title} style={{ width: '100%', height: 'auto', borderRadius: '10px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }} />
                    <div style={{ marginTop: '20px', border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>Informações</h3>
                        <p><strong>Lançamento:</strong> {movie.release_date}</p>
                        <p><strong>Duração:</strong> {movie.runtime} min</p>
                        <p><strong>Avaliação:</strong> {movie.vote_average.toFixed(1)} / 10 ({movie.vote_count})</p>
                        <p><strong>Géneros:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
                    </div>
                </div>

                {/* Descrição e Elenco */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h2 style={{ fontSize: '2em', marginTop: '0' }}>{movie.tagline || movie.title}</h2>
                    <p style={{ fontSize: '1.1em', lineHeight: '1.6' }}>{movie.overview || 'Sinopse não disponível em português.'}</p>

                    <h3 style={{ marginTop: '30px', borderBottom: '2px solid #333', paddingBottom: '5px' }}>Elenco Principal</h3>
                    <div className="cast-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        {cast.map(actor => (
                            <Link key={actor.id} to={`/actor/${actor.id}`} style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', width: '100px' }}>
                                <div className="actor-card">
                                    <img
                                        src={actor.profile_path ? `${IMAGE_BASE_URL}w185${actor.profile_path}` : 'https://placehold.co/100x150/ccc/333?text=Foto'}
                                        alt={actor.name}
                                        style={{ width: '100px', height: '150px', objectFit: 'cover', borderRadius: '5px' }}
                                    />
                                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}>{actor.name}</p>
                                    <p style={{ margin: '0', fontSize: '0.8em', color: '#777' }}>({actor.character})</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MovieDetails;