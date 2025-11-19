import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

// Chave da API
const API_KEY = 'd646e054c1823d4ffb54373b69954e66';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

const ActorDetails = () => {
    const { id } = useParams();
    const [actor, setActor] = useState(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600); // Novo estado

    useEffect(() => {
        // Listener de resize para responsividade
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
        };
        window.addEventListener('resize', handleResize);

        // Função para buscar detalhes do ator e seus filmes
        const fetchActorDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Busca detalhes do ator
                const actorResponse = await axios.get(
                    `${API_URL}/person/${id}?api_key=${API_KEY}&language=pt-BR`
                );
                setActor(actorResponse.data);

                // Busca os créditos (filmes)
                const creditsResponse = await axios.get(
                    `${API_URL}/person/${id}/movie_credits?api_key=${API_KEY}&language=pt-BR`
                );
                // Ordena os filmes por popularidade e pega os 10 mais populares
                const sortedMovies = creditsResponse.data.cast
                    .sort((a, b) => b.popularity - a.popularity)
                    .slice(0, 10);
                setMovies(sortedMovies);

            } catch (err) { 
                setError('Falha ao carregar detalhes do ator. Verifique a chave da API.');
                console.error('Erro ao buscar detalhes do ator:', err); 
            } finally {
                setLoading(false);
            }
        };

        fetchActorDetails();

        return () => window.removeEventListener('resize', handleResize); // Limpeza
    }, [id]);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.5em' }}>A carregar detalhes do ator...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>Erro: {error}</div>;
    }

    if (!actor) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Ator não encontrado.</div>;
    }

    const profileUrl = actor.profile_path ? `${IMAGE_BASE_URL}w500${actor.profile_path}` : 'https://placehold.co/500x750/ccc/333?text=Sem+Foto';

    const mainContentStyle = {
        padding: '20px', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        gap: '40px', 
        marginTop: '20px', 
        flexWrap: 'wrap',
        // Adiciona a lógica de stack para mobile
        flexDirection: isMobile ? 'column' : 'row', 
        alignItems: isMobile ? 'center' : 'flex-start',
    };

    return (
        <div className="actor-details-container">
            <h1 style={{ textAlign: 'center', margin: '30px 0 0 0' }}>{actor.name}</h1>
            
            <div style={mainContentStyle}>
                
                {/* Foto e Info */}
                <div style={{ flex: '0 0 300px', width: isMobile ? '90%' : 'auto' }}>
                    <img 
                        src={profileUrl} 
                        alt={actor.name} 
                        style={{ 
                            width: isMobile ? '100%' : '300px', 
                            maxWidth: '100%', 
                            height: 'auto', 
                            borderRadius: '10px', 
                            boxShadow: '0 8px 16px rgba(0,0,0,0.2)' 
                        }} 
                    />
                    <div style={{ marginTop: '20px', border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>Informações Pessoais</h3>
                        <p><strong>Nascimento:</strong> {actor.birthday || 'N/A'}</p>
                        <p><strong>Local de Nascimento:</strong> {actor.place_of_birth || 'N/A'}</p>
                        <p><strong>Popularidade:</strong> {actor.popularity.toFixed(1)}</p>
                    </div>
                </div>

                {/* Biografia e Filmes */}
                <div style={{ flex: 1, minWidth: isMobile ? '90%' : '300px' }}>
                    
                    <h2 style={{ fontSize: '1.5em', marginTop: '0' }}>Biografia</h2>
                    <p style={{ fontSize: '1em', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{actor.biography || 'Biografia não disponível em português.'}</p>

                    <h3 style={{ marginTop: '30px', borderBottom: '2px solid #333', paddingBottom: '5px' }}>Top 10 Filmes</h3>
                    
                    {movies.length > 0 ? (
                        // Exibição dos Filmes - Usa a classe .movie-grid do CSS
                        <div className="movie-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                            {movies.map((movie) => (
                                <Link key={movie.id} to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="movie-card" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
                                        <img
                                            src={movie.poster_path ? `${IMAGE_BASE_URL}w300${movie.poster_path}` : 'https://placehold.co/150x225/ccc/333?text=Sem+Poster'}
                                            alt={movie.title}
                                            style={{ width: '100%', height: '225px', objectFit: 'cover' }}
                                        />
                                        <div style={{ padding: '8px' }}>
                                            <p style={{ fontSize: '0.9em', margin: '0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 'bold' }}>{movie.title}</p>
                                            <p style={{ fontSize: '0.8em', margin: '0', color: '#555' }}>Como: {movie.character}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p>Nenhum crédito de filme encontrado.</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ActorDetails;