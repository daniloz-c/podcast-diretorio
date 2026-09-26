import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, onRate = null, size = 18, interactive = false }) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="star-rating">
      {stars.map((starIndex) => {
        const isFull = displayRating >= starIndex;
        const isHalf = displayRating >= starIndex - 0.5 && displayRating < starIndex;

        return (
          <span
            key={starIndex}
            className={interactive ? 'star-interactive' : ''}
            onClick={() => interactive && onRate && onRate(starIndex)}
            onMouseEnter={() => interactive && setHoverRating(starIndex)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          >
            <Star
              size={size}
              fill={isFull ? '#00a854' : isHalf ? 'url(#halfStarGrad)' : 'none'}
              color={isFull || isHalf ? '#00a854' : '#677b8c'}
              strokeWidth={1.5}
            />
          </span>
        );
      })}

      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="halfStarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="#00a854" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
