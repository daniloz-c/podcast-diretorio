import React, { useState, useEffect } from 'react';
import { X, Heart, Calendar, MessageSquare, Check, Sparkles } from 'lucide-react';
import RatingStars from './RatingStars';
import { useAuth } from '../context/AuthContext';
import { saveRatingAndReview, isLiked, getDiaryEntryByTarget } from '../services/socialService';

export default function EvaluationModal({ isOpen, onClose, targetItem, onSaved }) {
  const { currentUser, setIsAuthModalOpen } = useAuth();
  
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [listenedDate, setListenedDate] = useState(new Date().toISOString().split('T')[0]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (targetItem && isOpen) {
      setSavedSuccess(false);
      const targetId = targetItem.episodeId || targetItem.id;
      const existing = getDiaryEntryByTarget(targetId);
      
      if (existing) {
        setRating(existing.rating || 4);
        setComment(existing.comment || '');
        setLiked(!!existing.liked);
        setListenedDate(existing.listenedDate || new Date().toISOString().split('T')[0]);
      } else {
        setRating(targetItem.userRating || 4);
        setComment('');
        setLiked(isLiked(targetItem.id || targetItem.podcastId));
        setListenedDate(new Date().toISOString().split('T')[0]);
      }
    }
  }, [targetItem, isOpen]);

  if (!isOpen || !targetItem) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const isEpisode = !!(targetItem.episodeId || targetItem.feedId || targetItem.duration || targetItem.episodeTitle);
    const targetId = targetItem.episodeId ? `ep-${targetItem.episodeId}` : (isEpisode ? `ep-${targetItem.id}` : targetItem.id);
    const podcastTitle = targetItem.podcastTitle || targetItem.feedTitle || targetItem.title;
    const episodeTitle = isEpisode ? (targetItem.episodeTitle || targetItem.title) : null;
    const coverImage = targetItem.podcastImage || targetItem.image || targetItem.feedImage || targetItem.artwork;

    saveRatingAndReview(
      targetId,
      episodeTitle || podcastTitle,
      rating,
      comment,
      currentUser,
      {
        type: isEpisode ? 'episode' : 'podcast',
        podcastId: targetItem.podcastId || targetItem.feedId || targetItem.id,
        podcastTitle: podcastTitle,
        coverImage: coverImage,
        episodeId: targetItem.episodeId || (isEpisode ? targetItem.id : null),
        episodeTitle: episodeTitle,
        duration: targetItem.duration || 0,
        liked: liked,
        listenedDate: listenedDate
      }
    );

    setSavedSuccess(true);
    setTimeout(() => {
      if (onSaved) onSaved({ rating, comment, liked, listenedDate });
      onClose();
    }, 800);
  };

  const coverUrl = targetItem.podcastImage || targetItem.image || targetItem.feedImage || targetItem.artwork || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80';
  const isEpisode = !!(targetItem.episodeId || targetItem.feedId || targetItem.episodeTitle || targetItem.duration);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content evaluation-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} color="var(--accent-green)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              {isEpisode ? 'AVALIAR EPISÓDIO' : 'AVALIAR PODCAST'}
            </h3>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        {/* Item Summary Card */}
        <div className="eval-item-preview">
          <img src={coverUrl} alt="Capa" className="eval-item-cover" />
          <div className="eval-item-details">
            {isEpisode && (
              <span className="eval-item-badge">
                EPISÓDIO
              </span>
            )}
            <h4 className="eval-item-title">
              {isEpisode ? (targetItem.episodeTitle || targetItem.title) : targetItem.title}
            </h4>
            {isEpisode && targetItem.podcastTitle && (
              <div className="eval-item-podcast">{targetItem.podcastTitle}</div>
            )}
          </div>
        </div>

        {savedSuccess ? (
          <div className="eval-success-message">
            <div className="eval-success-icon">
              <Check size={28} />
            </div>
            <h4>Avaliação salva com sucesso no seu Diário!</h4>
            <p>Seu registro e resenha foram sincronizados.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="eval-form">
            {/* Rating Section */}
            <div className="eval-form-group rating-group">
              <label className="eval-label">Sua Nota:</label>
              <div className="rating-selector-wrapper">
                <RatingStars rating={rating} onRate={setRating} interactive={true} size={28} />
                <span className="rating-numeric-value">{rating} / 5</span>
              </div>
            </div>

            {/* Like & Date Grid */}
            <div className="eval-options-grid">
              {/* Date Listened */}
              <div className="eval-form-group">
                <label className="eval-label">
                  <Calendar size={14} /> Data que você ouviu:
                </label>
                <input
                  type="date"
                  className="form-input eval-date-input"
                  value={listenedDate}
                  onChange={(e) => setListenedDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              {/* Like / Favorite Toggle */}
              <div className="eval-form-group">
                <label className="eval-label">
                  <Heart size={14} /> Gostou do episódio?
                </label>
                <button
                  type="button"
                  className={`btn-like-toggle ${liked ? 'active' : ''}`}
                  onClick={() => setLiked(!liked)}
                >
                  <Heart size={16} fill={liked ? 'var(--accent-orange)' : 'none'} color={liked ? 'var(--accent-orange)' : 'currentColor'} />
                  {liked ? 'Curtido / Favorito' : 'Curtir'}
                </button>
              </div>
            </div>

            {/* Review / Comment Text */}
            <div className="eval-form-group">
              <label className="eval-label">
                <MessageSquare size={14} /> Resenha ou Comentário (opcional):
              </label>
              <textarea
                className="form-textarea eval-textarea"
                rows={4}
                placeholder="O que você achou? Destaques, críticas, reflexões ou momentos marcantes..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {/* Submit Action */}
            <div className="modal-actions" style={{ marginTop: 20 }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" style={{ minWidth: 160 }}>
                <Check size={16} /> Salvar no Diário
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
