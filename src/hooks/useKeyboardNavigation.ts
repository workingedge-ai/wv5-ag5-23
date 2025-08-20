import { useState, useEffect, useCallback } from 'react';
import { useAIOrbFocus } from './useAIOrbFocus';

export type FocusSection = 'nav' | 'carousel' | 'apps' | 'movies' | 'continue-watching' | 'ai-button' | 'categories' | 'menu-items' | 'order-summary';

interface NavigationState {
  currentSection: FocusSection;
  focusedIndex: number;
}

export const useKeyboardNavigation = (
  streamingAppsCount: number,
  moviesCount: number,
  continueWatchingCount: number,
  carouselItemsCount: number = 3,
  navItemsCount: number = 3
) => {
  const { isFocused: isAIFocused, setFocused: setAIFocused } = useAIOrbFocus();
  
  // Get initial state from session storage for focus persistence
  const getInitialState = (): NavigationState => {
    const storedSection = sessionStorage.getItem('last-focused-section') as FocusSection;
    const storedIndex = parseInt(sessionStorage.getItem('last-focused-index') || '0');
    
    if (isAIFocused) {
      return { currentSection: 'ai-button', focusedIndex: 0 };
    }
    
    if (storedSection && ['nav', 'ai-button'].includes(storedSection)) {
      return { currentSection: storedSection, focusedIndex: storedIndex };
    }
    
    return { currentSection: 'carousel', focusedIndex: 0 };
  };
  
  const [navigation, setNavigation] = useState<NavigationState>(getInitialState());

  const scrollToSection = useCallback((section: FocusSection) => {
    if (section === 'nav') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    const sectionElement = document.getElementById(`section-${section}`);
    if (sectionElement) {
      const headerHeight = 80; // Approximate header height
      const offsetTop = sectionElement.offsetTop - headerHeight;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }, []);

  const scrollToFocusedItem = useCallback((sectionId: string, index: number) => {
    const container = document.getElementById(sectionId);
    const item = container?.children[index] as HTMLElement;
    if (container && item) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      
      if (itemRect.left < containerRect.left || itemRect.right > containerRect.right) {
        item.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start'
        });
      }
    }
  }, []);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    setNavigation((prevNavigation) => {
      const { currentSection, focusedIndex } = prevNavigation;
      
      // Store current focus state for persistence
      const storeCurrentState = (section: FocusSection, index: number) => {
        if (['nav', 'ai-button'].includes(section)) {
          sessionStorage.setItem('last-focused-section', section);
          sessionStorage.setItem('last-focused-index', index.toString());
        }
      };

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (currentSection === 'nav') {
            scrollToSection('carousel');
            const newState = { currentSection: 'carousel' as FocusSection, focusedIndex: 0 };
            storeCurrentState(newState.currentSection, newState.focusedIndex);
            return newState;
          } else if (currentSection === 'ai-button') {
            scrollToSection('nav');
            const newState = { currentSection: 'nav' as FocusSection, focusedIndex: 0 };
            storeCurrentState(newState.currentSection, newState.focusedIndex);
            return newState;
          } else if (currentSection === 'carousel') {
            scrollToSection('apps');
            return { currentSection: 'apps', focusedIndex: 0 };
          } else if (currentSection === 'apps') {
            scrollToSection('movies');
            return { currentSection: 'movies', focusedIndex: 0 };
          } else if (currentSection === 'movies') {
            scrollToSection('continue-watching');
            return { currentSection: 'continue-watching', focusedIndex: 0 };
          }
          break;

        case 'ArrowUp':
          event.preventDefault();
          if (currentSection === 'carousel') {
            scrollToSection('nav');
            const newState = { currentSection: 'nav' as FocusSection, focusedIndex: 0 };
            storeCurrentState(newState.currentSection, newState.focusedIndex);
            return newState;
          } else if (currentSection === 'apps') {
            scrollToSection('carousel');
            return { currentSection: 'carousel', focusedIndex: 0 };
          } else if (currentSection === 'movies') {
            scrollToSection('apps');
            return { currentSection: 'apps', focusedIndex: 0 };
          } else if (currentSection === 'continue-watching') {
            scrollToSection('movies');
            return { currentSection: 'movies', focusedIndex: 0 };
          }
          break;

        case 'ArrowLeft':
          event.preventDefault();
          if (currentSection === 'ai-button') {
            // Navigate back to last nav item from AI button
            setAIFocused(false);
            const newState = { currentSection: 'nav' as FocusSection, focusedIndex: navItemsCount - 1 };
            storeCurrentState(newState.currentSection, newState.focusedIndex);
            return newState;
          } else if (currentSection === 'nav' && focusedIndex > 0) {
            const newState = { currentSection, focusedIndex: focusedIndex - 1 };
            storeCurrentState(newState.currentSection, newState.focusedIndex);
            return newState;
          } else if (currentSection === 'carousel' && focusedIndex > 0) {
            const newIndex = focusedIndex - 1;
            return { currentSection, focusedIndex: newIndex };
          } else if (currentSection === 'apps' && focusedIndex > 0) {
            const newIndex = focusedIndex - 1;
            setTimeout(() => scrollToFocusedItem('apps-container', newIndex), 0);
            return { currentSection, focusedIndex: newIndex };
          } else if (currentSection === 'movies' && focusedIndex > 0) {
            const newIndex = focusedIndex - 1;
            setTimeout(() => scrollToFocusedItem('movies-container', newIndex), 0);
            return { currentSection, focusedIndex: newIndex };
          } else if (currentSection === 'continue-watching' && focusedIndex > 0) {
            const newIndex = focusedIndex - 1;
            setTimeout(() => scrollToFocusedItem('continue-watching-container', newIndex), 0);
            return { currentSection, focusedIndex: newIndex };
          } else if (currentSection === 'apps') {
            // Handle vertical navigation in apps - move to previous row
            const currentRow = Math.floor(focusedIndex / 3);
            const currentCol = focusedIndex % 3;
            if (currentRow > 0) {
              const newIndex = (currentRow - 1) * 3 + currentCol;
              setTimeout(() => scrollToFocusedItem('apps-container', newIndex), 0);
              return { currentSection, focusedIndex: newIndex };
            }
          }
          break;

        case 'ArrowRight':
          event.preventDefault();
          if (currentSection === 'nav' && focusedIndex < navItemsCount - 1) {
            const newState = { currentSection, focusedIndex: focusedIndex + 1 };
            storeCurrentState(newState.currentSection, newState.focusedIndex);
            return newState;
          } else if (currentSection === 'nav' && focusedIndex === navItemsCount - 1) {
            // Navigate to AI button after last nav item (weather is last in nav)
            setAIFocused(true);
            const newState = { currentSection: 'ai-button' as FocusSection, focusedIndex: 0 };
            storeCurrentState(newState.currentSection, newState.focusedIndex);
            return newState;
          } else if (currentSection === 'carousel' && focusedIndex < carouselItemsCount - 1) {
            const newIndex = focusedIndex + 1;
            return { currentSection, focusedIndex: newIndex };
          } else if (currentSection === 'apps' && focusedIndex < streamingAppsCount - 1) {
            const newIndex = focusedIndex + 1;
            setTimeout(() => scrollToFocusedItem('apps-container', newIndex), 0);
            return { currentSection, focusedIndex: newIndex };
          } else if (currentSection === 'movies' && focusedIndex < moviesCount - 1) {
            const newIndex = focusedIndex + 1;
            setTimeout(() => scrollToFocusedItem('movies-container', newIndex), 0);
            return { currentSection, focusedIndex: newIndex };
          } else if (currentSection === 'continue-watching' && focusedIndex < continueWatchingCount - 1) {
            const newIndex = focusedIndex + 1;
            setTimeout(() => scrollToFocusedItem('continue-watching-container', newIndex), 0);
            return { currentSection, focusedIndex: newIndex };
          } else if (currentSection === 'apps') {
            // Handle vertical navigation in apps - move to next row
            const currentRow = Math.floor(focusedIndex / 3);
            const currentCol = focusedIndex % 3;
            const nextRowIndex = (currentRow + 1) * 3 + currentCol;
            if (nextRowIndex < streamingAppsCount) {
              const newIndex = nextRowIndex;
              setTimeout(() => scrollToFocusedItem('apps-container', newIndex), 0);
              return { currentSection, focusedIndex: newIndex };
            }
          }
          break;

        case 'Enter':
          event.preventDefault();
          if (currentSection === 'nav') {
            // Trigger navigation click in UnifiedHeader
            const headerButtons = document.querySelectorAll('.bg-black\\/30 button, .bg-black\\/30 .cursor-pointer');
            const targetButton = headerButtons[focusedIndex] as HTMLElement;
            if (targetButton) targetButton.click();
          } else if (currentSection === 'ai-button') {
            // Trigger AI button click (toggle mute/unmute)
            const aiButton = document.getElementById('ai-orb-button');
            if (aiButton) aiButton.click();
          } else if (currentSection === 'apps') {
            // Trigger app click
            const appElement = document.querySelector(`#apps-container > *:nth-child(${focusedIndex + 1})`) as HTMLElement;
            if (appElement) appElement.click();
          }
          break;
      }
      return prevNavigation;
    });
  }, [streamingAppsCount, moviesCount, continueWatchingCount, carouselItemsCount, navItemsCount, scrollToSection, scrollToFocusedItem, setAIFocused]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return navigation;
};