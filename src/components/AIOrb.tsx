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
  return <button id="ai-orb-button" onClick={handleClick} aria-expanded={isConnected && !isMuted} className={`
        h-10 text-sm font-medium transition-all duration-700 ease-out rounded-full px-4 flex items-center whitespace-nowrap relative overflow-hidden
        ${isOrbFocused ? 'bg-white text-black shadow-lg' : 'text-gray-300 hover:text-white hover:bg-white/10'}
        ${isConnected && !isMuted ? 'text-white bg-black/20 w-full h-12 justify-center px-6' : ''}
      `}>
      <div className={`flex items-center gap-2 transition-all duration-700 ease-out w-full justify-center ${isConnected && !isMuted ? 'px-4' : ''}`}>
        <span className={`transition-all duration-500 font-normal text-sm ${isConnected && !isMuted ? 'text-indigo-200 text-base' : 'text-indigo-500'}`}>Atlas AI</span>
        
        {/* Waveform Animation when active and not muted - smooth entrance/exit */}
        <div className={`
          flex items-center gap-0.5 transition-all duration-700 ease-out overflow-hidden
          ${shouldShowWaveform ? 'max-w-[120px] opacity-100 ml-4' : 'max-w-0 opacity-0 ml-0'}
        `}>
          <div className="w-0.5 h-4 bg-ai-blue rounded-full animate-waveform"></div>
          <div className="w-0.5 h-6 bg-ai-blue rounded-full animate-waveform-delayed"></div>
          <div className="w-0.5 h-3 bg-ai-blue rounded-full animate-waveform-delayed-2"></div>
          <div className="w-0.5 h-4 bg-ai-blue rounded-full animate-waveform"></div>
        </div>
      </div>
    </button>;
};
export default AIOrb;
