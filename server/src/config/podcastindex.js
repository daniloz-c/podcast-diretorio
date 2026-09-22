import crypto from 'crypto';

export function getPodcastIndexHeaders() {
  const apiKey = process.env.PODCAST_INDEX_KEY || '';
  const apiSecret = process.env.PODCAST_INDEX_SECRET || '';

  if (!apiKey || !apiSecret) {
    return null;
  }

  const apiHeaderTime = Math.floor(Date.now() / 1000);
  const data4Hash = apiKey + apiSecret + apiHeaderTime;
  const hash = crypto.createHash('sha1').update(data4Hash).digest('hex');

  return {
    'User-Agent': 'LetterboxdForPodcasts/1.0',
    'X-Auth-Date': apiHeaderTime.toString(),
    'X-Auth-Key': apiKey,
    'Authorization': hash,
  };
}

// Fallback Mock Data - Top Podcasts Brasileiros
export const MOCK_PODCASTS = [
  {
    id: 75075,
    title: "NerdCast",
    url: "https://jovemnerd.com.br/nerdcast/",
    originalUrl: "https://jovemnerd.com.br/nerdcast/",
    link: "https://jovemnerd.com.br/nerdcast/",
    description: "O mundo da cultura pop, tecnologia, ciência e história debatidos com muito humor e bate-papo descontraído por Alexandre Ottoni e Azaghal.",
    author: "Jovem Nerd",
    ownerName: "Jovem Nerd",
    language: "pt-BR",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80",
    artwork: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80",
    lastUpdateTime: 1726000000,
    itunesId: 162985860,
    trendScore: 98,
    categories: { 1: "Cultura", 2: "Comédia", 3: "Tecnologia" }
  },
  {
    id: 123456,
    title: "Podpah",
    url: "https://podpah.com.br/feed",
    originalUrl: "https://podpah.com.br/feed",
    link: "https://podpah.com.br",
    description: "Igão e Mítico comandam o podcast mais zica da internet brasileira recebendo grandes nomes da música, esporte e entretenimento.",
    author: "Igão e Mítico",
    ownerName: "Podpah",
    language: "pt-BR",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&auto=format&fit=crop&q=80",
    artwork: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&auto=format&fit=crop&q=80",
    lastUpdateTime: 1726000000,
    itunesId: 154895000,
    trendScore: 97,
    categories: { 1: "Entretenimento", 2: "Humor" }
  },
  {
    id: 987654,
    title: "Mano a Mano",
    url: "https://manoamano.com/feed",
    originalUrl: "https://manoamano.com/feed",
    link: "https://manoamano.com",
    description: "Mano Brown comanda conversas diretas sobre música, racismo, esporte, política e diversidade cultural no Brasil.",
    author: "Mano Brown",
    ownerName: "Spotify Studios Brasil",
    language: "pt-BR",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    artwork: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    lastUpdateTime: 1726000000,
    itunesId: 158900111,
    trendScore: 95,
    categories: { 1: "Música", 2: "Sociedade & Cultura" }
  },
  {
    id: 554433,
    title: "Hipsters Ponto Tech",
    url: "https://hipsters.tech/feed/podcast/",
    originalUrl: "https://hipsters.tech/feed/podcast/",
    link: "https://hipsters.tech",
    description: "Discussões sobre programação, inteligência artificial, design, startups e tecnologia no ecossistema brasileiro com a equipe da Alura.",
    author: "Alura",
    ownerName: "Alura Tecnologias",
    language: "pt-BR",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    artwork: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    lastUpdateTime: 1726000000,
    itunesId: 114598000,
    trendScore: 92,
    categories: { 1: "Tecnologia", 2: "Educação" }
  },
  {
    id: 334455,
    title: "Modus Operandi",
    url: "https://modusoperandi.com/feed",
    originalUrl: "https://modusoperandi.com/feed",
    link: "https://modusoperandi.com",
    description: "O maior podcast de True Crime do Brasil com Carol Moreira e Mabê Bonafé analisando casos misteriosos e históricos.",
    author: "Carol Moreira & Mabê Bonafé",
    ownerName: "Globo",
    language: "pt-BR",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    artwork: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    lastUpdateTime: 1726000000,
    itunesId: 149870000,
    trendScore: 94,
    categories: { 1: "True Crime", 2: "Sociedade" }
  },
  {
    id: 112233,
    title: "Café da Manhã",
    url: "https://folha.com.br/cafedamanha/feed",
    originalUrl: "https://folha.com.br/cafedamanha/feed",
    link: "https://folha.com.br",
    description: "Um podcast diário de notícias da Folha de S.Paulo trazendo os fatos mais importantes do Brasil e do mundo todas as manhãs.",
    author: "Folha de S.Paulo",
    ownerName: "Folha / Spotify Brasil",
    language: "pt-BR",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80",
    artwork: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80",
    lastUpdateTime: 1726000000,
    itunesId: 144888000,
    trendScore: 93,
    categories: { 1: "Notícias", 2: "Política Brasileira" }
  },
  {
    id: 887766,
    title: "O Assunto",
    url: "https://g1.globo.com/podcast/o-assunto/feed",
    originalUrl: "https://g1.globo.com/podcast/o-assunto/feed",
    link: "https://g1.globo.com",
    description: "Natuza Nery aprofunda um tema relevante da política, economia e sociedade brasileira com especialistas e repórteres do G1.",
    author: "Natuza Nery",
    ownerName: "G1 Globo",
    language: "pt-BR",
    image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80",
    artwork: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80",
    lastUpdateTime: 1726000000,
    itunesId: 147685000,
    trendScore: 96,
    categories: { 1: "Jornalismo", 2: "Notícias" }
  },
  {
    id: 665544,
    title: "Braincast",
    url: "https://b9.com.br/braincast/feed",
    originalUrl: "https://b9.com.br/braincast/feed",
    link: "https://b9.com.br",
    description: "Carlos Merigo, Ju Wallauer e convidados discutem a interseção entre criatividade, tecnologia, cultura digital e negócios no Brasil.",
    author: "B9",
    ownerName: "Rede B9",
    language: "pt-BR",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    artwork: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    lastUpdateTime: 1726000000,
    itunesId: 125600000,
    trendScore: 90,
    categories: { 1: "Cultura Digital", 2: "Tecnologia" }
  }
];

export const MOCK_EPISODES = {
  75075: [
    {
      id: 1001,
      title: "NerdCast 01 - O Começo de Tudo: RPG e Cultura Pop",
      description: "O primeiríssimo episódio histórico do NerdCast gravado em 2006 falando sobre RPG de mesa e cultura geek.",
      datePublished: 1144972800, // 2006 (Oldest)
      duration: 2400,
      enclosureUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      feedImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80",
      feedId: 75075
    },
    {
      id: 1002,
      title: "NerdCast 100 - O Fenômeno Star Wars no Brasil",
      description: "Debate profundo sobre o impacto da trilogia original no público brasileiro.",
      datePublished: 1208131200, // 2008
      duration: 3600,
      enclosureUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      feedImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80",
      feedId: 75075
    },
    {
      id: 1003,
      title: "NerdCast 500 - 10 Anos de NerdCast e Histórias Inéditas",
      description: "Episódio comemorativo de 10 anos relembrando a trajetória do podcast.",
      datePublished: 1460592000, // 2016
      duration: 5400,
      enclosureUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      feedImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80",
      feedId: 75075
    },
    {
      id: 1004,
      title: "NerdCast 950 - Inteligência Artificial & O Futuro da Programação",
      description: "Discutimos a revolução dos agentes autônomos de IA e como os desenvolvedores estão adaptando suas rotinas.",
      datePublished: 1726100000, // 2026 (Newest)
      duration: 7200,
      enclosureUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      feedImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80",
      feedId: 75075
    }
  ],
  123456: [
    {
      id: 2001,
      title: "Podpah #001 - Episódio de Estreia com Igão e Mítico",
      description: "Abertura oficial do canal Podpah falando sobre a ideia e bastidores.",
      datePublished: 1600000000,
      duration: 3600,
      enclosureUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      feedImage: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&auto=format&fit=crop&q=80",
      feedId: 123456
    },
    {
      id: 2002,
      title: "Podpah #400 - Papo sobre Tecnologia e Inovação",
      description: "Um bate papo descontraído com criadores de conteúdo e desenvolvedores no Brasil.",
      datePublished: 1726000000,
      duration: 10800,
      enclosureUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      feedImage: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&auto=format&fit=crop&q=80",
      feedId: 123456
    }
  ]
};
