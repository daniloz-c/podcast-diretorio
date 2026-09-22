import React, { useState } from 'react';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import RatingStars from './RatingStars';
import { useAuth } from '../context/AuthContext';
import { getPodcastReviews, saveRatingAndReview } from '../services/socialService';

export default function CommentSection({ podcastId, podcastTitle }) {
  const { currentUser, setIsAuthModalOpen } = useAuth();
  const [reviews, setReviews] = useState(() => getPodcastReviews(podcastId));
  const [commentText, setCommentText] = useState('');
  const [userRating, setUserRating] = useState(4);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (commentText.trim()) {
      saveRatingAndReview(podcastId, podcastTitle, userRating, commentText.trim(), currentUser);
      setReviews(getPodcastReviews(podcastId));
      setCommentText('');
    }
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h3 className="section-title">
        <span>Resenhas & Comentários</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{reviews.length} resenhas</span>
      </h3>

      {/* Write Review Form */}
      <form onSubmit={handleSubmit} className="review-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="user-badge">
            <div className="avatar">
              {currentUser ? currentUser.displayName.charAt(0) : '?'}
            </div>
            <span className="username">
              {currentUser ? currentUser.displayName : 'Faça login para comentar'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sua nota:</span>
            <RatingStars rating={userRating} onRate={setUserRating} interactive={true} size={20} />
          </div>
        </div>

        <textarea
          className="form-textarea"
          placeholder="Escreva sua resenha ou comentário sobre este podcast..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <button type="submit" className="btn btn-primary">
            <MessageSquare size={16} /> Publicar Resenha
          </button>
        </div>
      </form>

      {/* Review Feed */}
      {reviews.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '30px 0' }}>
          Nenhuma resenha escrita ainda. Seja o primeiro a opinar!
        </div>
      ) : (
        reviews.map((rev) => (
          <div key={rev.id} className="review-card">
            <div className="review-header">
              <div className="user-badge">
                <div className="avatar">{rev.userName.charAt(0)}</div>
                <div>
                  <div className="username">{rev.userName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.userHandle}</div>
                </div>
              </div>

              <RatingStars rating={rev.rating} size={16} />
            </div>

            <p className="review-body">{rev.comment}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>{new Date(rev.createdAt).toLocaleDateString('pt-BR')}</span>
              <button className="btn-icon" style={{ width: 26, height: 26 }} title="Curtir resenha">
                <ThumbsUp size={12} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
