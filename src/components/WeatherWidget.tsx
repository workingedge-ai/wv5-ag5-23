import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, CloudSnow, Zap } from 'lucide-react';
interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  description: string;
  location: string;
}
interface WeatherWidgetProps {
  focused?: boolean;
  onWeatherChange?: (condition: WeatherData['condition']) => void;
}
const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  focused = false,
  onWeatherChange
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchWeather = async () => {
      // Check if we have cached weather data
      const cachedWeather = localStorage.getItem('weatherData');
      const cacheTimestamp = localStorage.getItem('weatherTimestamp');
      const now = Date.now();
      const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds

      if (cachedWeather && cacheTimestamp && (now - parseInt(cacheTimestamp)) < thirtyMinutes) {
        // Use cached data
        setWeather(JSON.parse(cachedWeather));
        setLoading(false);
        return;
      }

      try {
        // Mock weather data since API key is invalid
        const mockWeatherData = {
          temperature: 22,
          condition: 'sunny' as const,
          description: 'Clear sky',
          location: 'Your City'
        };
        
        // Cache the data
        localStorage.setItem('weatherData', JSON.stringify(mockWeatherData));
        localStorage.setItem('weatherTimestamp', now.toString());
        
        setWeather(mockWeatherData);
        setLoading(false);
      } catch (error) {
        console.error('Weather fetch failed:', error);
        setLoading(false);
      }
    };

    fetchWeather();

    // Set up interval to refetch every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Notify parent when weather changes
  useEffect(() => {
    if (weather && onWeatherChange) {
      onWeatherChange(weather.condition);
    }
  }, [weather, onWeatherChange]);
  const getWeatherIcon = (condition: WeatherData['condition']) => {
    const iconProps = {
      size: 24,
      className: "text-psyco-green-DEFAULT drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
    };
    switch (condition) {
      case 'sunny':
        return <Sun {...iconProps} />;
      case 'cloudy':
        return <Cloud {...iconProps} />;
      case 'rainy':
        return <CloudRain {...iconProps} />;
      case 'stormy':
        return <Zap {...iconProps} />;
      case 'snowy':
        return <CloudSnow {...iconProps} />;
      default:
        return <Sun {...iconProps} />;
    }
  };
  if (loading) {
    return <div className={`flex items-center space-x-3 text-gray-300 transition-all duration-300 ${focused ? 'ring-2 ring-psyco-green-DEFAULT rounded-lg p-2' : ''}`}>
        <div className="w-6 h-6 bg-gray-600 rounded animate-pulse"></div>
        <div className="w-8 h-4 bg-gray-600 rounded animate-pulse"></div>
      </div>;
  }
  if (!weather) {
    return null;
  }
  return <div className={`flex items-center space-x-3 text-gray-300 transition-all duration-300 ${focused ? 'ring-2 ring-psyco-green-DEFAULT rounded-lg p-2' : ''}`}>
      {getWeatherIcon(weather.condition)}
      <div className="flex flex-col">
        <span className="text-white py-0 text-base font-medium">
          {weather.temperature}°C
        </span>
        
      </div>
    </div>;
};
export default WeatherWidget;