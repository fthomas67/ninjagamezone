import { PopularityFilter } from '../types';
import GameGrid from '../components/GameGrid';

interface FilterPageProps {
  filter: PopularityFilter;
}

const FilterPage = ({ filter }: FilterPageProps) => {
  const getFilterTitle = () => {
    switch (filter) {
      case 'newest':
        return 'Latest Games';
      case 'mostplayed':
        return 'Most Played Games';
      case 'bestgames':
        return 'Best Rated Games';
      default:
        return 'Popular Games';
    }
  };

  const getFilterDescription = () => {
    switch (filter) {
      case 'newest':
        return 'Discover the latest games added to NinjaGameZone.';
      case 'mostplayed':
        return 'The most popular and most played games by our community.';
      case 'bestgames':
        return 'The highest rated and most appreciated games by players.';
      default:
        return 'The most popular games right now.';
    }
  };

  return (
    <div className="fade-in max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {getFilterTitle()}
        </h1>
        
        <p className="text-gray-600">
          {getFilterDescription()}
        </p>
      </div>
      
      <GameGrid
        popularity={filter}
      />
    </div>
  );
};

export default FilterPage; 