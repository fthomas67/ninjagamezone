import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { categories, popularityFilters, getFilterBySlug, getFilterSlug } from '../data/categories';
import { PopularityFilter as PopularityFilterType } from '../types';
import { createSlug } from '../utils/slug';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ 
  isOpen, 
  onClose,
}: SidebarProps) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
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

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-[65px] left-0 z-40
        w-60 xl:w-64 bg-white border-r border-gray-200 
        h-[calc(100vh-65px)]
        flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <nav 
          ref={navRef}
          className={`
            h-full overflow-y-auto py-4 px-3
            ${isScrolling ? 'scrollbar-visible' : 'scrollbar-hidden'}
            transition-[scrollbar] duration-300
          `}
        >
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Sort by
          </h3>
          <ul className="space-y-1 mb-6">
            {popularityFilters.map((filter) => (
              <li key={filter.type}>
                <button 
                  onClick={() => handlePopularityClick(filter.type)}
                  className={`nav-item w-full text-left ${currentFilter === filter.type ? 'active' : ''}`}
                >
                  <span>{filter.icon}</span>
                  <span>{filter.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Categories
          </h3>
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`nav-item w-full text-left ${currentCategory === category.id ? 'active' : ''}`}
                >
                  <span>{category.emoji}</span>
                  <span>{category.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;