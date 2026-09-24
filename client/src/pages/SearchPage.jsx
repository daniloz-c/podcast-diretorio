import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search as SearchIcon } from 'lucide-react';
import PodcastCard from '../components/PodcastCard';
import { searchPodcasts, fetchCategories } from '../services/api';

export default function SearchPage() {
  const pageSize = 12;
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';

  const [podcasts, setPodcasts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [query, categoryParam]);

  const totalPages = Math.ceil(podcasts.length / pageSize);
  const firstPodcastIndex = (currentPage - 1) * pageSize;
  const visiblePodcasts = podcasts.slice(firstPodcastIndex, firstPodcastIndex + pageSize);

  const paginationItems = totalPages <= 7
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : currentPage <= 4
      ? [1, 2, 3, 4, 5, 'ellipsis-end', totalPages]
      : currentPage >= totalPages - 3
        ? [1, 'ellipsis-start', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        : [1, 'ellipsis-start', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-end', totalPages];

  const changePage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

        {/* Quick Category Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
          <button
            className={`btn ${!categoryParam && !query ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSearchParams({})}
            style={{ borderRadius: 'var(--radius-full)', fontSize: '0.8rem', padding: '4px 12px' }}
          >
            Todos
          </button>
          {categories.map((cat) => {
            const isActive = categoryParam.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSearchParams({ category: cat.name })}
                style={{ 
                  borderRadius: 'var(--radius-full)', 
                  fontSize: '0.8rem', 
                  padding: '4px 12px',
                  borderColor: cat.name.includes('Tecnologia') ? 'rgba(64, 188, 244, 0.4)' : cat.name.includes('Cultura Pop') ? 'rgba(255, 128, 0, 0.4)' : undefined
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>Buscando podcasts...</div>
      ) : podcasts.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', padding: '60px 0', textAlign: 'center' }}>
          Nenhum podcast encontrado para a busca. Tente buscar por outros termos!
        </div>
      ) : (
        <>
          <div className="poster-grid">
            {visiblePodcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Paginação de podcasts">
              <button
                className="pagination-button pagination-arrow"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Página anterior"
              >
                <ChevronLeft size={18} />
              </button>

              {paginationItems.map((item) => (
                typeof item === 'number' ? (
                  <button
                    key={item}
                    className={`pagination-button ${item === currentPage ? 'active' : ''}`}
                    onClick={() => changePage(item)}
                    aria-current={item === currentPage ? 'page' : undefined}
                  >
                    {item}
                  </button>
                ) : (
                  <span key={item} className="pagination-ellipsis" aria-hidden="true">...</span>
                )
              ))}

              <button
                className="pagination-button pagination-arrow"
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Próxima página"
              >
                <ChevronRight size={18} />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
