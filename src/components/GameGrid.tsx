import { useEffect, useState, useCallback } from 'react';
import GameCard from './GameCard';
import { Game, PopularityFilter } from '../types';
import { fetchGames } from '../services/gameService';
import { Gamepad2 } from 'lucide-react';

interface GameGridProps {
  categoryId?: number;
  popularity?: PopularityFilter;
  searchTerm?: string;
}

const GAMES_PER_PAGE = 24;

const GameGrid = ({ categoryId = 0, popularity = 'mostplayed', searchTerm = '' }: GameGridProps) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [totalGames, setTotalGames] = useState(0);
  
  const loadGames = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      const newPage = reset ? 1 : page;
      
      const response = await fetchGames(categoryId, popularity, newPage, GAMES_PER_PAGE);
      
      if (reset) {
        setGames(response.games);
        setTotalGames(response.total);
      } else {
        // Éviter les doublons en vérifiant les IDs
        const newGames = response.games.filter(
          newGame => !games.some(existingGame => existingGame.id === newGame.id)
        );
        setGames(prev => [...prev, ...newGames]);
      }
      
      setPage(newPage + 1);
      // Vérifier si on a atteint la fin des jeux disponibles
      setHasMore(games.length + response.games.length < response.total);
    } catch (err) {
      setError('Error loading games. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [categoryId, popularity, page, games.length]);
  
  // Réinitialiser la pagination quand les filtres changent
  useEffect(() => {
    setPage(1);
    setGames([]);
    setHasMore(true);
    loadGames(true);
  }, [categoryId, popularity, searchTerm]);
  
  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 500 &&
        !loading && 
        hasMore
      ) {
        loadGames();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, loadGames]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <Gamepad2 className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
        <p className="text-gray-600 mb-6">{error}</p>
      </div>
    );
  }

  return (
    <div className="game-grid">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
      
      {loading && (
        <div className="col-span-full flex justify-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
        </div>
      )}

      {!loading && games.length === 0 && (
        <div className="col-span-full text-center py-16">
          <Gamepad2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No games found</h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your filters or search.
          </p>
        </div>
      )}
    </div>
  );
};

export default GameGrid;