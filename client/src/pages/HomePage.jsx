import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Radio, Compass, Flag, Flame, Cpu, Film } from 'lucide-react';
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

  // Requisito: NA PÁGINA PRINCIPAL APRESENTAR SOMENTE OS 5 PODCASTS MAIS ESCUTADOS
  const top5Podcasts = trending.slice(0, 5);

  const getCategoryIcon = (catName) => {
    const nameLower = catName.toLowerCase();
    if (nameLower.includes('tecnologia') || nameLower.includes('ti')) {
      return <Cpu size={14} color="var(--accent-blue)" />;
    }
    if (nameLower.includes('cultura') || nameLower.includes('pop') || nameLower.includes('geek')) {
      return <Film size={14} color="var(--accent-orange)" />;
    }
    return <Radio size={14} color="var(--accent-green)" />;
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-text">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0, 168, 84, 0.25)', color: 'var(--accent-green)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: 12 }}>
            <Flag size={14} /> FOCADO EM PODCASTS BRASILEIROS 🇧🇷
          </div>
          <h1>Guarde, avalie e compartilhe os melhores podcasts do Brasil.</h1>
          <p>A rede social para entusiastas de áudio e podcasts brasileiros. Descubra lançamentos mais recentes, monte suas listas personalizadas e acompanhe a opinião da comunidade.</p>
          <div style={{ display: 'flex', gap: 14 }}>
            <Link to="/search" className="btn btn-primary">
              <Compass size={18} /> Explorar Todos os Podcasts BR
            </Link>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
        {/* Main Content Area */}
        <div>
          {/* Top 5 Section */}
          <h2 className="section-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Flame size={20} color="var(--accent-orange)" /> TOP 5 MAIS ESCUTADOS DO BRASIL
            </span>
            <Link to="/search" style={{ fontSize: '0.8rem', color: 'var(--accent-green)' }}>Ver Catálogo Completo →</Link>
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 16 }}>
            Os 5 podcasts mais populares e ouvidos no Brasil, baseados no ranking das principais plataformas.
          </p>

          {loading ? (
            <div style={{ color: 'var(--text-muted)', padding: '40px 0' }}>Carregando os 5 podcasts mais ouvidos...</div>
          ) : (
            <div className="poster-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
              {top5Podcasts.map((podcast, index) => (
                <PodcastCard key={podcast.id} podcast={podcast} rank={index + 1} />
              ))}
            </div>
          )}

          {/* Categorias em Destaque */}
          <h2 className="section-title" style={{ marginTop: 24 }}>
            <span>Navegar por Categorias</span>
            <Link to="/search" style={{ fontSize: '0.8rem', color: 'var(--accent-green)' }}>Explorar →</Link>
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 40 }}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/search?category=${encodeURIComponent(cat.name)}`}
                className="btn btn-secondary"
                style={{ 
                  borderRadius: 'var(--radius-full)',
                  borderColor: cat.name.includes('Tecnologia') ? 'rgba(64, 188, 244, 0.4)' : cat.name.includes('Cultura Pop') ? 'rgba(255, 128, 0, 0.4)' : undefined
                }}
              >
                {getCategoryIcon(cat.name)}
                <span>{cat.name}</span>
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
