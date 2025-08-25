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
  }, 30000); // Change every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const currentNews = newsItems[currentIndex];

  return (
    <Card className="h-full bg-background/10 border-border/20 backdrop-blur-sm rounded-3xl box-border">
  <div className="px-6 py-2 h-full flex items-center justify-start box-border" style={{paddingLeft: '30px'}}>
        <div className={`text-left w-full transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}> 
          <h3 className="text-3xl font-bold text-white mb-2">{currentNews.headline}</h3>
          <p className="text-muted-foreground text-xl font-normal mb-0" style={{ fontSize: '1.2em' }}>{currentNews.brief}</p>
        </div>
      </div>
    </Card>
  );
};

export default NewsWidget;