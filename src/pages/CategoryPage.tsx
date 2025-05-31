import { useParams } from 'react-router-dom';
import { PopularityFilter } from '../types';
import GameGrid from '../components/GameGrid';
import { categories } from '../data/categories';
import { createSlug } from '../utils/slug';

interface CategoryPageProps {
  filter?: PopularityFilter;
}

const CategoryPage = ({ filter = 'newest' }: CategoryPageProps) => {
  const { categorySlug } = useParams();
  
  // Trouver la catégorie correspondante au slug
  const category = categories.find(c => createSlug(c.name) === categorySlug);

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Catégorie non trouvée</h2>
        <p className="text-gray-600 mb-6">
          La catégorie que vous recherchez n'existe pas.
        </p>
      </div>
    );
  }

  const getFilterTitle = () => {
    let filterName = '';
    switch (filter) {
      case 'newest':
        filterName = 'les plus récents';
        break;
      case 'mostplayed':
        filterName = 'les plus joués';
        break;
      case 'bestgames':
        filterName = 'les mieux notés';
        break;
      default:
        filterName = 'les plus populaires';
    }
    
    return category.name === 'Tous les jeux' 
      ? `${category.name} ${filterName}`
      : `Jeux ${category.name} ${filterName}`;
  };

  const getFilterDescription = () => {
    const baseDescription = `Découvre notre sélection de jeux ${category.name.toLowerCase()}.`;
    
    switch (filter) {
      case 'newest':
        return `${baseDescription} Les derniers jeux ajoutés dans cette catégorie.`;
      case 'mostplayed':
        return `${baseDescription} Les jeux les plus populaires de cette catégorie.`;
      case 'bestgames':
        return `${baseDescription} Les jeux les mieux notés de cette catégorie.`;
      default:
        return baseDescription;
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
        categoryId={category.id}
        popularity={filter}
      />
      
      {/* Ad banner below game grid */}
      <div className="w-full bg-gray-200 rounded-xl p-4 mt-8 text-center">
        <p className="text-gray-500">Espace publicitaire</p>
      </div>
    </div>
  );
};

export default CategoryPage; 