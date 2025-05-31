import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import NotFoundPage from './pages/NotFoundPage';
import CategoryPage from './pages/CategoryPage';
import FilterPage from './pages/FilterPage';
import LegalNoticePage from './pages/LegalNoticePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/jeu/:gameId/:gameSlug" element={<GamePage />} />
        <Route path="/legal-notice" element={<LegalNoticePage />} />
        
        {/* Global filter routes */}
        <Route path="/most-played" element={<FilterPage filter="mostplayed" />} />
        <Route path="/newest" element={<FilterPage filter="newest" />} />
        <Route path="/best-rated" element={<FilterPage filter="bestgames" />} />
        
        {/* Category routes */}
        <Route path="/:categorySlug" element={<CategoryPage />} />
        
        {/* Category routes with filters */}
        <Route path="/:categorySlug/most-played" element={<CategoryPage filter="mostplayed" />} />
        <Route path="/:categorySlug/newest" element={<CategoryPage filter="newest" />} />
        <Route path="/:categorySlug/best-rated" element={<CategoryPage filter="bestgames" />} />
        
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;