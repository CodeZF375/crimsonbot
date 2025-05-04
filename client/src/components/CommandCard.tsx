import React from 'react';
import { Button } from '@/components/ui/button';

interface CommandCardProps {
  title: string;
  description: string;
  type: 'add' | 'remove';
  command: string;
  onExecute?: () => void;
  onHelp?: () => void;
}

const CommandCard: React.FC<CommandCardProps> = ({
  title,
  description,
  type,
  command,
  onExecute,
  onHelp
}) => {
  return (
    <div className="bg-discord-dark rounded-md p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-discord-lightest font-semibold">{title}</h3>
          <p className="text-sm text-discord-light mt-1">{description}</p>
        </div>
        <span className={`px-2 py-1 ${
          type === 'add' 
            ? 'bg-discord-primary/20 text-discord-primary' 
            : 'bg-discord-danger/20 text-discord-danger'
        } rounded text-xs`}>
          {type === 'add' ? 'EKLE' : 'KALDIR'}
        </span>
      </div>
      
      <div className="mt-4 p-3 bg-discord-darker/80 rounded-md">
        <code className="text-discord-secondary text-sm">{command}</code>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <Button 
          variant="ghost" 
          onClick={onExecute}
          className="px-3 py-1.5 bg-discord-primary/20 text-discord-primary rounded-md text-sm hover:bg-discord-primary/30 transition h-auto"
        >
          <i className="ri-play-line mr-1"></i> Çalıştır
        </Button>
        <Button 
          variant="ghost" 
          onClick={onHelp}
          className="px-3 py-1.5 bg-discord-danger/20 text-discord-danger rounded-md text-sm hover:bg-discord-danger/30 transition h-auto"
        >
          <i className="ri-information-line mr-1"></i> Yardım
        </Button>
      </div>
    </div>
  );
};

export default CommandCard;
