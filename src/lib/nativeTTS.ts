// Dynamic imports to avoid SSR issues
// import { TextToSpeech } from '@capacitor-community/text-to-speech';
// import { Capacitor } from '@capacitor/core';

export interface TTSOptions {
  text: string;
  language?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: number;
}

export class NativeTTSService {
  private static instance: NativeTTSService;
  private isNativeAvailable: boolean = false;
  private supportedVoices: SpeechSynthesisVoice[] = [];

  static getInstance(): NativeTTSService {
    if (!NativeTTSService.instance) {
      NativeTTSService.instance = new NativeTTSService();
    }
    return NativeTTSService.instance;
  }

  constructor() {
    // Constructor is now empty to avoid SSR issues
    // Initialization will happen on first use
  }

  private async initializeTTS() {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const { Capacitor } = await import('@capacitor/core');
      this.isNativeAvailable = Capacitor.isNativePlatform();
      
      if (this.isNativeAvailable) {
        const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
        // ネイティブプラットフォームでサポートされている音声を取得
        const voices = await TextToSpeech.getSupportedVoices();
        this.supportedVoices = voices.voices || [];
        
        console.log('Native TTS initialized');
        console.log('Supported voices:', this.supportedVoices);
      }
    } catch (error) {
      console.error('Failed to initialize native TTS:', error);
      this.isNativeAvailable = false;
    }
  }

  async speak(options: TTSOptions): Promise<void> {
    // Initialize on first use
    if (!this.isNativeAvailable && typeof window !== 'undefined') {
      await this.initializeTTS();
    }

    if (this.isNativeAvailable) {
      try {
        // ネイティブTTSを使用
        await this.speakNative(options);
      } catch (error) {
        console.error('Native TTS failed, falling back to Web Speech API:', error);
        // フォールバックとしてWeb Speech APIを使用
        this.speakWebAPI(options);
      }
    } else {
      // WebブラウザではWeb Speech APIを使用
      this.speakWebAPI(options);
    }
  }

  private async speakNative(options: TTSOptions): Promise<void> {
    const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
    
    // 中国語音声を検索
    const chineseVoice = this.findChineseVoice();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ttsOptions: any = {
      text: options.text,
      lang: options.language || 'zh-CN',
      rate: options.rate || 0.75,
      pitch: options.pitch || 1.0,
      volume: options.volume || 1.0,
      voice: chineseVoice?.voiceURI,
      category: 'ambient', // iOS用
    };

    console.log('Speaking with native TTS:', ttsOptions);
    await TextToSpeech.speak(ttsOptions);
  }

  private speakWebAPI(options: TTSOptions): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(options.text);
      utterance.lang = options.language || 'zh-CN';
      utterance.rate = options.rate || 0.75;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      // Web Speech APIの中国語音声を設定
      const voices = speechSynthesis.getVoices();
      const chineseVoice = voices.find(voice => 
        voice.lang.startsWith('zh') && 
        (voice.name.includes('Ting-Ting') || voice.name.includes('Female') || voice.name.includes('中文'))
      );
      
      if (chineseVoice) {
        utterance.voice = chineseVoice;
      }

      speechSynthesis.speak(utterance);
    }
  }

  private findChineseVoice(): SpeechSynthesisVoice | null {
    // 中国語音声を優先順位で検索
    const chineseKeywords = [
      'zh-CN', 'zh-TW', 'zh-HK', 'Chinese', '中文', 'Mandarin',
      'Ting-Ting', 'Sin-ji', 'Mei-Jia', 'Xiaoxiao', 'Xiaoyi'
    ];

    for (const keyword of chineseKeywords) {
      const voice = this.supportedVoices.find(v => 
        v.lang?.includes(keyword) || 
        v.name?.includes(keyword) ||
        v.voiceURI?.includes(keyword)
      );
      if (voice) {
        console.log('Selected Chinese voice:', voice);
        return voice;
      }
    }

    console.log('No Chinese voice found, using default');
    return this.supportedVoices[0];
  }

  async stop(): Promise<void> {
    if (this.isNativeAvailable) {
      try {
        const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
        await TextToSpeech.stop();
      } catch (error) {
        console.error('Failed to stop native TTS:', error);
      }
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    }
  }

  async getSupportedVoices(): Promise<SpeechSynthesisVoice[]> {
    if (this.isNativeAvailable) {
      return this.supportedVoices;
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        return speechSynthesis.getVoices();
      }
    }
    return [];
  }

  isNativeSupported(): boolean {
    return this.isNativeAvailable;
  }
}