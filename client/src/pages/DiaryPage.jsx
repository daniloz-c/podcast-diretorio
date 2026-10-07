import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, PlayCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserRatings } from '../services/userService';
import { Card } from './Card';
import { Button } from './Button';
import { Clock, Star, PlayCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserRatings } from '../services/userService';
import { Card } from './Card';
import { Button } from './Button';

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays === 0) {
    if (diffInHours === 0) {
      if (diffInMinutes === 0) return 'agora mesmo';
      if (diffInMinutes < 60) return `há ${diffInMinutes} minutos`;
      return `há ${diffInHours} horas`;
    }
    if (diffInHours === 1) return 'há 1 hora';
    return `há ${diffInHours} horas`;
  }

  if (diffInDays === 1) return 'hoje';
  if (diffInDays === 2) return 'ontem';
  if (diffInDays < 7) return `há ${diffInDays} dias`;
  if (diffInDays < 30) return `há ${Math.floor(diffInDays / 7)} semanas`;
  if (diffInDays < 365) return `há ${Math.floor(diffInDays / 30)} meses`;
  return `há ${Math.floor(diffInDays / 365)} anos`;
};

export default function DiaryPage() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const loadRatings = async () => {
      setLoading(true);
      try {
        const userRatings = await fetchUserRatings(currentUser.uid);
        setRatings(userRatings);
      } catch (error) {
        console.error('Error loading diary entries:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="main-content">
        <div className="card" style={{ padding: '48px', textAlign: 'center', margin: '24px auto' }}>
          <h2 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Área Restrita</h2>
          <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
            Você precisa estar logado para acessar seu diário de episódios.
          </p>
          <Link to="/" className="btn btn-primary">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="main-content">
        <div className="section-title">
          <h2>Meu Diário</h2>
        </div>
        <div className="card" style={{ padding: '40px', textAlign: 'center', margin: '24px auto' }}>
          <p style={{ color: 'var(--text-muted)' }}>Carregando seu diário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="section-title">
        <h2>Meu Diário</h2>
      </div>

      {ratings.length === 0 ? (
        <Card style={{ padding: '48px', textAlign: 'center', margin: '24px auto' }}>
          <div className="diary-empty-icon">
            <Clock size={64} />
          </div>
          <h2 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Seu diário está vazio</h2>
          <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
            Comece avaliando episódios para registrá-los aqui
          </p>
          <Link to="/" className="btn btn-primary">
            <PlayCircle size={16} /> Descobrir Episódios
          </Link>
        </Card>
      ) : (
        <div className="diary-entries">
          {ratings.map((rating) => (
            <div key={rating.id} className="diary-entry">
              <img
                src={rating.episode_image || rating.feed_image}
                alt={rating.episode_title}
                className="diary-entry-image"
              />

              <div className="diary-entry-content">
                <div className="diary-entry-header">
                  <div className="diary-entry-title">{rating.episode_title}</div>
                  <div className="diary-entry-podcast">{rating.podcast_title}</div>
                </div>

                <div className="diary-entry-rating">
                  <Star size={16} />
                  <span>{rating.rating}/5 estrelas</span>
                </div>

                {rating.comment && (
                  <div className="diary-entry-comment">{rating.comment}</div>
                )}

<div className="diary-entry-date">
          <Clock size={14} />
          <time dateTime={rating.created_at}>{formatRelativeTime(rating.created_at)}</time>
        </div>
              </div>

              <div className="diary-entry-actions">
                <Link to={`/episode/${rating.episode_id}`} className="btn btn-secondary" title="Ouvir novamente">
                  <PlayCircle size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}