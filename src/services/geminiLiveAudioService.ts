import { GoogleGenAI, LiveServerMessage, Modality, Session, Type } from '@google/genai';
import { createBlob, decode, decodeAudioData } from '../utils/geminiUtils';
import { homeAssistantService } from './homeAssistantService';
import { restaurantService } from './restaurantService';

const GEMINI_API_KEY = 'AIzaSyDYHKV8tArqd_uLJdk1xuNtrvRBD1u8rnQ';

// Function declarations for Gemini Live
const functionDeclarations = [
  // Navigation Functions
  {
    name: "navigate_to_home",
    description: "Navigate to the home page of the application",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  {
    name: "navigate_to_apps",
    description: "Navigate to the apps page to see all available applications",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  {
    name: "navigate_to_restaurant",
    description: "Navigate to the restaurant page to view the food menu. Use when user mentions being hungry, wanting food, or asking about the menu",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  {
    name: "navigate_to_services",
    description: "Navigate to the services page",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  {
    name: "navigate_to_booking",
    description: "Navigate to the booking page",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  {
    name: "scroll_home_page",
    description: "Scroll up or down on the home page to navigate between sections",
    parameters: {
      type: Type.OBJECT,
      properties: {
        direction: {
          type: Type.STRING,
          description: "Direction to scroll: 'up' or 'down'"
        }
      },
      required: ["direction"]
    }
  },
  {
    name: "stay_silent",
    description: "Mute the microphone and stay silent. Use when user asks to be quiet, mute, stay silent, or wait",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  {
    name: "open_youtube",
    description: "Opens YouTube in a new browser tab",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  {
    name: "turn_on_fan",
    description: "Turn on the fan connected to Home Assistant",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  {
    name: "turn_off_fan",
    description: "Turn off the fan connected to Home Assistant",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  {
    name: "get_fan_status",
    description: "Get the current status of the fan (on/off)",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  {
    name: "open_netflix",
    description: "Opens Netflix in a new browser tab", 
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  {
    name: "open_plex",
    description: "Opens Plex TV in a new browser tab",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  {
    name: "open_youtube_music",
    description: "Opens YouTube Music in a new browser tab",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  {
    name: "search_youtube",
    description: "Search for videos on YouTube and open the results",
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: {
          type: Type.STRING,
          description: "The search query for YouTube"
        }
      },
      required: ["query"]
    }
  },
  {
    name: "play_youtube_video",
    description: "Search and play a specific video on YouTube",
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: {
          type: Type.STRING,
          description: "The search query to find and play the video"
        }
      },
      required: ["query"]
    }
  },
  {
    name: "turn_on_smart_plug",
    description: "Turn on the smart plug connected to Home Assistant",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  {
    name: "turn_off_smart_plug",
    description: "Turn off the smart plug connected to Home Assistant",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  {
    name: "get_smart_plug_status",
    description: "Get the current status of the smart plug (on/off)",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  // Restaurant Management Functions
  {
    name: "show_restaurant_category",
    description: "Show menu items from a specific category in the restaurant",
    parameters: {
      type: Type.OBJECT,
      properties: {
        category: {
          type: Type.STRING,
          description: "The category to display (e.g., Pizza, Salads, Main Course, Pasta, Dessert, Burgers)"
        }
      },
      required: ["category"]
    }
  },
  {
    name: "add_item_to_order",
    description: "Add a menu item to the current order. Use this to add new items or increase quantity of existing items.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        itemName: {
          type: Type.STRING,
          description: "The exact name of the menu item to add"
        },
        quantity: {
          type: Type.NUMBER,
          description: "Quantity to add (defaults to 1 if not specified)"
        }
      },
      required: ["itemName"]
    }
  },
  {
    name: "remove_item_from_order",
    description: "COMPLETELY remove a menu item from the current order. This will remove ALL quantities of the specified item from the cart.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        itemName: {
          type: Type.STRING,
          description: "The exact name of the menu item to completely remove from order"
        }
      },
      required: ["itemName"]
    }
  },
  {
    name: "update_item_quantity",
    description: "Change the quantity of an existing item in the order to a specific number. Use this when user wants to set a specific quantity (e.g., 'change to 2', 'make it 3', 'set quantity to 1'). This replaces the current quantity with the new one.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        itemName: {
          type: Type.STRING,
          description: "The exact name of the menu item"
        },
        quantity: {
          type: Type.NUMBER,
          description: "The new quantity to set (will completely replace current quantity). Use 0 to remove the item."
        }
      },
      required: ["itemName", "quantity"]
    }
  },
  {
    name: "add_special_instructions",
    description: "Add special instructions to a menu item in the order",
    parameters: {
      type: Type.OBJECT,
      properties: {
        itemName: {
          type: Type.STRING,
          description: "The exact name of the menu item"
        },
        instructions: {
          type: Type.STRING,
          description: "Special instructions for the item"
        }
      },
      required: ["itemName", "instructions"]
    }
  },
  {
    name: "scroll_menu",
    description: "Scroll through the menu items list",
    parameters: {
      type: Type.OBJECT,
      properties: {
        direction: {
          type: Type.STRING,
          description: "Direction to scroll: 'up' or 'down'"
        },
        amount: {
          type: Type.STRING,
          description: "Amount to scroll: 'small', 'medium', or 'large'"
        }
      },
      required: ["direction"]
    }
  },
  {
    name: "place_restaurant_order",
    description: "Place the current restaurant order for Room 202",
    parameters: {
      type: Type.OBJECT,
      properties: {
        roomNumber: {
          type: Type.STRING,
          description: "Room number for delivery (defaults to 202)"
        }
      },
      required: []
    }
  },
  {
    name: "clear_restaurant_order",
    description: "Clear all items from the current restaurant order",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  {
    name: "get_order_summary",
    description: "Get the current restaurant order summary including items, quantities, and total price",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  {
    name: "get_restaurant_menu",
    description: "Get the full restaurant menu with all available items and categories",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  // Agentic Mode Function
  {
    name: "activate_agentic_mode",
    description: "Activate agentic mode to generate any text-based content including letters, documents, lists, comparisons, tables, research, reports, essays, summaries, plans, or any written material based on user request",
    parameters: {
      type: Type.OBJECT,
      properties: {
        task: {
          type: Type.STRING,
          description: "The specific task or request from the user (e.g., 'Write a letter to the Manager requesting 2 days holiday', 'Create a comparison table of smartphones', 'Generate a list of top restaurants', 'Research renewable energy options', 'Write a business proposal')"
        },
        contentType: {
          type: Type.STRING,
          description: "Type of content to generate (e.g., 'letter', 'document', 'list', 'comparison', 'table', 'research', 'report', 'essay', 'summary', 'plan')"
        }
      },
      required: ["task", "contentType"]
    }
  }
];

export class GeminiLiveAudioService {
  private client: GoogleGenAI;
  private session: Session | null = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private inputNode: GainNode | null = null;
  private outputNode: GainNode | null = null;
  private nextStartTime = 0;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private audioWorkletNode: AudioWorkletNode | null = null;
  private sources = new Set<AudioBufferSourceNode>();
  private isConnected = false;
  private isMuted = false;
  private onResponseCallback?: (text: string) => void;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    });
  }

  async connect(onResponse?: (text: string) => void): Promise<void> {
    if (this.isConnected) {
      console.log('Already connected to Gemini Live');
      return;
    }

    this.onResponseCallback = onResponse;

    try {
      // Check for media devices support before initializing
      if (!this.checkMediaDevicesSupport()) {
        throw new Error('Media Devices API not supported in this browser. Please use a modern browser with HTTPS.');
      }

      // Initialize audio contexts (handle legacy webkitAudioContext without using `any`)
      type AudioContextConstructor = new (options?: AudioContextOptions) => AudioContext;
      interface WindowWithAudioContext extends Window {
        webkitAudioContext?: AudioContextConstructor;
        AudioContext?: AudioContextConstructor;
      }

      const AC = ((window as unknown) as WindowWithAudioContext).AudioContext ?? ((window as unknown) as WindowWithAudioContext).webkitAudioContext;
      if (!AC) throw new Error('AudioContext is not supported in this environment');

      this.inputAudioContext = new AC({ sampleRate: 16000 });
      this.outputAudioContext = new AC({ sampleRate: 24000 });
      this.inputNode = this.inputAudioContext.createGain();
      this.outputNode = this.outputAudioContext.createGain();
      this.outputNode.connect(this.outputAudioContext.destination);

      await this.inputAudioContext.resume();
      await this.outputAudioContext.resume();

      const model = 'gemini-2.0-flash-live-001';

      this.session = await this.client.live.connect({
        model: model,
        callbacks: {
          onopen: () => {
            console.log('Connected to Gemini Live - improved function calling enabled');
            this.isConnected = true;
            this.setupAudioInput();

            // Send a one-time proactive hello on first-ever connection so the assistant
            // speaks first instead of waiting for user to say hi.
            // We persist a flag in localStorage so this occurs only once per user/browser.
            this.sendInitialGreetingIfNeeded();
          },
          onmessage: async (message: LiveServerMessage) => {
            console.log('Received message from Gemini:', message);
            
            // Handle function calls - check multiple possible locations
            if (message.toolCall) {
              console.log('Function call received in toolCall:', message.toolCall);
              await this.handleFunctionCall(message.toolCall);
              return;
            }
            
            // Also check serverContent for tool calls
            if (message.serverContent?.modelTurn?.parts) {
              for (const part of message.serverContent.modelTurn.parts) {
                if (part.functionCall) {
                  console.log('Function call received in serverContent:', part.functionCall);
                  const toolCall = { functionCalls: [part.functionCall] };
                  await this.handleFunctionCall(toolCall);
                  return;
                }
              }
            }

            // Handle audio response
            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData;
            if (audio && this.outputAudioContext) {
              this.nextStartTime = Math.max(
                this.nextStartTime,
                this.outputAudioContext.currentTime,
              );

              const audioBuffer = await decodeAudioData(
                decode(audio.data),
                this.outputAudioContext,
                24000,
                1,
              );
              const source = this.outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(this.outputNode!);
              source.addEventListener('ended', () => {
                this.sources.delete(source);
              });

              source.start(this.nextStartTime);
              this.nextStartTime = this.nextStartTime + audioBuffer.duration;
              this.sources.add(source);
            }

            // Handle text response
            // Only show toast for function call responses, not for general Gemini responses
            // So skip calling onResponseCallback here
            // const textPart = message.serverContent?.modelTurn?.parts?.find((part: any) => part.text);
            // if (textPart && this.onResponseCallback) {
            //   this.onResponseCallback(textPart.text);
            // }

            // Handle interruption
            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              for (const source of this.sources.values()) {
                source.stop();
                this.sources.delete(source);
              }
              this.nextStartTime = 0;
            }
          },
          onerror: (error: ErrorEvent) => {
            console.error('Gemini Live error:', error);
          },
          onclose: (event: CloseEvent) => {
            console.log('Gemini Live connection closed:', event.reason);
            this.isConnected = false;
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Orus' } },
          },
          tools: [{ googleSearch: {} }, { functionDeclarations }],
          // System instruction: make the assistant behave like a hotel room assistant,
          // reply in the same language the user is speaking, and keep responses short
          // and to the point.
          systemInstruction: `You are a helpful hotel room assistant. Reply in the same language the user is speaking. Keep responses short, concise, and to the point.`,
        },
      });

    } catch (error) {
      console.error('Failed to connect to Gemini Live:', error);
      throw new Error('Could not establish connection to Gemini Live');
    }
  }

  private checkMediaDevicesSupport(): boolean {
    // Check if navigator.mediaDevices exists
    if (!navigator.mediaDevices) {
      console.error('navigator.mediaDevices is not supported in this browser');
      return false;
    }

    // Check if getUserMedia exists
    if (!navigator.mediaDevices.getUserMedia) {
      console.error('navigator.mediaDevices.getUserMedia is not supported in this browser');
      return false;
    }

    // Check if we're on HTTPS (required for microphone access)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      console.error('Microphone access requires HTTPS connection');
      return false;
    }

    return true;
  }

  private async handleFunctionCall(toolCall: { functionCalls?: Array<{ id?: string; name?: string; args?: Record<string, unknown> }> }): Promise<void> {
    console.log('Processing function call:', toolCall);
    
    const functionCall = toolCall.functionCalls?.[0];
    if (!functionCall) {
      console.error('No function call found in toolCall');
      return;
    }

  const functionName = functionCall.name;
  const functionId = functionCall.id;
  const args = (functionCall.args || {}) as Record<string, unknown>;
    
    let result = { success: true, message: '' };

    switch (functionName) {
      // Navigation functions
      case 'navigate_to_home':
        result = this.navigateToHome();
        break;
      case 'navigate_to_apps':
        result = this.navigateToApps();
        break;
      case 'navigate_to_restaurant':
        result = this.navigateToRestaurant();
        break;
      case 'navigate_to_services':
        result = this.navigateToServices();
        break;
      case 'navigate_to_booking':
        result = this.navigateToBooking();
        break;
      case 'scroll_home_page': {
        const dir = typeof args.direction === 'string' && (args.direction === 'up' || args.direction === 'down') ? args.direction as 'up' | 'down' : 'down';
        result = this.scrollHomePage(dir);
        break;
      }
      case 'stay_silent':
        result = await this.staySilent();
        break;
  case 'open_youtube':
        result = this.openYouTube();
        this.autoMute();
        break;
      case 'open_netflix':
        result = this.openNetflix();
        this.autoMute();
        break;
      case 'open_plex':
        result = this.openPlex();
        this.autoMute();
        break;
      case 'open_youtube_music':
        result = this.openYouTubeMusic();
        this.autoMute();
        break;
      case 'search_youtube': {
        const q = typeof args.query === 'string' ? args.query : '';
        result = this.searchYouTube(q);
        this.autoMute();
        break;
      }
      case 'play_youtube_video': {
        const q2 = typeof args.query === 'string' ? args.query : '';
        result = this.playYouTubeVideo(q2);
        this.autoMute();
        break;
      }
      case 'turn_on_smart_plug':
        result = await this.turnOnSmartPlug();
        break;
      case 'turn_off_smart_plug':
        result = await this.turnOffSmartPlug();
        break;
      case 'get_smart_plug_status':
        result = await this.getSmartPlugStatus();
        break;
      case 'turn_on_fan':
        result = await this.turnOnFan();
        break;
      case 'turn_off_fan':
        result = await this.turnOffFan();
        break;
      case 'get_fan_status':
        result = await this.getFanStatus();
        break;
      // Restaurant function calls
      case 'show_restaurant_category': {
        const cat = typeof args.category === 'string' ? args.category : '';
        result = this.showRestaurantCategory(cat);
        break;
      }
      case 'add_item_to_order': {
        const name = typeof args.itemName === 'string' ? args.itemName : '';
        const qty = typeof args.quantity === 'number' ? args.quantity : 1;
        result = this.addItemToOrder(name, qty);
        break;
      }
      case 'remove_item_from_order': {
        const nameR = typeof args.itemName === 'string' ? args.itemName : '';
        result = this.removeItemFromOrder(nameR);
        break;
      }
      case 'update_item_quantity': {
        const nameU = typeof args.itemName === 'string' ? args.itemName : '';
        const qtyU = typeof args.quantity === 'number' ? args.quantity : 0;
        result = this.updateItemQuantity(nameU, qtyU);
        break;
      }
      case 'add_special_instructions': {
        const nameS = typeof args.itemName === 'string' ? args.itemName : '';
        const instr = typeof args.instructions === 'string' ? args.instructions : '';
        result = this.addSpecialInstructions(nameS, instr);
        break;
      }
      case 'scroll_menu': {
        const dirM = typeof args.direction === 'string' && (args.direction === 'up' || args.direction === 'down') ? args.direction as 'up' | 'down' : 'down';
        const amount = typeof args.amount === 'string' ? args.amount as 'small' | 'medium' | 'large' : 'medium';
        result = this.scrollMenu(dirM, amount);
        break;
      }
      case 'place_restaurant_order': {
        const room = typeof args.roomNumber === 'string' ? args.roomNumber : '202';
        result = this.placeRestaurantOrder(room);
        break;
      }
      case 'clear_restaurant_order':
        result = this.clearRestaurantOrder();
        break;
      case 'get_order_summary':
        result = this.getOrderSummary();
        break;
      case 'get_restaurant_menu':
        result = this.getRestaurantMenu();
        break;
      // Agentic mode function call
      case 'activate_agentic_mode': {
        const task = typeof args.task === 'string' ? args.task : '';
        const contentType = typeof args.contentType === 'string' ? args.contentType : '';
        result = await this.activateAgenticMode(task, contentType);
        break;
      }
      default:
        console.log('Unknown function call:', functionName);
        result = { success: false, message: 'Unknown function' };
    }

    // Send function response back to Gemini with the correct ID
    if (this.session && functionId) {
      try {
        this.session.sendToolResponse({
          functionResponses: [{
            id: functionId,
            name: functionName,
            response: result
          }]
        });
      } catch (error) {
        console.error('Error sending tool response:', error);
      }
    }
  }

  // Navigation methods
  private navigateToHome(): { success: boolean; message: string } {
    console.log('Navigating to home page');
    // Use React Router navigation instead of window.location.href
    const event = new CustomEvent('navigate', { detail: { path: '/' } });
    window.dispatchEvent(event);
    if (this.onResponseCallback) {
      this.onResponseCallback('Navigating to home page!');
    }
    return { success: true, message: 'Navigated to home page' };
  }

  private navigateToApps(): { success: boolean; message: string } {
    console.log('Navigating to apps page');
    const event = new CustomEvent('navigate', { detail: { path: '/apps' } });
    window.dispatchEvent(event);
    if (this.onResponseCallback) {
      this.onResponseCallback('Opening apps page!');
    }
    return { success: true, message: 'Navigated to apps page' };
  }

  private navigateToRestaurant(): { success: boolean; message: string } {
    console.log('Navigating to restaurant page');
    const event = new CustomEvent('navigate', { detail: { path: '/restaurant' } });
    window.dispatchEvent(event);
    if (this.onResponseCallback) {
      this.onResponseCallback('Opening restaurant menu!');
    }
    return { success: true, message: 'Navigated to restaurant page' };
  }

  private navigateToServices(): { success: boolean; message: string } {
    console.log('Navigating to services page');
    const event = new CustomEvent('navigate', { detail: { path: '/services' } });
    window.dispatchEvent(event);
    if (this.onResponseCallback) {
      this.onResponseCallback('Opening services page!');
    }
    return { success: true, message: 'Navigated to services page' };
  }

  private navigateToBooking(): { success: boolean; message: string } {
    console.log('Navigating to booking page');
    const event = new CustomEvent('navigate', { detail: { path: '/booking' } });
    window.dispatchEvent(event);
    if (this.onResponseCallback) {
      this.onResponseCallback('Opening booking page!');
    }
    return { success: true, message: 'Navigated to booking page' };
  }

  private scrollHomePage(direction: 'up' | 'down'): { success: boolean; message: string } {
    console.log('Scrolling home page:', direction);
    
    // Simulate arrow key press for keyboard navigation
    const event = new KeyboardEvent('keydown', {
      key: direction === 'down' ? 'ArrowDown' : 'ArrowUp',
      bubbles: true,
      cancelable: true
    });
    
    document.dispatchEvent(event);
    
    if (this.onResponseCallback) {
      this.onResponseCallback(`Scrolling ${direction} on home page!`);
    }
    
    return { success: true, message: `Scrolled ${direction} on home page` };
  }

  private async staySilent(): Promise<{ success: boolean; message: string }> {
    console.log('Staying silent - muting microphone');
    await this.mute();
    
    // Trigger the orb to update its state by dispatching a mute event
    const muteEvent = new CustomEvent('aiOrb:mute');
    window.dispatchEvent(muteEvent);
    
    if (this.onResponseCallback) {
      this.onResponseCallback('Going silent...');
    }
    return { success: true, message: 'Microphone muted' };
  }

  private autoMute(): void {
    console.log('Auto-muting due to external activity');
    setTimeout(async () => {
      await this.mute();
    }, 1000); // Delay to allow response to be heard
  }

  // Fan control methods
  private async turnOnFan(): Promise<{ success: boolean; message: string }> {
    const entityId = 'fan.fan';
    try {
      console.log('Turning on fan:', entityId);
      const result = await homeAssistantService.controlSmartPlug(entityId, true);
      if (this.onResponseCallback) {
        this.onResponseCallback('Fan turned on successfully!');
      }
      return result;
    } catch (error) {
      console.error('Failed to turn on fan:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      if (this.onResponseCallback) {
        this.onResponseCallback(`Failed to turn on fan: ${errorMessage}`);
      }
      return { success: false, message: errorMessage };
    }
  }

  private async turnOffFan(): Promise<{ success: boolean; message: string }> {
    const entityId = 'fan.fan';
    try {
      console.log('Turning off fan:', entityId);
      const result = await homeAssistantService.controlSmartPlug(entityId, false);
      if (this.onResponseCallback) {
        this.onResponseCallback('Fan turned off successfully!');
      }
      return result;
    } catch (error) {
      console.error('Failed to turn off fan:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      if (this.onResponseCallback) {
        this.onResponseCallback(`Failed to turn off fan: ${errorMessage}`);
      }
      return { success: false, message: errorMessage };
    }
  }

  private async getFanStatus(): Promise<{ success: boolean; message: string }> {
    const entityId = 'fan.fan';
    try {
      console.log('Getting fan status:', entityId);
      const entityState = await homeAssistantService.getEntityState(entityId);
      if (entityState) {
        const status = entityState.state === 'on' ? 'on' : 'off';
        const message = `Fan is currently ${status}`;
        if (this.onResponseCallback) {
          this.onResponseCallback(message);
        }
        return { success: true, message };
      } else {
        const errorMessage = 'Fan not found';
        if (this.onResponseCallback) {
          this.onResponseCallback(errorMessage);
        }
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Failed to get fan status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      if (this.onResponseCallback) {
        this.onResponseCallback(`Failed to get fan status: ${errorMessage}`);
      }
      return { success: false, message: errorMessage };
    }
  }

  private openYouTube(): { success: boolean; message: string } {
    console.log('Opening YouTube in new tab');
    const opened = window.open('https://www.youtube.com', '_blank');
    
    if (this.onResponseCallback) {
      this.onResponseCallback(opened ? 'YouTube opened successfully!' : 'Failed to open YouTube - please check your popup blocker');
    }
    
    return { 
      success: !!opened, 
      message: opened ? 'YouTube opened successfully' : 'Failed to open YouTube'
    };
  }

  private openNetflix(): { success: boolean; message: string } {
    console.log('Opening Netflix in new tab');
    const opened = window.open('https://www.netflix.com', '_blank');
    
    if (this.onResponseCallback) {
      this.onResponseCallback(opened ? 'Netflix opened successfully!' : 'Failed to open Netflix - please check your popup blocker');
    }
    
    return { 
      success: !!opened, 
      message: opened ? 'Netflix opened successfully' : 'Failed to open Netflix'
    };
  }

  private openPlex(): { success: boolean; message: string } {
    console.log('Opening Plex TV in new tab');
    const opened = window.open('https://app.plex.tv', '_blank');
    
    if (this.onResponseCallback) {
      this.onResponseCallback(opened ? 'Plex TV opened successfully!' : 'Failed to open Plex - please check your popup blocker');
    }
    
    return { 
      success: !!opened, 
      message: opened ? 'Plex TV opened successfully' : 'Failed to open Plex'
    };
  }

  private openYouTubeMusic(): { success: boolean; message: string } {
    console.log('Opening YouTube Music in new tab');
    const opened = window.open('https://music.youtube.com', '_blank');
    
    if (this.onResponseCallback) {
      this.onResponseCallback(opened ? 'YouTube Music opened successfully!' : 'Failed to open YouTube Music - please check your popup blocker');
    }
    
    return { 
      success: !!opened, 
      message: opened ? 'YouTube Music opened successfully' : 'Failed to open YouTube Music'
    };
  }

  private searchYouTube(query: string): { success: boolean; message: string } {
    console.log('Searching YouTube for:', query);
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const opened = window.open(searchUrl, '_blank');
    
    if (this.onResponseCallback) {
      this.onResponseCallback(opened ? `YouTube search for "${query}" opened!` : 'Failed to open YouTube search - please check your popup blocker');
    }
    
    return { 
      success: !!opened, 
      message: opened ? `YouTube search for "${query}" opened successfully` : 'Failed to open YouTube search'
    };
  }

  private playYouTubeVideo(query: string): { success: boolean; message: string } {
    console.log('Playing YouTube video for:', query);
    // For playing a video, we'll search and let the user click the first result
    // In a real implementation, you might use YouTube API to get the first video ID
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const opened = window.open(searchUrl, '_blank');
    
    if (this.onResponseCallback) {
      this.onResponseCallback(opened ? `YouTube search for "${query}" opened! Click the first result to play.` : 'Failed to open YouTube - please check your popup blocker');
    }
    
    return { 
      success: !!opened, 
      message: opened ? `YouTube video search for "${query}" opened successfully` : 'Failed to open YouTube video search'
    };
  }

  private async turnOnSmartPlug(): Promise<{ success: boolean; message: string }> {
    const entityId = 'switch.smart_plug';
    
    try {
      console.log('Turning on smart plug:', entityId);
      const result = await homeAssistantService.controlSmartPlug(entityId, true);
      
      if (this.onResponseCallback) {
        this.onResponseCallback('Smart plug turned on successfully!');
      }
      
      return result;
    } catch (error) {
      console.error('Failed to turn on smart plug:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (this.onResponseCallback) {
        this.onResponseCallback(`Failed to turn on smart plug: ${errorMessage}`);
      }
      
      return { success: false, message: errorMessage };
    }
  }

  private async turnOffSmartPlug(): Promise<{ success: boolean; message: string }> {
    const entityId = 'switch.smart_plug';
    
    try {
      console.log('Turning off smart plug:', entityId);
      const result = await homeAssistantService.controlSmartPlug(entityId, false);
      
      if (this.onResponseCallback) {
        this.onResponseCallback('Smart plug turned off successfully!');
      }
      
      return result;
    } catch (error) {
      console.error('Failed to turn off smart plug:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (this.onResponseCallback) {
        this.onResponseCallback(`Failed to turn off smart plug: ${errorMessage}`);
      }
      
      return { success: false, message: errorMessage };
    }
  }

  private async getSmartPlugStatus(): Promise<{ success: boolean; message: string }> {
    const entityId = 'switch.smart_plug';
    
    try {
      console.log('Getting smart plug status:', entityId);
      const entityState = await homeAssistantService.getEntityState(entityId);
      
      if (entityState) {
        const status = entityState.state === 'on' ? 'on' : 'off';
        const message = `Smart plug is currently ${status}`;
        
        if (this.onResponseCallback) {
          this.onResponseCallback(message);
        }
        
        return { success: true, message };
      } else {
        const errorMessage = 'Smart plug not found';
        
        if (this.onResponseCallback) {
          this.onResponseCallback(errorMessage);
        }
        
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Failed to get smart plug status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (this.onResponseCallback) {
        this.onResponseCallback(`Failed to get smart plug status: ${errorMessage}`);
      }
      
      return { success: false, message: errorMessage };
    }
  }

  // Restaurant function methods
  private showRestaurantCategory(category: string): { success: boolean; message: string } {
    console.log('Showing restaurant category:', category);
    const result = restaurantService.showCategory(category);
    
    if (this.onResponseCallback) {
      this.onResponseCallback(result.message);
    }
    
    return result;
  }

  private addItemToOrder(itemName: string, quantity: number = 1): { success: boolean; message: string } {
    console.log('Adding item to order:', itemName, 'quantity:', quantity);
    const result = restaurantService.addItemToOrder(itemName, quantity);
    
    if (this.onResponseCallback) {
      this.onResponseCallback(result.message);
    }
    
    return result;
  }

  private removeItemFromOrder(itemName: string): { success: boolean; message: string } {
    console.log('Removing item from order:', itemName);
    const result = restaurantService.removeItemFromOrder(itemName);
    
    if (this.onResponseCallback) {
      this.onResponseCallback(result.message);
    }
    
    return result;
  }

  private updateItemQuantity(itemName: string, quantity: number): { success: boolean; message: string } {
    console.log('Updating item quantity:', itemName, 'to', quantity);
    const result = restaurantService.updateItemQuantity(itemName, quantity);
    
    if (this.onResponseCallback) {
      this.onResponseCallback(result.message);
    }
    
    return result;
  }

  private addSpecialInstructions(itemName: string, instructions: string): { success: boolean; message: string } {
    console.log('Adding special instructions:', itemName, instructions);
    const result = restaurantService.addSpecialInstructions(itemName, instructions);
    
    if (this.onResponseCallback) {
      this.onResponseCallback(result.message);
    }
    
    return result;
  }

  private scrollMenu(direction: 'up' | 'down', amount: 'small' | 'medium' | 'large' = 'medium'): { success: boolean; message: string } {
    console.log('Scrolling menu:', direction, amount);
    const result = restaurantService.scrollMenu(direction, amount);
    
    if (this.onResponseCallback) {
      this.onResponseCallback(result.message);
    }
    
    return result;
  }

  private placeRestaurantOrder(roomNumber: string = "202"): { success: boolean; message: string } {
    console.log('Placing restaurant order for room:', roomNumber);
    const result = restaurantService.placeOrder(roomNumber || "202");
    
    if (this.onResponseCallback) {
      this.onResponseCallback(result.message);
    }
    
    return result;
  }

  private clearRestaurantOrder(): { success: boolean; message: string } {
    console.log('Clearing restaurant order');
    const result = restaurantService.clearOrder();
    
    if (this.onResponseCallback) {
      this.onResponseCallback(result.message);
    }
    
    return result;
  }

  private getOrderSummary(): { success: boolean; message: string } {
    console.log('Getting order summary');
    const result = restaurantService.getOrderSummary();
    
    if (this.onResponseCallback) {
      this.onResponseCallback(result.message);
    }
    
    return result;
  }

  private getRestaurantMenu(): { success: boolean; message: string } {
    console.log('Getting restaurant menu');
    const menu = restaurantService.getMenu();
    const categories = restaurantService.getCategories();
    
    const menuText = `Available menu categories: ${categories.join(', ')}. 
    Menu items: ${menu.map(item => `${item.name} ($${item.price}) - ${item.description}`).join(', ')}`;
    
    if (this.onResponseCallback) {
      this.onResponseCallback(`I have the full menu available. Categories include: ${categories.join(', ')}`);
    }
    
    return { 
      success: true, 
      message: menuText
    };
  }

  private async activateAgenticMode(task: string, contentType: string): Promise<{ success: boolean; message: string }> {
    console.log('Activating agentic mode for task:', task, 'type:', contentType);
    
    try {
      // Dispatch event to trigger agentic mode overlay
      const agenticEvent = new CustomEvent('activate-agentic-mode', {
        detail: { task, contentType }
      });
      window.dispatchEvent(agenticEvent);
      
      if (this.onResponseCallback) {
        this.onResponseCallback(`Generating ${contentType} for you...`);
      }
      
      return { 
        success: true, 
        message: `Agentic mode activated for ${contentType} generation` 
      };
    } catch (error) {
      console.error('Failed to activate agentic mode:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (this.onResponseCallback) {
        this.onResponseCallback(`Failed to activate agentic mode: ${errorMessage}`);
      }
      
      return { success: false, message: errorMessage };
    }
  }

  private async setupAudioInput(): Promise<void> {
    if (!this.inputAudioContext) return;

    try {
      // Double-check media devices support
      if (!this.checkMediaDevicesSupport()) {
        throw new Error('Media Devices API not available - microphone input disabled');
      }

      console.log('Requesting microphone access...');
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        },
      });

      console.log('Microphone access granted, setting up audio processing...');

      this.sourceNode = this.inputAudioContext.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(this.inputNode!);

      // Check for AudioWorklet support
      const supportsAudioWorklet = 'audioWorklet' in this.inputAudioContext;
      console.log('AudioWorklet supported:', supportsAudioWorklet);

      if (supportsAudioWorklet) {
        try {
          await this.inputAudioContext.audioWorklet.addModule('/audio-processor.js');
          this.audioWorkletNode = new AudioWorkletNode(this.inputAudioContext, 'audio-processor');
          
          this.audioWorkletNode.port.onmessage = (event) => {
            if (this.isMuted || !this.session) return;
            
            const pcmData = event.data;
            this.session.sendRealtimeInput({ media: createBlob(pcmData) });
          };

          this.sourceNode.connect(this.audioWorkletNode);
          this.audioWorkletNode.connect(this.inputAudioContext.destination);
          console.log('Using AudioWorkletNode for audio processing');
        } catch (error) {
          console.warn('AudioWorklet failed to load, falling back to ScriptProcessorNode:', error);
          this.setupFallbackAudioProcessing();
        }
      } else {
        console.log('AudioWorklet not supported, using ScriptProcessorNode fallback');
        this.setupFallbackAudioProcessing();
      }

      console.log('Audio input setup complete');
    } catch (error) {
      console.error('Error setting up audio input:', error);
      
      // Provide user-friendly error messages
      if (error instanceof Error) {
        if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          throw new Error('No microphone found. Please connect a microphone and try again.');
        } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          throw new Error('Microphone access denied. Please allow microphone access and try again.');
        } else if (error.name === 'NotSupportedError') {
          throw new Error('Microphone not supported in this browser. Please use a modern browser with HTTPS.');
        } else if (error.message.includes('Media Devices API')) {
          throw new Error('This browser does not support microphone access. Please use Chrome, Firefox, Safari, or Edge with HTTPS.');
        }
      }
      
      throw error;
    }
  }

  private setupFallbackAudioProcessing(): void {
    if (!this.sourceNode || !this.inputAudioContext) return;

    console.log('[Deprecation Warning] Using ScriptProcessorNode - consider upgrading to a browser that supports AudioWorkletNode');
    
    const bufferSize = 256;
    const scriptProcessor = this.inputAudioContext.createScriptProcessor(bufferSize, 1, 1);
    
    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
      if (this.isMuted || !this.session) return;
      const inputBuffer = audioProcessingEvent.inputBuffer;
      const pcmData = inputBuffer.getChannelData(0);
      this.session.sendRealtimeInput({ media: createBlob(pcmData) });
    };

    this.sourceNode.connect(scriptProcessor);
    scriptProcessor.connect(this.inputAudioContext.destination);
  }

  async mute(): Promise<void> {
    this.isMuted = true;
    console.log('Gemini Live audio muted');
  }

  async unmute(): Promise<void> {
    this.isMuted = false;
    console.log('Gemini Live audio unmuted');
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    try {
      // Stop audio stream
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop());
        this.mediaStream = null;
      }

      // Disconnect audio nodes
      if (this.audioWorkletNode && this.sourceNode) {
        this.audioWorkletNode.disconnect();
        this.sourceNode.disconnect();
      }

      // Stop all audio sources
      for (const source of this.sources.values()) {
        source.stop();
        this.sources.delete(source);
      }

      // Close session
      if (this.session) {
        this.session.close();
        this.session = null;
      }

      // Close audio contexts
      if (this.inputAudioContext) {
        await this.inputAudioContext.close();
        this.inputAudioContext = null;
      }
      if (this.outputAudioContext) {
        await this.outputAudioContext.close();
        this.outputAudioContext = null;
      }

      this.isConnected = false;
      this.isMuted = false;
      this.audioWorkletNode = null;
      this.sourceNode = null;
      this.inputNode = null;
      this.outputNode = null;
      this.onResponseCallback = undefined;

      console.log('Disconnected from Gemini Live');
    } catch (error) {
      console.error('Error disconnecting from Gemini Live:', error);
    }
  }

  getConnectionState(): { isConnected: boolean; isMuted: boolean } {
    return {
      isConnected: this.isConnected,
      isMuted: this.isMuted
    };
  }

  // Send a one-time greeting on the first connection per browser/user
  private async sendInitialGreetingIfNeeded(): Promise<void> {
    try {
      const flagKey = 'gemini_live_initial_greeting_sent';
      if (typeof window === 'undefined' || !window.localStorage) return;
      const sent = window.localStorage.getItem(flagKey);
      if (sent) return; // already sent in this browser

      const helloText = 'Hello! I am your hotel room assistant. How can I help you today?';

      // Attempt to send a text message via the session. Different SDKs expose
      // different methods; try a few common ones gracefully.
      await this.sendTextToSession(helloText);

      window.localStorage.setItem(flagKey, '1');
    } catch (err) {
      console.warn('Failed to send initial greeting:', err);
    }
  }

  // Helper: send a text message to the live session using available APIs.
  private async sendTextToSession(text: string): Promise<void> {
    if (!this.session) return;

    // Try common method names used by streaming/live SDKs.
    // If none exist, send a tool response with a fake function to surface text.
    try {
      type LiveSessionLike = {
        sendMessage?: (payload: { text?: string }) => Promise<unknown> | void;
        sendText?: (text: string) => Promise<unknown> | void;
        send?: (payload: unknown) => Promise<unknown> | void;
        sendToolResponse?: (payload: unknown) => void;
      };

      const s = this.session as unknown as LiveSessionLike;

      if (typeof s.sendMessage === 'function') {
        await s.sendMessage({ text });
        return;
      }

      if (typeof s.sendText === 'function') {
        await s.sendText(text);
        return;
      }

      if (typeof s.send === 'function') {
        await s.send({ text });
        return;
      }

      // Fallback: if session supports sendToolResponse, send a synthetic tool response
      // that may be interpreted as an assistant message.
      if (typeof s.sendToolResponse === 'function') {
        try {
          s.sendToolResponse({
            functionResponses: [{ id: 'initial_greeting', name: 'initial_greeting', response: { success: true, message: text } }]
          });
        } catch (e) {
          // ignore
        }
        return;
      }
    } catch (error) {
      console.warn('Error while sending text to session:', error);
    }
  }
}

export const geminiLiveService = new GeminiLiveAudioService();
