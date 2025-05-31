import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <Gamepad2 className="w-20 h-20 text-primary mb-6" />
      
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Page Non Trouvée</h2>
      
      <p className="text-gray-600 max-w-md mb-8">
        Oups ! La page que tu cherches n'existe pas. Peut-être que le jeu a été déplacé ou supprimé.
      </p>
      
      <Link to="/" className="btn btn-primary">
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFoundPage;