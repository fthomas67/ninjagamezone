import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchGameBySlug, getMockGames } from '../services/gameService';
import { Game } from '../types';
import { Maximize2, Share2, Gamepad2, AlertTriangle, X } from 'lucide-react';
import { createSlug } from '../utils/slug';
import { Helmet } from 'react-helmet-async';
import bestOnMobileGamesData from '../data/gamemonetize_bestonmobile.json';
import GameCard from '../components/GameCard';
import '../styles/ios-fullscreen.css';

interface GameData {
  id: string;
  title: string;
  description: string;
  url: string;
  thumb: string;
  category: string;
  tags: string;
  width: string;
  height: string;
  instructions: string;
}

const typedBestOnMobileGames = bestOnMobileGamesData as GameData[];

interface HTMLIFrameElement {
  webkitEnterFullscreen?: () => void;
  webkitExitFullscreen?: () => void;
}

interface Window {
  MSStream?: any;
}

const GamePage = () => {
  const { gameId, gameSlug } = useParams<{ gameId: string; gameSlug: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [similarGames, setSimilarGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeSize, setIframeSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOptimized, setIsMobileOptimized] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(true);
  const iframeParentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Détecter si l'appareil est mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Vérifier si le jeu est optimisé pour mobile
  useEffect(() => {
    if (game) {
      const isOptimized = typedBestOnMobileGames.some((g: GameData) => g.id === game.id);
      setIsMobileOptimized(isOptimized);
    }
  }, [game]);

  // Update page title and meta description when game changes
  useEffect(() => {
    if (game) {
      // Update page title
      document.title = `${game.title} - Play Free Online Game | NinjaGameZone`;
      
      // Update meta tags
      const metaTags = {
        description: `Play ${game.title} online for free. ${game.description.substring(0, 120)}...`,
        keywords: `${game.title}, online game, free game, browser game, ${game.category || 'arcade'}, play online`,
        ogTitle: `${game.title} - Play Free Online Game | NinjaGameZone`,
        ogDescription: `Play ${game.title} online for free. ${game.description.substring(0, 120)}...`,
        ogImage: game.thumbnail || '/logo.svg',
        ogUrl: window.location.href,
        twitterCard: 'summary_large_image',
      };

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', metaTags.description);
      }

      // Add JSON-LD structured data
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: game.title,
        description: game.description,
        genre: game.category,
        gamePlatform: 'Web Browser',
        applicationCategory: 'Game',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock'
        }
      };

      // Remove existing JSON-LD if any
      const existingJsonLd = document.querySelector('script[type="application/ld+json"]');
      if (existingJsonLd) {
        existingJsonLd.remove();
      }

      // Add new JSON-LD
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [game]);

  useEffect(() => {
    const loadGame = async () => {
      if (!gameId) return;
      
      try {
        setLoading(true);
        const foundGame = await fetchGameBySlug(gameId);
        
        if (foundGame) {
          // Verify the slug matches
          const correctSlug = createSlug(foundGame.title);
            
          if (gameSlug !== correctSlug) {
            // Redirect to the correct URL if slug doesn't match
            navigate(`/game/${foundGame.id}/${correctSlug}`, { replace: true });
            return;
          }
          
          setGame(foundGame);
          
          // Set initial iframe size based on game dimensions
          if (foundGame.width && foundGame.height) {
            console.log('Game dimensions:', {
              width: foundGame.width,
              height: foundGame.height,
              ratio: `${parseInt(foundGame.width)}/${parseInt(foundGame.height)}`
            });
            setIframeSize({
              width: parseInt(foundGame.width),
              height: parseInt(foundGame.height)
            });
          } else {
            console.log('No game dimensions found, using default 16:9 ratio');
          }
          
          // Utiliser les jeux similaires retournés par fetchGameBySlug
          if (foundGame.similarGames) {
            setSimilarGames(foundGame.similarGames);
          }
        } else {
          setError('Game not found');
        }
      } catch (err) {
        setError('Error loading game');
        console.error(err);
      }
      setLoading(false);
    };
    
    loadGame();
  }, [gameId, gameSlug, navigate]);

  const toggleFullscreen = () => {
    const gameContainer = document.getElementById('game-container');
    const iframeParent = iframeParentRef.current;
    if (!gameContainer || !iframeParent) return;

    // Fullscreen natif pour les autres appareils
    if (!document.fullscreenElement) {
      gameContainer.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: game?.title,
        text: game?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleIframeResize = (event: MessageEvent) => {
      if (event.data) {
        if (event.data.type === 'resize') {
          const iframe = document.querySelector('iframe');
          if (iframe) {
            iframe.style.height = `${event.data.height}px`;
            setIframeSize({ width: iframe.offsetWidth, height: event.data.height });
          }
        } else if (event.data.type === 'gameSize') {
          setIframeSize({ width: event.data.width, height: event.data.height });
        }
      }
    };

    window.addEventListener('message', handleIframeResize);
    return () => window.removeEventListener('message', handleIframeResize);
  }, []);

  useEffect(() => {
    if (game) {
      // Gestion des jeux récents dans le localStorage
      try {
        const stored = localStorage.getItem('recentGames');
        let recentGames = stored ? JSON.parse(stored) : [];
        // Retirer le jeu s'il existe déjà
        recentGames = recentGames.filter((g: any) => g.id !== game.id);
        // Ajouter le jeu courant en premier
        recentGames.unshift({
          id: game.id,
          title: game.title,
          thumbnail: game.thumbnail,
          url: game.url
        });
        // Limiter à 6 jeux
        if (recentGames.length > 6) recentGames = recentGames.slice(0, 6);
        localStorage.setItem('recentGames', JSON.stringify(recentGames));
      } catch (e) {
        // fail silently
      }
    }
  }, [game]);
  
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-r-transparent mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }
  
  if (error || !game) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <Gamepad2 className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops, game not found!</h2>
        <p className="text-gray-600 mb-6">
          {error || "We couldn't find the game you're looking for."}
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        {game && (
          <>
            <title>{`${game.title} - Play Free Online Game | NinjaGameZone`}</title>
            <meta name="description" content={`Play ${game.title} online for free. ${game.description.substring(0, 120)}...`} />
            <meta name="keywords" content={`${game.title}, online game, free game, browser game, ${game.category || 'arcade'}, play online`} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={`${game.title} - Play Free Online Game | NinjaGameZone`} />
            <meta property="og:description" content={`Play ${game.title} online for free. ${game.description.substring(0, 120)}...`} />
            <meta property="og:image" content={game.thumbnail || '/logo.svg'} />
            <meta property="og:url" content={window.location.href} />
            
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`${game.title} - Play Free Online Game | NinjaGameZone`} />
            <meta name="twitter:description" content={`Play ${game.title} online for free. ${game.description.substring(0, 120)}...`} />
            <meta name="twitter:image" content={game.thumbnail || '/logo.svg'} />
            
            {/* Canonical URL */}
            <link rel="canonical" href={window.location.href} />
          </>
        )}
      </Helmet>

      <div className="fade-in -mt-6 -mx-4 md:-mx-6 lg:-mx-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 md:p-6 lg:p-8">
          {/* Main content - Game and Description */}
          <main className="lg:col-span-3">
            {/* Game container */}
            <article 
              id="game-container" 
              className={`
                relative bg-black rounded-xl overflow-hidden
                ${isFullscreen ? 'fixed inset-0 z-50' : ''}
              `}
            >
              {isMobile && !isMobileOptimized && showMobileWarning && !isFullscreen && (
                <div className="absolute top-0 left-0 right-0 bg-primary/90 text-white p-3 z-10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <p className="text-sm">
                      This game is not optimized for mobile and may not work correctly on your device.
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowMobileWarning(false)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Close warning"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Affichage du bouton de fermeture en fullscreen iOS */}
              {isFullscreen && /iPad|iPhone|iPod/.test(navigator.userAgent) && (
                <div className="fixed top-0 left-0 w-full z-[10000] bg-black/90 flex items-center justify-between px-4 py-3 shadow-md">
                  <span className="text-white font-semibold text-base">Fullscreen</span>
                  <button
                    onClick={toggleFullscreen}
                    className="flex items-center gap-2 text-white bg-primary/80 hover:bg-primary px-4 py-2 rounded-full font-medium transition-colors"
                    aria-label="Quit fullscreen"
                  >
                    <X className="w-5 h-5" />
                    <span>Quit fullscreen</span>
                  </button>
                </div>
              )}

              {(() => {
                const ratio = game?.width && game?.height 
                  ? `${parseInt(game.width)}/${parseInt(game.height)}`
                  : '16/9';

                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

                return (
                  <div 
                    ref={iframeParentRef}
                    className={`${!isFullscreen ? 'mx-auto max-h-[540px]' : ''}`}
                    style={{ 
                      aspectRatio: isFullscreen ? 'auto' : ratio
                    }}
                  >
                    <iframe
                      src={game.url}
                      title={game.title}
                      className={`w-full h-full ${isFullscreen && isIOS ? 'ios-fullscreen' : ''}`}
                      style={{
                        width: isFullscreen ? '100vw' : '100%',
                        height: isFullscreen ? '100vh' : '100%',
                        border: 'none',
                        objectFit: 'contain'
                      }}
                      allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; interest-cohort"
                      loading="lazy"
                      scrolling="no"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation allow-popups-to-escape-sandbox"
                      referrerPolicy="origin"
                    ></iframe>
                  </div>
                );
              })()}
              
              {/* Game controls bar */}
              <div className={`bg-black/90 backdrop-blur-sm p-2 flex items-center justify-between ${isFullscreen ? 'hidden' : ''}`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <img src="/logo.svg" alt="NinjaGameZone Logo" className="w-4 h-4" />
                  </div>
                  <h1 className="text-white font-medium line-clamp-1">{game.title}</h1>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative group"
                    aria-label="Share"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs font-medium text-white bg-black rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Share
                    </span>
                  </button>
                  
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative group"
                    aria-label="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                    <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs font-medium text-white bg-black rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Fullscreen
                    </span>
                  </button>
                </div>
              </div>
            </article>

            {/* Game info */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6 p-6">
              <h2 className="text-2xl font-bold mb-4">{game.title}</h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-full">
                  {game.categoryName}
                </span>
                
                {game.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="prose prose-sm max-w-none">
                {game.instructions && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="font-bold mb-2">Instructions</h3>
                    <p className="text-gray-600">{game.instructions}</p>
                  </div>
                )}
                
                <p className="text-gray-600 whitespace-pre-line">{game.description}</p>
              </div>
            </div>
          </main>

          {/* Sidebar - Ad and Similar Games */}
          <div className="lg:col-span-1 space-y-6">

            {/* Similar games */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <h3 className="text-lg font-bold p-4 border-b border-gray-100">
                Similar Games
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-1 gap-4 p-4">
                {similarGames.map(similarGame => (
                  <GameCard key={similarGame.id} game={similarGame} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GamePage;