export const RECENT_EPISODE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export function latestEpisodeDate(items, now = Date.now()) {
  const dates = items
    .map(item => Date.parse(item.isoDate || item.pubDate || ''))
    .filter(date => Number.isFinite(date) && date <= now);
  return dates.length ? new Date(Math.max(...dates)).toISOString() : null;
}

export function selectRecentPodcasts(podcasts, now = Date.now(), limit = 5) {
  return podcasts.filter(podcast => {
    const date = Date.parse(podcast.latestEpisodePublishedAt || '');
    return Number.isFinite(date) && date <= now && date > now - RECENT_EPISODE_WINDOW_MS;
  }).slice(0, limit);
}
