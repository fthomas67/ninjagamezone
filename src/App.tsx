import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import NotFoundPage from './pages/NotFoundPage';
import CategoryPage from './pages/CategoryPage';
import FilterPage from './pages/FilterPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/jeu/:gameId/:gameSlug" element={<GamePage />} />
        
        {/* Routes pour les filtres globaux */}
        <Route path="/plus-joues" element={<FilterPage filter="mostplayed" />} />
        <Route path="/plus-recents" element={<FilterPage filter="newest" />} />
        <Route path="/mieux-notes" element={<FilterPage filter="bestgames" />} />
        
        {/* Routes pour les catégories */}
        <Route path="/:categorySlug" element={<CategoryPage />} />
        
        {/* Routes pour les catégories avec filtres */}
        <Route path="/:categorySlug/plus-joues" element={<CategoryPage filter="mostplayed" />} />
        <Route path="/:categorySlug/plus-recents" element={<CategoryPage filter="newest" />} />
        <Route path="/:categorySlug/mieux-notes" element={<CategoryPage filter="bestgames" />} />
        
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;