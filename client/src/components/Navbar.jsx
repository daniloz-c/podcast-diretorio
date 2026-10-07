import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Radio, Compass, List, Bookmark, Clock, User, LogOut, PlusCircle, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onOpenCreateList }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, setIsAuthModalOpen } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand-logo">
          <div className="brand-dots">
            <span className="brand-dot dot-green"></span>
            <span className="brand-dot dot-blue"></span>
            <span className="brand-dot dot-orange"></span>
          </div>
          <span>PODBOXD</span>
        </Link>

        <form onSubmit={handleSearchSubmit} className="search-container">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar podcasts, episódios, listas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <nav className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            <Radio size={16} /> POPULARES
          </Link>
          <Link to="/search" className={`nav-link ${location.pathname.startsWith('/search') ? 'active' : ''}`}>
            <Compass size={16} /> DESCOBRIR
          </Link>
          <Link to="/lists" className={`nav-link ${location.pathname.startsWith('/lists') ? 'active' : ''}`}>
            <List size={16} /> LISTAS
          </Link>
          <Link to="/watchlist" className={`nav-link ${location.pathname === '/watchlist' ? 'active' : ''}`}>
            <Bookmark size={16} /> WATCHLIST
          </Link>
          <Link to="/diary" className={`nav-link ${location.pathname === '/diary' ? 'active' : ''}`}>
            <Clock size={16} /> DIÁRIO
          </Link>
          <button onClick={toggleTheme} className="nav-link" title="Alternar tema">
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>


          {currentUser ? (
            <>
              <button onClick={onOpenCreateList} className="btn btn-secondary" style={{ padding: '6px 12px' }}>
                <PlusCircle size={16} /> Nova Lista
              </button>

              <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
                <div className="avatar" style={{ width: 28, height: 28, fontSize: '0.8rem' }}>
                  {currentUser.displayName.charAt(0)}
                </div>
                {currentUser.displayName}
              </Link>
              <button onClick={logout} className="nav-link" title="Sair">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <button onClick={() => setIsAuthModalOpen(true)} className="btn btn-primary">
              <User size={16} /> Entrar
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
