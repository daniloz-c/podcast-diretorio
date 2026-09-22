import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter } from 'lucide-react';
import PodcastCard from '../components/PodcastCard';
import { searchPodcasts, fetchCategories } from '../services/api';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';

  const [podcasts, setPodcasts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    async function performSearch() {
      setLoading(true);
      const searchTerm = query || categoryParam;
      const [results, catList] = await Promise.all([
        searchPodcasts(searchTerm),
        fetchCategories()
      ]);
      setPodcasts(results);
      setCategories(catList);
      setLoading(false);
    }
    performSearch();
  }, [query, categoryParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 className="section-title" style={{ fontSize: '1.8rem', textTransform: 'none' }}>
          {query ? (
            <>Resultados para "<span className="accent">{query}</span>"</>
          ) : categoryParam ? (
            <>Categoria "<span className="accent">{categoryParam}</span>"</>
          ) : (
            'Descobrir Podcasts'
          )}
        </h1>

        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 12, marginTop: 16, maxWidth: 600 }}>
          <div className="search-container" style={{ maxWidth: '100%' }}>
            <SearchIcon className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Digite o nome de um podcast ou assunto..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Buscar
          </button>
        </form>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>Buscando podcasts...</div>
      ) : podcasts.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', padding: '60px 0', textAlign: 'center' }}>
          Nenhum podcast encontrado para a busca. Tente buscar por outros termos!
        </div>
      ) : (
        <div className="poster-grid">
          {podcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </div>
      )}
    </div>
  );
}
