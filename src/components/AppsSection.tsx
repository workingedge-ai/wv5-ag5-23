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
  
  // Move focused app to the first position
  const orderedApps = focused
    ? [apps[focusedIndex], ...apps.filter((_, idx) => idx !== focusedIndex)]
    : apps;

  // Restore original order, but scroll focused card into view
  React.useEffect(() => {
    if (focused) {
      const el = document.getElementById(`app-${focusedIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
    }
  }, [focused, focusedIndex]);

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
              key={app.name}
              id={`app-${index}`}
              onClick={() => handleAppClick(app.url)}
              className={`
                flex-shrink-0 w-80 h-44 bg-background/10 border-border/20 backdrop-blur-sm cursor-pointer transition-all duration-200 rounded-[30px] p-0
                ${isFocused ? 'bg-background/30' : 'hover:bg-background/20'}
              `}
            >
              <div className="w-full h-full relative">
                <img
                  src={app.icon}
                  alt={app.name}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-[30px]"
                  style={{ zIndex: 1 }}
                />
                <div
                  className={`absolute inset-0 rounded-[30px] border-2 border-white pointer-events-none transition-opacity duration-200 ${isFocused ? 'opacity-100' : 'opacity-0'}`}
                  style={isFocused ? {
                    zIndex: 2,
                    boxShadow: 'inset 0 0 8px 2px rgba(255,255,255,0.5)'
                  } : { zIndex: 2 }}
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