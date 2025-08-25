import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

const newsItems = [
  {
    headline: "Tech Innovation Summit 2024",
    brief: "Leading tech companies showcase breakthrough AI technologies at annual conference."
  },
  {
    headline: "Green Energy Breakthrough",
    brief: "Scientists develop new solar panel technology with 45% efficiency rating."
  },
  {
    headline: "Space Exploration Milestone",
    brief: "Private space company successfully launches first commercial lunar mission."
  },
  {
    headline: "Healthcare AI Revolution",
    brief: "New AI system improves early disease detection accuracy by 90%."
  },
  {
    headline: "Climate Action Progress",
    brief: "Global carbon emissions drop 15% as renewable energy adoption accelerates."
  }
];

const NewsWidget: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
        setIsVisible(true);
      }, 500); // Wait for fade out before changing content
    }, 180000); // Change every 3 minutes

    return () => clearInterval(interval);
  }, []);

  const currentNews = newsItems[currentIndex];

  return (
    <Card className="h-full bg-background/10 border-border/20 backdrop-blur-sm rounded-3xl box-border">
      <div className="p-6 h-full flex flex-col justify-center box-border overflow-hidden">
        <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h3 className="text-sm font-semibold text-foreground mb-2">News</h3>
          <h4 className="text-xs font-medium text-foreground mb-1 line-clamp-2">
            {currentNews.headline}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-3">
            {currentNews.brief}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default NewsWidget;