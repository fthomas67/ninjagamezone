import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PopularityFilter as PopularityFilterType } from '../types';
import GameGrid from '../components/GameGrid';
import { categories } from '../data/categories';
import { Helmet } from 'react-helmet-async';

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
    const categoryName = category ? category.name : 'All games';
    
    let filterName = '';
    switch (popularityFilter) {
      case 'newest':
        filterName = 'newest';
        break;
      case 'mostplayed':
        filterName = 'most played';
        break;
      default:
        filterName = 'popular';
    }
    
    return `${categoryName} ${filterName}`;
  };

  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}" - Free Online Games | NinjaGameZone`;
    }
    
    return "Free Online Games - Play Now!";
  };

  const getPageDescription = () => {
    if (searchQuery) {
      return `Find all games matching "${searchQuery}" on NinjaGameZone. Play free online games instantly in your browser.`;
    }
    
    return "Discover our collection of the best free online games. Play hundreds of high-quality games directly in your browser. Action, adventure, puzzle, sports and much more!";
  };

  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'NinjaGameZone',
      url: window.location.origin,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${window.location.origin}/?search={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };

    if (searchQuery) {
      return {
        ...baseData,
        '@type': 'SearchResultsPage',
        name: `Search Results for "${searchQuery}"`,
        description: getPageDescription()
      };
    }

    return baseData;
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <meta name="keywords" content="free online games, browser games, play online, arcade games, action games, puzzle games, sports games" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getPageDescription()} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="/logo.svg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={getPageTitle()} />
        <meta name="twitter:description" content={getPageDescription()} />
        <meta name="twitter:image" content="/logo.svg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={window.location.href} />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(getStructuredData())}
        </script>
      </Helmet>

      <div className="fade-in max-w-full overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {getPageTitle()}
          </h1>
          
          <p className="text-gray-600">
            {getPageDescription()}
          </p>
        </div>
        
        <GameGrid
          categoryId={selectedCategory}
          popularity={popularityFilter}
          searchTerm={searchQuery}
        />
      </div>
    </>
  );
};

export default HomePage;