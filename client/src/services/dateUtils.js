export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays === 0) {
    if (diffInHours === 0) {
      if (diffInMinutes === 0) return 'agora mesmo';
      if (diffInMinutes < 60) return `há ${diffInMinutes} minutos`;
      return `há ${diffInHours} horas`;
    }
    if (diffInHours === 1) return 'há 1 hora';
    return `há ${diffInHours} horas`;
  }

  if (diffInDays === 1) return 'hoje';
  if (diffInDays === 2) return 'ontem';
  if (diffInDays < 7) return `há ${diffInDays} dias`;
  if (diffInDays < 30) return `há ${Math.floor(diffInDays / 7)} semanas`;
  if (diffInDays < 365) return `há ${Math.floor(diffInDays / 30)} meses`;
  return `há ${Math.floor(diffInDays / 365)} anos`;
};