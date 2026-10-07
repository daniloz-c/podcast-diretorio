import React, { useState, useEffect } from 'react';
import RatingStars from './RatingStars';
import { saveRating } from '../services/userService';
import { Card } from './Card';

export default function EpisodeRatingForm({ userId, episodeId, episodeTitle, podcastTitle, episodeImage, initialRating = 0, initialComment = '' }) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('Você precisa estar logado para avaliar');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await saveRating(userId, episodeId, rating, comment);
    } catch (err) {
      setError('Erro ao salvar avaliação');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonText = isSubmitting ? 'Salvando...' : 'Salvar Avaliação';

  return (
    <Card className="episode-rating-form">
      <div className="rating-header">
        <h3>Avaliar Episódio</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rating-stars-section">
          <RatingStars rating={rating} onRate={handleRatingChange} size={24} interactive={true} />
          <span className="rating-value">{rating > 0 ? `${rating}/5 estrelas` : ''}</span>
        </div>

        <div className="rating-description">
          <p>
            <strong>{episodeTitle}</strong> de {podcastTitle}
          </p>
        </div>

        <div className="comment-section">
          <textarea
            className="rating-comment"
            placeholder="Opcional: Mande uma resenha..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            maxLength={500}
          />
          <div className="comment-count">
            {comment.length}/500 caracteres
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="btn btn-primary rating-submit-btn"
          disabled={isSubmitting || !rating}
        >
          <span className="btn-text">{buttonText}</span>
        </button>
      </form>
    </Card>
  );
}