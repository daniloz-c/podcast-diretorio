// Social Data Store (LocalStorage + Firestore sync)

const STORAGE_KEYS = {
  FAVORITES: 'lb_podcast_favorites',
  LIKES: 'lb_podcast_likes',
  RATINGS: 'lb_podcast_ratings',
  REVIEWS: 'lb_podcast_reviews',
  FOLLOWS: 'lb_user_follows',
  LISTS: 'lb_custom_lists',
  ACTIVITIES: 'lb_activities'
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

// Initial seed activities if empty
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
export function saveRatingAndReview(podcastId, podcastTitle, rating, reviewText, user) {
  const ratings = getStored(STORAGE_KEYS.RATINGS, {});
  ratings[podcastId] = rating;
  setStored(STORAGE_KEYS.RATINGS, ratings);

  if (reviewText && reviewText.trim().length > 0) {
    const reviews = getStored(STORAGE_KEYS.REVIEWS, []);
    const newReview = {
      id: `rev-${Date.now()}`,
      podcastId,
      podcastTitle,
      rating,
      comment: reviewText,
      userName: user?.displayName || 'Danilo Silva',
      userHandle: user?.handle || '@danilosilva',
      createdAt: Date.now(),
      likes: 0
    };
    const updatedReviews = [newReview, ...reviews];
    setStored(STORAGE_KEYS.REVIEWS, updatedReviews);
  }

  addActivity({
    action: 'evaluated',
    targetTitle: podcastTitle,
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
