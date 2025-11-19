import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Chave da API
const API_KEY = 'd646e054c1823d4ffb54373b69954e66';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Função que é chamada ao submeter o formulário
    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!query.trim()) {
            setResults([]);
            setError('Por favor, digite um termo de busca.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            // Busca o filme pelo título
            const response = await axios.get(
                `${API_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`
            );
            
            setResults(response.data.results);
            
            if (response.data.results.length === 0) {
                setError(`Nenhum filme encontrado para "${query}".`);
            } else {
                setError(null);
            }

        } catch (error) { 
            setError('Falha ao realizar a busca. Verifique a chave da API.');
            console.error('Erro ao buscar filmes:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Buscar Filmes</h1>

            {/* Layout de busca adaptável: w-full e padding */}
            <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', padding: '0 10px' }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Digite o nome do filme..."
                    // A largura será ajustada pelo flexbox, mas garantimos que preencha bem
                    style={{ padding: '10px', fontSize: '1.1em', flexGrow: 1, maxWidth: '600px', borderRadius: '5px 0 0 5px', border: '1px solid #ccc', outline: 'none' }}
                />
                <button 
                    type="submit" 
                    style={{ padding: '10px 20px', fontSize: '1.1em', borderRadius: '0 5px 5px 0', border: 'none', backgroundColor: '#333', color: 'white', cursor: 'pointer' }}
                >
                    Buscar
                </button>
            </form>

            {loading && <div style={{ textAlign: 'center', padding: '20px', fontSize: '1.2em' }}>A carregar resultados...</div>}
            
            {!loading && error && <div style={{ color: 'red', textAlign: 'center', padding: '20px', border: '1px solid red', borderRadius: '5px', backgroundColor: '#fee' }}>{error}</div>}

            {/* Exibição dos Filmes - Usa a classe .movie-grid */}
            <div className="movie-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', justifyContent: 'center' }}>
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
                                <p style={{ fontSize: '0.9em', margin: '0', color: '#555' }}>Avaliação: {movie.vote_average.toFixed(1)}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SearchPage;