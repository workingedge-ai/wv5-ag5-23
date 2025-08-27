import { useState, useEffect, useCallback } from 'react';
import { globalAIOrbService } from '@/services/globalAIOrbService';
import { toast } from 'sonner';

interface UseGlobalAIOrbReturn {
  isConnected: boolean;
  isMuted: boolean;
  audioLevel: number;
  toggleMute: () => Promise<void>;
  mute: () => Promise<void>;
  unmute: () => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  audioOutputElement: HTMLAudioElement | null;
}

export const useGlobalAIOrb = (): UseGlobalAIOrbReturn => {
  const [state, setState] = useState(() => globalAIOrbService.getConnectionState());

  useEffect(() => {
    // Subscribe to global state changes
    const unsubscribe = globalAIOrbService.subscribe(() => {
      setState(globalAIOrbService.getConnectionState());
    });

    // Start audio level simulation
    const interval = setInterval(() => {
      globalAIOrbService.updateAudioLevel();
      setState(globalAIOrbService.getConnectionState());
    }, 100);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const connect = useCallback(async () => {
    try {
      await globalAIOrbService.connect();
      toast.success('Connected to Gemini Live');
    } catch (error) {
      console.error('Failed to connect:', error);
      toast.error('Failed to connect to Gemini Live');
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await globalAIOrbService.disconnect();
      toast.info('Disconnected from Gemini Live');
    } catch (error) {
      console.error('Failed to disconnect:', error);
      toast.error('Failed to disconnect from Gemini Live');
    }
  }, []);

  const toggleMute = useCallback(async () => {
    try {
      await globalAIOrbService.toggleMute();
      const newState = globalAIOrbService.getConnectionState();
      toast.info(newState.isMuted ? 'Microphone muted' : 'Microphone unmuted');
    } catch (error) {
      console.error('Failed to toggle mute:', error);
      toast.error('Failed to toggle microphone');
    }
  }, []);

  const mute = useCallback(async () => {
    try {
      await globalAIOrbService.mute();
      toast.info('Microphone muted');
    } catch (error) {
      console.error('Failed to mute:', error);
      toast.error('Failed to mute microphone');
    }
  }, []);

  const unmute = useCallback(async () => {
    try {
      await globalAIOrbService.unmute();
      toast.info('Microphone unmuted');
    } catch (error) {
      console.error('Failed to unmute:', error);
      toast.error('Failed to unmute microphone');
    }
  }, []);

  return {
    isConnected: state.isConnected,
    isMuted: state.isMuted,
    audioLevel: state.audioLevel,
    toggleMute,
    mute,
    unmute,
    connect,
    disconnect,
    audioOutputElement: globalAIOrbService.getAudioOutputElement()
  };
};