import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

const TimeWeatherWidget: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather] = useState({
    temp: 72,
    condition: 'Sunny',
    icon: '☀️'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="fixed bottom-6 right-6 z-50 bg-background/10 border-border/20 backdrop-blur-sm rounded-[20px] p-4 min-w-[160px]">
      <div className="text-center text-white">
        <div className="text-2xl font-light mb-1">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm text-gray-300 mb-3">
          {formatDate(currentTime)}
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg">{weather.icon}</span>
          <div className="text-right">
            <div className="text-lg font-medium">{weather.temp}°</div>
            <div className="text-xs text-gray-400">{weather.condition}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TimeWeatherWidget;