import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Chave da API
const API_KEY = 'd646e054c1823d4ffb54373b69954e66';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieList = () => {
    // Definimos o tipo como 'popular' para ser a página inicial
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                setError(null);

                // Busca filmes populares, que é o conteúdo esperado para a Home
                const url = `${API_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`;

                const response = await axios.get(url);
                setMovies(response.data.results);
            } catch (error) {
                // Mensagem de erro clara para o utilizador
                setError('Falha ao carregar a lista de Filmes Populares. Por favor, verifique a ligação à internet ou a chave da API.');
                console.error('Erro ao buscar filmes populares:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em' }}>A carregar Filmes Populares...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '50px', border: '1px solid red', borderRadius: '5px', backgroundColor: '#fee' }}>Erro: {error}</div>;
    }

    return (
        <div className="movie-list-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Filmes Populares Hoje!</h1>
            
            {/* Grid de Filmes - Agora a responsividade é tratada pela classe CSS. */}
            <div className="movie-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', justifyContent: 'center' }}>
                {movies.map((movie) => (
                    // Link para a página de detalhes do filme
                    <Link key={movie.id} to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="movie-card" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden', transition: 'transform 0.2s', backgroundColor: '#fff' }}>
                            <img
                                src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://placehold.co/200x300/ccc/333?text=Sem+Poster'}
                                alt={movie.title}
                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                            />
                            <div style={{ padding: '10px' }}>
                                <h3 style={{ fontSize: '1.1em', margin: '5px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{movie.title}</h3>
                                <p style={{ fontSize: '0.9em', margin: '0', color: '#555' }}>Avaliação: {movie.vote_average.toFixed(1)}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MovieList;