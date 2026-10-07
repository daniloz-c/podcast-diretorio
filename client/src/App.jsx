import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PodcastPage from './pages/PodcastPage';
import EpisodePage from './pages/EpisodePage';
import SearchPage from './pages/SearchPage';
import UserProfilePage from './pages/UserProfilePage';
import CustomListsPage from './pages/CustomListsPage';
import AudioPlayerBar from './components/AudioPlayerBar';
import CreateListModal from './components/CreateListModal';
import AuthModal from './components/AuthModal';
import DiaryPage from './pages/DiaryPage';
import WatchlistPage from './pages/WatchlistPage';
import { AuthProvider } from './context/AuthContext';
import { AudioProvider } from './context/AudioContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <AudioProvider>
          <BrowserRouter>
            <div className="app-container">
              <Navbar onOpenCreateList={() => setIsCreateListOpen(true)} />
            
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/podcast/:id" element={<PodcastPage />} />
                <Route path="/episode/:id" element={<EpisodePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/lists" element={<CustomListsPage onOpenCreateList={() => setIsCreateListOpen(true)} />} />
                <Route path="/diary" element={<DiaryPage />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
              </Routes>
            </main>

            <AudioPlayerBar />
            <CreateListModal isOpen={isCreateListOpen} onClose={() => setIsCreateListOpen(false)} />
            <AuthModal />
          </div>
        </BrowserRouter>
      </AudioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
