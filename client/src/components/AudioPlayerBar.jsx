import React from 'react';
import { Play, Pause, Volume2, SkipForward, SkipBack } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function AudioPlayerBar() {
  const { currentEpisode, podcastInfo, isPlaying, currentTime, duration, togglePlayPause, seek } = useAudio();

  if (!currentEpisode) return null;

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const coverImage = podcastInfo?.image || podcastInfo?.artwork || currentEpisode?.feedImage || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="audio-player-bar">
      <div className="player-info">
        <img src={coverImage} alt="Capa" className="player-thumb" />
        <div style={{ overflow: 'hidden' }}>
          <div className="player-title">{currentEpisode.title}</div>
          <div className="player-subtitle">{podcastInfo?.title || 'Podcast'}</div>
        </div>
      </div>

      <div className="player-controls">
        <div className="player-buttons">
          <button className="btn-icon" style={{ width: 32, height: 32 }} onClick={() => seek(Math.max(0, currentTime - 15))}>
            <SkipBack size={16} />
          </button>
          
          <button className="btn btn-primary" style={{ width: 42, height: 42, borderRadius: '50%', padding: 0 }} onClick={togglePlayPause}>
            {isPlaying ? <Pause size={20} fill="#000" /> : <Play size={20} fill="#000" style={{ marginLeft: 2 }} />}
          </button>

          <button className="btn-icon" style={{ width: 32, height: 32 }} onClick={() => seek(Math.min(duration, currentTime + 15))}>
            <SkipForward size={16} />
          </button>
        </div>

        <div className="scrubber-container">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            className="scrubber-input"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 120, justifyContent: 'flex-end' }}>
        <Volume2 size={18} color="var(--text-secondary)" />
      </div>
    </div>
  );
}
