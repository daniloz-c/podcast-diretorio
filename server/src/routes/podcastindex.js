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

// Função para bloquear podcasts indesejados / spam de feeds
function isBlockedPodcast(p) {
  const author = (p.artistName || p.author || p.ownerName || '').toLowerCase();
  const title = (p.collectionName || p.trackName || p.title || '').toLowerCase();
  
  // Requisito: Eliminar podcasts feitos por Terceirona Oficial
  if (author.includes('terceirona') || title.includes('terceirona')) {
    return true;
  }
  return false;
}

// Requisito: ELIMINAR PODCAST SEM EPISÓDIOS E PODCASTS BLOQUEADOS
// Deduplicar por título normalizado e filtrar podcasts com trackCount > 0
function deduplicateAndFilter(items) {
  const seen = new Map();
  for (const p of items) {
    // Elimina podcasts bloqueados (ex: Terceirona Oficial)
    if (isBlockedPodcast(p)) {
      continue;
    }

    // Elimina podcasts sem episódios (trackCount <= 0 ou inexistente)
    const trackCount = p.trackCount || 0;
    if (trackCount <= 0) {
      continue;
    }

    // Normalizar: lowercase, sem acentos/pontuação, primeiros 30 chars
    const normalizedTitle = (p.collectionName || p.trackName || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 30);

    if (!normalizedTitle) continue;

    const existing = seen.get(normalizedTitle);
    if (!existing || trackCount > (existing.trackCount || 0)) {
      seen.set(normalizedTitle, p);
    }
  }
  return [...seen.values()];
}

// ─────────────────────────────────────────────
// IDs de podcasts brasileiros ordenados pelos mais escutados (Spotify / Apple Charts Brasil)
// ─────────────────────────────────────────────
const BR_TOP_PODCAST_IDS = [
  1533526944, // #1 Podpah — Igão e Mítico
  1466327128, // #2 Flow Podcast — Grupo Flow (Feed oficial ativo com +1470 episódios)
  381816509,  // #3 NerdCast — Jovem Nerd (Cultura Pop & TI)
  1477406521, // #4 O Assunto — Natuza Nery / G1
  1566207871, // #5 Inteligência Ltda. — Rogério Vilela
  1802248733, // #6 Mano a Mano — Mano Brown
  1492958937, // #7 Modus Operandi — Carol Moreira e Mabê
  1498261768, // #8 Não Inviabilize — Déia Freitas
  1492466080, // #9 Psicologia na Prática — Alana Anijar
  1133325943, // #10 Hipsters Ponto Tech — Alura (Tecnologia / TI)
  1583050574, // #11 Ciência Sem Fim — Sérgio Sacani
  504897783,  // #12 Braincast — B9 (Tecnologia / Cultura)
  996967108,  // #13 Xadrez Verbal — Filipe Figueiredo e Matias Pinto
  1653631116, // #14 Rádio Novelo Apresenta — Rádio Novelo
  1493602027, // #15 História em Meia Hora — Vítor Soares
  1456306439, // #16 Papo de Segunda — GNT
];

// Mapa de ranking para priorizar os mais escutados
const RANK_MAP = new Map();
BR_TOP_PODCAST_IDS.forEach((id, index) => {
  RANK_MAP.set(Number(id), index + 1);
});

// ─────────────────────────────────────────────
// GET /podcasts/trending — Top podcasts brasileiros ordenados por mais escutados
// ─────────────────────────────────────────────
router.get('/podcasts/trending', async (req, res) => {
  try {
    const [featuredResponse, discoveryResponse1, discoveryResponse2] = await Promise.all([
      axios.get(
        `${ITUNES_BASE}/lookup?id=${BR_TOP_PODCAST_IDS.join(',')}&entity=podcast`,
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
    const discovered = [
      ...(discoveryResponse1.data?.results || []),
      ...(discoveryResponse2.data?.results || [])
    ].filter(r => r.wrapperType === 'track' || r.kind === 'podcast');

    // Eliminar podcasts sem episódios e deduplicar
    const results = deduplicateAndFilter([...featured, ...discovered]);

    // Ordenar: primeiro pelo ranking oficial dos mais ouvidos, depois por quantidade de episódios
    const sorted = results.sort((a, b) => {
      const idA = Number(a.collectionId || a.trackId);
      const idB = Number(b.collectionId || b.trackId);
      const rankA = RANK_MAP.get(idA) || 999;
      const rankB = RANK_MAP.get(idB) || 999;

      if (rankA !== rankB) {
        return rankA - rankB; // Ordem dos mais escutados primeiro (1, 2, 3, 4, 5...)
      }
      return (b.trackCount || 0) - (a.trackCount || 0);
    });

    return res.json({ status: 'true', feeds: sorted.map(normalizeiTunesPodcast) });
  } catch (err) {
    console.warn('[iTunes Trending] Erro:', err.message);
    return res.status(500).json({ status: 'false', message: 'Falha ao buscar podcasts em destaque' });
  }
});

// ─────────────────────────────────────────────
// GET /podcasts/search?q=termo — Busca via iTunes (país BR) com suporte a categorias especiais
// ─────────────────────────────────────────────
router.get('/podcasts/search', async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  if (!q) return res.redirect('/api/podcasts/trending');

  // Mapeamento semântico de categorias especiais: Tecnologia (TI) e Cultura Pop (Geek/Nerd)
  let itunesSearchTerm = q;
  const lowerQ = q.toLowerCase();

  if (lowerQ.includes('tecnologia') || lowerQ === 'ti' || lowerQ.includes('programação')) {
    itunesSearchTerm = 'podcast tecnologia programacao ti brasil';
  } else if (lowerQ.includes('cultura pop') || lowerQ.includes('geek') || lowerQ.includes('nerd')) {
    itunesSearchTerm = 'podcast cultura pop geek nerd cinema brasil';
  }

  try {
    const response = await axios.get(
      `${ITUNES_BASE}/search?term=${encodeURIComponent(itunesSearchTerm)}&country=BR&media=podcast&entity=podcast&limit=100`,
      { timeout: 8000 }
    );
    const raw = (response.data?.results || []).filter(r => r.wrapperType === 'track' || r.kind === 'podcast');
    
    // Eliminar podcast sem episódios e deduplicar
    const results = deduplicateAndFilter(raw)
      .sort((a, b) => {
        const idA = Number(a.collectionId || a.trackId);
        const idB = Number(b.collectionId || b.trackId);
        const rankA = RANK_MAP.get(idA) || 999;
        const rankB = RANK_MAP.get(idB) || 999;
        if (rankA !== rankB) return rankA - rankB;
        return (b.trackCount || 0) - (a.trackCount || 0);
      });

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
// Requisito: QUANDO ABRIR A PÁGINA DE UM PODCAST APRESENTAR OS EPISÓDEOS MAIS RECENTES (ordem decrescente)
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
        feedImage: ep.itunes?.image?.$?.href || coverImage,
        feedId: Number(id),
        link: ep.link || ''
      };
    });

    // Requisito: Apresentar os episódios mais recentes primeiro (decrescente de data)
    items.sort((a, b) => (b.datePublished || 0) - (a.datePublished || 0));

    return res.json({ status: 'true', items });
  } catch (err) {
    console.warn('[RSS Parser] Erro ao parsear feed:', err.message);
    return res.json({ status: 'true', items: [] });
  }
});

// ─────────────────────────────────────────────
// GET /episodes/byid?id=:episodeGuid — Detalhes do episódio
// ─────────────────────────────────────────────
router.get('/episodes/byid', async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: 'Episode ID required' });
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
// GET /categories — Categorias incluindo Tecnologia (TI) e Cultura Pop (Geek/Nerd)
// ─────────────────────────────────────────────
router.get('/categories', async (req, res) => {
  return res.json({
    status: 'true',
    categories: [
      { id: 1515, name: 'Tecnologia', description: 'Podcasts focados na área da TI, programação e inovação' },
      { id: 1324, name: 'Cultura Pop', description: 'Podcasts sobre universo geek, nerd, cinema, animes e games' },
      { id: 1303, name: 'Comédia', description: 'Humor, stand-up e bate-papos descontraídos' },
      { id: 1489, name: 'Notícias', description: 'Jornalismo diário, política e acontecimentos' },
      { id: 1516, name: 'True Crime', description: 'Investigação criminal e casos misteriosos' },
      { id: 1304, name: 'Educação', description: 'História, filosofia, ciência e aprendizado' },
      { id: 1318, name: 'Negócios', description: 'Empreendedorismo, economia e investimentos' },
      { id: 1316, name: 'Esportes', description: 'Futebol e análises esportivas' },
      { id: 1314, name: 'Música', description: 'Cultura musical, entrevistas e álbuns' },
      { id: 1488, name: 'Saúde e Bem-Estar', description: 'Psicologia, autocuidado e mente' },
      { id: 1487, name: 'Ficção', description: 'Áudiodramas e histórias narradas' }
    ]
  });
});

export default router;
