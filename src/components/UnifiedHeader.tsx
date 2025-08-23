import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OrbWithAI from './OrbWithAI';

interface UnifiedHeaderProps {
  focused: boolean;
  focusedIndex: number;
  onWeatherChange: (condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy') => void;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  focused,
  focusedIndex,
  onWeatherChange
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Apps', path: '/apps' },
    { name: 'Restaurant', path: '/restaurant' }
  ];

  const handleNavClick = (path: string, index: number) => {
    // Persist focus index when navigating with mouse click
    localStorage.setItem('header-focus-index', index.toString());
    navigate(path);
  };

  return (
    <div className="unified-header flex justify-between items-center w-full p-6 md:p-8 fixed top-0 left-0 right-0 z-[60] py-[25px]">
      {/* Navigation buttons aligned to the left */}
      <div className="flex items-center space-x-4">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const isFocused = focused && focusedIndex === index;
          
          return (
            <button 
              key={item.path} 
              onClick={() => handleNavClick(item.path, index)} 
              className={`
                h-10 text-sm font-medium rounded-full px-4 flex items-center whitespace-nowrap transform transition-all duration-300
                ${isActive ? 'bg-white text-black shadow-lg scale-105' : isFocused ? 'bg-gray-600 text-white shadow-lg scale-105' : 'text-gray-300 hover:text-white hover:bg-white/10 scale-100'}
              `}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      {/* AI Orb on the absolute right */}
      <div className="flex items-center">
        <OrbWithAI focused={focused && focusedIndex === 5} size="small" />
      </div>
    </div>
  );
};

export default UnifiedHeader;