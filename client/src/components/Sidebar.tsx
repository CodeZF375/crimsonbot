import React from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const [location] = useLocation();
  
  const { data: statusData } = useQuery({
    queryKey: ['/api/status'],
    refetchInterval: 30000,
  });
  
  const botStatus = statusData?.bot || 'unknown';
  
  return (
    <aside className={`w-64 bg-discord-darker p-4 flex flex-col ${className}`}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-discord-lightest flex items-center">
          <i className="ri-robot-2-line mr-2 text-discord-primary"></i>
          Bot Yönetimi
        </h1>
        <p className="text-sm mt-1 text-discord-light">Discord Bot Kontrol Paneli</p>
      </div>
      
      <nav className="flex-1">
        <div className="mb-2 text-xs uppercase tracking-wider text-discord-light/70">Ana Menü</div>
        <Link 
          href="/" 
          className={`flex items-center p-3 mb-1 rounded-md ${
            location === '/' 
              ? 'bg-discord-primary text-white' 
              : 'hover:bg-discord-dark/80 transition'
          }`}
        >
          <i className="ri-question-line mr-2"></i>
          <span>Yardım</span>
        </Link>
        
        <div className="mt-6 mb-2 text-xs uppercase tracking-wider text-discord-light/70">Komut Kategorileri</div>
        <Link 
          href="/muteffikler" 
          className={`flex items-center p-3 mb-1 rounded-md ${
            location === '/muteffikler' 
              ? 'bg-discord-primary text-white' 
              : 'hover:bg-discord-dark/80 transition'
          }`}
        >
          <i className="ri-team-line mr-2"></i>
          <span>Müttefikler</span>
        </Link>
        
        <Link 
          href="/dusmanlar" 
          className={`flex items-center p-3 mb-1 rounded-md ${
            location === '/dusmanlar' 
              ? 'bg-discord-primary text-white' 
              : 'hover:bg-discord-dark/80 transition'
          }`}
        >
          <i className="ri-sword-line mr-2"></i>
          <span>Düşmanlar</span>
        </Link>
        
        <Link 
          href="/askadro" 
          className={`flex items-center p-3 mb-1 rounded-md ${
            location === '/askadro' 
              ? 'bg-discord-primary text-white' 
              : 'hover:bg-discord-dark/80 transition'
          }`}
        >
          <i className="ri-group-line mr-2"></i>
          <span>AS Kadro</span>
        </Link>
        
        <Link 
          href="/ksbilgi" 
          className={`flex items-center p-3 mb-1 rounded-md ${
            location === '/ksbilgi' 
              ? 'bg-discord-primary text-white' 
              : 'hover:bg-discord-dark/80 transition'
          }`}
        >
          <i className="ri-information-line mr-2"></i>
          <span>KS Bilgi</span>
        </Link>
        
        <Link 
          href="/sunucular" 
          className={`flex items-center p-3 mb-1 rounded-md ${
            location === '/sunucular' 
              ? 'bg-discord-primary text-white' 
              : 'hover:bg-discord-dark/80 transition'
          }`}
        >
          <i className="ri-server-line mr-2"></i>
          <span>Oynadığımız Sunucular</span>
        </Link>
      </nav>
      
      <div className="mt-auto pt-4 border-t border-discord-light/10">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-discord-primary flex items-center justify-center text-white">
            <i className="ri-discord-fill text-lg"></i>
          </div>
          <div className="ml-3">
            <div className="text-discord-lightest font-medium">Bot Durumu</div>
            <div className="flex items-center text-xs">
              <span className={`w-2 h-2 rounded-full mr-1 ${
                botStatus === 'online' 
                  ? 'bg-discord-success' 
                  : botStatus === 'offline' 
                    ? 'bg-discord-danger' 
                    : 'bg-discord-warning'
              }`}></span>
              <span>
                {botStatus === 'online' 
                  ? 'Çevrimiçi' 
                  : botStatus === 'offline' 
                    ? 'Çevrimdışı' 
                    : 'Bilinmiyor'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
