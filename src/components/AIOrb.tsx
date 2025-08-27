import React, { useState, useEffect } from 'react';
import { useGeminiLiveAudio } from '@/hooks/useGeminiLiveAudio';
import { useAIOrbFocus } from '@/hooks/useAIOrbFocus';
interface AIOrbProps {
  focused?: boolean;
  onClick?: () => void;
}
const AIOrb: React.FC<AIOrbProps> = ({
  focused = false,
  onClick
}) => {
  const {
    isConnected,
    isMuted,
    toggleMute,
    mute,
    connect,
    disconnect
  } = useGeminiLiveAudio();
  const {
    isFocused,
    setFocused
  } = useAIOrbFocus();

  // Listen for mute events from Gemini service
  useEffect(() => {
    const handleMuteEvent = () => {
      mute();
    };
    window.addEventListener('aiOrb:mute', handleMuteEvent);
    return () => {
      window.removeEventListener('aiOrb:mute', handleMuteEvent);
    };
  }, [mute]);
  const handleClick = async () => {
    onClick?.();
    if (!isConnected) {
      // First click - establish connection
      await connect();
    } else {
      // Subsequent clicks - toggle mute
      await toggleMute();
    }
  };

  // Use focused prop or global focus state
  const isOrbFocused = focused || isFocused;

  // Always show the correct state based on connection status
  const shouldShowWaveform = isConnected && !isMuted;

  // Broadcast AI orb state so other components can react (header glow, navbar, etc.)
  useEffect(() => {
    try {
      const event = new CustomEvent('aiOrb:state', { detail: { active: isConnected && !isMuted } });
      window.dispatchEvent(event);
    } catch (err) {
      // Fallback for older browsers
      const ev = document.createEvent('CustomEvent');
      ev.initCustomEvent('aiOrb:state', false, false, { active: isConnected && !isMuted });
      window.dispatchEvent(ev as any);
    }
  }, [isConnected, isMuted]);

  useEffect(() => {
    // Update global focus state when focused prop changes
    if (focused !== isFocused) {
      setFocused(focused);
    }
  }, [focused, isFocused, setFocused]);
  return (
    <button
      id="ai-orb-button"
      onClick={handleClick}
      className={`
        w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 font-bold text-xl
        ${isOrbFocused ? 'bg-white text-black shadow-lg' : 'bg-gray-700 text-white hover:bg-white/10'}
      `}
      style={{ outline: 'none', border: 'none' }}
    >
      AI
    </button>
  );
};
export default AIOrb;
