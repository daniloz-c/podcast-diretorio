import test from 'node:test';
import assert from 'node:assert/strict';
import { latestEpisodeDate, selectRecentPodcasts, RECENT_EPISODE_WINDOW_MS } from '../src/services/recentPodcasts.js';

const now = Date.parse('2026-10-24T12:00:00Z');
const podcast = (id, date) => ({ id, latestEpisodePublishedAt: date });

test('aceita somente episódios com menos de 30 dias, sem datas futuras ou inválidas', () => {
  const items = [
    podcast(1, new Date(now - 1000).toISOString()),
    podcast(2, new Date(now - RECENT_EPISODE_WINDOW_MS).toISOString()),
    podcast(3, new Date(now - RECENT_EPISODE_WINDOW_MS + 1).toISOString()),
    podcast(4, new Date(now + 1000).toISOString()),
    podcast(5, null),
    podcast(6, 'inválida')
  ];
  assert.deepEqual(selectRecentPodcasts(items, now).map(p => p.id), [1, 3]);
});

test('preserva ranking e limita a cinco após filtrar', () => {
  const items = Array.from({ length: 8 }, (_, id) => podcast(id, new Date(now).toISOString()));
  assert.deepEqual(selectRecentPodcasts(items, now).map(p => p.id), [0, 1, 2, 3, 4]);
});

test('encontra publicação mais recente em RSS fora de ordem e ignora datas futuras', () => {
  assert.equal(latestEpisodeDate([
    { pubDate: '2026-10-01T12:00:00Z' },
    { isoDate: '2026-10-23T12:00:00Z' },
    { pubDate: 'invalid' },
    { isoDate: '2026-11-01T12:00:00Z' }
  ], now), '2026-10-23T12:00:00.000Z');
  assert.equal(latestEpisodeDate([], now), null);
});
