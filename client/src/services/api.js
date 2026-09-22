import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000
});

export async function fetchTrendingPodcasts() {
  try {
    const res = await api.get('/podcasts/trending');
    return res.data.feeds || [];
  } catch (error) {
    console.error('Error fetching trending podcasts:', error);
    return [];
  }
}

export async function searchPodcasts(query) {
  try {
    const res = await api.get(`/podcasts/search?q=${encodeURIComponent(query)}`);
    return res.data.feeds || [];
  } catch (error) {
    console.error('Error searching podcasts:', error);
    return [];
  }
}

export async function fetchPodcastById(id) {
  try {
    const res = await api.get(`/podcasts/byid?id=${id}`);
    return res.data.feed || null;
  } catch (error) {
    console.error('Error fetching podcast details:', error);
    return null;
  }
}

export async function fetchEpisodesByFeedId(feedId, feedUrl = null) {
  try {
    const params = new URLSearchParams({ id: feedId });
    if (feedUrl) params.append('feedUrl', feedUrl);
    const res = await api.get(`/episodes/byfeedid?${params.toString()}`);
    return res.data.items || [];
  } catch (error) {
    console.error('Error fetching podcast episodes:', error);
    return [];
  }
}

export async function fetchEpisodeById(id) {
  try {
    const res = await api.get(`/episodes/byid?id=${id}`);
    return res.data.episode || null;
  } catch (error) {
    console.error('Error fetching episode:', error);
    return null;
  }
}

export async function fetchCategories() {
  try {
    const res = await api.get('/categories');
    return res.data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default api;
