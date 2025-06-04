import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import CookieBanner from './CookieBanner';
import Header from './Header';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Track page view conversion
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-715632083/UxLXCK21pdEaENPbntUC'
      });
    }

    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSidebarToggle = () => {
    if (isMobile) {
      // Sur mobile, on force l'état expanded
      setIsSidebarExpanded(true);
    }
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarExpandToggle = () => {
    // Cette fonction n'est utilisée que sur desktop
    if (!isMobile) {
      setIsSidebarExpanded(!isSidebarExpanded);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ScrollToTop />
      <Header 
        isSidebarOpen={isSidebarOpen} 
        onSidebarToggle={handleSidebarToggle}
        isSidebarExpanded={isSidebarExpanded}
        onSidebarExpandToggle={handleSidebarExpandToggle}
      />
      <div className="flex flex-1">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          isExpanded={isSidebarExpanded}
        />
        <div className={`flex-1 flex flex-col ${isSidebarExpanded ? 'lg:ml-48' : 'lg:ml-16'} transition-all duration-300`}>
          <main className="flex-1 pt-[72px] px-4 pb-4 md:px-6 md:pb-6 lg:px-8">
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