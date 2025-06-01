import { Category, PopularityFilter } from '../types';

export const popularityFilters: { type: PopularityFilter; label: string; icon: string; slug: string }[] = [
  { type: 'mostplayed', label: 'Most Played', icon: '🔥', slug: 'most-played' },
  { type: 'bestonmobile', label: 'Best on Mobile', icon: '📱', slug: 'best-on-mobile' },
  { type: 'newest', label: 'Newest', icon: '🆕', slug: 'newest' },
  { type: 'bestgames', label: 'Best Rated', icon: '⭐', slug: 'best-rated' }
];

export const categories: Category[] = [
  { id: 0, name: 'All Games', emoji: '🎮' },
  { id: 1, name: '.IO', emoji: '🌐' },
  { id: 2, name: '2 Players', emoji: '👥' },
  { id: 3, name: '3D', emoji: '🎲' },
  { id: 4, name: 'Action', emoji: '⚡' },
  { id: 5, name: 'Adventure', emoji: '🗺️' },
  { id: 6, name: 'Arcade', emoji: '🕹️' },
  { id: 7, name: 'Baby Hazel', emoji: '👶' },
  { id: 8, name: 'Bejeweled', emoji: '💎' },
  { id: 9, name: 'Boys', emoji: '👦' },
  { id: 10, name: 'Clicker', emoji: '🖱️' },
  { id: 11, name: 'Cooking', emoji: '🍳' },
  { id: 12, name: 'Girls', emoji: '👧' },
  { id: 13, name: 'Hypercasual', emoji: '🎯' },
  { id: 14, name: 'Multiplayer', emoji: '🤝' },
  { id: 15, name: 'Puzzle', emoji: '🧩' },
  { id: 16, name: 'Racing', emoji: '🏎️' },
  { id: 17, name: 'Shooting', emoji: '🎯' },
  { id: 18, name: 'Football', emoji: '⚽' },
  { id: 19, name: 'Sports', emoji: '🏅' },
  { id: 20, name: 'Stickman', emoji: '🏃' }
];

export const getFilterBySlug = (slug: string): PopularityFilter | undefined => {
  return popularityFilters.find(f => f.slug === slug)?.type;
};

export const getFilterSlug = (filter: PopularityFilter): string => {
  return popularityFilters.find(f => f.type === filter)?.slug || 'newest';
};