import React, { useState, useEffect } from 'react';
import { Heart, List, Star, Activity, User, Edit3 } from 'lucide-react';
import PodcastCard from '../components/PodcastCard';
import RatingStars from '../components/RatingStars';
import { useAuth } from '../context/AuthContext';
import { getUserFavorites, getUserLists, getAllReviews, getActivityFeed } from '../services/socialService';

export default function UserProfilePage() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [lists, setLists] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    setFavorites(getUserFavorites());
    setLists(getUserLists());
    setReviews(getAllReviews());
    setActivities(getActivityFeed());
  }, []);

  if (!currentUser) {
    return <div style={{ color: 'var(--text-muted)', padding: '60px 0', textAlign: 'center' }}>Faça login para ver seu perfil.</div>;
  }

  return (
    <div>
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-large">
          {currentUser.displayName.charAt(0)}
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{currentUser.displayName}</h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{currentUser.handle}</div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{favorites.length}</span>
              <span className="stat-label">Favoritos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{reviews.length}</span>
              <span className="stat-label">Resenhas</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{lists.length}</span>
              <span className="stat-label">Listas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Favorites Shelf */}
      <h2 className="section-title">
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Heart size={18} color="var(--accent-orange)" /> SEUS PODCASTS FAVORITOS
        </span>
      </h2>

      {favorites.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', padding: '20px 0', marginBottom: 30 }}>
          Você ainda não marcou nenhum podcast como favorito.
        </div>
      ) : (
        <div className="poster-grid">
          {favorites.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </div>
      )}

      {/* User Reviews */}
      <h2 className="section-title" style={{ marginTop: 20 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Star size={18} color="var(--accent-green)" /> SUAS RESENHAS
        </span>
      </h2>

      {reviews.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', padding: '20px 0' }}>
          Você ainda não publicou resenhas.
        </div>
      ) : (
        reviews.map((rev) => (
          <div key={rev.id} className="review-card">
            <div className="review-header">
              <div style={{ fontWeight: 700, color: 'var(--accent-green)' }}>{rev.podcastTitle}</div>
              <RatingStars rating={rev.rating} size={16} />
            </div>
            <p className="review-body">{rev.comment}</p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {new Date(rev.createdAt).toLocaleDateString('pt-BR')}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
