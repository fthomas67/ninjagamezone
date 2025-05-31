export interface Game {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  category: number;
  categoryName: string;
  tags: string[];
  popularity: number;
  featured?: boolean;
  new?: boolean;
  instructions?: string;
  width?: string;
  height?: string;
}

export interface GameResponse {
  games: Game[];
  total: number;
  message?: string;
}

export type PopularityFilter = 'newest' | 'mostplayed' | 'hotgames' | 'bestgames';

export interface Category {
  id: number;
  name: string;
  emoji: string;
}