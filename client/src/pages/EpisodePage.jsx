import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Pause, ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import CommentSection from '../components/CommentSection';
import { fetchEpisodeById } from '../services/api';
import { useAudio } from '../context/AudioContext';

export default function EpisodePage() {
  const { id } = useParams();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playEpisode, currentEpisode, isPlaying } = useAudio();

  useEffect(() => {
    async function loadEp() {
      setLoading(true);
      const data = await fetchEpisodeById(id);
      setEpisode(data);
      setLoading(false);
    }
    loadEp();
  }, [id]);

  if (loading) {
    return <div style={{ color: 'var(--text-muted)', padding: '60px 0', textAlign: 'center' }}>Carregando episódio...</div>;
  }

  if (!episode) {
    return <div style={{ color: 'var(--text-muted)', padding: '60px 0', textAlign: 'center' }}>Episódio não encontrado.</div>;
  }

  const isCurrent = currentEpisode?.id === episode.id;

  return (
    <div>
      <Link to={episode.feedId ? `/podcast/${episode.feedId}` : '/'} className="btn btn-secondary" style={{ marginBottom: 20 }}>
        <ArrowLeft size={16} /> Voltar para o Podcast
      </Link>

      <div className="podcast-header">
        <img
          src={episode.feedImage || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80'}
          alt={episode.title}
          className="podcast-cover-large"
        />

        <div className="podcast-info">
          <h1 className="podcast-title">{episode.title}</h1>

          <div className="podcast-meta">
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={14} /> {new Date(episode.datePublished * 1000).toLocaleDateString('pt-BR')}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={14} /> {Math.floor(episode.duration / 60)} minutos
            </span>
          </div>

          <p className="podcast-description">{episode.description}</p>

          <div className="action-bar">
            <button
              className="btn btn-primary"
              onClick={() => playEpisode(episode, { title: episode.title, image: episode.feedImage })}
              style={{ padding: '12px 24px', fontSize: '1rem' }}
            >
              {isCurrent && isPlaying ? (
                <>
                  <Pause size={20} fill="#ffffff" /> Pausar Reprodução
                </>
              ) : (
                <>
                  <Play size={20} fill="#ffffff" /> Reproduzir Episódio
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <CommentSection podcastId={`ep-${episode.id}`} podcastTitle={episode.title} />
    </div>
  );
}
