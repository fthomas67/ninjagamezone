import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import CookieBanner from './CookieBanner';
import Header from './Header';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Track page view conversion
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-715632083/UxLXCK21pdEaENPbntUC'
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header isSidebarOpen={isSidebarOpen} onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 pt-[72px]">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col lg:ml-60 xl:ml-64">
          <main className="flex-1 p-4 md:p-6 lg:px-8">
            <Outlet />
          </main>
          <Footer />
          <CookieBanner />
        </div>
      </div>
    </div>
  );
}

export default Layout;