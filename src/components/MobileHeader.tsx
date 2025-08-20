import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIOrb from '@/components/AIOrb';

const MobileHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const roomNumber = localStorage.getItem('mobile-room-number') || '';
  const guestName = localStorage.getItem('mobile-guest-name') || '';

  const isHome = location.pathname === '/';
  const isRestaurant = location.pathname === '/restaurant';

  const getPageTitle = () => {
    if (isHome) return `Room ${roomNumber}`;
    if (isRestaurant) return 'Restaurant Menu';
    return 'Mobile Services';
  };

  return (
    <header className="bg-black/90 backdrop-blur-md border-b border-gray-800 px-4 py-3 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {!isHome && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/10 p-2"
            >
              <ArrowLeft size={20} />
            </Button>
          )}
          <div>
            <h1 className="text-white font-semibold text-lg">
              {getPageTitle()}
            </h1>
            {guestName && (
              <p className="text-gray-400 text-sm">
                Welcome, {guestName}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <AIOrb />
          {!isHome && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/10 p-2"
              title="Home"
            >
              <Home size={18} />
            </Button>
          )}
          {!isRestaurant && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/restaurant')}
              className="text-white hover:bg-white/10 p-2"
              title="Restaurant"
            >
              <UtensilsCrossed size={18} />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;