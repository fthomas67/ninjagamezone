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
      className="card group hover:scale-[1.02] transition-all duration-300"
      aria-label={`Play ${game.title}`}
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-200">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-foreground line-clamp-1 mb-1">
          {game.title}
        </h3>
        
        <div className="flex flex-wrap gap-1 mt-1">
          <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
            {game.categoryName}
          </span>
          
          {game.tags.slice(0, 2).map((tag, index) => (
            <span 
              key={index} 
              className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default GameCard;