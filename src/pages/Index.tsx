import React, { useEffect } from "react";
import SuggestionsWidget from '@/components/SuggestionsWidget';
import NewsWidget from '@/components/NewsWidget';
import AppsSection from '@/components/AppsSection';
const Index = () => {
  // Get guest name from localStorage (set during mobile access control)
  const guestName = localStorage.getItem('mobile-guest-name') || 'Guest';

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <div className="min-h-screen bg-transparent text-white relative">
      <div className="pt-24 py-[49px]">
        {/* Welcome Message */}
        <div className="px-6 md:px-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-medium text-white my-0">
              Welcome {guestName}, what would you like to do?
            </h1>
          </div>
        </div>

        {/* Widget Section */}
        <div className="px-6 md:px-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-6 h-96">
              {/* Main Widget - 60% width */}
              <div className="w-3/5 bg-background/5 border border-border/20 rounded-3xl backdrop-blur-sm box-border">
                {/* Reserved for future content */}
              </div>
              
              {/* Side Widgets - 40% width */}
              <div className="w-2/5 flex flex-col gap-6">
                {/* Suggestions Widget - Top half */}
                <div className="h-1/2 box-border">
                  <SuggestionsWidget />
                </div>
                
                {/* News Widget - Bottom half */}
                <div className="h-1/2 box-border">
                  <NewsWidget />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Apps Section */}
        <div className="px-6 md:px-8">
          <div className="max-w-8xl mx-auto">
            
            <AppsSection />
          </div>
        </div>
      </div>
    </div>;
};
export default Index;