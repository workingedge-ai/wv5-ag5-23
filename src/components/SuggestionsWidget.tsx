import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

const suggestions = [
  "Try Ordering Food",
  "Ask Atlas to Turn Off the Fan",
  "Check the Weather",
  "Control Room Lighting",
  "Set Room Temperature",
  "Call Front Desk",
  "Book Restaurant Table",
  "Request Housekeeping"
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
    }, 180000); // Change every 3 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-full bg-background/10 border-border/20 backdrop-blur-sm rounded-2xl box-border">
      <div className="p-4 h-full flex items-center justify-center">
        <div className={`text-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h3 className="text-lg font-semibold text-foreground mb-2">Suggestions</h3>
          <p className="text-muted-foreground text-sm">
            "{suggestions[currentIndex]}"
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SuggestionsWidget;