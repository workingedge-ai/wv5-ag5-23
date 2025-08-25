import React from 'react';
import { Card } from '@/components/ui/card';

const apps = [
  { 
    name: 'YouTube', 
    icon: '/src/assets/youtube-icon.jpg', 
    url: 'https://youtube.com'
  },
  { 
    name: 'YouTube Music', 
    icon: '/src/assets/youtube-music-icon.jpg', 
    url: 'https://music.youtube.com'
  },
  { 
    name: 'Plex', 
    icon: '/src/assets/plex-icon.jpg', 
    url: 'https://plex.tv'
  },
  { 
    name: 'Netflix', 
    icon: '/src/assets/netflix-icon.jpg', 
    url: 'https://netflix.com'
  },
  { 
    name: 'Pluto TV', 
    icon: '/src/assets/pluto-icon.jpg', 
    url: 'https://pluto.tv'
  }
];

const AppsSection: React.FC = () => {
  const handleAppClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="w-full">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {apps.map((app, index) => (
          <Card 
            key={index}
            onClick={() => handleAppClick(app.url)}
            className="flex-shrink-0 w-32 h-20 bg-background/10 border-border/20 backdrop-blur-sm cursor-pointer hover:bg-background/20 transition-all duration-200 hover:scale-105 rounded-2xl"
          >
            <div className="w-full h-full p-2 flex flex-col items-center justify-center">
              <img 
                src={app.icon} 
                alt={app.name}
                className="w-10 h-10 rounded-xl object-cover mb-1"
              />
              <span className="text-xs text-foreground text-center font-medium truncate w-full">
                {app.name}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppsSection;