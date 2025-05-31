import { Game, GameResponse, PopularityFilter } from '../types';
import newestGamesData from '../data/gamemonetize_newest.json';
import mostplayedGamesData from '../data/gamemonetize_mostplayed.json';
import bestGamesData from '../data/gamemonetize_bestgames.json';

interface GameData {
  id: string;
  title: string;
  description: string;
  url: string;
  thumb: string;
  category: string;
  tags: string;
  width: string;
  height: string;
  instructions: string;
  popularity?: number;
  featured?: boolean;
}

const transformGameData = (gameData: GameData): Game => ({
  id: gameData.id,
  title: gameData.title.trim(),
  description: gameData.description,
  url: gameData.url,
  thumbnail: gameData.thumb,
  category: getCategoryIdFromName(gameData.category),
  categoryName: gameData.category,
  tags: gameData.tags.split(', '),
  popularity: Math.floor(Math.random() * 100), // Since we don't have real popularity data
  featured: Math.random() > 0.8,
  new: Math.random() > 0.7,
  width: gameData.width,
  height: gameData.height,
  instructions: gameData.instructions
});

const getCategoryIdFromName = (categoryName: string): number => {
  const categoryMap: { [key: string]: number } = {
    'All': 0,
    '.IO': 1,
    '2 Player': 2,
    '3D': 3,
    'Action': 4,
    'Adventure': 5,
    'Arcade': 6,
    'Baby Hazel': 7,
    'Bejeweled': 8,
    'Boys': 9,
    'Clicker': 10,
    'Cooking': 11,
    'Girls': 12,
    'Hypercasual': 13,
    'Multiplayer': 14,
    'Puzzle': 15,
    'Racing': 16,
    'Shooting': 17,
    'Soccer': 18,
    'Sports': 19,
    'Stickman': 20
  };

  return categoryMap[categoryName] || 0;
};

const getCategoryNameFromId = (categoryId: number): string => {
  const categoryMap: { [key: number]: string } = {
    0: 'All',
    1: '.IO',
    2: '2 Player',
    3: '3D',
    4: 'Action',
    5: 'Adventure',
    6: 'Arcade',
    7: 'Baby Hazel',
    8: 'Bejeweled',
    9: 'Boys',
    10: 'Clicker',
    11: 'Cooking',
    12: 'Girls',
    13: 'Hypercasual',
    14: 'Multiplayer',
    15: 'Puzzle',
    16: 'Racing',
    17: 'Shooting',
    18: 'Soccer',
    19: 'Sports',
    20: 'Stickman'
  };

  return categoryMap[categoryId] || 'All';
};

const getGamesData = (popularity: PopularityFilter): GameData[] => {
  switch (popularity) {
    case 'newest':
      return newestGamesData;
    case 'mostplayed':
      return mostplayedGamesData;
    case 'bestgames':
      return bestGamesData;
    default:
      return mostplayedGamesData; // Par défaut, retourner les plus joués
  }
};

// Fetch games based on filters
export const fetchGames = async (
  categoryId?: number,
  popularity: PopularityFilter = 'newest',
  page = 1,
  limit = 24
): Promise<GameResponse> => {
  try {
    let filteredGames = getGamesData(popularity);
    
    // Filtrer par catégorie si spécifié
    if (categoryId && categoryId > 0) {
      const categoryName = getCategoryNameFromId(categoryId);
      filteredGames = filteredGames.filter((game: GameData) => game.category === categoryName);
    }
    
    // Transformer les données
    const transformedGames = filteredGames.map(transformGameData);
    
    // Appliquer la pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      games: transformedGames.slice(startIndex, endIndex),
      total: transformedGames.length
    };
  } catch (error) {
    console.error('Error fetching games:', error);
    return { games: [], total: 0 };
  }
};

// Fetch a single game by ID or slug
export const fetchGameBySlug = async (slug: string): Promise<Game | null> => {
  try {
    // Chercher dans les deux sources de données
    const game = [...newestGamesData, ...mostplayedGamesData].find((g: GameData) => g.id === slug);
    return game ? transformGameData(game) : null;
  } catch (error) {
    console.error('Error fetching game:', error);
    return null;
  }
};

// Search games by keyword
export const searchGames = async (keyword: string): Promise<Game[]> => {
  try {
    const searchTerm = keyword.toLowerCase();
    // Chercher dans les deux sources de données
    const allGames = [...newestGamesData, ...mostplayedGamesData];
    const filteredGames = allGames.filter((game: GameData) => 
      game.title.toLowerCase().includes(searchTerm) ||
      game.description.toLowerCase().includes(searchTerm) ||
      game.tags.toLowerCase().includes(searchTerm)
    );
    
    return filteredGames.map(transformGameData);
  } catch (error) {
    console.error('Error searching games:', error);
    return [];
  }
};

// Get mock games (now returns transformed real data)
export const getMockGames = async (count = 20): Promise<Game[]> => {
  try {
    // Utiliser les jeux les plus récents par défaut
    return newestGamesData
      .map(transformGameData)
      .slice(0, count);
  } catch (error) {
    console.error('Error fetching mock games:', error);
    return [];
  }
};