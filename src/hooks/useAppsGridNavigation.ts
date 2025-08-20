import { useState, useEffect, useCallback } from 'react';
import { useAIOrbFocus } from './useAIOrbFocus';

export type AppsFocusSection = 'nav' | 'apps' | 'ai-button';

interface AppsNavigationState {
  currentSection: AppsFocusSection;
  focusedIndex: number;
}

export const useAppsGridNavigation = (
  appsCount: number,
  navItemsCount: number = 3
) => {
  const { isFocused: isAIFocused, setFocused: setAIFocused } = useAIOrbFocus();
  
  const [navigation, setNavigation] = useState<AppsNavigationState>({
    currentSection: isAIFocused ? 'ai-button' : 'apps',
    focusedIndex: 0,
  });

  const scrollToSection = useCallback((section: AppsFocusSection) => {
    if (section === 'nav') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    const sectionElement = document.getElementById(`section-${section}`);
    if (sectionElement) {
      const headerHeight = 80;
      const offsetTop = sectionElement.offsetTop - headerHeight;
      window.scrollTo({
        top: offsetTop,
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
          if (currentSection === 'nav') {
            scrollToSection('apps');
            return { currentSection: 'apps', focusedIndex: 0 };
          } else if (currentSection === 'apps') {
            // Move down one row in the 3x3 grid
            const currentRow = Math.floor(focusedIndex / 3);
            const currentCol = focusedIndex % 3;
            const nextRowIndex = (currentRow + 1) * 3 + currentCol;
            if (nextRowIndex < appsCount) {
              return { currentSection, focusedIndex: nextRowIndex };
            }
          }
          break;

        case 'ArrowUp':
          event.preventDefault();
          if (currentSection === 'apps') {
            const currentRow = Math.floor(focusedIndex / 3);
            const currentCol = focusedIndex % 3;
            if (currentRow > 0) {
              // Move up one row in the 3x3 grid
              const prevRowIndex = (currentRow - 1) * 3 + currentCol;
              return { currentSection, focusedIndex: prevRowIndex };
            } else {
              // Go to nav when at top row
              scrollToSection('nav');
              return { currentSection: 'nav', focusedIndex: 0 };
            }
          }
          break;

        case 'ArrowLeft':
          event.preventDefault();
          if (currentSection === 'ai-button') {
            setAIFocused(false);
            return { currentSection: 'nav', focusedIndex: navItemsCount - 1 };
          } else if (currentSection === 'nav' && focusedIndex > 0) {
            return { currentSection, focusedIndex: focusedIndex - 1 };
          } else if (currentSection === 'apps') {
            // Move left in the grid
            if (focusedIndex % 3 > 0) {
              return { currentSection, focusedIndex: focusedIndex - 1 };
            }
          }
          break;

        case 'ArrowRight':
          event.preventDefault();
          if (currentSection === 'nav' && focusedIndex < navItemsCount - 1) {
            return { currentSection, focusedIndex: focusedIndex + 1 };
          } else if (currentSection === 'nav' && focusedIndex === navItemsCount - 1) {
            setAIFocused(true);
            return { currentSection: 'ai-button', focusedIndex: 0 };
          } else if (currentSection === 'apps') {
            // Move right in the grid
            if (focusedIndex % 3 < 2 && focusedIndex + 1 < appsCount) {
              return { currentSection, focusedIndex: focusedIndex + 1 };
            }
          }
          break;

        case 'Enter':
          event.preventDefault();
          if (currentSection === 'nav') {
            const headerButtons = document.querySelectorAll('.bg-black\\/30 button, .bg-black\\/30 .cursor-pointer');
            const targetButton = headerButtons[focusedIndex] as HTMLElement;
            if (targetButton) targetButton.click();
          } else if (currentSection === 'ai-button') {
            const aiButton = document.getElementById('ai-orb-button');
            if (aiButton) aiButton.click();
          } else if (currentSection === 'apps') {
            const appElement = document.querySelector(`#apps-container > *:nth-child(${focusedIndex + 1})`) as HTMLElement;
            if (appElement) appElement.click();
          }
          break;
      }
      return prevNavigation;
    });
  }, [appsCount, navItemsCount, scrollToSection, setAIFocused]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return navigation;
};