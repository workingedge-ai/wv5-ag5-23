import React from 'react';
import { Card } from '@/components/ui/card';
const apps = [{
  name: 'YouTube',
  icon: '/src/assets/youtube-icon.jpg',
  url: 'https://youtube.com'
}, {
  name: 'YouTube Music',
  icon: '/src/assets/youtube-music-icon.jpg',
  url: 'https://music.youtube.com'
}, {
  name: 'Plex',
  icon: '/src/assets/plex-icon.jpg',
  url: 'https://plex.tv'
}, {
  name: 'Netflix',
  icon: '/src/assets/netflix-icon.jpg',
  url: 'https://netflix.com'
}, {
  name: 'Pluto TV',
  icon: '/src/assets/pluto-icon.jpg',
  url: 'https://pluto.tv'
}];
interface AppsSectionProps {
  focused: boolean;
  focusedIndex: number;
}

const AppsSection: React.FC<AppsSectionProps> = ({ focused, focusedIndex }) => {
  const handleAppClick = (url: string) => {
    window.open(url, '_blank');
  };
  
  return (
    <div id="apps-section" className="w-full">
      <div 
        id="apps-container" 
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
      >
        {apps.map((app, index) => {
          const isFocused = focused && focusedIndex === index;
          
          return (
            <Card
              key={index}
              id={`app-${index}`}
              onClick={() => handleAppClick(app.url)}
              className={`
                flex-shrink-0 w-64 h-44 bg-background/10 border-border/20 backdrop-blur-sm cursor-pointer transition-all duration-200 rounded-2xl p-0
                ${isFocused ? 'bg-background/30 scale-105 ring-2 ring-white/50' : 'hover:bg-background/20 hover:scale-105'}
              `}
            >
              <div className="w-full h-full relative">
                <img
                  src={app.icon}
                  alt={app.name}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
                  style={{ zIndex: 1 }}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AppsSection;