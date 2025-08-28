import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

const suggestions = [
  {
    title: "Try Ordering Food",
    description: "Order delicious meals directly to your room."
  },
  {
    title: "Ask Atlas to Turn Off the Fan",
    description: "Control your room's fan with a simple voice command."
  },
  {
    title: "Check the Weather",
    description: "Get real-time weather updates for your location."
  },
  {
    title: "Control Room Lighting",
    description: "Adjust the lighting to your preference instantly."
  },
  {
    title: "Set Room Temperature",
    description: "Make your room comfortable by setting the perfect temperature."
  },
  {
    title: "Call Front Desk",
    description: "Reach out to the front desk for any assistance you need."
  },
  {
    title: "Book Restaurant Table",
    description: "Reserve a table at the hotel restaurant with ease."
  },
  {
    title: "Request Housekeeping",
    description: "Request cleaning or extra amenities for your room."
  }
];

const SuggestionsWidget: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
        setIsVisible(true);
      }, 500); // Wait for fade out before changing content
  }, 25000); // Change every 25 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-full bg-background/10 border-border/20 backdrop-blur-sm rounded-3xl box-border">
  <div className="px-6 py-2 h-full flex items-center justify-start box-border" style={{paddingLeft: '30px'}}>
        <div className={`text-left w-full transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}> 
          <h3 className="text-2xl font-bold text-white mb-0">{suggestions[currentIndex].title}</h3>
          <p className="text-muted-foreground text-xl font-normal mb-0" style={{ fontSize: '1.2em' }}>{suggestions[currentIndex].description}</p>
        </div>
      </div>
    </Card>
  );
};

export default SuggestionsWidget;