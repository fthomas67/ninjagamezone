import { PopularityFilter } from '../types';
import GameGrid from '../components/GameGrid';
import { Helmet } from 'react-helmet-async';

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
      case 'bestonmobile':
        return 'Best on Mobile Games';
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
      case 'bestonmobile':
        return 'The best games for mobile devices.';
      default:
        return 'The most popular games right now.';
    }
  };

  const getPageTitle = () => {
    return `${getFilterTitle()} - Free Online Games | NinjaGameZone`;
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
        name: getFilterTitle(),
        description: getFilterDescription()
      }
    };
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getFilterDescription()} />
        <meta name="keywords" content={`${getFilterTitle().toLowerCase()}, online games, free games, browser games, ${filter} games`} />
        
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
    </>
  );
};

export default FilterPage; 