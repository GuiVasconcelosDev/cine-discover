import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Chave da API Corrigida para d646e054c1823d4ffb54373b69954e66
const API_KEY = 'd646e054c1823d4ffb54373b69954e66';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    // Função para buscar filmes quando o utilizador submete a pesquisa
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const response = await axios.get(
                `${API_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${query}&page=1&include_adult=false`
            );
            setResults(response.data.results);
        } catch (err) {
            setError('Falha ao buscar resultados. Verifique a chave da API e a conexão.');
            console.error('Erro na pesquisa:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Pesquisar Filmes</h1>
            
            <form onSubmit={handleSearch} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Digite o título do filme..."
                    style={{ flexGrow: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button 
                    type="submit"
                    style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#333', color: 'white', cursor: 'pointer' }}
                >
                    Pesquisar
                </button>
            </form>

            {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Carregando resultados...</div>}
            {error && <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>Erro: {error}</div>}

            {hasSearched && !loading && !error && results.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px' }}>Nenhum resultado encontrado para "{query}".</div>
            )}
            
            {/* Exibição dos Resultados */}
            <div className="results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', justifyContent: 'center' }}>
                {results.map((movie) => (
                    <Link key={movie.id} to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="movie-card" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden', transition: 'transform 0.2s', backgroundColor: '#fff' }}>
                            <img
                                src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://placehold.co/200x300/ccc/333?text=Sem+Poster'}
                                alt={movie.title}
                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                            />
                            <div style={{ padding: '10px' }}>
                                <h3 style={{ fontSize: '1.1em', margin: '5px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{movie.title}</h3>
                                <p style={{ fontSize: '0.9em', margin: '0', color: '#555' }}>Lançamento: {movie.release_date || 'N/A'}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SearchPage;