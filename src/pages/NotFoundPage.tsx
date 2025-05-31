import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <Gamepad2 className="w-20 h-20 text-primary mb-6" />
      
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Page Not Found</h2>
      
      <p className="text-gray-600 max-w-md mb-8">
        Oops! The page you're looking for doesn't exist. Maybe the game has been moved or deleted.
      </p>
      
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;