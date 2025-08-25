import React, { useEffect } from "react";
import SuggestionsWidget from '@/components/SuggestionsWidget';
import NewsWidget from '@/components/NewsWidget';
import AppsSection from '@/components/AppsSection';
import TimeWeatherWidget from '@/components/TimeWeatherWidget';
import { useHomeKeyboardNavigation } from '@/hooks/useHomeKeyboardNavigation';
const Index = () => {
  // Get guest name from localStorage (set during mobile access control)
  const guestName = localStorage.getItem('mobile-guest-name') || 'Guest';
  
  // Keyboard navigation for home page
  const navigation = useHomeKeyboardNavigation(5); // 5 apps

  // Scroll to top on page load and completely prevent scrolling
  useEffect(() => {
    window.scrollTo(0, 0);
    const preventScroll = (e: Event) => {
      e.preventDefault();
      window.scrollTo(0, 0);
      return false;
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('scroll', preventScroll, { passive: false });
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', (e) => {
      // Prevent arrow keys, space, page up/down
      if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
        window.scrollTo(0, 0);
        return false;
      }
    }, { passive: false });
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('scroll', preventScroll);
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, []);
  return <div className="min-h-screen bg-transparent text-white relative">
      <div className="pt-0 py-0">
        {/* Welcome Message Above Widget Section */}
        <div className="mb-0 pl-10">
          <h1 className="text-2xl font-medium text-white text-left my-0">
            Welcome {guestName}, what would you like to do?
          </h1>
        </div>
        {/* Widget Section */}
        <div className="w-screen h-80 p-[40px]" style={{margin:0}}>
          <div className="w-full">
            <div className="flex gap-4 h-80">
              {/* Main Widget - 60% width */}
              <div className="w-3/5 bg-background/5 border border-border/20 rounded-[25px] backdrop-blur-sm">
                {/* Reserved for future content */}
              </div>
              
              {/* Side Widgets - 40% width */}
              <div className="w-2/5 flex flex-col gap-4">
                {/* Suggestions Widget - Top half */}
                <div className="h-1/2">
                  <SuggestionsWidget />
                </div>
                
                {/* News Widget - Bottom half */}
                <div className="h-1/2">
                  <NewsWidget />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Apps Section */}
  <div className="px-6 md:px-10 mt-16">
          <div className="max-w-8xl mx-auto">
            
            <AppsSection 
              focused={navigation.currentSection === 'apps'}
              focusedIndex={navigation.focusedIndex}
            />
          </div>
        </div>
      </div>
      
      {/* Time and Weather Widget */}
      <TimeWeatherWidget />
    </div>;
};
export default Index;