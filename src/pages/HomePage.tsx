import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PopularityFilter as PopularityFilterType } from '../types';
import GameGrid from '../components/GameGrid';
import { categories } from '../data/categories';

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [popularityFilter, setPopularityFilter] = useState<PopularityFilterType>('mostplayed');
  
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const popularityParam = searchParams.get('popularity') as PopularityFilterType;
    
    if (categoryParam) {
      setSelectedCategory(parseInt(categoryParam, 10));
    }
    
    if (popularityParam && ['newest', 'mostplayed', 'hotgames', 'bestgames'].includes(popularityParam)) {
      setPopularityFilter(popularityParam);
    }
  }, [location]);
  
  const updateUrl = (categoryId: number, filter: PopularityFilterType) => {
    const params = new URLSearchParams();
    if (categoryId > 0) params.set('category', categoryId.toString());
    if (filter !== 'newest') params.set('popularity', filter);
    if (searchQuery) params.set('search', searchQuery);
    
    navigate({
      pathname: '/',
      search: params.toString()
    }, { replace: true });
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
    updateUrl(categoryId, popularityFilter);
  };

  const handlePopularitySelect = (filter: PopularityFilterType) => {
    setPopularityFilter(filter);
    updateUrl(selectedCategory, filter);
  };

  const getFilterTitle = () => {
    const category = categories.find(c => c.id === selectedCategory);
    const categoryName = category ? category.name : 'Tous les jeux';
    
    let filterName = '';
    switch (popularityFilter) {
      case 'newest':
        filterName = 'plus récents';
        break;
      case 'mostplayed':
        filterName = 'plus joués';
        break;
      default:
        filterName = 'populaires';
    }
    
    return `${categoryName} ${filterName}`;
  };

  const getPageTitle = () => {
    if (searchQuery) {
      return `Résultats pour "${searchQuery}"`;
    }
    
    return "Jeux gratuits en ligne - Jouez maintenant !";
  };

  const getPageDescription = () => {
    if (searchQuery) {
      return `Découvre tous les jeux qui correspondent à ta recherche.`;
    }
    
    return "Découvre notre sélection des meilleurs jeux gratuits en ligne. Des centaines de jeux de qualité, jouables directement dans ton navigateur. Action, aventure, puzzle, sport et bien plus encore !";
  };

  return (
    <div className="fade-in max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {getPageTitle()}
        </h1>
        
        <p className="text-gray-600">
          {getPageDescription()}
        </p>
      </div>
      
      {/* Ad banner above game grid */}
      <div className="w-full bg-gray-200 rounded-xl p-4 mb-6 text-center">
        <p className="text-gray-500">Espace publicitaire</p>
      </div>
      
      <GameGrid
        categoryId={selectedCategory}
        popularity={popularityFilter}
        searchTerm={searchQuery}
      />
      
      {/* Ad banner below game grid */}
      <div className="w-full bg-gray-200 rounded-xl p-4 mt-8 text-center">
        <p className="text-gray-500">Espace publicitaire</p>
      </div>
    </div>
  );
};

export default HomePage;