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
            <Link to="/legal-notice" className="text-gray-600 hover:text-primary">Legal Notice</Link>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            Games are provided by GameMonetize via their RSS feed. NinjaGameZone is not affiliated with GameMonetize.
          </p>
          
          <p className="text-gray-500 text-sm mt-2 flex items-center justify-center gap-1">
            <span>Created with</span> 
            <Heart className="w-4 h-4 text-secondary inline" /> 
            <span>in 2025</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;