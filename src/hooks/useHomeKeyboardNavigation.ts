import { useState, useEffect, useCallback } from 'react';

export type HomeFocusSection = 'header' | 'apps';

interface HomeNavigationState {
  currentSection: HomeFocusSection;
  focusedIndex: number;
}

export const useHomeKeyboardNavigation = (appsCount: number = 5) => {
  const [navigation, setNavigation] = useState<HomeNavigationState>({
    currentSection: 'header',
    focusedIndex: 0,
  });

  const scrollToApps = useCallback(() => {
    const appsSection = document.getElementById('apps-section');
    if (appsSection) {
      appsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const scrollToHeader = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollAppsContainer = useCallback((direction: 'left' | 'right') => {
    const container = document.getElementById('apps-container');
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    setNavigation((prevNavigation) => {
      const { currentSection, focusedIndex } = prevNavigation;
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (currentSection === 'header') {
            scrollToApps();
            return { currentSection: 'apps', focusedIndex: 0 };
          }
          break;

        case 'ArrowUp':
          event.preventDefault();
          if (currentSection === 'apps') {
            scrollToHeader();
            return { currentSection: 'header', focusedIndex: 0 };
          }
          break;

        case 'ArrowLeft':
          event.preventDefault();
          if (currentSection === 'header' && focusedIndex > 0) {
            return { currentSection, focusedIndex: focusedIndex - 1 };
          } else if (currentSection === 'apps') {
            if (focusedIndex > 0) {
              return { currentSection, focusedIndex: focusedIndex - 1 };
            }
            scrollAppsContainer('left');
          }
          break;

        case 'ArrowRight':
          event.preventDefault();
          if (currentSection === 'header' && focusedIndex < 3) { // 4 buttons (0-3)
            return { currentSection, focusedIndex: focusedIndex + 1 };
          } else if (currentSection === 'apps') {
            if (focusedIndex < appsCount - 1) {
              return { currentSection, focusedIndex: focusedIndex + 1 };
            }
            scrollAppsContainer('right');
          }
          break;

        case 'Enter':
          event.preventDefault();
          if (currentSection === 'header') {
            const headerButtons = document.querySelectorAll('[id^="header-button-"]');
            const targetButton = headerButtons[focusedIndex] as HTMLElement;
            if (targetButton) targetButton.click();
          } else if (currentSection === 'apps') {
            const appElement = document.getElementById(`app-${focusedIndex}`);
            if (appElement) appElement.click();
          }
          break;
      }
      return prevNavigation;
    });
  }, [appsCount, scrollToApps, scrollToHeader, scrollAppsContainer]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return navigation;
};