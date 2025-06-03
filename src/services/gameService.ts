import { Game, GameResponse, PopularityFilter } from '../types';
import newestGamesData from '../data/gamemonetize_newest.json';
import mostplayedGamesData from '../data/gamemonetize_mostplayed.json';
import bestGamesData from '../data/gamemonetize_bestgames.json';
import bestOnMobileGamesData from '../data/gamemonetize_bestonmobile.json';

// Forcer le typage des données JSON
const typedNewestGames = newestGamesData as GameData[];
const typedMostplayedGames = mostplayedGamesData as GameData[];
const typedBestGames = bestGamesData as GameData[];
const typedBestOnMobileGames = bestOnMobileGamesData as GameData[];

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
    'All Games': 0,
    '.IO': 1,
    '2 Players': 2,
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
    'Football': 18,
    'Sports': 19,
    'Stickman': 20
  };

  return categoryMap[categoryName] || 0;
};

const getCategoryNameFromId = (categoryId: number): string => {
  const categoryMap: { [key: number]: string } = {
    0: 'All Games',
    1: '.IO',
    2: '2 Players',
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
    18: 'Football',
    19: 'Sports',
    20: 'Stickman'
  };

  return categoryMap[categoryId] || 'All Games';
};

const getGamesData = (popularity: PopularityFilter): GameData[] => {
  switch (popularity) {
    case 'newest':
      return typedNewestGames;
    case 'mostplayed':
      return typedMostplayedGames;
    case 'bestgames':
      return typedBestGames;
    case 'bestonmobile':
      return typedBestOnMobileGames;
    default:
      return typedMostplayedGames;
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
      
      // Gérer les variations de noms pour certaines catégories
      const categoryVariations: { [key: string]: string[] } = {
        '2 Players': ['2 Player', '2 Players', '2 Player Games'],
        'Puzzle': ['Puzzle', 'Puzzles'],
        'Sports': ['Sports', 'Sport'],
        'Football': ['Football', 'Soccer'],
        'Shooting': ['Shooting', 'Shooter', 'Shoot'],
        'Racing': ['Racing', 'Race'],
        'Action': ['Action', 'Adventure'],
        'Arcade': ['Arcade', 'Arcade Games'],
        '3D': ['3D', '3D Games'],
        'Multiplayer': ['Multiplayer', 'Multiplayer Games']
      };

      const variations = categoryVariations[categoryName] || [categoryName];
      
      filteredGames = filteredGames.filter((game: GameData) => {
        // Vérifier la catégorie principale
        if (game.category === categoryName) return true;
        
        // Vérifier les tags avec les variations
        if (game.tags) {
          const tags = game.tags.toLowerCase();
          return variations.some(variation => 
            tags.includes(variation.toLowerCase())
          );
        }
        return false;
      });
      
      // Vérifier si la catégorie a des données
      if (filteredGames.length === 0) {
        console.warn(`Aucun jeu trouvé pour la catégorie: ${categoryName}`);
        return {
          games: [],
          total: 0,
          message: `Aucun jeu disponible dans la catégorie ${categoryName} pour le moment.`
        };
      }
    }
    
    // Transformer les données
    const transformedGames = filteredGames.map(transformGameData);
    
    // Appliquer la pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      games: transformedGames.slice(startIndex, endIndex),
      total: transformedGames.length,
      message: transformedGames.length === 0 ? 'Aucun jeu trouvé.' : undefined
    };
  } catch (error) {
    console.error('Error fetching games:', error);
    return { 
      games: [], 
      total: 0,
      message: 'Une erreur est survenue lors de la récupération des jeux.'
    };
  }
};

// Fetch a single game by ID or slug
export const fetchGameBySlug = async (slug: string): Promise<Game | null> => {
  try {
    // Chercher dans les deux sources de données
    const game = [...typedNewestGames, ...typedMostplayedGames].find((g: GameData) => g.id === slug);
    
    if (!game) return null;

    // Trouver des jeux similaires basés sur les tags
    const gameTags = game.tags.toLowerCase().split(', ');
    const allGames = [...typedNewestGames, ...typedMostplayedGames];
    
    // Calculer un score de similarité pour chaque jeu
    const similarGames = allGames
      .filter(g => g.id !== game.id) // Exclure le jeu actuel
      .map(g => {
        const gTags = g.tags.toLowerCase().split(', ');
        // Calculer le nombre de tags en commun
        const commonTags = gameTags.filter(tag => gTags.includes(tag));
        return {
          game: g,
          score: commonTags.length
        };
      })
      .filter(g => g.score > 0) // Ne garder que les jeux avec au moins un tag en commun
      .sort((a, b) => b.score - a.score) // Trier par score décroissant
      .slice(0, 6) // Prendre les 5 meilleurs
      .map(g => transformGameData(g.game));

    const transformedGame = transformGameData(game);
    transformedGame.similarGames = similarGames;

    return transformedGame;
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
    const allGames = [...typedNewestGames, ...typedMostplayedGames];
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
    return typedNewestGames
      .map(transformGameData)
      .slice(0, count);
  } catch (error) {
    console.error('Error fetching mock games:', error);
    return [];
  }
};