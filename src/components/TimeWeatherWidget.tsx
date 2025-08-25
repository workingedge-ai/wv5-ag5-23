import React, { useState, useEffect } from 'react';

const TimeWeatherWidget: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather] = useState({
    city: 'Coimbatore',
    humidity: 73,
    icon: '🌤️', // You can use a more accurate icon or an image
    condition: 'Rain',
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
  <div className="fixed bottom-8 right-8 z-50 rounded-[16px] min-w-[220px] w-fit px-5 py-2 flex items-center bg-transparent" style={{background: 'transparent'}}>
      {/* Time */}
      <div className="flex flex-row items-end">
        <span className="text-[2.1rem] leading-none font-light text-white" style={{fontFamily: 'Poppins, sans-serif'}}>{formatTime(currentTime).split(' ')[0]}</span>
        <span className="text-base text-gray-300 ml-2 mb-1" style={{fontFamily: 'Poppins, sans-serif'}}>{formatTime(currentTime).split(' ')[1].toLowerCase()}</span>
      </div>
      {/* Divider */}
  <div className="mx-3 h-8 w-px bg-gray-700"></div>
      {/* City, Humidity, Weather */}
      <div className="flex flex-col justify-center">
        <span className="text-[1.4rem] font-light text-white" style={{fontFamily: 'Poppins, sans-serif'}}>{weather.city}</span>
        <span className="text-base text-gray-400 -mt-2" style={{fontFamily: 'Poppins, sans-serif'}}>Humidity {weather.humidity}</span>
      </div>
      {/* Weather Icon */}
      <div className="ml-3 flex items-center">
        {/* Replace with an actual image/icon if needed */}
        <span className="text-[1.6rem] drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">{weather.icon}</span>
      </div>
    </div>
  );
};

export default TimeWeatherWidget;