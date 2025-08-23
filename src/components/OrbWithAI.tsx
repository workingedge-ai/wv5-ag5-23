import React, { useState, useEffect } from 'react';
import AbstractBall from '@/components/AbstractBall';
import { useGeminiLiveAudio } from '@/hooks/useGeminiLiveAudio';
import { useAIOrbFocus } from '@/hooks/useAIOrbFocus';

interface OrbWithAIProps {
  focused?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

const OrbWithAI: React.FC<OrbWithAIProps> = ({
  focused = false,
  onClick,
  size = 'small'
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

  const [config, setConfig] = useState({
    perlinTime: 25.0,
    perlinDNoise: 2.5,
    chromaRGBr: 7.5,
    chromaRGBg: 5,
    chromaRGBb: 7,
    chromaRGBn: 0,
    chromaRGBm: 1.0,
    sphereWireframe: false,
    spherePoints: false,
    spherePsize: 1.0,
    cameraSpeedY: 0.0,
    cameraSpeedX: 0.0,
    cameraZoom: 175,
    cameraGuide: false,
    perlinMorph: 5.5,
  });

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

  // Update orb visual state based on AI connection and activity
  useEffect(() => {
    if (isConnected && !isMuted) {
      // Active state - more dynamic animation
      setConfig(c => ({ 
        ...c, 
        perlinTime: 100.0, 
        perlinMorph: 25.0,
        chromaRGBr: 2.5,
        chromaRGBg: 7.5,
        chromaRGBb: 10.0,
        cameraSpeedY: 1.0,
        cameraSpeedX: 0.5
      }));
    } else if (isConnected) {
      // Connected but muted - moderate animation
      setConfig(c => ({ 
        ...c, 
        perlinTime: 25.0, 
        perlinMorph: 10.0,
        chromaRGBr: 5.0,
        chromaRGBg: 5.0,
        chromaRGBb: 7.0,
        cameraSpeedY: 0.5,
        cameraSpeedX: 0.2
      }));
    } else {
      // Idle state - subtle animation
      setConfig(c => ({ 
        ...c, 
        perlinTime: 5.0, 
        perlinMorph: 2.0,
        chromaRGBr: 7.5,
        chromaRGBg: 5.0,
        chromaRGBb: 7.0,
        cameraSpeedY: 0.1,
        cameraSpeedX: 0.1
      }));
    }
  }, [isConnected, isMuted]);

  // Handle click interaction
  const handleClick = async () => {
    onClick?.();
    if (!isConnected) {
      await connect();
    } else {
      await toggleMute();
    }
  };

  // Use focused prop or global focus state
  const isOrbFocused = focused || isFocused;

  // Broadcast AI orb state so other components can react
  useEffect(() => {
    try {
      const event = new CustomEvent('aiOrb:state', { detail: { active: isConnected && !isMuted } });
      window.dispatchEvent(event);
    } catch (err) {
      const ev = document.createEvent('CustomEvent');
      ev.initCustomEvent('aiOrb:state', false, false, { active: isConnected && !isMuted });
      window.dispatchEvent(ev as any);
    }
  }, [isConnected, isMuted]);

  useEffect(() => {
    if (focused !== isFocused) {
      setFocused(focused);
    }
  }, [focused, isFocused, setFocused]);

  // Determine size based on prop
  const sizeConfig = {
    small: { width: '80px', height: '80px', zoom: 200 },
    medium: { width: '120px', height: '120px', zoom: 180 },
    large: { width: '200px', height: '200px', zoom: 150 }
  };

  const currentSize = sizeConfig[size];

  return (
    <button 
      id="ai-orb-button" 
      onClick={handleClick} 
      aria-expanded={isConnected && !isMuted}
      className={`
        relative transition-all duration-300 ease-out rounded-full overflow-hidden
        ${isOrbFocused ? 'ring-2 ring-white/50 scale-110' : 'hover:scale-105'}
        ${isConnected && !isMuted ? 'ring-2 ring-indigo-400/50' : ''}
      `}
      style={{
        width: currentSize.width,
        height: currentSize.height
      }}
    >
      <AbstractBall {...config} cameraZoom={currentSize.zoom} />
      
      {/* Status indicator overlay */}
      <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full border border-white/20">
        <div className={`
          w-full h-full rounded-full transition-colors duration-300
          ${isConnected && !isMuted ? 'bg-green-400' : isConnected ? 'bg-yellow-400' : 'bg-gray-400'}
        `} />
      </div>
      
      {/* Label for accessibility and small screens */}
      {size === 'small' && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white/70 whitespace-nowrap">
          Atlas AI
        </div>
      )}
    </button>
  );
};

export default OrbWithAI;