import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AIOrb from './AIOrb';

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

  // Prevent focus from moving out of header when pressing right arrow on last button
  // This is handled in Index.tsx by clamping headerIndex to 3, so no change needed here for keyboard navigation

  return (
  <div className="unified-header flex justify-between items-center w-full fixed top-0 left-0 right-0 z-[60] py-[12px]" style={{paddingLeft: '25px', paddingRight: '40px'}}>
      {/* Navigation buttons aligned to the left */}
      <div className="flex items-center space-x-4">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const isFocused = focused && focusedIndex === index;
          
          return (
              <button 
                key={item.path}
                id={`header-button-${index}`}
                onClick={() => handleNavClick(item.path, index)} 
                className={`
                  text-xl font-extralight px-2 flex items-center whitespace-nowrap bg-transparent border-none outline-none transition-all duration-300
                  ${isActive ? 'text-white font-light' : isFocused ? 'text-white focus-glow' : 'text-gray-300 hover:text-white'}
                `}
                style={{
                  textShadow: isFocused ? '0 0 4px rgba(255,255,255,0.6), 0 0 8px rgba(255,255,255,0.3)' : 'none',
                  background: 'transparent',
                  borderRadius: 0,
                  height: 'auto',
                  padding: '0 16px',
                  position: 'relative',
                  opacity: isActive || isFocused ? 1 : 0.3,
                }}
              >
                {item.name}
              </button>
          );
        })}
      </div>

      {/* AI Orb on the absolute right */}
      <div className="flex items-center">
        <div id="header-button-3">
          <AIOrb focused={focused && focusedIndex === 3} />
        </div>
      </div>
    </div>
  );
};

export default UnifiedHeader;