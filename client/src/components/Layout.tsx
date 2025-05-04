import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';
import { useMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - hidden on mobile */}
      <Sidebar className="hidden md:block" />
      
      {/* Mobile header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-discord-darker z-10 p-4 border-b border-discord-light/10">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-discord-lightest flex items-center">
              <i className="ri-robot-2-line mr-2 text-discord-primary"></i>
              Bot Yönetimi
            </h1>
            <button onClick={toggleMobileMenu} className="text-discord-lightest">
              <i className="ri-menu-line text-2xl"></i>
            </button>
          </div>
        </div>
      )}
      
      {/* Mobile menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 md:pt-6 mt-16 md:mt-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;
