// Dynamic imports to avoid SSR issues
// import { SpeechRecognition } from '@capacitor-community/speech-recognition';
// import { Capacitor } from '@capacitor/core';
import type { SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '@/types/speech';

export interface SpeechRecognitionOptions {
  language?: string;
  maxResults?: number;
  prompt?: string;
  partialResults?: boolean;
  popup?: boolean;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

export class NativeSpeechRecognitionService {
  private static instance: NativeSpeechRecognitionService;
  private isNativeAvailable: boolean = false;
  private isListening: boolean = false;

  static getInstance(): NativeSpeechRecognitionService {
    if (!NativeSpeechRecognitionService.instance) {
      NativeSpeechRecognitionService.instance = new NativeSpeechRecognitionService();
    }
    return NativeSpeechRecognitionService.instance;
  }

  constructor() {
    // Constructor is now empty to avoid SSR issues
    // Initialization will happen on first use
  }

  private async initializeSpeechRecognition() {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const { Capacitor } = await import('@capacitor/core');
      this.isNativeAvailable = Capacitor.isNativePlatform();
      
      if (this.isNativeAvailable) {
        const { SpeechRecognition } = await import('@capacitor-community/speech-recognition');
        // 権限の確認と要求
        const permission = await SpeechRecognition.requestPermissions();
        if (permission.speechRecognition === 'granted') {
          console.log('Native Speech Recognition initialized');
        } else {
          console.warn('Speech recognition permission denied');
          this.isNativeAvailable = false;
        }
      }
    } catch (error) {
      console.error('Failed to initialize native speech recognition:', error);
      this.isNativeAvailable = false;
    }
  }

  async startListening(
    options: SpeechRecognitionOptions = {}
  ): Promise<SpeechRecognitionResult[]> {
    if (this.isListening) {
      throw new Error('Already listening');
    }

    // Initialize on first use
    if (!this.isNativeAvailable && typeof window !== 'undefined') {
      await this.initializeSpeechRecognition();
    }

    this.isListening = true;

    try {
      if (this.isNativeAvailable) {
        return await this.startNativeListening(options);
      } else {
        return await this.startWebListening(options);
      }
    } finally {
      this.isListening = false;
    }
  }

  private async startNativeListening(
    options: SpeechRecognitionOptions
  ): Promise<SpeechRecognitionResult[]> {
    const { SpeechRecognition } = await import('@capacitor-community/speech-recognition');
    
    try {
      const nativeOptions = {
        language: options.language || 'zh-CN',
        maxResults: options.maxResults || 5,
        prompt: options.prompt || '中国語で話してください',
        partialResults: options.partialResults ?? false,
        popup: options.popup ?? true,
      };

      console.log('Starting native speech recognition:', nativeOptions);
      
      const result = await SpeechRecognition.start(nativeOptions);
      
      if (result && result.matches) {
        return result.matches.map((match: string, index: number) => ({
          transcript: match,
          confidence: 1.0 - (index * 0.1), // 最初の結果ほど信頼度を高く
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Native speech recognition failed:', error);
      throw error;
    }
  }

  private async startWebListening(
    options: SpeechRecognitionOptions
  ): Promise<SpeechRecognitionResult[]> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window))) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      const SpeechRecognitionAPI = 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = options.language || 'zh-CN';
      recognition.interimResults = options.partialResults ?? false;
      recognition.maxAlternatives = options.maxResults || 5;
      recognition.continuous = false;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const results: SpeechRecognitionResult[] = [];
        
        for (let i = 0; i < event.results.length; i++) {
          for (let j = 0; j < event.results[i].length; j++) {
            results.push({
              transcript: event.results[i][j].transcript,
              confidence: event.results[i][j].confidence,
            });
          }
        }
        
        resolve(results);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Web speech recognition error:', event.error);
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      recognition.onend = () => {
        console.log('Web speech recognition ended');
      };

      console.log('Starting web speech recognition');
      recognition.start();
    });
  }

  async stopListening(): Promise<void> {
    if (!this.isListening) {
      return;
    }

    try {
      if (this.isNativeAvailable) {
        const { SpeechRecognition } = await import('@capacitor-community/speech-recognition');
        await SpeechRecognition.stop();
      }
      // Web Speech APIは自動的に停止される
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
    } finally {
      this.isListening = false;
    }
  }

  async checkAvailability(): Promise<boolean> {
    if (this.isNativeAvailable) {
      try {
        const { SpeechRecognition } = await import('@capacitor-community/speech-recognition');
        const available = await SpeechRecognition.available();
        return available.available;
      } catch (error) {
        console.error('Failed to check native speech recognition availability:', error);
        return false;
      }
    } else {
      return typeof window !== 'undefined' && (('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window));
    }
  }

  isNativeSupported(): boolean {
    return this.isNativeAvailable;
  }

  getCurrentlyListening(): boolean {
    return this.isListening;
  }
}