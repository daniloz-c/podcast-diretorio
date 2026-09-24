import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Play } from 'lucide-react';
import { isFavorited, toggleFavorite } from '../services/socialService';

export default function PodcastCard({ podcast, rank }) {
  const [fav, setFav] = useState(() => isFavorited(podcast.id));

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleFavorite(podcast.id, podcast);
    setFav(result);
  };

  const coverUrl = podcast.image || podcast.artwork || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80';

  return (
    <Link to={`/podcast/${podcast.id}`} className="poster-card">
      <img src={coverUrl} alt={podcast.title} className="poster-image" loading="lazy" />
      
      {rank && (
        <div className="rank-badge">
          #{rank}
        </div>
      )}

      <div className="rating-badge">
        <Star size={12} fill="#00e054" color="#00e054" />
        <span>4.8</span>
      </div>

      <div className="poster-overlay">
        <h4 className="poster-title">{podcast.title}</h4>
        <p className="poster-author">{podcast.author || podcast.ownerName}</p>
        
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            className={`btn-icon ${fav ? 'active-heart' : ''}`}
            onClick={handleFavoriteClick}
            title="Favoritar"
            style={{ width: 30, height: 30 }}
          >
            <Heart size={14} fill={fav ? '#ff8000' : 'none'} color={fav ? '#ff8000' : 'currentColor'} />
          </button>
        </div>
      </div>
    </Link>
  );
}
