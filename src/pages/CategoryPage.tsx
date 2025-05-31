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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Category not found</h2>
        <p className="text-gray-600 mb-6">
          The category you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  const getFilterTitle = () => {
    let filterName = '';
    switch (filter) {
      case 'newest':
        filterName = 'newest';
        break;
      case 'mostplayed':
        filterName = 'most played';
        break;
      case 'bestgames':
        filterName = 'best rated';
        break;
      default:
        filterName = 'most popular';
    }
    
    return category.name === 'All Games' 
      ? `${category.name} ${filterName}`
      : `${category.name} Games ${filterName}`;
  };

  const getFilterDescription = () => {
    const baseDescription = `Explore our collection of ${category.name.toLowerCase()} games.`;
    
    switch (filter) {
      case 'newest':
        return `${baseDescription} The latest games added to this category.`;
      case 'mostplayed':
        return `${baseDescription} The most popular games in this category.`;
      case 'bestgames':
        return `${baseDescription} The highest rated games in this category.`;
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
        <p className="text-gray-500">Advertisement Space</p>
      </div>
      
      <GameGrid
        categoryId={category.id}
        popularity={filter}
      />
      
      {/* Ad banner below game grid */}
      <div className="w-full bg-gray-200 rounded-xl p-4 mt-8 text-center">
        <p className="text-gray-500">Advertisement Space</p>
      </div>
    </div>
  );
};

export default CategoryPage; 