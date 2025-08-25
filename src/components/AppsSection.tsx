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
const AppsSection: React.FC = () => {
  const handleAppClick = (url: string) => {
    window.open(url, '_blank');
  };
  return <div className="w-full">
      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
        {apps.map((app, index) => (
          <Card
            key={index}
            onClick={() => handleAppClick(app.url)}
            className="flex-shrink-0 w-64 h-44 bg-background/10 border-border/20 backdrop-blur-sm cursor-pointer hover:bg-background/20 transition-all duration-200 hover:scale-105 rounded-2xl p-0"
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
        ))}
      </div>
    </div>;
};
export default AppsSection;