import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Trophy, Star, Clock, TrendingUp } from 'lucide-react';
import { categories } from '../data/categories';
import { fetchGames } from '../services/gameService';
import GameCard from '../components/GameCard';
import { Game, PopularityFilter } from '../types';

const HomePage = () => {
  const [mostPlayedGames, setMostPlayedGames] = useState<Game[]>([]);
  const [newestGames, setNewestGames] = useState<Game[]>([]);
  const [bestRatedGames, setBestRatedGames] = useState<Game[]>([]);
  const [trendingGames, setTrendingGames] = useState<Game[]>([]);

  useEffect(() => {
    const loadGames = async () => {
      const [mostPlayed, newest, bestRated, trending] = await Promise.all([
        fetchGames(undefined, 'mostplayed', 1, 8),
        fetchGames(undefined, 'newest', 1, 8),
        fetchGames(undefined, 'bestgames', 1, 8),
        fetchGames(undefined, 'hotgames', 1, 8)
      ]);

      setMostPlayedGames(mostPlayed.games);
      setNewestGames(newest.games);
      setBestRatedGames(bestRated.games);
      setTrendingGames(trending.games);
    };

    loadGames();
  }, []);

  const getPageTitle = () => "Play Free Online Games | Best Browser Games Collection | NinjaGameZone";
  const getPageDescription = () => "Discover the best free online games collection at NinjaGameZone. Play action, adventure, puzzle, sports games and more directly in your browser. No download required!";

  const getStructuredData = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NinjaGameZone',
    url: window.location.origin,
    description: getPageDescription(),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${window.location.origin}/?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  });

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

      <div className="fade-in max-w-full overflow-x-hidden pt-6">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Play Free Online Games
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our collection of the best free online games. Play hundreds of high-quality games directly in your browser. No download required!
          </p>
        </section>

        {/* Most Played Games */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              Most Played Games
            </h2>
            <Link 
              to="/most-played"
              className="text-primary hover:text-primary/80 flex items-center gap-1 font-medium"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {mostPlayedGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* Newest Games */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-2xl">🆕</span>
              Newest Games
            </h2>
            <Link 
              to="/newest"
              className="text-primary hover:text-primary/80 flex items-center gap-1 font-medium"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {newestGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* Best Rated Games */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              Best Rated Games
            </h2>
            <Link 
              to="/best-rated"
              className="text-primary hover:text-primary/80 flex items-center gap-1 font-medium"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {bestRatedGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* Trending Games */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-2xl">📈</span>
              Trending Now
            </h2>
            <Link 
              to="/hot-games"
              className="text-primary hover:text-primary/80 flex items-center gap-1 font-medium"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {trendingGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Game Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/${category.name.toLowerCase()}`}
                className="group p-4 rounded-xl bg-hover hover:bg-hover/80 transition-colors"
              >
                <div className="text-3xl mb-2">{category.emoji}</div>
                <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;