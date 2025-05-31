import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 h-16 flex items-center gap-4 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Toggle menu"
          >
            <span className="text-2xl">☰</span>
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <img src="/logo.svg" alt="NinjaGameZone" className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline font-bold text-xl">
              <span className="text-foreground">Ninja</span>
              <span className="text-primary">GameZone</span>
            </span>
          </Link>
        </div>
        
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xl">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;