import { PopularityFilter } from '../types';
import GameGrid from '../components/GameGrid';

interface FilterPageProps {
  filter: PopularityFilter;
}

const FilterPage = ({ filter }: FilterPageProps) => {
  const getFilterTitle = () => {
    switch (filter) {
      case 'newest':
        return 'Jeux les plus récents';
      case 'mostplayed':
        return 'Jeux les plus joués';
      case 'bestgames':
        return 'Jeux les mieux notés';
      default:
        return 'Jeux populaires';
    }
  };

  const getFilterDescription = () => {
    switch (filter) {
      case 'newest':
        return 'Découvre les derniers jeux ajoutés sur NinjaGameZone.';
      case 'mostplayed':
        return 'Les jeux les plus populaires et les plus joués par notre communauté.';
      case 'bestgames':
        return 'Les jeux les mieux notés et les plus appréciés par les joueurs.';
      default:
        return 'Les jeux les plus populaires du moment.';
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
      
      {/* Ad banner above game grid */}
      <div className="w-full bg-gray-200 rounded-xl p-4 mb-6 text-center">
        <p className="text-gray-500">Espace publicitaire</p>
      </div>
      
      <GameGrid
        popularity={filter}
      />
      
      {/* Ad banner below game grid */}
      <div className="w-full bg-gray-200 rounded-xl p-4 mt-8 text-center">
        <p className="text-gray-500">Espace publicitaire</p>
      </div>
    </div>
  );
};

export default FilterPage; 