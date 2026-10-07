import Database from 'better-sqlite3';
import { resolve, dirname } from 'path';
import { mkdirSync, existsSync } from 'fs';

const dbPath = process.env.DB_PATH || './data/podcast.sqlite';
const absolutePath = resolve(dbPath);
const dbDir = dirname(absolutePath);

if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS podcasts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      itunes_id INTEGER NOT NULL UNIQUE,
      title TEXT NOT NULL,
      author TEXT,
      owner_name TEXT,
      description TEXT,
      image TEXT,
      artwork TEXT,
      link TEXT,
      feed_url TEXT,
      language TEXT DEFAULT 'pt-BR',
      country TEXT DEFAULT 'BRA',
      trend_score INTEGER DEFAULT 80,
      source TEXT DEFAULT 'itunes',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS episodes (
      id TEXT PRIMARY KEY,
      podcast_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      date_published INTEGER NOT NULL,
      duration INTEGER DEFAULT 0,
      enclosure_url TEXT,
      feed_image TEXT,
      feed_id INTEGER,
      link TEXT,
      FOREIGN KEY (podcast_id) REFERENCES podcasts(itunes_id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_episodes_date_published ON episodes(date_published);
    CREATE INDEX IF NOT EXISTS idx_episodes_podcast_date ON episodes(podcast_id, date_published DESC);

    CREATE TABLE IF NOT EXISTS user_ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      episode_id TEXT NOT NULL,
      rating INTEGER,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE,
      UNIQUE(user_id, episode_id)
    );

    CREATE INDEX IF NOT EXISTS idx_user_ratings_user ON user_ratings(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_ratings_episode ON user_ratings(episode_id);
    CREATE INDEX IF NOT EXISTS idx_user_ratings_date ON user_ratings(created_at DESC);

    CREATE TABLE IF NOT EXISTS watchlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      episode_id TEXT NOT NULL,
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE,
      UNIQUE(user_id, episode_id)
    );

    CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist(user_id);
    CREATE INDEX IF NOT EXISTS idx_watchlist_episode ON watchlist(episode_id);

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    INSERT OR IGNORE INTO categories (id, name, description) VALUES
    (1515, 'Tecnologia', 'Podcasts focados na área da TI, programação e inovação'),
    (1324, 'Cultura Pop', 'Podcasts sobre universo geek, nerd, cinema, animes e games'),
    (1303, 'Comédia', 'Humor, stand-up e bate-papos descontraídos'),
    (1489, 'Notícias', 'Jornalismo diário, política e acontecimentos'),
    (1516, 'True Crime', 'Investigação criminal e casos misteriosos'),
    (1304, 'Educação', 'História, filosofia, ciência e aprendizado'),
    (1318, 'Negócios', 'Empreendedorismo, economia e investimentos'),
    (1316, 'Esportes', 'Futebol e análises esportivas'),
    (1314, 'Música', 'Cultura musical, entrevistas e álbuns'),
    (1488, 'Saúde e Bem-Estar', 'Psicologia, autocuidado e mente'),
    (1487, 'Ficção', 'Áudiodramas e histórias narradas');
  `);
}

function getPodcasts() {
  return db.prepare('SELECT * FROM podcasts ORDER BY trend_score DESC, updated_at DESC').all();
}

function getPodcastByItunesId(itunesId) {
  return db.prepare('SELECT * FROM podcasts WHERE itunes_id = ?').get(itunesId);
}

function insertPodcast(podcast) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO podcasts (
      itunes_id, title, author, owner_name, description, image, artwork,
      link, feed_url, language, country, trend_score, source, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);
  return stmt.run(
    podcast.itunes_id,
    podcast.title,
    podcast.author,
    podcast.owner_name,
    podcast.description,
    podcast.image,
    podcast.artwork,
    podcast.link,
    podcast.feed_url,
    podcast.language || 'pt-BR',
    podcast.country || 'BRA',
    podcast.trend_score || 80,
    podcast.source || 'itunes'
  );
}

function insertPodcasts(podcasts) {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO podcasts (
      itunes_id, title, author, owner_name, description, image, artwork,
      link, feed_url, language, country, trend_score, source, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);
  const insertMany = db.transaction((podcasts) => {
    for (const p of podcasts) {
      insert.run(
        p.itunes_id,
        p.title,
        p.author,
        p.owner_name,
        p.description,
        p.image,
        p.artwork,
        p.link,
        p.feed_url,
        p.language || 'pt-BR',
        p.country || 'BRA',
        p.trend_score || 80,
        p.source || 'itunes'
      );
    }
  });
  insertMany(podcasts);
}

function getEpisodes(podcastId) {
  return db.prepare(`
    SELECT * FROM episodes WHERE podcast_id = ? ORDER BY date_published DESC
  `).all(podcastId);
}

function insertEpisodes(episodes) {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO episodes (
      id, podcast_id, title, description, date_published, duration,
      enclosure_url, feed_image, feed_id, link
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertMany = db.transaction((episodes) => {
    for (const ep of episodes) {
      insert.run(
        ep.id,
        ep.podcast_id,
        ep.title,
        ep.description,
        ep.date_published,
        ep.duration || 0,
        ep.enclosure_url,
        ep.feed_image,
        ep.feed_id,
        ep.link
      );
    }
  });
  insertMany(episodes);
}

function getCategories() {
  return db.prepare('SELECT * FROM categories ORDER BY name').all();
}

function getRatingByUserAndEpisode(userId, episodeId) {
  return db.prepare(`
    SELECT * FROM user_ratings
    WHERE user_id = ? AND episode_id = ?
  `).get(userId, episodeId);
}

function insertRating(userId, episodeId, rating, comment = null) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO user_ratings (user_id, episode_id, rating, comment, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);
  return stmt.run(userId, episodeId, rating, comment);
}

function updateRating(userId, episodeId, rating, comment) {
  const stmt = db.prepare(`
    UPDATE user_ratings
    SET rating = ?, comment = ?, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ? AND episode_id = ?
  `);
  return stmt.run(rating, comment, userId, episodeId);
}

function deleteRating(userId, episodeId) {
  const stmt = db.prepare('DELETE FROM user_ratings WHERE user_id = ? AND episode_id = ?');
  return stmt.run(userId, episodeId);
}

function getWatchlistByUser(userId) {
  return db.prepare(`
    SELECT w.id, w.added_at, e.*
    FROM watchlist w
    JOIN episodes e ON w.episode_id = e.id
    WHERE w.user_id = ?
    ORDER BY w.added_at DESC
  `).all(userId);
}

function addToWatchlist(userId, episodeId) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO watchlist (user_id, episode_id)
    VALUES (?, ?)
  `);
  return stmt.run(userId, episodeId);
}

function removeFromWatchlist(userId, episodeId) {
  const stmt = db.prepare('DELETE FROM watchlist WHERE user_id = ? AND episode_id = ?');
  return stmt.run(userId, episodeId);
}

function isInWatchlist(userId, episodeId) {
  const stmt = db.prepare('SELECT 1 FROM watchlist WHERE user_id = ? AND episode_id = ? LIMIT 1');
  const result = stmt.get(userId, episodeId);
  return !!result;
}

function getRatingsByUser(userId) {
  return db.prepare(`
    SELECT u.*, e.id AS episode_id, e.podcast_id, e.title AS episode_title, e.image AS episode_image,
           p.title AS podcast_title, p.author AS podcast_author
    FROM user_ratings u
    JOIN episodes e ON u.episode_id = e.id
    JOIN podcasts p ON e.podcast_id = p.itunes_id
    WHERE u.user_id = ?
    ORDER BY u.created_at DESC
  `).all(userId);
}

initSchema();

export {
  db,
  getPodcasts,
  getPodcastByItunesId,
  insertPodcast,
  insertPodcasts,
  getEpisodes,
  insertEpisodes,
  getCategories,
  getRatingByUserAndEpisode,
  insertRating,
  updateRating,
  deleteRating,
  getWatchlistByUser,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
  getRatingsByUser
};