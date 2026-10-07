import { saveRating } from './userService';

const STORAGE_KEYS = {

  FAVORITES: 'lb_podcast_favorites',
  LIKES: 'lb_podcast_likes',
  RATINGS: 'lb_podcast_ratings',
  REVIEWS: 'lb_podcast_reviews',
  FOLLOWS: 'lb_user_follows',
  LISTS: 'lb_custom_lists',
  ACTIVITIES: 'lb_activities',
  DIARY: 'lb_diary_entries',
  WATCHLIST: 'lb_podcast_watchlist'
};


function getStored(key, defaultValue = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function setStored(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to storage:', e);
  }
}

// Initial seed activities and diary if empty
function initializeMockSocialData() {
  const currentActivities = getStored(STORAGE_KEYS.ACTIVITIES, []);
  if (currentActivities.length === 0) {
    const initialActivities = [
      {
        id: 'act-1',
        userName: 'Danilo Silva',
        userHandle: '@danilosilva',
        action: 'evaluated',
        targetTitle: 'NerdCast 950 - Inteligência Artificial',
        rating: 5,
        reviewText: 'Episódio espetacular! Discussões muito pertinentes sobre o avanço dos LLMs.',
        timestamp: Date.now() - 3600000 * 2,
        podcastId: 75075
      },
      {
        id: 'act-2',
        userName: 'Ana Clara',
        userHandle: '@anaclara',
        action: 'favorited',
        targetTitle: 'Modus Operandi',
        timestamp: Date.now() - 3600000 * 5,
        podcastId: 334455
      },
      {
        id: 'act-3',
        userName: 'Lucas Tech',
        userHandle: '@lucastech',
        action: 'created_list',
        targetTitle: 'Melhores Podcasts de Programação 2026',
        timestamp: Date.now() - 3600000 * 12
      }
    ];
    setStored(STORAGE_KEYS.ACTIVITIES, initialActivities);
  }

  const currentLists = getStored(STORAGE_KEYS.LISTS, []);
  if (currentLists.length === 0) {
    const initialLists = [
      {
        id: 'list-1',
        title: 'Top 5 Podcasts para Finais de Semana',
        description: 'Episódios mais descontraídos e informativos para relaxar.',
        ownerName: 'Danilo Silva',
        ownerHandle: '@danilosilva',
        podcastsCount: 5,
        createdAt: Date.now() - 86400000,
        podcasts: [75075, 123456, 554433, 987654, 334455]
      }
    ];
    setStored(STORAGE_KEYS.LISTS, initialLists);
  }

  const currentDiary = getStored(STORAGE_KEYS.DIARY, []);
  if (currentDiary.length === 0) {
    const today = new Date();
    const formatDate = (d) => d.toISOString().split('T')[0];

    const d1 = new Date(today);
    const d2 = new Date(today);
    d2.setDate(d2.getDate() - 1);
    const d3 = new Date(today);
    d3.setDate(d3.getDate() - 4);
    const d4 = new Date(today);
    d4.setDate(d4.getDate() - 8);

    const initialDiary = [
      {
        id: 'diary-1',
        type: 'episode',
        podcastId: 75075,
        podcastTitle: 'NerdCast',
        podcastImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
        episodeId: 101,
        episodeTitle: 'NerdCast 950 - O Futuro da Inteligência Artificial',
        episodeDuration: 5760,
        rating: 5,
        liked: true,
        comment: 'Um dos melhores episódios do ano! A discussão sobre agentes autônomos e o impacto na programação foi fantástica.',
        listenedDate: formatDate(d1),
        createdAt: d1.getTime(),
        userName: 'Danilo Silva',
        userHandle: '@danilosilva'
      },
      {
        id: 'diary-2',
        type: 'episode',
        podcastId: 334455,
        podcastTitle: 'Modus Operandi',
        podcastImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
        episodeId: 202,
        episodeTitle: 'Caso O.J. Simpson: Os Detalhes do Julgamento do Século',
        episodeDuration: 4200,
        rating: 4.5,
        liked: true,
        comment: 'Roteiro impecável como sempre, mabê e carol entregando tudo no storytelling.',
        listenedDate: formatDate(d2),
        createdAt: d2.getTime(),
        userName: 'Danilo Silva',
        userHandle: '@danilosilva'
      },
      {
        id: 'diary-3',
        type: 'podcast',
        podcastId: 123456,
        podcastTitle: 'Mano a Mano',
        podcastImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
        rating: 5,
        liked: true,
        comment: 'Entrevistas de altíssimo nível cultural e político. Mano Brown é um mestre comunicador.',
        listenedDate: formatDate(d3),
        createdAt: d3.getTime(),
        userName: 'Danilo Silva',
        userHandle: '@danilosilva'
      },
      {
        id: 'diary-4',
        type: 'episode',
        podcastId: 554433,
        podcastTitle: 'Hipsters Ponto Tech',
        podcastImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
        episodeId: 404,
        episodeTitle: 'Arquitetura de Microsserviços vs Monólitos em 2026',
        episodeDuration: 3120,
        rating: 4,
        liked: false,
        comment: 'Boas reflexões técnicas sobre custo de nuvem e complexidade operacional.',
        listenedDate: formatDate(d4),
        createdAt: d4.getTime(),
        userName: 'Danilo Silva',
        userHandle: '@danilosilva'
      }
    ];
    setStored(STORAGE_KEYS.DIARY, initialDiary);

    // Initial sync of ratings and reviews with mock diary
    const ratings = getStored(STORAGE_KEYS.RATINGS, {});
    const reviews = getStored(STORAGE_KEYS.REVIEWS, []);
    
    initialDiary.forEach(item => {
      const targetId = item.episodeId ? `ep-${item.episodeId}` : item.podcastId;
      if (!ratings[targetId]) {
        ratings[targetId] = item.rating;
      }
      if (item.comment && !reviews.some(r => r.podcastId == targetId)) {
        reviews.push({
          id: `rev-${item.id}`,
          podcastId: targetId,
          podcastTitle: item.episodeTitle || item.podcastTitle,
          rating: item.rating,
          comment: item.comment,
          userName: item.userName,
          userHandle: item.userHandle,
          createdAt: item.createdAt,
          likes: item.liked ? 1 : 0
        });
      }
    });

    setStored(STORAGE_KEYS.RATINGS, ratings);
    setStored(STORAGE_KEYS.REVIEWS, reviews);
  }
}

initializeMockSocialData();

// FAVORITES
export function toggleFavorite(podcastId, podcastData) {
  const favorites = getStored(STORAGE_KEYS.FAVORITES, []);
  const index = favorites.findIndex(item => item.id == podcastId || item == podcastId);
  
  let updated;
  let isFav = false;

  if (index >= 0) {
    updated = favorites.filter(item => item.id != podcastId && item != podcastId);
  } else {
    updated = [...favorites, { id: podcastId, ...podcastData }];
    isFav = true;
    addActivity({
      action: 'favorited',
      targetTitle: podcastData?.title || `Podcast #${podcastId}`,
      podcastId
    });
  }

  setStored(STORAGE_KEYS.FAVORITES, updated);
  return isFav;
}

export function isFavorited(podcastId) {
  const favorites = getStored(STORAGE_KEYS.FAVORITES, []);
  return favorites.some(item => item.id == podcastId || item == podcastId);
}

export function getUserFavorites() {
  return getStored(STORAGE_KEYS.FAVORITES, []);
}

// WATCHLIST (Assistir / Ouvir Mais Tarde)
export function toggleWatchlist(itemData, user = null) {
  const watchlist = getStored(STORAGE_KEYS.WATCHLIST, []);
  const itemId = itemData.id || itemData.podcastId || itemData.itunesId;
  const index = watchlist.findIndex(item => (item.id || item.podcastId || item.itunesId) == itemId);
  
  let updated;
  let inWatchlist = false;

  if (index >= 0) {
    updated = watchlist.filter(item => (item.id || item.podcastId || item.itunesId) != itemId);
  } else {
    const newItem = {
      id: itemId,
      title: itemData.title || itemData.podcastTitle || itemData.collectionName,
      author: itemData.author || itemData.ownerName || itemData.artistName || '',
      image: itemData.image || itemData.artwork || itemData.podcastImage || itemData.feedImage || '',
      addedAt: Date.now(),
      type: itemData.episodeId ? 'episode' : 'podcast',
      ...itemData
    };
    updated = [newItem, ...watchlist];
    inWatchlist = true;
    
    addActivity({
      action: 'added_watchlist',
      targetTitle: itemData.title || itemData.podcastTitle || `Podcast #${itemId}`,
      podcastId: itemId
    }, user);
  }

  setStored(STORAGE_KEYS.WATCHLIST, updated);
  return inWatchlist;
}

export function isInWatchlist(itemId) {
  const watchlist = getStored(STORAGE_KEYS.WATCHLIST, []);
  return watchlist.some(item => (item.id || item.podcastId || item.itunesId) == itemId);
}

export function getUserWatchlist() {
  return getStored(STORAGE_KEYS.WATCHLIST, []);
}

export function removeFromWatchlistLocal(itemId) {
  const watchlist = getStored(STORAGE_KEYS.WATCHLIST, []);
  const updated = watchlist.filter(item => (item.id || item.podcastId || item.itunesId) != itemId);
  setStored(STORAGE_KEYS.WATCHLIST, updated);
  return updated;
}


// LIKES
export function toggleLike(podcastId, podcastData) {
  const likes = getStored(STORAGE_KEYS.LIKES, []);
  const index = likes.findIndex(id => id == podcastId);
  
  let updated;
  let isLiked = false;

  if (index >= 0) {
    updated = likes.filter(id => id != podcastId);
  } else {
    updated = [...likes, podcastId];
    isLiked = true;
    addActivity({
      action: 'liked',
      targetTitle: podcastData?.title || `Podcast #${podcastId}`,
      podcastId
    });
  }

  setStored(STORAGE_KEYS.LIKES, updated);
  return isLiked;
}

export function isLiked(podcastId) {
  const likes = getStored(STORAGE_KEYS.LIKES, []);
  return likes.includes(podcastId);
}

// RATINGS & REVIEWS
export function saveRatingAndReview(podcastId, podcastTitle, rating, reviewText, user, metadata = {}) {
  const ratings = getStored(STORAGE_KEYS.RATINGS, {});
  ratings[podcastId] = rating;
  setStored(STORAGE_KEYS.RATINGS, ratings);

  if (reviewText && reviewText.trim().length > 0) {
    const reviews = getStored(STORAGE_KEYS.REVIEWS, []);
    const existingIndex = reviews.findIndex(r => r.podcastId == podcastId && r.userHandle === (user?.handle || '@danilosilva'));
    
    const reviewData = {
      id: existingIndex >= 0 ? reviews[existingIndex].id : `rev-${Date.now()}`,
      podcastId,
      podcastTitle,
      rating,
      comment: reviewText,
      userName: user?.displayName || 'Danilo Silva',
      userHandle: user?.handle || '@danilosilva',
      createdAt: Date.now(),
      likes: metadata.liked ? 1 : 0
    };

    let updatedReviews;
    if (existingIndex >= 0) {
      updatedReviews = [...reviews];
      updatedReviews[existingIndex] = reviewData;
    } else {
      updatedReviews = [reviewData, ...reviews];
    }
    setStored(STORAGE_KEYS.REVIEWS, updatedReviews);
  }

  // Also auto-record into diary
  saveDiaryEntry({
    type: String(podcastId).startsWith('ep-') || metadata.episodeId ? 'episode' : 'podcast',
    podcastId: metadata.podcastId || (String(podcastId).startsWith('ep-') ? null : podcastId),
    podcastTitle: metadata.podcastTitle || podcastTitle,
    podcastImage: metadata.coverImage || metadata.podcastImage || metadata.feedImage,
    episodeId: metadata.episodeId || (String(podcastId).startsWith('ep-') ? String(podcastId).replace('ep-', '') : null),
    episodeTitle: metadata.episodeTitle || (String(podcastId).startsWith('ep-') ? podcastTitle : null),
    episodeDuration: metadata.duration || metadata.episodeDuration || 0,
    rating,
    comment: reviewText,
    liked: metadata.liked || false,
    listenedDate: metadata.listenedDate || new Date().toISOString().split('T')[0]
  }, user);

  // Sync with backend API if user is logged in
  if (user?.uid) {
    const cleanEpisodeId = metadata.episodeId || (String(podcastId).startsWith('ep-') ? String(podcastId).replace('ep-', '') : String(podcastId));
    saveRating(user.uid, cleanEpisodeId, rating, reviewText).catch(err => {
      console.warn('Backend rating sync error:', err);
    });
  }

  addActivity({
    action: 'evaluated',
    targetTitle: metadata.episodeTitle || podcastTitle,
    rating,
    reviewText,
    podcastId
  }, user);

  return true;
}


export function getPodcastRating(podcastId) {
  const ratings = getStored(STORAGE_KEYS.RATINGS, {});
  return ratings[podcastId] || 0;
}

export function getPodcastReviews(podcastId) {
  const reviews = getStored(STORAGE_KEYS.REVIEWS, []);
  return reviews.filter(r => r.podcastId == podcastId);
}

export function getAllReviews() {
  return getStored(STORAGE_KEYS.REVIEWS, []);
}

// DIARY MANAGEMENT (Letterboxd Style)
export function getDiaryEntries(filters = {}) {
  const diary = getStored(STORAGE_KEYS.DIARY, []);
  
  // Sort in descending chronological order (most recent listenedDate / createdAt first)
  let sorted = [...diary].sort((a, b) => {
    const dateA = new Date(a.listenedDate || a.createdAt).getTime();
    const dateB = new Date(b.listenedDate || b.createdAt).getTime();
    if (dateB !== dateA) return dateB - dateA;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  if (filters.type && filters.type !== 'all') {
    sorted = sorted.filter(item => item.type === filters.type);
  }

  if (filters.hasReview) {
    sorted = sorted.filter(item => item.comment && item.comment.trim().length > 0);
  }

  if (filters.likedOnly) {
    sorted = sorted.filter(item => !!item.liked);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    sorted = sorted.filter(item => 
      (item.podcastTitle && item.podcastTitle.toLowerCase().includes(q)) ||
      (item.episodeTitle && item.episodeTitle.toLowerCase().includes(q)) ||
      (item.comment && item.comment.toLowerCase().includes(q))
    );
  }

  return sorted;
}

export function getDiaryEntryByTarget(targetId) {
  const diary = getStored(STORAGE_KEYS.DIARY, []);
  return diary.find(item => 
    item.episodeId == targetId || 
    item.podcastId == targetId || 
    `ep-${item.episodeId}` == targetId
  ) || null;
}

export function saveDiaryEntry(entryData, user = null) {
  const diary = getStored(STORAGE_KEYS.DIARY, []);
  
  // Check if an entry for the exact same item already exists on the same listenedDate
  const targetKey = entryData.episodeId ? `ep-${entryData.episodeId}` : `pod-${entryData.podcastId}`;
  const existingIdx = diary.findIndex(d => {
    const dKey = d.episodeId ? `ep-${d.episodeId}` : `pod-${d.podcastId}`;
    return dKey === targetKey && (d.listenedDate === entryData.listenedDate || !entryData.listenedDate);
  });

  const entry = {
    id: existingIdx >= 0 ? diary[existingIdx].id : `diary-${Date.now()}`,
    type: entryData.type || (entryData.episodeId ? 'episode' : 'podcast'),
    podcastId: entryData.podcastId || null,
    podcastTitle: entryData.podcastTitle || 'Podcast',
    podcastImage: entryData.podcastImage || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
    episodeId: entryData.episodeId || null,
    episodeTitle: entryData.episodeTitle || null,
    episodeDuration: entryData.episodeDuration || 0,
    rating: Number(entryData.rating) || 0,
    liked: !!entryData.liked,
    comment: entryData.comment || '',
    listenedDate: entryData.listenedDate || new Date().toISOString().split('T')[0],
    createdAt: entryData.createdAt || Date.now(),
    userName: user?.displayName || 'Danilo Silva',
    userHandle: user?.handle || '@danilosilva'
  };

  let updated;
  if (existingIdx >= 0) {
    updated = [...diary];
    updated[existingIdx] = { ...updated[existingIdx], ...entry };
  } else {
    updated = [entry, ...diary];
  }

  setStored(STORAGE_KEYS.DIARY, updated);

  // Sync ratings object
  const ratings = getStored(STORAGE_KEYS.RATINGS, {});
  const ratingKey = entry.episodeId ? `ep-${entry.episodeId}` : entry.podcastId;
  if (entry.rating > 0 && ratingKey) {
    ratings[ratingKey] = entry.rating;
    setStored(STORAGE_KEYS.RATINGS, ratings);
  }

  return entry;
}

export function deleteDiaryEntry(diaryId) {
  const diary = getStored(STORAGE_KEYS.DIARY, []);
  const updated = diary.filter(d => d.id !== diaryId);
  setStored(STORAGE_KEYS.DIARY, updated);
  return updated;
}

// FOLLOW USER
export function toggleFollowUser(targetUserHandle) {
  const follows = getStored(STORAGE_KEYS.FOLLOWS, []);
  const isFollowing = follows.includes(targetUserHandle);

  let updated;
  if (isFollowing) {
    updated = follows.filter(h => h !== targetUserHandle);
  } else {
    updated = [...follows, targetUserHandle];
  }

  setStored(STORAGE_KEYS.FOLLOWS, updated);
  return !isFollowing;
}

export function isFollowingUser(targetUserHandle) {
  const follows = getStored(STORAGE_KEYS.FOLLOWS, []);
  return follows.includes(targetUserHandle);
}

// CUSTOM LISTS
export function createCustomList(title, description, initialPodcastId = null, user = null) {
  const lists = getStored(STORAGE_KEYS.LISTS, []);
  const newList = {
    id: `list-${Date.now()}`,
    title,
    description,
    ownerName: user?.displayName || 'Danilo Silva',
    ownerHandle: user?.handle || '@danilosilva',
    podcastsCount: initialPodcastId ? 1 : 0,
    podcasts: initialPodcastId ? [initialPodcastId] : [],
    createdAt: Date.now()
  };

  const updated = [newList, ...lists];
  setStored(STORAGE_KEYS.LISTS, updated);

  addActivity({
    action: 'created_list',
    targetTitle: title
  }, user);

  return newList;
}

export function getUserLists() {
  return getStored(STORAGE_KEYS.LISTS, []);
}

// ACTIVITY FEED
export function addActivity(activityData, user = null) {
  const activities = getStored(STORAGE_KEYS.ACTIVITIES, []);
  const newActivity = {
    id: `act-${Date.now()}`,
    userName: user?.displayName || 'Danilo Silva',
    userHandle: user?.handle || '@danilosilva',
    timestamp: Date.now(),
    ...activityData
  };

  const updated = [newActivity, ...activities];
  setStored(STORAGE_KEYS.ACTIVITIES, updated);
}

export function getActivityFeed() {
  return getStored(STORAGE_KEYS.ACTIVITIES, []);
}
