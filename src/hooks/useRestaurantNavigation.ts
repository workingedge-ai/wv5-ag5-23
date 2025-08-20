import { useState, useEffect, useCallback } from 'react';
import { useAIOrbFocus } from './useAIOrbFocus';

export type RestaurantFocusSection = 'categories' | 'menu-items' | 'place-order' | 'ai-button';

interface RestaurantNavigationState {
  currentSection: RestaurantFocusSection;
  focusedIndex: number;
}

export const useRestaurantNavigation = (
  categoriesCount: number,
  menuItemsCount: number,
  navItemsCount: number = 4,
  universalNavigation?: { currentSection: string; setCurrentSection: (section: string) => void; setFocusedIndex: (index: number) => void }
) => {
  const { isFocused: isAIFocused, setFocused: setAIFocused } = useAIOrbFocus();
  
  const [navigation, setNavigation] = useState<RestaurantNavigationState>({
    currentSection: isAIFocused ? 'ai-button' : 'menu-items', // Start with menu-items instead of categories
    focusedIndex: -1, // Start with no focus
  });

  const scrollToFocusedItem = useCallback((containerId: string, index: number) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Find all clickable menu item cards inside the container (they have the cursor-pointer class)
    const items = Array.from(container.querySelectorAll<HTMLElement>('.cursor-pointer'));
    const item = items[index];
    if (item) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      // For vertical scrolling in menu items: only scroll when item is outside visible bounds
      if (itemRect.top < containerRect.top || itemRect.bottom > containerRect.bottom) {
        item.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, []);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Only handle restaurant navigation when not in header
    if (universalNavigation?.currentSection === 'nav') {
      return;
    }

    setNavigation((prevNavigation) => {
      const { currentSection, focusedIndex } = prevNavigation;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (currentSection === 'categories' && focusedIndex === -1) {
            // When navigation enters categories section, start with first item
            return { currentSection, focusedIndex: 0 };
          } else if (currentSection === 'categories' && focusedIndex < categoriesCount - 1) {
            return { currentSection, focusedIndex: focusedIndex + 1 };
          } else if (currentSection === 'menu-items' && focusedIndex === -1) {
            // When navigation enters menu-items section, start with first item
            return { currentSection, focusedIndex: 0 };
          } else if (currentSection === 'menu-items' && focusedIndex < menuItemsCount - 1) {
            const newIndex = focusedIndex + 1;
            setTimeout(() => scrollToFocusedItem('menu-items-container', newIndex), 0);
            return { currentSection, focusedIndex: newIndex };
          }
          break;

        case 'ArrowUp':
          event.preventDefault();
          if (currentSection === 'categories' && focusedIndex > 0) {
            return { currentSection, focusedIndex: focusedIndex - 1 };
          } else if (currentSection === 'categories' && focusedIndex === -1) {
            // When navigation enters categories section, start with first item
            return { currentSection, focusedIndex: 0 };
          } else if (currentSection === 'categories' && focusedIndex === 0) {
            // Transition back to header navigation
            if (universalNavigation) {
              universalNavigation.setCurrentSection('nav');
              universalNavigation.setFocusedIndex(2); // Focus on Restaurant tab
            }
            return prevNavigation;
          } else if (currentSection === 'menu-items' && focusedIndex === -1) {
            // When navigation enters menu-items section, start with first item
            return { currentSection, focusedIndex: 0 };
          } else if (currentSection === 'menu-items' && focusedIndex > 0) {
            const newIndex = focusedIndex - 1;
            setTimeout(() => scrollToFocusedItem('menu-items-container', newIndex), 0);
            return { currentSection, focusedIndex: newIndex };
          } else if (currentSection === 'place-order') {
            return { currentSection: 'menu-items', focusedIndex: 0 };
          }
          break;

        case 'ArrowLeft':
          event.preventDefault();
          if (currentSection === 'ai-button') {
            setAIFocused(false);
            // Transition back to header navigation
            if (universalNavigation) {
              universalNavigation.setCurrentSection('nav');
              universalNavigation.setFocusedIndex(5); // AI button index
            }
            return { currentSection: 'categories', focusedIndex: 0 };
          } else if (currentSection === 'menu-items') {
            return { currentSection: 'categories', focusedIndex: 0 };
          } else if (currentSection === 'place-order') {
            return { currentSection: 'menu-items', focusedIndex: 0 };
          }
          break;

        case 'ArrowRight':
          event.preventDefault();
          if (currentSection === 'categories') {
            return { currentSection: 'menu-items', focusedIndex: 0 };
          } else if (currentSection === 'menu-items') {
            return { currentSection: 'place-order', focusedIndex: 0 };
          }
          break;

        case 'Enter':
          event.preventDefault();
          if (currentSection === 'ai-button') {
            const aiButton = document.getElementById('ai-orb-button');
            if (aiButton) aiButton.click();
          } else if (currentSection === 'categories') {
            const categoryElement = document.querySelector(`#categories-container > *:nth-child(${focusedIndex + 1})`) as HTMLElement;
            if (categoryElement) categoryElement.click();
          } else if (currentSection === 'menu-items') {
            // Find the correct menu item card
            const menuCards = document.querySelectorAll('#menu-items-container .cursor-pointer');
            const targetCard = menuCards[focusedIndex] as HTMLElement;
            if (targetCard) targetCard.click();
          } else if (currentSection === 'place-order') {
            const orderButton = document.getElementById('place-order-button');
            if (orderButton) orderButton.click();
          }
          break;
      }
      return prevNavigation;
    });
  }, [categoriesCount, menuItemsCount, navItemsCount, scrollToFocusedItem, setAIFocused, universalNavigation]);

  useEffect(() => {
    // Start restaurant navigation when universal navigation moves to main section
    if (universalNavigation?.currentSection === 'main') {
      setNavigation({ currentSection: 'categories', focusedIndex: 0 });
    }
  }, [universalNavigation?.currentSection]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return navigation;
};