import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import podcastIndexRoutes from './routes/podcastindex.js';
import { getPodcasts, insertPodcasts, getPodcastByItunesId, getEpisodes, insertEpisodes, getCategories } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Letterboxd Podcast Server', timestamp: new Date() });
});

// Cache endpoints (SQLite-backed)
app.get('/api/cache/podcasts', (req, res) => {
  try {
    const podcasts = getPodcasts();
    res.json({ status: 'true', feeds: podcasts });
  } catch (err) {
    console.error('[Cache] Erro ao buscar podcasts:', err.message);
    res.json({ status: 'false', feeds: [] });
  }
});

app.get('/api/cache/podcasts/:itunesId', (req, res) => {
  try {
    const podcast = getPodcastByItunesId(Number(req.params.itunesId));
    if (podcast) {
      res.json({ status: 'true', feed: podcast });
    } else {
      res.status(404).json({ status: 'false', message: 'Podcast não encontrado no cache' });
    }
  } catch (err) {
    console.error('[Cache] Erro ao buscar podcast:', err.message);
    res.status(500).json({ status: 'false', message: 'Erro no cache' });
  }
});

app.get('/api/cache/episodes/:itunesId', (req, res) => {
  try {
    const episodes = getEpisodes(Number(req.params.itunesId));
    res.json({ status: 'true', items: episodes });
  } catch (err) {
    console.error('[Cache] Erro ao buscar episódios:', err.message);
    res.json({ status: 'true', items: [] });
  }
});

app.get('/api/cache/categories', (req, res) => {
  try {
    const categories = getCategories();
    res.json({ status: 'true', categories });
  } catch (err) {
    console.error('[Cache] Erro ao buscar categorias:', err.message);
    res.json({ status: 'false', categories: [] });
  }
});

// API Routes
app.use('/api', podcastIndexRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Letterboxd Podcast Server running on http://localhost:${PORT}`);
  console.log(`💾 SQLite database: ${process.env.DB_PATH || './data/podcast.sqlite'}`);
});
