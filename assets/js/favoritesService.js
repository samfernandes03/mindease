export function getFavoritesKey(userId) {
  return `favorites_${userId}`;
}

export function loadFavorites(userId) {
  return JSON.parse(localStorage.getItem(getFavoritesKey(userId))) || [];
}

export function saveFavorites(userId, favorites) {
  localStorage.setItem(getFavoritesKey(userId), JSON.stringify(favorites));
}

export function addFavorite(userId, activityId) {
  const favorites = loadFavorites(userId);

  if (!favorites.includes(activityId)) {
    favorites.push(activityId);
  }

  saveFavorites(userId, favorites);

  return favorites;
}

export function removeFavorite(userId, activityId) {
  const favorites = loadFavorites(userId).filter((id) => id !== activityId);

  saveFavorites(userId, favorites);

  return favorites;
}

export function toggleFavorite(userId, activityId) {
  const favorites = loadFavorites(userId);

  if (favorites.includes(activityId)) {
    return removeFavorite(userId, activityId);
  }

  return addFavorite(userId, activityId);
}

export function isFavorite(userId, activityId) {
  return loadFavorites(userId).includes(activityId);
}