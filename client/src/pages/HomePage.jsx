import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Radio, Compass, Flag } from 'lucide-react';
import PodcastCard from '../components/PodcastCard';
import ActivityFeed from '../components/ActivityFeed';
import { fetchTrendingPodcasts, fetchCategories } from '../services/api';

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [trendList, catList] = await Promise.all([
        fetchTrendingPodcasts(),
        fetchCategories()
      ]);
      setTrending(trendList);
      setCategories(catList);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-text">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0, 224, 84, 0.15)', color: 'var(--accent-green)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: 12 }}>
            <Flag size={14} /> FOCADO EM PODCASTS BRASILEIROS 🇧🇷
          </div>
          <h1>Guarde, avalie e compartilhe os melhores podcasts do Brasil.</h1>
          <p>A rede social para entusiastas de áudio e podcasts brasileiros. Descubra novos episódios, ordene do mais antigo ao mais novo, monte suas listas e acompanhe a opinião dos seus amigos.</p>
          <div style={{ display: 'flex', gap: 14 }}>
            <Link to="/search" className="btn btn-primary">
              <Compass size={18} /> Explorar Podcasts BR
            </Link>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
        {/* Main Content Area */}
        <div>
          <h2 className="section-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={18} className="accent" /> POPULARES DO BRASIL
            </span>
            <Link to="/search" style={{ fontSize: '0.8rem', color: 'var(--accent-green)' }}>Ver Todos →</Link>
          </h2>

          {loading ? (
            <div style={{ color: 'var(--text-muted)', padding: '40px 0' }}>Carregando podcasts brasileiros...</div>
          ) : (
            <div className="poster-grid">
              {trending.map((podcast) => (
                <PodcastCard key={podcast.id} podcast={podcast} />
              ))}
            </div>
          )}

          {/* Categories */}
          <h2 className="section-title" style={{ marginTop: 20 }}>
            <span>Navegar por Categorias</span>
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 40 }}>
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                to={`/search?category=${encodeURIComponent(cat.name)}`}
                className="btn btn-secondary"
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                <Radio size={14} color="var(--accent-green)" /> {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar Activity */}
        <div>
          <h2 className="section-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} color="var(--accent-orange)" /> ATIVIDADE DA COMUNIDADE
            </span>
          </h2>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
