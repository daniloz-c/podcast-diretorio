import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Bookmark, Trash2, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserWatchlist, removeFromWatchlist } from '../services/userService';
import { getUserWatchlist, removeFromWatchlistLocal } from '../services/socialService';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { formatRelativeTime } from '../services/dateUtils';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadWatchlist = async () => {
      setLoading(true);
      try {
        let items = getUserWatchlist();
        if (currentUser?.uid) {
          const apiItems = await fetchUserWatchlist(currentUser.uid);
          // Deduplicate items by ID
          const ids = new Set(items.map((i) => i.id || i.podcastId));
          apiItems.forEach((apiItem) => {
            if (!ids.has(apiItem.id)) {
              items.push(apiItem);
            }
          });
        }
        setWatchlist(items);
      } catch (error) {
        console.error('Error loading watchlist:', error);
        setWatchlist(getUserWatchlist());
      } finally {
        setLoading(false);
      }
    };

    loadWatchlist();
  }, [currentUser]);

  const handleRemoveFromWatchlist = async (itemId) => {
    removeFromWatchlistLocal(itemId);
    if (currentUser?.uid) {
      try {
        await removeFromWatchlist(currentUser.uid, itemId);
      } catch (error) {
        console.error('Error removing from backend watchlist:', error);
      }
    }
    setWatchlist((prev) => prev.filter((item) => (item.id || item.podcastId) !== itemId));
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="section-title">
          <h2>
            <Bookmark size={22} color="var(--accent-green)" /> Minha Watchlist (Ouvir Mais Tarde)
          </h2>
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
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bookmark size={24} color="var(--accent-green)" /> Minha Watchlist (Ouvir Mais Tarde)
        </h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {watchlist.length} {watchlist.length === 1 ? 'item salvo' : 'itens salvos'}
        </span>
      </div>

      {watchlist.length === 0 ? (
        <Card style={{ padding: '48px', textAlign: 'center', margin: '24px auto', maxWidth: 600 }}>
          <div style={{ display: 'inline-flex', padding: 20, borderRadius: '50%', backgroundColor: 'rgba(0, 168, 84, 0.1)', marginBottom: 20 }}>
            <Bookmark size={48} color="var(--accent-green)" />
          </div>
          <h2 style={{ marginBottom: '12px', color: 'var(--text-primary)' }}>Sua Watchlist está vazia</h2>
          <p style={{ marginBottom: '24px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Clique no ícone de marca-página (Bookmark) nos cards de podcasts ou episódios para salvá-los aqui e ouvir mais tarde!
          </p>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Compass size={18} /> Explorar Podcasts Populares
          </Link>
        </Card>
      ) : (
        <div className="watchlist-entries" style={{ display: 'grid', gap: 16, marginTop: 20 }}>
          {watchlist.map((item) => {
            const itemId = item.id || item.podcastId;
            const coverUrl = item.image || item.artwork || item.feed_image || item.feedImage || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80';
            const isEpisode = !!(item.episodeId || item.podcast_id || item.type === 'episode');
            const targetLink = isEpisode ? `/episode/${itemId}` : `/podcast/${itemId}`;

            return (
              <div
                key={itemId}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: 16,
                  borderRadius: 'var(--radius-lg)',
                  transition: 'transform 0.2s, border-color 0.2s'
                }}
              >
                <img
                  src={coverUrl}
                  alt={item.title || item.podcast_title}
                  style={{ width: 64, height: 64, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isEpisode ? 'rgba(64, 188, 244, 0.2)' : 'rgba(0, 168, 84, 0.2)',
                        color: isEpisode ? 'var(--accent-blue)' : 'var(--accent-green)'
                      }}
                    >
                      {isEpisode ? 'EPISÓDIO' : 'PODCAST'}
                    </span>
                    {item.date_published && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {formatRelativeTime(item.date_published)}
                      </span>
                    )}
                  </div>

                  <Link to={targetLink} style={{ textDecoration: 'none' }}>
                    <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700, margin: '2px 0' }}>
                      {item.title || item.episode_title}
                    </h4>
                  </Link>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {item.author || item.ownerName || item.podcast_title || 'Podcast'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Link to={targetLink} className="btn btn-primary" title="Abrir detalhes">
                    <PlayCircle size={18} />
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveFromWatchlist(itemId)}
                    title="Remover da Watchlist"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}