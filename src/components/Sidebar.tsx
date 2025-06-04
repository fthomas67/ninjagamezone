import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { categories, popularityFilters, getFilterBySlug, getFilterSlug } from '../data/categories';
import { PopularityFilter as PopularityFilterType } from '../types';
import { createSlug } from '../utils/slug';
import { History, X } from 'lucide-react';
import GameCard from './GameCard';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded: boolean;
}

const Sidebar = ({ 
  isOpen, 
  onClose,
  isExpanded,
}: SidebarProps) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [showRecent, setShowRecent] = useState(false);
  const [recentGames, setRecentGames] = useState<any[]>([]);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  
  const getCurrentState = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    let currentCategory = 0;
    let currentFilter: PopularityFilterType = 'mostplayed';

    const filterSlug = pathParts[pathParts.length - 1];
    const filter = getFilterBySlug(filterSlug);
    if (filter) currentFilter = filter;

    if (pathParts.length > 0) {
      const categorySlug = pathParts[0];
      const category = categories.find(c => createSlug(c.name) === categorySlug);
      if (category) currentCategory = category.id;
    }

    return { currentCategory, currentFilter };
  };

  const { currentCategory, currentFilter } = getCurrentState();
  
  const handleCategoryClick = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const categorySlug = createSlug(category.name);
    const filterSlug = getFilterSlug(currentFilter);
    navigate(`/${categorySlug}/${filterSlug}`);
    onClose();
  };

  const handlePopularityClick = (filter: PopularityFilterType) => {
    const filterSlug = getFilterSlug(filter);
    
    if (currentCategory > 0) {
      const category = categories.find(c => c.id === currentCategory);
      if (!category) return;
      navigate(`/${createSlug(category.name)}/${filterSlug}`);
    } else {
      navigate(`/${filterSlug}`);
    }
    onClose();
  };

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const handleScroll = () => {
      setIsScrolling(true);
      
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    nav.addEventListener('scroll', handleScroll);
    return () => {
      nav.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

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

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Wrapper pour permettre overflow visible */}
      <div style={{ overflow: 'visible', position: 'relative', height: '100%' }}>
        <aside
          className={`
            fixed top-[65px] left-0 z-40
            ${isExpanded ? 'w-48' : 'w-16'}
            h-[calc(100vh-65px)]
            flex flex-col
            shadow-[1px_0_2px_rgba(0,0,0,0.05)]
            bg-sidebar
            transition-all duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            overflow-visible
          `}
        >
          <nav 
            ref={navRef}
            className={`
              h-full overflow-y-auto pt-8 px-2 pb-4
              ${isScrolling ? 'scrollbar-visible' : 'scrollbar-hidden'}
              transition-[scrollbar] duration-300
              overflow-visible
            `}
          >
            <h3 className="sr-only">Trier par</h3>
            <ul className="space-y-1 mb-6">
              {popularityFilters.map((filter) => (
                <li key={filter.type} className="relative group">
                  <button 
                    onClick={() => handlePopularityClick(filter.type)}
                    className={`nav-item w-full text-left text-muted hover:bg-hover flex items-center rounded-lg px-2 py-2 transition-all duration-200
                      ${currentFilter === filter.type ? 'bg-hover text-foreground font-bold' : ''}
                    `}
                    aria-label={filter.label}
                  >
                    <span className="text-xl w-8 flex justify-center items-center">{filter.icon}</span>
                    {isExpanded && <span className="ml-2">{filter.label}</span>}
                  </button>
                  {/* Tooltip */}
                  {!isExpanded && (
                    <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 rounded-lg bg-hover text-foreground text-sm font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.15)] opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 whitespace-nowrap z-50">
                      {filter.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <h3 className="sr-only">Catégories</h3>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.id} className="relative group">
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className={`nav-item w-full text-left text-muted hover:bg-hover flex items-center rounded-lg px-2 py-2 transition-all duration-200
                      ${currentCategory === category.id ? 'bg-hover text-foreground font-bold' : ''}
                    `}
                    aria-label={category.name}
                  >
                    <span className="text-xl w-8 flex justify-center items-center">{category.emoji}</span>
                    {isExpanded && <span className="ml-2">{category.name}</span>}
                  </button>
                  {/* Tooltip */}
                  {!isExpanded && (
                    <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 rounded-lg bg-hover text-foreground text-sm font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.15)] opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 whitespace-nowrap z-50">
                      {category.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
      {/* Encart jeux récents mobile (fixe en bas) */}
      {isOpen && (
        <div className="lg:hidden fixed left-0 bottom-0 w-60 xl:w-64 bg-sidebar text-foreground border-t border-border z-50">
          <button
            onClick={() => setShowRecent(v => !v)}
            className="flex items-center gap-2 w-full px-4 py-3 hover:bg-primary/10 transition-colors font-medium"
            aria-label="Games played recently"
          >
            <History className="w-5 h-5" />
            <span>Played recently</span>
          </button>
          {showRecent && (
            <div className="fixed inset-0 w-screen h-screen bg-sidebar text-foreground z-50 flex flex-col animate-fade-in overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-border/10">
                <span className="font-bold text-lg">Played recently</span>
                <button onClick={() => setShowRecent(false)} className="hover:bg-primary/20 rounded-full p-1"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto">
                {recentGames.length === 0 && <span className="text-muted col-span-2">Aucun jeu récent</span>}
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
      )}
    </>
  );
};

export default Sidebar;