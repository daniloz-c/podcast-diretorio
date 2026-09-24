import { Router } from 'express';
import axios from 'axios';
import Parser from 'rss-parser';
import crypto from 'crypto';

const router = Router();
const rssParser = new Parser({
  timeout: 8000,
  headers: { 'User-Agent': 'Podboxd/1.0 (podcast discovery app)' },
  customFields: {
    item: [
      ['itunes:duration', 'duration'],
      ['itunes:image', 'itunesImage'],
    ]
  }
});

// ─────────────────────────────────────────────
// iTunes Search API — gratuita, sem chave, podcasts reais
// ─────────────────────────────────────────────
const ITUNES_BASE = 'https://itunes.apple.com';

function normalizeiTunesPodcast(item) {
  return {
    id: item.collectionId || item.trackId,
    title: item.collectionName || item.trackName,
    author: item.artistName,
    ownerName: item.artistName,
    description: item.description || '',
    image: item.artworkUrl600 || item.artworkUrl100 || '',
    artwork: item.artworkUrl600 || item.artworkUrl100 || '',
    link: item.collectionViewUrl || '',
    feedUrl: item.feedUrl || '',
    language: 'pt-BR',
    itunesId: item.collectionId,
    trackCount: item.trackCount || 0,
    primaryGenreName: item.primaryGenreName || '',
    categories: { 1: item.primaryGenreName || 'Podcasts' },
    genres: item.genres || [],
    country: item.country || 'BRA',
    trendScore: 80,
    source: 'itunes'
  };
}

// Deduplicar por título normalizado — elimina feeds distintos do mesmo podcast
// Mantém o com maior trackCount (mais episódios = feed principal)
function deduplicateByTitle(items) {
  const seen = new Map();
  for (const p of items) {
    // Normalizar: lowercase, sem acentos/pontuação, primeiros 30 chars
    const normalizedTitle = (p.collectionName || p.trackName || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 30);
    const existing = seen.get(normalizedTitle);
    if (!existing || (p.trackCount || 0) > (existing.trackCount || 0)) {
      seen.set(normalizedTitle, p);
    }
  }
  return [...seen.values()];
}

// Filtrar podcasts claramente não-brasileiros (sem feedUrl ou country incorreto)
// Mantém podcasts com country BRA ou sem country (iTunes às vezes omite)
function filterBrazilianOnly(items) {
  return items.filter(p => {
    const country = (p.country || '').toUpperCase();
    return !country || country === 'BRA' || country === 'BR';
  });
}


// ─────────────────────────────────────────────
// PodcastIndex headers helper (optional, for when keys are provided)
// ─────────────────────────────────────────────
function getPodcastIndexHeaders() {
  const apiKey = process.env.PODCAST_INDEX_KEY || '';
  const apiSecret = process.env.PODCAST_INDEX_SECRET || '';
  if (!apiKey || !apiSecret) return null;
  const apiHeaderTime = Math.floor(Date.now() / 1000);
  const hash = crypto.createHash('sha1').update(apiKey + apiSecret + apiHeaderTime).digest('hex');
  return {
    'User-Agent': 'Podboxd/1.0',
    'X-Auth-Date': String(apiHeaderTime),
    'X-Auth-Key': apiKey,
    'Authorization': hash,
  };
}

// IDs de podcasts brasileiros conhecidos no iTunes — sem duplicatas
const BR_PODCAST_IDS = [
  1477406521, // O Assunto — G1
  381816509,  // NerdCast — Jovem Nerd
  1533526944, // Podpah
  504897783,  // Braincast — B9
  1133325943, // Hipsters Ponto Tech — Alura
  996967108,  // Xadrez Verbal
  1583050574, // Ciência Sem Fim — Estúdios Flow
  1492958937, // Modus Operandi
  1437955740, // Flow Podcast
  1802248733, // Mano a Mano — Mano Brown
  1480878918, // Vozes do Rádio
  1410154502, // Inteligência Ltda
  1441935321, // Café da Manhã — Folha
  1572970113, // Papo de Segunda
  1659038721, // História em Meia Hora
  1522979073, // Rádio Novelo Apresenta
];

// ─────────────────────────────────────────────
// GET /podcasts/trending — Top podcasts brasileiros via lookup direto no iTunes
// ─────────────────────────────────────────────
router.get('/podcasts/trending', async (req, res) => {
  try {
    const [featuredResponse, ...discoveryResponses] = await Promise.all([
      axios.get(
        `${ITUNES_BASE}/lookup?id=${BR_PODCAST_IDS.join(',')}&entity=podcast`,
        { timeout: 10000 }
      ),
      axios.get(
        `${ITUNES_BASE}/search?term=podcast%20brasil&country=BR&media=podcast&entity=podcast&limit=100`,
        { timeout: 10000 }
      ),
      axios.get(
        `${ITUNES_BASE}/search?term=podcast%20brasileiro&country=BR&media=podcast&entity=podcast&limit=100`,
        { timeout: 10000 }
      )
    ]);

    const featured = (featuredResponse.data?.results || [])
      .filter(r => r.wrapperType === 'track' || r.kind === 'podcast');
    const discovered = discoveryResponses.flatMap(response => response.data?.results || [])
      .filter(r => r.wrapperType === 'track' || r.kind === 'podcast');
    const results = deduplicateByTitle([...featured, ...discovered]);
    // Ordenar pelo número de episódios e manter a ordem original dos IDs como tie-breaker
    const sorted = results.sort((a, b) => (b.trackCount || 0) - (a.trackCount || 0));
    return res.json({ status: 'true', feeds: sorted.map(normalizeiTunesPodcast) });
  } catch (err) {
    console.warn('[iTunes Trending] Erro:', err.message);
    return res.status(500).json({ status: 'false', message: 'Falha ao buscar podcasts em destaque' });
  }
});


// ─────────────────────────────────────────────
// GET /podcasts/search?q=termo — Busca via iTunes (país BR)
// ─────────────────────────────────────────────
router.get('/podcasts/search', async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  if (!q) return res.redirect('/api/podcasts/trending');

  try {
    const response = await axios.get(
      `${ITUNES_BASE}/search?term=${encodeURIComponent(q)}&country=BR&media=podcast&entity=podcast&limit=100`,
      { timeout: 8000 }
    );
    const raw = (response.data?.results || []).filter(r => r.wrapperType === 'track');
    // Deduplicar por título normalizado
    const results = deduplicateByTitle(raw)
      .sort((a, b) => (b.trackCount || 0) - (a.trackCount || 0));
    return res.json({ status: 'true', feeds: results.map(normalizeiTunesPodcast) });
  } catch (err) {
    console.warn('[iTunes Search] Erro:', err.message);
    return res.json({ status: 'false', feeds: [] });
  }
});

// ─────────────────────────────────────────────
// GET /podcasts/byid?id=:id — Detalhes de podcast via iTunes
// ─────────────────────────────────────────────
router.get('/podcasts/byid', async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: 'ID required' });

  try {
    const response = await axios.get(
      `${ITUNES_BASE}/lookup?id=${id}`,
      { timeout: 8000 }
    );
    const results = response.data?.results || [];
    const podcast = results.find(r => r.wrapperType === 'track' || r.kind === 'podcast');
    if (podcast) {
      return res.json({ status: 'true', feed: normalizeiTunesPodcast(podcast) });
    }
  } catch (err) {
    console.warn('[iTunes Lookup] Erro:', err.message);
  }
  return res.status(404).json({ status: 'false', message: 'Podcast não encontrado' });
});

// ─────────────────────────────────────────────
// GET /episodes/byfeedid?id=:itunesId — Episódios via RSS (feedUrl do iTunes)
// ─────────────────────────────────────────────
router.get('/episodes/byfeedid', async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: 'Feed ID required' });

  let feedUrl = req.query.feedUrl || null;

  // Se não tiver feedUrl, buscar via iTunes lookup
  if (!feedUrl) {
    try {
      const lookupRes = await axios.get(`${ITUNES_BASE}/lookup?id=${id}`, { timeout: 6000 });
      const podcast = (lookupRes.data?.results || []).find(r => r.feedUrl);
      feedUrl = podcast?.feedUrl || null;
    } catch (err) {
      console.warn('[iTunes Lookup for feedUrl] Erro:', err.message);
    }
  }

  if (!feedUrl) {
    return res.json({ status: 'true', items: [] });
  }

  try {
    const feed = await rssParser.parseURL(feedUrl);
    const coverImage = feed.image?.url || feed.itunes?.image || '';

    const items = (feed.items || []).map((ep, idx) => {
      const pub = ep.pubDate ? Math.floor(new Date(ep.pubDate).getTime() / 1000) : 0;
      let durationSec = 0;
      if (ep.itunes?.duration) {
        const parts = String(ep.itunes.duration).split(':').map(Number);
        if (parts.length === 3) durationSec = parts[0] * 3600 + parts[1] * 60 + parts[2];
        else if (parts.length === 2) durationSec = parts[0] * 60 + parts[1];
        else durationSec = parts[0] || 0;
      }

      return {
        id: ep.guid || `ep-${id}-${idx}`,
        title: ep.title || `Episódio ${idx + 1}`,
        description: ep.contentSnippet || ep.content || ep.itunes?.summary || '',
        datePublished: pub,
        duration: durationSec,
        enclosureUrl: ep.enclosure?.url || '',
        feedImage: ep.itunes?.image?.$ ?.href || coverImage,
        feedId: Number(id),
        link: ep.link || ''
      };
    });

    // Sort ascending: oldest → newest (conforme requisito do ideia.md)
    items.sort((a, b) => a.datePublished - b.datePublished);

    return res.json({ status: 'true', items });
  } catch (err) {
    console.warn('[RSS Parser] Erro ao parsear feed:', err.message);
    return res.json({ status: 'true', items: [] });
  }
});

// ─────────────────────────────────────────────
// GET /episodes/byid?id=:episodeGuid — Busca episódio pelo GUID
// (Guardamos isso em memória temporária; por simplicidade retorna vazio)
// ─────────────────────────────────────────────
router.get('/episodes/byid', async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: 'Episode ID required' });
  // Sem cache local, redirecionamos a busca para o feed do podcast pai
  return res.json({
    status: 'true',
    episode: {
      id,
      title: 'Episódio',
      description: '',
      datePublished: 0,
      duration: 0,
      enclosureUrl: '',
      feedImage: '',
      feedId: null
    }
  });
});

// ─────────────────────────────────────────────
// GET /categories — Géneros disponíveis na Apple Podcasts BR
// ─────────────────────────────────────────────
router.get('/categories', async (req, res) => {
  return res.json({
    status: 'true',
    categories: [
      { id: 1303, name: 'Comédia' },
      { id: 1489, name: 'Notícias' },
      { id: 1324, name: 'Sociedade e Cultura' },
      { id: 1304, name: 'Educação' },
      { id: 1305, name: 'Crianças e Família' },
      { id: 1316, name: 'Esportes' },
      { id: 1485, name: 'Arte' },
      { id: 1301, name: 'Artes Cênicas' },
      { id: 1487, name: 'Ficção' },
      { id: 1507, name: 'Jogos' },
      { id: 1502, name: 'Lazer' },
      { id: 1314, name: 'Música' },
      { id: 1488, name: 'Saúde e Bem-Estar' },
      { id: 1515, name: 'Tecnologia' },
      { id: 1516, name: 'True Crime' },
      { id: 1318, name: 'Negócios' },
    ]
  });
});

export default router;
