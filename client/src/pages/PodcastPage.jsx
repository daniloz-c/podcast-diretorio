import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Star, UserPlus, Play, Pause, ArrowUpDown, Flag } from 'lucide-react';
import RatingStars from '../components/RatingStars';
import CommentSection from '../components/CommentSection';
import { fetchPodcastById, fetchEpisodesByFeedId } from '../services/api';
import { useAudio } from '../context/AudioContext';
import { useAuth } from '../context/AuthContext';
import { 
  isFavorited, 
  toggleFavorite, 
  isLiked, 
  toggleLike, 
  isFollowingUser, 
  toggleFollowUser, 
  getPodcastRating, 
  saveRatingAndReview 
} from '../services/socialService';

export default function PodcastPage() {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [sortAsc, setSortAsc] = useState(false); // Requisito: Padrão = Mais Recentes Primeiro (do mais novo para o mais antigo)
  const [loading, setLoading] = useState(true);

  const { playEpisode, currentEpisode, isPlaying } = useAudio();
  const { currentUser, setIsAuthModalOpen } = useAuth();

  const [fav, setFav] = useState(false);
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    async function loadPodcast() {
      setLoading(true);
      const podcastData = await fetchPodcastById(id);
      setPodcast(podcastData);

      const eps = await fetchEpisodesByFeedId(id, podcastData?.feedUrl || null);

      // Requisito: QUANDO ABRIR A PÁGINA DE UM PODCAST APRESENTAR OS EPISÓDEOS MAIS RECENTES
      const sorted = [...eps].sort((a, b) => {
        const timeA = a.datePublished || 0;
        const timeB = b.datePublished || 0;
        return timeB - timeA; // Mais recente primeiro
      });

      setEpisodes(sorted);
      setFav(isFavorited(id));
      setLiked(isLiked(id));
      setFollowing(isFollowingUser(podcastData?.author || 'host'));
      setUserRating(getPodcastRating(id));
      setLoading(false);
    }
    loadPodcast();
  }, [id]);

  const toggleSortOrder = () => {
    const newAsc = !sortAsc;
    setSortAsc(newAsc);
    setEpisodes(prev => [...prev].sort((a, b) => {
      const timeA = a.datePublished || a.pubDate || 0;
      const timeB = b.datePublished || b.pubDate || 0;
      return newAsc ? (timeA - timeB) : (timeB - timeA);
    }));
  };

  if (loading) {
    return <div style={{ color: 'var(--text-muted)', padding: '60px 0', textAlign: 'center' }}>Carregando podcast...</div>;
  }

  if (!podcast) {
    return <div style={{ color: 'var(--text-muted)', padding: '60px 0', textAlign: 'center' }}>Podcast não encontrado.</div>;
  }

  const handleFavorite = () => {
    const result = toggleFavorite(podcast.id, podcast);
    setFav(result);
  };

  const handleLike = () => {
    const result = toggleLike(podcast.id, podcast);
    setLiked(result);
  };

  const handleFollow = () => {
    const result = toggleFollowUser(podcast.author || podcast.ownerName);
    setFollowing(result);
  };

  const handleRate = (ratingValue) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setUserRating(ratingValue);
    saveRatingAndReview(podcast.id, podcast.title, ratingValue, '', currentUser);
  };

  const coverUrl = podcast.image || podcast.artwork || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80';

  return (
    <div>
      {/* Podcast Details Header */}
      <div className="podcast-header">
        <img src={coverUrl} alt={podcast.title} className="podcast-cover-large" />

        <div className="podcast-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ backgroundColor: 'rgba(0, 224, 84, 0.15)', color: 'var(--accent-green)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Flag size={12} /> PODCAST BRASILEIRO 🇧🇷
            </span>
          </div>

          <h1 className="podcast-title">{podcast.title}</h1>
          
          <div className="podcast-meta">
            <span>Por <strong>{podcast.author || podcast.ownerName}</strong></span>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={16} fill="#00e054" color="#00e054" />
              <strong style={{ color: '#00e054' }}>4.8</strong> (1.2k avaliações)
            </div>
          </div>

          <p className="podcast-description">{podcast.description}</p>

          {/* Action Buttons as requested in ideia.md */}
          <div className="action-bar">
            {/* Avaliar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', padding: '6px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Avaliar:</span>
              <RatingStars rating={userRating} onRate={handleRate} interactive={true} size={18} />
            </div>

            {/* Favoritar */}
            <button
              className={`btn ${fav ? 'btn-primary' : 'btn-secondary'}`}
              onClick={handleFavorite}
            >
              <Heart size={16} fill={fav ? '#000' : 'none'} /> {fav ? 'Favoritado' : 'Favoritar'}
            </button>

            {/* Curtir */}
            <button
              className={`btn ${liked ? 'btn-primary' : 'btn-secondary'}`}
              onClick={handleLike}
              style={liked ? { backgroundColor: 'var(--accent-orange)', color: '#000' } : {}}
            >
              <Star size={16} fill={liked ? '#000' : 'none'} /> {liked ? 'Curtido' : 'Curtir'}
            </button>

            {/* Seguir */}
            <button
              className={`btn ${following ? 'btn-primary' : 'btn-secondary'}`}
              onClick={handleFollow}
            >
              <UserPlus size={16} /> {following ? 'Seguindo Podcast' : 'Seguir'}
            </button>
          </div>
        </div>
      </div>

      {/* Episode List with Order Control */}
      <h2 className="section-title">
        <span>Episódios ({episodes.length})</span>

        {/* Toggle sort order */}
        <button
          className="btn btn-secondary"
          onClick={toggleSortOrder}
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          title="Alterar ordenação dos episódios"
        >
          <ArrowUpDown size={14} color="var(--accent-green)" />
          {sortAsc ? 'Ordenação: Mais Antigos Primeiro (#1)' : 'Ordenação: Mais Recentes Primeiro (Padrão)'}
        </button>
      </h2>

      <div className="episode-list">
        {episodes.map((ep, index) => {
          const isCurrent = currentEpisode?.id === ep.id;
          return (
            <div key={ep.id} className="episode-item">
              <div className="episode-main">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 700 }}>
                    EPISÓDIO #{sortAsc ? index + 1 : episodes.length - index}
                  </span>
                  {!sortAsc && index === 0 && (
                    <span style={{ backgroundColor: 'rgba(0, 224, 84, 0.15)', color: 'var(--accent-green)', fontSize: '0.65rem', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}>
                      MAIS RECENTE
                    </span>
                  )}
                </div>
                <Link to={`/episode/${ep.id}`} className="episode-title">
                  {ep.title}
                </Link>
                <p className="episode-desc">{ep.description}</p>
                <div className="episode-meta">
                  <span>Publicado em: {new Date(ep.datePublished * 1000).toLocaleDateString('pt-BR')}</span>
                  <span>•</span>
                  <span>{Math.floor(ep.duration / 60)} min</span>
                </div>
              </div>

              <button
                className={`btn ${isCurrent && isPlaying ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => playEpisode(ep, podcast)}
                style={{ padding: '10px 18px' }}
              >
                <Play size={16} fill={isCurrent && isPlaying ? '#000' : 'currentColor'} />
                {isCurrent && isPlaying ? 'Pausar' : 'Ouvir'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Comment Section */}
      <CommentSection podcastId={podcast.id} podcastTitle={podcast.title} />
    </div>
  );
}
