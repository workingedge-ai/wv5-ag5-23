import React, { useEffect, useState, useCallback } from "react";
import SuggestionsWidget from '@/components/SuggestionsWidget';
import NewsWidget from '@/components/NewsWidget';
import AppsSection from '@/components/AppsSection';
import TimeWeatherWidget from '@/components/TimeWeatherWidget';
import UnifiedHeader from '@/components/UnifiedHeader';
import { useHomeKeyboardNavigation } from '@/hooks/useHomeKeyboardNavigation';
const Index = () => {
  // Get guest name from localStorage (set during mobile access control)
  const guestName = localStorage.getItem('mobile-guest-name') || 'Guest';

  // Focus state: 'header' or 'apps'
  const [focusedSection, setFocusedSection] = useState<'header' | 'apps'>('header');
  // Header button index (0-3)
  const [headerIndex, setHeaderIndex] = useState(0);

  // Keyboard navigation for apps section (if you want to support left/right in apps, you can expand)
  const APPS_COUNT = 5; // Update this if the number of apps changes
  const [appsFocusedIndex, setAppsFocusedIndex] = useState(0);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (focusedSection === 'header') {
      if (e.key === 'ArrowRight') {
        setHeaderIndex((prev) => Math.min(prev + 1, 3)); // Stay at last button
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        setHeaderIndex((prev) => Math.max(prev - 1, 0));
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        setFocusedSection('apps');
        e.preventDefault();
      } else if (e.key === 'Enter') {
        // Simulate click on the focused header button
        const btn = document.getElementById(`header-button-${headerIndex}`);
        if (btn) {
          (btn as HTMLElement).click();
        }
        e.preventDefault();
      }
    } else if (focusedSection === 'apps') {
      if (e.key === 'ArrowUp') {
        setFocusedSection('header');
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        setAppsFocusedIndex((prev) => Math.min(prev + 1, APPS_COUNT - 1));
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        setAppsFocusedIndex((prev) => Math.max(prev - 1, 0));
        e.preventDefault();
      }
    }
  }, [focusedSection]);

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
    // Only prevent default for page navigation keys, not for our custom navigation
    window.addEventListener('keydown', (e) => {
      if ([33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
        // Only prevent if not handled by our navigation
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          e.preventDefault();
          window.scrollTo(0, 0);
        }
      }
    }, { passive: false });
    // Add our navigation handler
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('scroll', preventScroll);
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
  <div className="min-h-screen bg-transparent text-white relative" >
      <div className="pt-0 py-0">
        {/* Welcome Message Above Widget Section */}
        <div className="mb-0 pl-10">
          <h1 className="text-2xl font-medium text-white text-left my-0">
            Welcome {guestName}, what would you like to do?
          </h1>
        </div>
        {/* Widget Section */}
  <div className="w-screen h-80 p-[40px]" style={{ marginTop: '-20px' }}>
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
              focused={focusedSection === 'apps'}
              focusedIndex={appsFocusedIndex}
            />
          </div>
        </div>
      </div>

      {/* Unified Header */}
      <UnifiedHeader
        focused={focusedSection === 'header'}
        focusedIndex={headerIndex}
        onWeatherChange={() => {}}
      />

      {/* Time and Weather Widget */}
      <TimeWeatherWidget />
    </div>
  );
};
export default Index;