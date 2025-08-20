import { useState, useEffect, useCallback } from 'react';

interface AIOrbFocusState {
  isFocused: boolean;
  setFocused: (focused: boolean) => void;
}

export const useAIOrbFocus = (): AIOrbFocusState => {
  const [isFocused, setIsFocused] = useState(false);

  const setFocused = useCallback((focused: boolean) => {
    setIsFocused(focused);
    
    // Store focus state in session storage for persistence across pages
    sessionStorage.setItem('ai-orb-focused', focused.toString());
    
    // Dispatch global events for other components to listen
    window.dispatchEvent(new CustomEvent(focused ? 'ai-orb-focus' : 'ai-orb-blur'));
  }, []);

  useEffect(() => {
    // Check if AI was focused before navigation
    const wasFocused = sessionStorage.getItem('ai-orb-focused') === 'true';
    if (wasFocused) {
      setIsFocused(true);
    }

    // Listen for focus restoration events
    const handleFocusRestore = () => {
      setIsFocused(true);
    };

    window.addEventListener('focus-ai-orb', handleFocusRestore);
    
    return () => {
      window.removeEventListener('focus-ai-orb', handleFocusRestore);
    };
  }, []);

  return { isFocused, setFocused };
};