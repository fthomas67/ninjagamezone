import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Menu, X, History } from 'lucide-react';
import bestOnMobile from '../data/gamemonetize_bestonmobile.json';
import mostPlayed from '../data/gamemonetize_mostplayed.json';
import bestGames from '../data/gamemonetize_bestgames.json';
import newest from '../data/gamemonetize_newest.json';
import { createSlug } from '../utils/slug';
import GameCard from './GameCard';

interface Game {
  id: string;
  title: string;
  url: string;
  thumb: string;
}

interface HeaderProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}

const Header = ({ isSidebarOpen, onSidebarToggle }: HeaderProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Game[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [recentGames, setRecentGames] = useState<any[]>([]);
  const navigate = useNavigate();

  // Combiner tous les jeux en un seul tableau
  const allGames: Game[] = [
    ...(bestOnMobile as Game[]),
    ...(mostPlayed as Game[]),
    ...(bestGames as Game[]),
    ...(newest as Game[])
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchTerm.length > 2) {
      const filteredGames = allGames
        .filter(game => 
          game.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 7); // Limiter à 7 suggestions
      setSuggestions(filteredGames);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (showRecent) {
      try {
        const stored = localStorage.getItem('recentGames');
        setRecentGames(stored ? JSON.parse(stored) : []);
      } catch {
        setRecentGames([]);
      }
    }
  }, [showRecent]);

  const handleGameSelect = (game: Game) => {
    const titleSlug = createSlug(game.title);
    navigate(`/game/${game.id}/${titleSlug}`);
    setSearchTerm('');
    setSuggestions([]);
    setIsSearchOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 py-4 w-full z-50">
      <div className="flex items-center w-full px-4">
        {/* Logo/Menu à gauche */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={onSidebarToggle}
            className="lg:hidden flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <img src="/logo.svg" alt="NinjaGameZone" className="w-4 h-4" />
            </div>
            <span className="font-bold text-xl">
              <span className="text-gray-900">Ninja</span>
              <span className="text-primary">GameZone</span>
            </span>
          </Link>
        </div>
        {/* Barre de recherche desktop centrée */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="relative w-full max-w-2xl px-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full pl-4 pr-12 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            />
            {suggestions.length > 0 && (
              <div className="absolute w-full mt-2 bg-white rounded-lg z-50 shadow-sm border border-gray-200">
                <div className="max-h-[min(400px,calc(100vh-200px))] overflow-y-auto rounded-lg">
                  {suggestions.map((game) => (
                    <div
                      key={game.id}
                      onClick={() => handleGameSelect(game)}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-900 flex items-center gap-3 bg-white"
                    >
                      <img 
                        src={game.thumb} 
                        alt={game.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <span className="truncate">{game.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Bouton 'Played recently' desktop */}
        <div className="hidden lg:flex items-center ml-auto relative">
          <div className="relative">
            <button
              onClick={() => setShowRecent(v => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
              aria-label="Games played recently"
            >
              <History className="w-5 h-5" />
              <span className="font-medium">Played recently</span>
            </button>
            {showRecent && (
              <div className="absolute right-1 mt-2 w-96 max-w-[95vw] bg-[#232334] text-white rounded-xl shadow-lg z-50 border border-gray-700 animate-fade-in overflow-x-hidden" style={{minWidth: '260px', maxWidth: '95vw'}}>
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <span className="font-bold text-lg">Played recently</span>
                  <button onClick={() => setShowRecent(false)} className="hover:bg-white/10 rounded-full p-1"><X className="w-6 h-6" /></button>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  {recentGames.length === 0 && <span className="text-gray-400 col-span-2">Aucun jeu récent</span>}
                  {recentGames.map((game, idx) => (
                    <div key={game.id} className="relative group">
                      <GameCard game={game} />
                      <button
                        className="absolute top-2 right-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full p-1 opacity-80 group-hover:opacity-100 transition"
                        onClick={() => {
                          const updated = recentGames.filter((g) => g.id !== game.id);
                          setRecentGames(updated);
                          localStorage.setItem('recentGames', JSON.stringify(updated));
                        }}
                        aria-label="Supprimer ce jeu"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Bouton recherche mobile à droite */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="lg:hidden flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-lg transition-colors ml-auto"
          aria-label="Search"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-50 lg:hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close search"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-4 pr-12 py-2 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
          {suggestions.length > 0 && (
            <div className="px-4 pt-0.5">
              <div className="max-h-[calc(100vh-120px)] overflow-y-auto bg-white rounded-lg border border-gray-200">
                {suggestions.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => handleGameSelect(game)}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-900 flex items-center gap-3 bg-white"
                  >
                    <img 
                      src={game.thumb} 
                      alt={game.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <span className="truncate">{game.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header; 