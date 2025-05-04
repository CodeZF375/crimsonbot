import React from 'react';
import { Link, useLocation } from 'wouter';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [location] = useLocation();
  
  return (
    <div 
      className={`fixed inset-0 bg-discord-darker z-20 transform transition-transform duration-300 md:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b border-discord-light/10">
        <h1 className="text-xl font-bold text-discord-lightest">Bot Yönetimi</h1>
        <button onClick={onClose} className="text-discord-lightest">
          <i className="ri-close-line text-2xl"></i>
        </button>
      </div>
      
      <div className="p-4">
        <nav>
          <div className="mb-2 text-xs uppercase tracking-wider text-discord-light/70">Ana Menü</div>
          <Link 
            href="/" 
            onClick={onClose}
            className={`flex items-center p-3 mb-1 rounded-md ${
              location === '/' 
                ? 'bg-discord-primary text-white' 
                : 'hover:bg-discord-dark/80'
            }`}
          >
            <i className="ri-question-line mr-2"></i>
            <span>Yardım</span>
          </Link>
          
          <div className="mt-6 mb-2 text-xs uppercase tracking-wider text-discord-light/70">Komut Kategorileri</div>
          <Link 
            href="/muteffikler" 
            onClick={onClose}
            className={`flex items-center p-3 mb-1 rounded-md ${
              location === '/muteffikler' 
                ? 'bg-discord-primary text-white' 
                : 'hover:bg-discord-dark/80'
            }`}
          >
            <i className="ri-team-line mr-2"></i>
            <span>Müttefikler</span>
          </Link>
          
          <Link 
            href="/dusmanlar" 
            onClick={onClose}
            className={`flex items-center p-3 mb-1 rounded-md ${
              location === '/dusmanlar' 
                ? 'bg-discord-primary text-white' 
                : 'hover:bg-discord-dark/80'
            }`}
          >
            <i className="ri-sword-line mr-2"></i>
            <span>Düşmanlar</span>
          </Link>
          
          <Link 
            href="/askadro" 
            onClick={onClose}
            className={`flex items-center p-3 mb-1 rounded-md ${
              location === '/askadro' 
                ? 'bg-discord-primary text-white' 
                : 'hover:bg-discord-dark/80'
            }`}
          >
            <i className="ri-group-line mr-2"></i>
            <span>AS Kadro</span>
          </Link>
          
          <Link 
            href="/ksbilgi" 
            onClick={onClose}
            className={`flex items-center p-3 mb-1 rounded-md ${
              location === '/ksbilgi' 
                ? 'bg-discord-primary text-white' 
                : 'hover:bg-discord-dark/80'
            }`}
          >
            <i className="ri-information-line mr-2"></i>
            <span>KS Bilgi</span>
          </Link>
          
          <Link 
            href="/sunucular" 
            onClick={onClose}
            className={`flex items-center p-3 mb-1 rounded-md ${
              location === '/sunucular' 
                ? 'bg-discord-primary text-white' 
                : 'hover:bg-discord-dark/80'
            }`}
          >
            <i className="ri-server-line mr-2"></i>
            <span>Oynadığımız Sunucular</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
