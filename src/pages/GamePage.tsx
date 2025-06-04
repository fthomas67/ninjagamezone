import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchGameBySlug } from '../services/gameService';
import { Game } from '../types';
import { Maximize2, Share2, Gamepad2, X, PlayCircle } from 'lucide-react';
import { createSlug } from '../utils/slug';
import { Helmet } from 'react-helmet-async';
import bestOnMobileGamesData from '../data/gamemonetize_bestonmobile.json';
import GameCard from '../components/GameCard';
import '../styles/ios-fullscreen.css';

// Déclaration du type pour VIDEO_OPTIONS
declare global {
  interface Window {
    VIDEO_OPTIONS: {
      gameid: string;
      width: string;
      height: string;
      color: string;
      getAds: string;
    };
  }
}

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
  const [showPreGame, setShowPreGame] = useState(true);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

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
          // Réinitialiser showPreGame à true lorsque le jeu change
          setShowPreGame(true);
          
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

  // Fonction pour extraire le gameid de l'URL
  const extractGameId = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 2];
  };

  // Fonction pour charger la vidéo
  const loadVideo = (gameId: string) => {
    const videoOptions = {
      gameid: gameId,
      width: "100%",
      height: "480px",
      color: "#3f007e",
      getAds: "false"
    };

    window.VIDEO_OPTIONS = videoOptions;

    // Charger jQuery d'abord
    const jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
    jqueryScript.integrity = 'sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=';
    jqueryScript.crossOrigin = 'anonymous';
    
    // Charger le script de la vidéo après jQuery
    jqueryScript.onload = () => {
      const videoScript = document.createElement('script');
      videoScript.type = 'text/javascript';
      videoScript.src = 'https://api.gamemonetize.com/video.js';
      document.body.appendChild(videoScript);
    };

    document.body.appendChild(jqueryScript);
  };

  // Effet pour charger/décharger la vidéo
  useEffect(() => {
    if (showHowToPlay && game) {
      const gameId = extractGameId(game.url);
      loadVideo(gameId);
    }

    return () => {
      // Nettoyer le script et la div de la vidéo
      const script = document.getElementById('gamemonetize-video-api');
      const videoDiv = document.getElementById('gamemonetize-video');
      if (script) script.remove();
      if (videoDiv) videoDiv.innerHTML = '';
    };
  }, [showHowToPlay, game]);
  
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-r-transparent mb-4"></div>
          <p className="text-muted">Loading game...</p>
        </div>
      </div>
    );
  }
  
  if (error || !game) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <Gamepad2 className="w-16 h-16 text-muted mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Oops, game not found!</h2>
        <p className="text-muted mb-6">
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

      <div
        className="fade-in -mx-4 md:-mx-6 lg:-mx-8"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgb(25, 28, 38) 0%, rgba(25, 28, 38, 0) 20%),
            linear-gradient(to top, rgb(25, 28, 38) 0%, rgba(25, 28, 38, 0) 20%),
            radial-gradient(circle at 50% 50%, rgb(25, 28, 38) 0%, rgba(25, 28, 38, 0.6) 0%,  rgb(25, 28, 38, 1) 75%),
            linear-gradient(0deg, rgb(0, 0, 0) 10%, rgba(0, 0, 0, 0.1) 100%),
            url(${game.thumbnail})
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 md:p-6 lg:p-8 relative z-10">
          
          {/* Main content - Game and Description */}
          <main className="col-span-1 lg:col-span-4">
            {/* Game container */}
            <article 
              id="game-container" 
              className={`
                relative rounded-xl overflow-hidden
                ${isFullscreen ? 'fixed inset-0 z-50' : ''}
                ${!showPreGame ? 'bg-black' : ''}
              `}
            >
              {showPreGame && game ? (
                <div className="flex flex-row items-center justify-center w-full h-full min-h-[320px] min-w-[220px] py-12">
                  {/* Centre : thumb, titre, boutons */}
                  <div className="flex flex-col items-center justify-center flex-1 px-8">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-56 h-36 md:w-64 md:h-40 rounded-xl shadow-2xl object-cover mb-8"
                      style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)' }}
                    />
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">{game.title}</h1>
                    <div className="flex flex-col gap-4 w-full items-center">
                      <button
                        className="text-button-brand text-xl font-bold px-10 py-4 rounded-full shadow-lg flex items-center gap-3 transition-all duration-300 mb-2 bg-gradient-yellow shadow-yellow-glow hover:bg-gradient-yellow-hover hover:shadow-yellow-glow-hover hover:scale-hover active:scale-95"
                        onClick={() => {
                          setShowPreGame(false);
                          if (window.gtag) {
                            window.gtag('event', 'game_start', {
                              'game_id': game.id,
                              'game_title': game.title,
                              'game_category': game.categoryName
                            });
                          }
                        }}
                      >
                        Play Now
                        <PlayCircle className="w-7 h-7" />
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-hover transition-colors text-muted"
                        onClick={() => setShowHowToPlay(true)}
                      >
                        <span className="font-medium">Game Preview</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Affichage du bouton de fermeture en fullscreen iOS */}
                  {isFullscreen && /iPad|iPhone|iPod/.test(navigator.userAgent) && (
                    <div className="fixed top-0 left-0 w-full z-[10000] bg-background/90 flex items-center justify-between px-4 py-3 shadow-md">
                      <span className="text-foreground font-semibold text-base">Fullscreen</span>
                      <button
                        onClick={toggleFullscreen}
                        className="flex items-center gap-2 text-foreground bg-primary/80 hover:bg-primary px-4 py-2 rounded-full font-medium transition-colors"
                        aria-label="Quit fullscreen"
                      >
                        <X className="w-5 h-5" />
                        <span>Quit fullscreen</span>
                      </button>
                    </div>
                  )}
                  <div 
                    ref={iframeParentRef}
                    className={`${!isFullscreen ? 'mx-auto h-[540px]' : ''}`}
                    style={{ 
                      aspectRatio: isFullscreen ? 'auto' : ''
                    }}
                  >
                    <iframe
                      src={game.url}
                      title={game.title}
                      className={`w-full h-full ${isFullscreen && /iPad|iPhone|iPod/.test(navigator.userAgent) ? 'ios-fullscreen' : ''}`}
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
                </>
              )}
              
              {/* Game controls bar */}
              {!showPreGame && (
              <div className={`bg-background/90 backdrop-blur-sm p-2 flex items-center justify-between ${isFullscreen ? 'hidden' : ''}`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <img src="/logo.svg" alt="NinjaGameZone Logo" className="w-4 h-4" />
                  </div>
                  <h1 className="text-foreground font-medium line-clamp-1">{game.title}</h1>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 text-muted hover:text-foreground hover:bg-hover rounded-lg transition-colors relative group"
                    aria-label="Share"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs font-medium text-foreground bg-background rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Share
                    </span>
                  </button>
                  
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 text-muted hover:text-foreground hover:bg-hover rounded-lg transition-colors relative group"
                    aria-label="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                    <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs font-medium text-foreground bg-background rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Fullscreen
                    </span>
                  </button>
                </div>
              </div>
              )}
            </article>

            {/* Similar games sous le jeu */}
            <div className="bg-card rounded-xl shadow-md overflow-hidden mt-6">
              <h3 className="text-lg font-bold p-4 border-b border-border text-foreground">
                Similar games
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4">
                {similarGames.map(similarGame => (
                  <GameCard key={similarGame.id} game={similarGame} />
                ))}
              </div>
            </div>

            {/* Game info */}
            <div className="bg-card rounded-xl shadow-md overflow-hidden mt-6 p-6">
              <h2 className="text-2xl font-bold mb-4 text-foreground">{game.title}</h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-primary/20 text-primary text-sm px-2 py-1 rounded-full">
                  {game.categoryName}
                </span>
                
                {game.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-hover text-muted text-sm px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="prose prose-sm max-w-none">
                {game.instructions && (
                  <div className="mb-6 p-4 bg-hover rounded-lg border border-border">
                    <h3 className="font-bold mb-2 text-foreground">Instructions</h3>
                    <p className="text-muted">{game.instructions}</p>
                  </div>
                )}
                
                <p className="text-muted whitespace-pre-line">{game.description}</p>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal Game Preview */}
      {showHowToPlay && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl w-full max-w-3xl relative">
            <button
              onClick={() => setShowHowToPlay(false)}
              className="absolute top-4 right-4 p-2 hover:bg-hover rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Game Preview</h2>
              <div id="gamemonetize-video" className="w-full aspect-video bg-black rounded-lg"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GamePage;