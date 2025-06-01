import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchGameBySlug, getMockGames } from '../services/gameService';
import { Game } from '../types';
import { Maximize2, Share2, Gamepad2, AlertTriangle, X } from 'lucide-react';
import { createSlug } from '../utils/slug';
import { Helmet } from 'react-helmet-async';
import bestOnMobileGamesData from '../data/gamemonetize_bestonmobile.json';

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
    // Détecter si l'appareil est iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      const iframe = document.querySelector('iframe') as HTMLIFrameElement;
      if (iframe) {
        if (!isFullscreen) {
          // Utiliser l'API spécifique à iOS
          iframe.webkitEnterFullscreen?.();
          setIsFullscreen(true);
        } else {
          iframe.webkitExitFullscreen?.();
          setIsFullscreen(false);
        }
      }
      return;
    }

    if (!document.fullscreenElement) {
      const gameContainer = document.getElementById('game-container');
      if (gameContainer) {
        gameContainer.requestFullscreen();
        setIsFullscreen(true);
      }
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
              {isMobile && !isMobileOptimized && showMobileWarning && (
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

              {(() => {
                const ratio = game?.width && game?.height 
                  ? `${parseInt(game.width)}/${parseInt(game.height)}`
                  : '16/9';
                
                console.log('Current game dimensions:', {
                  width: game?.width,
                  height: game?.height,
                  ratio
                });

                return (
                  <div 
                    className={`max-h-[80vh] ${!isFullscreen ? 'mx-auto' : ''}`}
                    style={{ aspectRatio: ratio }}
                  >
                    <iframe
                      src={game.url}
                      title={game.title}
                      className="w-full h-full"
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
              <div className="divide-y divide-gray-100">
                {similarGames.map(similarGame => {
                  const similarGameSlug = createSlug(similarGame.title);
                    
                  return (
                    <Link
                      key={similarGame.id}
                      to={`/game/${similarGame.id}/${similarGameSlug}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={similarGame.thumbnail}
                          alt={similarGame.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">
                          {similarGame.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {similarGame.categoryName}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GamePage;