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
      <div className="flex flex-col gap-2">
        <div className="relative overflow-hidden rounded-xl bg-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300" style={{ aspectRatio: '512/384' }}>
          <img
            src={game.thumbnail}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 pointer-events-none group-hover:ring-2 group-hover:ring-inset group-hover:ring-primary rounded-xl"></div>
        </div>
        <h3 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {game.title}
        </h3>
      </div>
    </Link>
  );
};

export default GameCard;