import { Router } from 'express';
import {
  getRatingByUserAndEpisode,
  insertRating,
  updateRating,
  deleteRating,
  getWatchlistByUser,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
  getRatingsByUser
} from '../config/database.js';

const router = Router();

// ─────────────────────────────────────────────
// Ratings (Avaliações)
// ─────────────────────────────────────────────

router.post('/ratings', (req, res) => {
  try {
    const { userId, episodeId, rating, comment } = req.body;

    if (!userId || !episodeId || rating === undefined) {
      return res.status(400).json({ error: 'userId, episodeId, and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if rating already exists
    const existing = getRatingByUserAndEpisode(userId, episodeId);

    if (existing) {
      // Update existing rating
      updateRating(userId, episodeId, rating, comment);
      return res.json({
        status: 'success',
        rating: { rating, comment, updated: true }
      });
    }

    // Insert new rating
    insertRating(userId, episodeId, rating, comment);
    return res.json({
      status: 'success',
      rating: { rating, comment, updated: false }
    });
  } catch (err) {
    console.error('[Ratings API] Error:', err);
    return res.status(500).json({ error: 'Failed to save rating' });
  }
});

router.get('/ratings', (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const ratings = getRatingsByUser(userId);
    return res.json({ status: 'success', ratings });
  } catch (err) {
    console.error('[Ratings API] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

router.delete('/ratings', (req, res) => {
  try {
    const { userId, episodeId } = req.body;

    if (!userId || !episodeId) {
      return res.status(400).json({ error: 'userId and episodeId required' });
    }

    deleteRating(userId, episodeId);
    return res.json({ status: 'success', message: 'Rating deleted' });
  } catch (err) {
    console.error('[Ratings API] Error:', err);
    return res.status(500).json({ error: 'Failed to delete rating' });
  }
});

// ─────────────────────────────────────────────
// Watchlist
// ─────────────────────────────────────────────

router.post('/watchlist', (req, res) => {
  try {
    const { userId, episodeId } = req.body;

    if (!userId || !episodeId) {
      return res.status(400).json({ error: 'userId and episodeId required' });
    }

    if (isInWatchlist(userId, episodeId)) {
      return res.json({ status: 'success', message: 'Already in watchlist' });
    }

    addToWatchlist(userId, episodeId);
    return res.json({ status: 'success', message: 'Added to watchlist' });
  } catch (err) {
    console.error('[Watchlist API] Error:', err);
    return res.status(500).json({ error: 'Failed to add to watchlist' });
  }
});

router.delete('/watchlist', (req, res) => {
  try {
    const { userId, episodeId } = req.body;

    if (!userId || !episodeId) {
      return res.status(400).json({ error: 'userId and episodeId required' });
    }

    removeFromWatchlist(userId, episodeId);
    return res.json({ status: 'success', message: 'Removed from watchlist' });
  } catch (err) {
    console.error('[Watchlist API] Error:', err);
    return res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});

router.get('/watchlist', (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const watchlist = getWatchlistByUser(userId);
    return res.json({ status: 'success', watchlist });
  } catch (err) {
    console.error('[Watchlist API] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

router.post('/watchlist/check', (req, res) => {
  try {
    const { userId, episodeId } = req.body;

    if (!userId || !episodeId) {
      return res.status(400).json({ error: 'userId and episodeId required' });
    }

    const inWatchlist = isInWatchlist(userId, episodeId);
    return res.json({ status: 'success', inWatchlist });
  } catch (err) {
    console.error('[Watchlist Check API] Error:', err);
    return res.status(500).json({ error: 'Failed to check watchlist' });
  }
});

export default router;