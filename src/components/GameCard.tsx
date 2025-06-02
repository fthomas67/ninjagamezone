import { Link } from 'react-router-dom';
import { Game } from '../types';
import { createSlug } from '../utils/slug';

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const titleSlug = createSlug(game.title);
  const gameUrl = `/game/${game.id}/${titleSlug}`;
  
  return (
    <Link
      to={gameUrl}
      className="group transition-all duration-300"
      aria-label={`Play ${game.title}`}
    >
      <div className="relative overflow-hidden rounded-xl bg-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300" style={{ aspectRatio: '512/384' }}>
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 pointer-events-none group-hover:ring-2 group-hover:ring-inset group-hover:ring-primary rounded-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-xs font-semibold text-white line-clamp-1">
            {game.title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;