
import { useState, useEffect, useCallback } from 'react';
import { geminiLiveService } from '@/services/geminiLiveAudioService';
import { toast } from 'sonner';

interface UseGeminiLiveAudioReturn {
  isConnected: boolean;
  isMuted: boolean;
  toggleMute: () => Promise<void>;
  mute: () => Promise<void>;
  unmute: () => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  audioLevel: number;
}

export const useGeminiLiveAudio = (): UseGeminiLiveAudioReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const updateConnectionState = useCallback(() => {
    const state = geminiLiveService.getConnectionState();
    setIsConnected(state.isConnected);
    setIsMuted(state.isMuted);
  }, []);

  const handleResponse = useCallback((text: string) => {
    console.log('Gemini response:', text);
    toast.info(`Gemini: ${text}`);
  }, []);

  const connect = useCallback(async () => {
    try {
      await geminiLiveService.connect(handleResponse);
      updateConnectionState();
      toast.success('Connected to Gemini Live');
    } catch (error) {
      console.error('Failed to connect:', error);
      toast.error('Failed to connect to Gemini Live');
    }
  }, [updateConnectionState, handleResponse]);

  const disconnect = useCallback(async () => {
    try {
      await geminiLiveService.disconnect();
      updateConnectionState();
      toast.info('Disconnected from Gemini Live');
    } catch (error) {
      console.error('Failed to disconnect:', error);
      toast.error('Failed to disconnect from Gemini Live');
    }
  }, [updateConnectionState]);

  const toggleMute = useCallback(async () => {
    try {
      if (isMuted) {
        await geminiLiveService.unmute();
        toast.info('Microphone unmuted');
      } else {
        await geminiLiveService.mute();
        toast.info('Microphone muted');
      }
      updateConnectionState();
    } catch (error) {
      console.error('Failed to toggle mute:', error);
      toast.error('Failed to toggle microphone');
    }
  }, [isMuted, updateConnectionState]);

  const mute = useCallback(async () => {
    try {
      await geminiLiveService.mute();
      updateConnectionState();
      toast.info('Microphone muted');
    } catch (error) {
      console.error('Failed to mute:', error);
      toast.error('Failed to mute microphone');
    }
  }, [updateConnectionState]);

  const unmute = useCallback(async () => {
    try {
      await geminiLiveService.unmute();
      updateConnectionState();
      toast.info('Microphone unmuted');
    } catch (error) {
      console.error('Failed to unmute:', error);
      toast.error('Failed to unmute microphone');
    }
  }, [updateConnectionState]);

  // Simulate audio level for visual feedback
  useEffect(() => {
    if (!isConnected || isMuted) {
      setAudioLevel(0);
      return;
    }

    const interval = setInterval(() => {
      setAudioLevel(Math.random() * 0.8 + 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, [isConnected, isMuted]);

  // Don't cleanup on unmount to persist across pages
  // Users can manually disconnect by muting/clicking the AI button

  return {
    isConnected,
    isMuted,
    toggleMute,
    mute,
    unmute,
    connect,
    disconnect,
    audioLevel
  };
};
