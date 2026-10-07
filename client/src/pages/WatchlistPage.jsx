import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock, Calendar, Trash2, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserWatchlist, removeFromWatchlist, checkWatchlist } from '../services/userService';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { formatRelativeTime } from '../services/dateUtils';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const loadWatchlist = async () => {
      setLoading(true);
      try {
        const userWatchlist = await fetchUserWatchlist(currentUser.uid);
        setWatchlist(userWatchlist);
      } catch (error) {
        console.error('Error loading watchlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWatchlist();
  }, [currentUser]);

  const handleRemoveFromWatchlist = async (episodeId) => {
    if (!currentUser) return;

    try {
      await removeFromWatchlist(currentUser.uid, episodeId);

      // Remove from state after successful removal
      setWatchlist((prev) => prev.filter((item) => item.id !== episodeId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="main-content">
        <div className="card" style={{ padding: '48px', textAlign: 'center', margin: '24px auto' }}>
          <h2 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Área Restrita</h2>
          <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
            Você precisa estar logado para acessar sua watchlist.
          </p>
          <Link to="/" className="btn btn-primary">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="main-content">
        <div className="section-title">
          <h2>Minha Watchlist</h2>
        </div>
        <div className="card" style={{ padding: '40px', textAlign: 'center', margin: '24px auto' }}>
          <p style={{ color: 'var(--text-muted)' }}>Carregando sua watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="section-title">
        <h2>Minha Watchlist</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {watchlist.length} episódios salvos
        </span>
      </div>

      {watchlist.length === 0 ? (
        <Card style={{ padding: '48px', textAlign: 'center', margin: '24px auto' }}>
          <Bell size={64} style={{ marginBottom: '16px', opacity: '0.5' }} />
          <h2 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Sua watchlist está vazia</h2>
          <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
            Adicione episódios que você quer ouvir depois
          </p>
          <Link to="/" className="btn btn-primary">
            <PlayCircle size={16} /> Descobrir Episódios
          </Link>
        </Card>
      ) : (
        <div className="watchlist-entries">
          {watchlist.map((item) => (
            <div key={item.id} className="watchlist-entry">
              <img
                src={item.feed_image || item.image || 'https://via.placeholder.com/60'}
                alt={item.title}
                className="watchlist-entry-image"
              />

              <div className="watchlist-entry-content">
                <div className="watchlist-entry-title">{item.title}</div>
                <div className="watchlist-entry-podcast">
                  {item.title && item.podcast_id ? null : <div>{item.podcast_title}</div>}
                </div>
                {item.podcast_id && (
                  <div className="watchlist-entry-podcast">{item.podcast_title}</div>
                )}
                {item.date_published && (
                  <div className="watchlist-entry-date">
                    {formatRelativeTime(item.date_published)}
                  </div>
                )}
              </div>

              <div className="watchlist-entry-actions">
                <Link to={`/episode/${item.id}`} className="btn btn-primary" title="Ouvir agora">
                  <PlayCircle size={18} />
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveFromWatchlist(item.id)}
                  title="Remover da lista"
                  style={{ marginLeft: '8px' }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}