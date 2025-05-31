import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Menu } from 'lucide-react';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Mobile header with hamburger button */}
          <div className="lg:hidden p-4 border-b border-gray-200">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
              <span className="font-medium">Menu</span>
            </button>
          </div>
          <main className="flex-1 p-4 md:p-6 lg:px-8">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Layout;