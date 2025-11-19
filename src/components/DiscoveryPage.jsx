import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Chave da API
const API_KEY = 'd646e054c1823d4ffb54373b69954e66';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const DiscoveryPage = () => {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [sortBy, setSortBy] = useState('popularity.desc');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

    // Função para buscar filmes e gêneros
    const fetchGenresAndMovies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Fetch Genres (If not already fetched)
            if (genres.length === 0) {
                const genresResponse = await axios.get(
                    `${API_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`
                );
                setGenres(genresResponse.data.genres);
            }

            // 2. Build the discover URL
            let discoverUrl = `${API_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&sort_by=${sortBy}&page=1`;
            
            if (selectedGenre) {
                discoverUrl += `&with_genres=${selectedGenre}`;
            }

            // 3. Fetch Movies
            const moviesResponse = await axios.get(discoverUrl);
            setMovies(moviesResponse.data.results);

        } catch (err) {
            setError('Falha ao carregar a página de Descoberta. Verifique a chave da API.');
            console.error('Erro ao buscar dados:', err);
        } finally {
            setLoading(false);
        }
    }, [genres.length, selectedGenre, sortBy]);

    useEffect(() => {
        // Listener de resize para responsividade
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
        };
        window.addEventListener('resize', handleResize);

        fetchGenresAndMovies();
        
        return () => window.removeEventListener('resize', handleResize);
    }, [fetchGenresAndMovies]);

    // Estilo para o container de filtros - Corrigido (sem chaves duplicadas)
    const filterContainerStyle = {
        padding: '15px',
        border: '1px solid #eee',
        borderRadius: '8px',
        marginBottom: '30px',
        display: 'flex',
        gap: '20px',
        // A lógica de responsividade define a direção e o alinhamento
        flexDirection: isMobile ? 'column' : 'row', 
        alignItems: isMobile ? 'flex-start' : 'center',
    };

    const selectStyle = {
        padding: '8px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        minWidth: isMobile ? '100%' : '200px', // Ocupa a largura total no mobile
    };

    return (
        <div className="discovery-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Página de Descoberta e Filtros</h1>
            
            {/* Controle de Filtros */}
            <div style={filterContainerStyle}>
                
                {/* Filtro por Gênero */}
                <label style={{ width: isMobile ? '100%' : 'auto' }}>
                    Filtrar por Gênero:
                    <select 
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        value={selectedGenre}
                        style={{ ...selectStyle, marginLeft: isMobile ? '0' : '10px', marginTop: isMobile ? '5px' : '0' }}
                    >
                        <option value="">-- Todos os Gêneros --</option>
                        {genres.map((genre) => (
                            <option key={genre.id} value={genre.id}>{genre.name}</option>
                        ))}
                    </select>
                </label>

                {/* Ordenação */}
                <label style={{ width: isMobile ? '100%' : 'auto' }}>
                    Ordenar por:
                    <select 
                        onChange={(e) => setSortBy(e.target.value)}
                        value={sortBy}
                        style={{ ...selectStyle, marginLeft: isMobile ? '0' : '10px', marginTop: isMobile ? '5px' : '0' }}
                    >
                        <option value="popularity.desc">Mais Populares (Decrescente)</option>
                        <option value="popularity.asc">Menos Populares (Crescente)</option>
                        <option value="vote_average.desc">Melhor Avaliados (Decrescente)</option>
                        <option value="release_date.desc">Data de Lançamento (Recente)</option>
                        <option value="title.asc">Título (A-Z)</option>
                    </select>
                </label>
            </div>

            {loading && <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em' }}>Carregando filmes com filtros...</div>}
            
            {!loading && error && <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>Erro: {error}</div>}

            {/* Exibição dos Filmes */}
            <div className="movie-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', justifyContent: 'center' }}>
                {movies.map((movie) => (
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

export default DiscoveryPage;