import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const commandCategories = [
  { name: 'Müttefikler', icon: 'ri-team-line', path: '/muteffikler' },
  { name: 'Düşmanlar', icon: 'ri-sword-line', path: '/dusmanlar' },
  { name: 'AS Kadro', icon: 'ri-group-line', path: '/askadro' },
  { name: 'KS Bilgi', icon: 'ri-information-line', path: '/ksbilgi' },
  { name: 'Sunucular', icon: 'ri-server-line', path: '/sunucular' }
];

const Home: React.FC = () => {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-discord-lightest mb-4 flex items-center">
          <i className="ri-question-line mr-2 text-discord-primary"></i>
          Yardım Menüsü
        </h2>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost"
            className="px-3 py-1.5 bg-discord-darker rounded-md text-sm hover:bg-discord-darker/80 transition h-auto"
          >
            <i className="ri-refresh-line mr-1"></i> Yenile
          </Button>
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Komut ara..." 
              className="bg-discord-darker border border-discord-light/10 rounded-md px-3 py-1.5 text-sm w-40 md:w-64 focus:outline-none focus:ring-1 focus:ring-discord-primary h-auto"
            />
            <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-discord-light/70"></i>
          </div>
        </div>
      </div>
      
      <Card className="bg-discord-darker rounded-lg mb-6 border-none">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-discord-primary/20 text-discord-primary mb-4">
              <i className="ri-slash-commands-2 text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-discord-lightest mb-2">Slash Komutları</h3>
            <p className="text-discord-light mb-4">
              Tüm komutları kullanmak için aşağıdaki kategorileri inceleyebilirsiniz.
            </p>
            
            <div className="inline-block bg-discord-dark px-4 py-2 rounded-md mb-4">
              <code className="text-discord-secondary">/yardım</code>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-6">
              {commandCategories.map((category, index) => (
                <Link href={category.path} key={index}>
                  <div className="bg-discord-dark rounded-md p-3 text-center hover:bg-discord-dark/80 transition cursor-pointer group">
                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-discord-primary/20 text-discord-primary mb-2 group-hover:bg-discord-primary/30 transition">
                      <i className={category.icon}></i>
                    </div>
                    <div className="text-sm font-medium text-discord-lightest">{category.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Home;
