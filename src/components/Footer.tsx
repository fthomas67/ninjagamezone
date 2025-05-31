import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
              <img src="/logo.svg" alt="NinjaGameZone" className="w-3 h-3" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-foreground">Ninja</span>
              <span className="text-primary">GameZone</span>
            </span>
          </div>
          
          <div className="flex gap-6">
            <Link to="/" className="text-gray-600 hover:text-primary">Accueil</Link>
            <Link to="/mentions-legales" className="text-gray-600 hover:text-primary">Mentions Légales</Link>
            <Link to="/politique-cookies" className="text-gray-600 hover:text-primary">Cookies</Link>
            <Link to="/a-propos" className="text-gray-600 hover:text-primary">À propos</Link>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            Les jeux sont fournis par GameMonetize via leur flux RSS. NinjaGameZone n'est pas affilié à GameMonetize.
          </p>
          
          <p className="text-gray-500 text-sm mt-2 flex items-center justify-center gap-1">
            <span>Créé avec</span> 
            <Heart className="w-4 h-4 text-secondary inline" /> 
            <span>en 2025</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;