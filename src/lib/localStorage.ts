import { StudyProgress } from '@/types/vocabulary';

export class LocalStorageService {
  private static readonly PROGRESS_KEY = 'cn-vocab-progress';
  private static readonly SETTINGS_KEY = 'cn-vocab-settings';

  static saveProgress(progress: StudyProgress[]): void {
    if (typeof window === 'undefined') return;
    try {
      const serializedProgress = progress.map(p => ({
        ...p,
        lastStudied: p.lastStudied.toISOString(),
        nextReview: p.nextReview.toISOString(),
      }));
      localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(serializedProgress));
    } catch (error) {
      console.error('Failed to save progress to localStorage:', error);
    }
  }

  static loadProgress(): StudyProgress[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(this.PROGRESS_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      return parsed.map((p: {
        vocabularyId: string;
        correctCount: number;
        incorrectCount: number;
        lastStudied: string;
        nextReview: string;
        reviewInterval: number;
      }) => ({
        ...p,
        lastStudied: new Date(p.lastStudied),
        nextReview: new Date(p.nextReview),
      }));
    } catch (error) {
      console.error('Failed to load progress from localStorage:', error);
      return [];
    }
  }

  static getProgressForVocabulary(vocabularyId: string): StudyProgress | null {
    const allProgress = this.loadProgress();
    return allProgress.find(p => p.vocabularyId === vocabularyId) || null;
  }

  static updateVocabularyProgress(progress: StudyProgress): void {
    const allProgress = this.loadProgress();
    const existingIndex = allProgress.findIndex(p => p.vocabularyId === progress.vocabularyId);
    
    if (existingIndex >= 0) {
      allProgress[existingIndex] = progress;
    } else {
      allProgress.push(progress);
    }
    
    this.saveProgress(allProgress);
  }

  static saveSettings(settings: Record<string, unknown>): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  }

  static loadSettings(): Record<string, unknown> | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
      return null;
    }
  }

  static clearAllData(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(this.PROGRESS_KEY);
      localStorage.removeItem(this.SETTINGS_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}