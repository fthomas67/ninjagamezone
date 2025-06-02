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
      className="group hover:scale-[1.02] transition-all duration-300"
      aria-label={`Play ${game.title}`}
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      
      <div className="mt-2">
        <h3 className="text-sm md:text-base font-medium text-foreground line-clamp-1">
          {game.title}
        </h3>
      </div>
    </Link>
  );
};

export default GameCard;