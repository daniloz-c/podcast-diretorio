import api from './api';

export async function saveRating(userId, episodeId, rating, comment = null) {
  try {
    const res = await api.post('/ratings', null, {
      params: { userId, episodeId, rating, comment }
    });
    return res.data;
  } catch (error) {
    console.error('Error saving rating:', error);
    throw error;
  }
}

export async function fetchUserRatings(userId) {
  try {
    const res = await api.get('/ratings', { params: { userId } });
    return res.data.ratings || [];
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return [];
  }
}

export async function deleteRating(userId, episodeId) {
  try {
    const res = await api.delete('/ratings', {
      { userId, episodeId }
    });
    return res.data;
  } catch (error) {
    console.error('Error deleting rating:', error);
    throw error;
  }
}

export async function addToWatchlist(userId, episodeId) {
  try {
    const res = await api.post('/watchlist', null, {
      params: { userId, episodeId }
    });
    return res.data;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
}

export async function removeFromWatchlist(userId, episodeId) {
  try {
    const res = await api.delete('/watchlist', {
      { userId, episodeId }
    });
    return res.data;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw error;
  }
}

export async function fetchUserWatchlist(userId) {
  try {
    const res = await api.get('/watchlist', { params: { userId } });
    return res.data.watchlist || [];
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return [];
  }
}

export async function checkWatchlist(userId, episodeId) {
  try {
    const res = await api.post('/watchlist/check', null, {
      params: { userId, episodeId }
    });
    return res.data.inWatchlist || false;
  } catch (error) {
    console.error('Error checking watchlist:', error);
    return false;
  }
}