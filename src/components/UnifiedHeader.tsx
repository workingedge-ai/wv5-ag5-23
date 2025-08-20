import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WeatherWidget from './WeatherWidget';
import AIOrb from './AIOrb';
import { useGeminiLiveAudio } from '@/hooks/useGeminiLiveAudio';
import { Clock } from 'lucide-react';
interface UnifiedHeaderProps {
  focused: boolean;
  focusedIndex: number;
  onWeatherChange: (condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy') => void;
}
type NavItem = {
  name: string;
  path: string;
  type: 'nav';
};
type TimeItem = {
  name: string;
  type: 'time';
};
type WeatherItem = {
  name: string;
  type: 'weather';
};
type AIItem = {
  name: string;
  type: 'ai';
};
type HeaderItem = NavItem | TimeItem | WeatherItem | AIItem;
const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  focused,
  focusedIndex,
  onWeatherChange
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isConnected,
    isMuted
  } = useGeminiLiveAudio();
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  const navItems: NavItem[] = [{
    name: 'Home',
    path: '/',
    type: 'nav'
  }, {
    name: 'Apps',
    path: '/apps',
    type: 'nav'
  }, {
    name: 'Restaurant',
    path: '/restaurant',
    type: 'nav'
  }];
  const allItems: HeaderItem[] = [...navItems, {
    name: getCurrentTime(),
    type: 'time'
  }, {
    name: 'Weather',
    type: 'weather'
  }, {
    name: 'Atlas AI',
    type: 'ai'
  }];
  const handleNavClick = (path: string, index: number) => {
    // Persist focus index when navigating with mouse click
    localStorage.setItem('header-focus-index', index.toString());
    navigate(path);
  };
  return <div className={`unified-header ${isConnected && !isMuted ? 'ai-active' : ''} flex justify-center w-full p-6 md:p-8 fixed top-0 left-0 right-0 z-[60] py-[25px]`}>
      {/* Animated blue glow background when AI is active */}
      {isConnected && !isMuted && (
        <div className="absolute inset-0 flex justify-center items-start pt-6 md:pt-8 pointer-events-none z-0">
          <div className="w-full max-w-[900px] h-20 relative">
            <div className="absolute left-0 top-0 w-full h-full rounded-full overflow-hidden">
              <div className="w-full h-full animate-ai-horizontal-pulse" style={{
                background: 'linear-gradient(90deg, rgba(0,180,255,0.18) 0%, rgba(0,180,255,0.45) 50%, rgba(0,180,255,0.18) 100%)',
                filter: 'blur(32px)'
              }}></div>
            </div>
          </div>
        </div>
      )}
      <div className={`
        bg-black/30 backdrop-blur-md rounded-full shadow-2xl py-[4px] px-[4px] relative transition-all duration-500 overflow-visible
        ${isConnected && !isMuted 
          ? 'border-4 border-ai-blue shadow-[0_0_40px_hsl(var(--ai-blue)/0.7)] animate-ai-pulse-complex' 
          : 'border border-white/10'
        }
      `}>
        {/* Inner blue glow overlay when AI is active */}
        {isConnected && !isMuted && (
          <div
            className="absolute -inset-4 rounded-full pointer-events-none overflow-visible z-10 animate-ai-glow-pulse"
            style={{
              background: 'linear-gradient(90deg, rgba(0,180,255,0.14) 0%, rgba(0,150,230,0.26) 50%, rgba(0,180,255,0.14) 100%)',
              filter: 'blur(36px)',
              mixBlendMode: 'screen',
              boxShadow: '0 0 60px rgba(0,160,240,0.28)'
            }}
            aria-hidden="true"
          ></div>
        )}
        <div className={`flex items-center space-x-2 transition-all duration-700 ease-out relative w-full z-20`}>
          {/* AI Orb - Positioned absolutely when active to take full width */}
          {allItems.map((item, index) => {
          const isActive = item.type === 'nav' && 'path' in item && location.pathname === item.path;
          const isFocused = focused && focusedIndex === index;
          const shouldFadeOut = isConnected && !isMuted && item.type !== 'ai';
          
          if (item.type === 'ai') {
            return (
              <div 
                key="ai" 
                className={`
                  transition-all duration-700 ease-out
                  ${isConnected && !isMuted ? 'w-full' : 'w-auto'}
                  z-10
                `}
              >
                <AIOrb focused={isFocused} />
              </div>
            );
          }

          // Other items with fade out effect
          const commonClasses = `
            transition-all duration-700 ease-out
            ${shouldFadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `;

          if (item.type === 'weather') {
            return <div key="weather" className={`
                    h-10 flex items-center rounded-full px-3 transform
                    ${isFocused ? 'bg-white/20 shadow-lg scale-105 translate-x-1' : 'hover:bg-white/10 scale-100 translate-x-0'}
                    ${commonClasses}
                  `}>
                  <WeatherWidget onWeatherChange={onWeatherChange} />
                </div>;
          }
          
          if (item.type === 'time') {
            return <div key="time" className={`
                    h-10 flex items-center text-gray-300 rounded-full px-3 transform
                    ${isFocused ? 'bg-white/20 shadow-lg text-white scale-105 translate-x-1' : 'hover:bg-white/10 hover:text-white scale-100 translate-x-0'}
                    ${commonClasses}
                  `}>
                  <Clock size={16} className="mr-2" />
                  <span className="font-semibold whitespace-nowrap text-sm">
                    {getCurrentTime()}
                  </span>
                </div>;
          }

          // Navigation items - must be nav type here
          if (item.type === 'nav') {
            return <button key={item.path} onClick={() => handleNavClick(item.path, index)} className={`
                    h-10 text-sm font-medium rounded-full px-4 flex items-center whitespace-nowrap transform
                    ${isActive ? 'bg-white text-black shadow-lg scale-105 translate-x-1' : isFocused ? 'bg-gray-600 text-white shadow-lg scale-105 translate-x-1' : 'text-gray-300 hover:text-white hover:bg-white/10 scale-100 translate-x-0'}
                    ${commonClasses}
                  `}>
                  {item.name}
                </button>;
          }
          return null;
        })}
        </div>
      </div>
    </div>;
};
export default UnifiedHeader;

// Add animation for horizontal blue pulse and navbar glow/pulse
// You can move this to your global CSS if preferred
const style = document.createElement('style');
style.innerHTML = `
@keyframes ai-horizontal-pulse {
  0% { transform: translateX(-30px); opacity: 0.8; }
  50% { transform: translateX(30px); opacity: 1; }
  100% { transform: translateX(-30px); opacity: 0.8; }
}
.animate-ai-horizontal-pulse {
  animation: ai-horizontal-pulse 2.5s ease-in-out infinite;
}

@keyframes ai-glow-pulse {
  0% { opacity: 0.12; transform: scale(1); }
  40% { opacity: 0.22; transform: scale(1.02); }
  60% { opacity: 0.28; transform: scale(1.015); }
  100% { opacity: 0.12; transform: scale(1); }
}
.animate-ai-glow-pulse {
  animation: ai-glow-pulse 2s ease-in-out infinite;
  transform-origin: center;
}

@keyframes ai-pulse-shadow {
  0% {
    box-shadow: 0 0 12px rgba(0,180,255,0.12), inset 0 0 6px rgba(0,180,255,0.04);
  }
  50% {
    box-shadow: 0 0 48px rgba(0,180,255,0.35), inset 0 0 16px rgba(0,180,255,0.09);
  }
  100% {
    box-shadow: 0 0 12px rgba(0,180,255,0.12), inset 0 0 6px rgba(0,180,255,0.04);
  }
}
.animate-ai-pulse-complex {
  animation: ai-pulse-shadow 2.5s ease-in-out infinite;
}
`;
if (typeof document !== 'undefined' && !document.getElementById('ai-horizontal-pulse-style')) {
  style.id = 'ai-horizontal-pulse-style';
  document.head.appendChild(style);
}
