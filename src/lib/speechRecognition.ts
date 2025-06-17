/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      length: number;
    };
  };
}

interface SpeechRecognitionError {
  error: string;
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.isSupported = true;
        this.setupRecognition();
      }
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'zh-CN';
    this.recognition.maxAlternatives = 3;
  }

  isRecognitionSupported(): boolean {
    return this.isSupported;
  }

  async startRecognition(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const results: string[] = [];
        for (let i = 0; i < event.results[0].length; i++) {
          results.push(event.results[0][i].transcript);
        }
        resolve(results);
      };

      this.recognition.onerror = (event: SpeechRecognitionError) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.start();
    });
  }

  stopRecognition() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  findBestMatch(recognizedOptions: string[], correctOptions: string[]): {
    bestMatch: string;
    confidence: number;
    isCorrect: boolean;
  } {
    let bestMatch = '';
    let highestScore = 0;

    for (const recognized of recognizedOptions) {
      for (const correct of correctOptions) {
        const similarity = this.calculateSimilarity(recognized, correct);
        if (similarity > highestScore) {
          highestScore = similarity;
          bestMatch = recognized;
        }
      }
    }

    return {
      bestMatch,
      confidence: highestScore,
      isCorrect: highestScore > 0.7,
    };
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    return (longer.length - this.levenshteinDistance(longer, shorter)) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}