
import { useState, useEffect, useCallback } from 'react';

interface AgenticModeState {
  isOpen: boolean;
  task: string;
  contentType: string;
}

export const useAgenticMode = () => {
  const [state, setState] = useState<AgenticModeState>({
    isOpen: false,
    task: '',
    contentType: ''
  });

  const openAgenticMode = useCallback((task: string, contentType: string) => {
    setState({
      isOpen: true,
      task,
      contentType
    });
  }, []);

  const closeAgenticMode = useCallback(() => {
    setState({
      isOpen: false,
      task: '',
      contentType: ''
    });
  }, []);

  useEffect(() => {
    const handleAgenticModeEvent = (event: CustomEvent) => {
      const { task, contentType } = event.detail;
      openAgenticMode(task, contentType);
    };

    window.addEventListener('activate-agentic-mode', handleAgenticModeEvent as EventListener);
    
    return () => {
      window.removeEventListener('activate-agentic-mode', handleAgenticModeEvent as EventListener);
    };
  }, [openAgenticMode]);

  return {
    ...state,
    openAgenticMode,
    closeAgenticMode
  };
};
