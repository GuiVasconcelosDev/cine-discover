import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Chave da API Corrigida para d646e054c1823d4ffb54373b69954e66
const API_KEY = 'd646e054c1823d4ffb54373b69954e66';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

const ActorDetails = () => {
    const { id } = useParams();
    const [actor, setActor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Busca os detalhes do ator
                const actorResponse = await axios.get(
                    `${API_URL}/person/${id}?api_key=${API_KEY}&language=pt-BR`
                );
                setActor(actorResponse.data);

            } catch (err) {
                setError('Falha ao carregar detalhes do ator. Verifique a chave da API.');
                console.error('Erro ao buscar detalhes do ator:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.5em' }}>A carregar detalhes do ator...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>Erro: {error}</div>;
    }

    if (!actor) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Ator/Atriz não encontrado(a).</div>;
    }

    const profileUrl = actor.profile_path ? `${IMAGE_BASE_URL}w500${actor.profile_path}` : 'https://placehold.co/500x750/ccc/333?text=Sem+Foto';

    return (
        <div className="actor-details-container" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                
                {/* Imagem do Perfil */}
                <div style={{ flex: '0 0 300px' }}>
                    <img src={profileUrl} alt={actor.name} style={{ width: '100%', height: 'auto', borderRadius: '10px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }} />
                </div>

                {/* Informações */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h1 style={{ fontSize: '2.5em', marginTop: '0' }}>{actor.name}</h1>
                    
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>Biografia</h3>
                    <p style={{ fontSize: '1.1em', lineHeight: '1.6' }}>{actor.biography || 'Biografia não disponível em português.'}</p>

                    <div style={{ marginTop: '20px' }}>
                        <p><strong>Nascimento:</strong> {actor.birthday || 'N/A'}</p>
                        <p><strong>Local de Nascimento:</strong> {actor.place_of_birth || 'N/A'}</p>
                        <p><strong>Popularidade:</strong> {actor.popularity}</p>
                    </div>

                </div>

            </div>
            
            {/* Obras Conhecidas (se existirem, esta secção seria expandida, mas por agora focamo-nos nos detalhes base) */}
        </div>
    );
};

export default ActorDetails;