import { GeminiLiveAudioService } from './geminiLiveAudioService';

class GlobalAIOrbService {
  private static instance: GlobalAIOrbService;
  private geminiService: GeminiLiveAudioService;
  private isConnected = false;
  private isMuted = false;
  private audioLevel = 0;
  private subscribers = new Set<() => void>();
  private audioOutputElement: HTMLAudioElement | null = null;

  private constructor() {
    this.geminiService = new GeminiLiveAudioService();
    this.createAudioOutputElement();
  }

  static getInstance(): GlobalAIOrbService {
    if (!GlobalAIOrbService.instance) {
      GlobalAIOrbService.instance = new GlobalAIOrbService();
    }
    return GlobalAIOrbService.instance;
  }

  private createAudioOutputElement() {
    // Create a global audio element for AI speech output
    this.audioOutputElement = document.createElement('audio');
    this.audioOutputElement.style.display = 'none';
    this.audioOutputElement.crossOrigin = 'anonymous';
    this.audioOutputElement.id = 'global-ai-audio-output';
    document.body.appendChild(this.audioOutputElement);
  }

  getAudioOutputElement(): HTMLAudioElement | null {
    return this.audioOutputElement;
  }

  subscribe(callback: () => void) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback());
  }

  async connect(): Promise<void> {
    try {
      await this.geminiService.connect((text: string) => {
        console.log('Gemini response:', text);
      });
      this.updateConnectionState();
    } catch (error) {
      console.error('Failed to connect:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.geminiService.disconnect();
      this.updateConnectionState();
    } catch (error) {
      console.error('Failed to disconnect:', error);
      throw error;
    }
  }

  async toggleMute(): Promise<void> {
    try {
      if (this.isMuted) {
        await this.geminiService.unmute();
      } else {
        await this.geminiService.mute();
      }
      this.updateConnectionState();
    } catch (error) {
      console.error('Failed to toggle mute:', error);
      throw error;
    }
  }

  async mute(): Promise<void> {
    try {
      await this.geminiService.mute();
      this.updateConnectionState();
    } catch (error) {
      console.error('Failed to mute:', error);
      throw error;
    }
  }

  async unmute(): Promise<void> {
    try {
      await this.geminiService.unmute();
      this.updateConnectionState();
    } catch (error) {
      console.error('Failed to unmute:', error);
      throw error;
    }
  }

  private updateConnectionState() {
    const state = this.geminiService.getConnectionState();
    this.isConnected = state.isConnected;
    this.isMuted = state.isMuted;
    this.notifySubscribers();
  }

  getConnectionState() {
    return {
      isConnected: this.isConnected,
      isMuted: this.isMuted,
      audioLevel: this.audioLevel
    };
  }

  // Simulate audio level for visual feedback
  updateAudioLevel() {
    if (!this.isConnected || this.isMuted) {
      this.audioLevel = 0;
      return;
    }
    this.audioLevel = Math.random() * 0.8 + 0.1;
  }
}

export const globalAIOrbService = GlobalAIOrbService.getInstance();