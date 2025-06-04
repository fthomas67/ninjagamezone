import { useParams } from 'react-router-dom';
import { PopularityFilter } from '../types';
import GameGrid from '../components/GameGrid';
import { categories } from '../data/categories';
import { createSlug } from '../utils/slug';
import { Helmet } from 'react-helmet-async';

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
        <h2 className="text-2xl font-bold text-white mb-2">Category not found</h2>
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
        filterName = 'Newest';
        break;
      case 'mostplayed':
        filterName = 'Most played';
        break;
      case 'bestgames':
        filterName = 'Best rated';
        break;
      case 'bestonmobile':
        filterName = 'Best on mobile';
        break;
      default:
        filterName = 'Most popular';
    }
    
    return category.name === 'All Games' 
      ? `${category.name} ${filterName}`
      : `${filterName} ${category.name} Games`;
  };

  const getFilterDescription = () => {
    const baseDescription = `Explore our collection of ${category.name.toLowerCase()} games.`;
    
    switch (filter) {
      case 'newest':
        return `${baseDescription} The latest games added to this category.`;
      case 'mostplayed':
        return `${baseDescription} The most popular games in this category.`;
      case 'bestonmobile':
        return `${baseDescription} The best games for mobile devices.`;
      case 'bestgames':
        return `${baseDescription} The highest rated games in this category.`;
      default:
        return baseDescription;
    }
  };

  const getPageTitle = () => {
    const title = getFilterTitle();
    return `${title} - Free Online Games | NinjaGameZone`;
  };

  const getStructuredData = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: getFilterTitle(),
      description: getFilterDescription(),
      url: window.location.href,
      about: {
        '@type': 'Thing',
        name: category.name,
        description: `Collection of ${category.name.toLowerCase()} games`
      }
    };
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getFilterDescription()} />
        <meta name="keywords" content={`${category.name.toLowerCase()} games, online games, free games, browser games, ${filter} games`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getFilterDescription()} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="/logo.svg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={getPageTitle()} />
        <meta name="twitter:description" content={getFilterDescription()} />
        <meta name="twitter:image" content="/logo.svg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={window.location.href} />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(getStructuredData())}
        </script>
      </Helmet>

      <div className="fade-in max-w-full overflow-x-hidden pt-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {getFilterTitle()}
          </h1>
          
          <p className="text-gray-600">
            {getFilterDescription()}
          </p>
        </div>
        
        <GameGrid
          categoryId={category.id}
          popularity={filter}
        />
      </div>
    </>
  );
};

export default CategoryPage; 