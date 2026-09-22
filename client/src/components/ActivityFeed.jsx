import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, List, MessageSquare } from 'lucide-react';
import RatingStars from './RatingStars';
import { getActivityFeed } from '../services/socialService';

export default function ActivityFeed() {
  const activities = getActivityFeed();

  const renderIcon = (action) => {
    switch (action) {
      case 'evaluated':
        return <Star size={14} color="var(--accent-green)" fill="var(--accent-green)" />;
      case 'favorited':
      case 'liked':
        return <Heart size={14} color="var(--accent-orange)" fill="var(--accent-orange)" />;
      case 'created_list':
        return <List size={14} color="var(--accent-blue)" />;
      default:
        return <MessageSquare size={14} color="var(--text-secondary)" />;
    }
  };

  const getActionText = (act) => {
    switch (act.action) {
      case 'evaluated':
        return 'avaliou';
      case 'favorited':
        return 'favoritou';
      case 'liked':
        return 'curtiu';
      case 'created_list':
        return 'criou a lista';
      default:
        return 'interagiu com';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {activities.slice(0, 8).map((act) => (
        <div key={act.id} className="review-card" style={{ padding: '14px 18px', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.85rem' }}>
                {act.userName.charAt(0)}
              </div>

              <div>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{act.userName}</span>{' '}
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {getActionText(act)}{' '}
                </span>
                {act.podcastId ? (
                  <Link to={`/podcast/${act.podcastId}`} style={{ fontWeight: 700, color: 'var(--accent-green)' }}>
                    {act.targetTitle}
                  </Link>
                ) : (
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{act.targetTitle}</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {act.rating && <RatingStars rating={act.rating} size={14} />}
              {renderIcon(act.action)}
            </div>
          </div>

          {act.reviewText && (
            <p className="review-body" style={{ marginTop: 8, fontSize: '0.85rem', fontStyle: 'italic', marginBottom: 0 }}>
              "{act.reviewText}"
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
