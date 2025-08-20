import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Clock, Wifi, Phone } from 'lucide-react';

const MobileHome: React.FC = () => {
  const navigate = useNavigate();
  const roomNumber = localStorage.getItem('mobile-room-number') || '';
  const guestName = localStorage.getItem('mobile-guest-name') || '';

  const services = [
    {
      title: 'Restaurant Menu',
      description: 'Order food and beverages directly to your room',
      icon: UtensilsCrossed,
      action: () => navigate('/restaurant'),
      color: 'bg-green-600 hover:bg-green-700',
      available: true
    },
    {
      title: 'Room Service',
      description: 'Request housekeeping and amenities',
      icon: Clock,
      action: () => {},
      color: 'bg-blue-600 hover:bg-blue-700',
      available: false
    },
    {
      title: 'Concierge',
      description: 'Get local recommendations and assistance',
      icon: Phone,
      action: () => {},
      color: 'bg-purple-600 hover:bg-purple-700',
      available: false
    },
    {
      title: 'WiFi & Services',
      description: 'Network information and hotel services',
      icon: Wifi,
      action: () => {},
      color: 'bg-gray-600 hover:bg-gray-700',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-20 pb-8 px-4">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Room {roomNumber}
          </h1>
          <p className="text-gray-300 text-lg">
            Hello, {guestName}!
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Access your room services from your mobile device
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="space-y-4 max-w-md mx-auto">
        {services.map((service, index) => {
          const IconComponent = service.icon;
          
          return (
            <Card 
              key={index}
              className={`bg-gray-900 border-gray-700 hover:border-gray-500 transition-all duration-200 ${
                service.available ? 'cursor-pointer' : 'opacity-60'
              }`}
              onClick={service.available ? service.action : undefined}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${service.color} ${!service.available && 'grayscale'}`}>
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-1">
                      {service.title}
                      {!service.available && (
                        <span className="text-xs text-gray-500 ml-2">(Coming Soon)</span>
                      )}
                    </CardTitle>
                    <CardDescription className="text-gray-300 text-sm">
                      {service.description}
                    </CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 max-w-md mx-auto">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/restaurant')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 mb-3"
            >
              <UtensilsCrossed size={18} className="mr-2" />
              View Restaurant Menu
            </Button>
            <p className="text-gray-400 text-xs text-center">
              More services will be available soon
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Room Info */}
      <div className="mt-6 text-center">
        <p className="text-gray-500 text-xs">
          Room {roomNumber} • Mobile Services
        </p>
      </div>
    </div>
  );
};

export default MobileHome;