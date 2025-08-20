import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface MobileAccessControlProps {
  children: React.ReactNode;
}

const MobileAccessControl: React.FC<MobileAccessControlProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [roomNumber, setRoomNumber] = useState('');
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check URL for room number
    const urlParams = new URLSearchParams(location.search);
    const roomFromUrl = urlParams.get('room');
    
    if (roomFromUrl) {
      // Store room number and authorize
      localStorage.setItem('mobile-room-number', roomFromUrl);
      localStorage.setItem('mobile-authorized', 'true');
      setIsAuthorized(true);
    } else {
      // Check if previously authorized
      const storedAuth = localStorage.getItem('mobile-authorized');
      const storedRoom = localStorage.getItem('mobile-room-number');
      
      if (storedAuth === 'true' && storedRoom) {
        setIsAuthorized(true);
      }
    }
    
    setLoading(false);
  }, [location.search]);

  const handleAuthorize = () => {
    if (!roomNumber.trim() || !guestName.trim()) {
      toast.error('Please enter both room number and guest name');
      return;
    }

    // Store authorization
    localStorage.setItem('mobile-room-number', roomNumber.trim());
    localStorage.setItem('mobile-guest-name', guestName.trim());
    localStorage.setItem('mobile-authorized', 'true');
    
    // Update URL to include room number
    navigate(`${location.pathname}?room=${roomNumber.trim()}`);
    
    setIsAuthorized(true);
    toast.success(`Welcome, ${guestName}! You now have access to Room ${roomNumber}.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl mb-2">
              Room Access Required
            </CardTitle>
            <p className="text-gray-300 text-sm">
              Please enter your room number and name to access mobile services
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="room-number" className="text-white">
                Room Number
              </Label>
              <Input
                id="room-number"
                type="text"
                placeholder="e.g. 101, 205, etc."
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="guest-name" className="text-white">
                Guest Name
              </Label>
              <Input
                id="guest-name"
                type="text"
                placeholder="Your name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 mt-1"
              />
            </div>
            <Button 
              onClick={handleAuthorize}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 mt-6"
              disabled={!roomNumber.trim() || !guestName.trim()}
            >
              Access Room Services
            </Button>
            <p className="text-xs text-gray-400 text-center mt-4">
              You must be a registered guest to access these services
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default MobileAccessControl;