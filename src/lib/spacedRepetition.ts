import { StudyProgress } from '@/types/vocabulary';

export class SpacedRepetitionSystem {
  private static readonly REVIEW_INTERVALS = [
    5 * 60 * 1000,      // 5分
    60 * 60 * 1000,     // 1時間
    10 * 60 * 60 * 1000, // 10時間
    2 * 24 * 60 * 60 * 1000, // 2日
    7 * 24 * 60 * 60 * 1000, // 1週間
    30 * 24 * 60 * 60 * 1000, // 1ヶ月
  ];

  static calculateNextReview(
    progress: StudyProgress,
    isCorrect: boolean
  ): { nextReview: Date; reviewInterval: number } {
    const now = new Date();
    let newInterval: number;

    if (isCorrect) {
      const currentLevel = this.getIntervalLevel(progress.reviewInterval);
      const nextLevel = Math.min(currentLevel + 1, this.REVIEW_INTERVALS.length - 1);
      newInterval = this.REVIEW_INTERVALS[nextLevel];
    } else {
      newInterval = this.REVIEW_INTERVALS[0];
    }

    const nextReview = new Date(now.getTime() + newInterval);
    
    return {
      nextReview,
      reviewInterval: newInterval,
    };
  }

  private static getIntervalLevel(currentInterval: number): number {
    for (let i = 0; i < this.REVIEW_INTERVALS.length; i++) {
      if (currentInterval <= this.REVIEW_INTERVALS[i]) {
        return i;
      }
    }
    return this.REVIEW_INTERVALS.length - 1;
  }

  static isDueForReview(progress: StudyProgress): boolean {
    const now = new Date();
    return now >= progress.nextReview;
  }

  static createInitialProgress(vocabularyId: string): StudyProgress {
    const now = new Date();
    return {
      vocabularyId,
      correctCount: 0,
      incorrectCount: 0,
      lastStudied: now,
      nextReview: now,
      reviewInterval: 0,
    };
  }

  static updateProgress(
    progress: StudyProgress,
    isCorrect: boolean
  ): StudyProgress {
    const { nextReview, reviewInterval } = this.calculateNextReview(progress, isCorrect);
    
    return {
      ...progress,
      correctCount: progress.correctCount + (isCorrect ? 1 : 0),
      incorrectCount: progress.incorrectCount + (isCorrect ? 0 : 1),
      lastStudied: new Date(),
      nextReview,
      reviewInterval,
    };
  }

  static getVocabularyPriority(progress: StudyProgress[]): string[] {
    const now = new Date();
    
    const dueWords = progress
      .filter(p => this.isDueForReview(p))
      .sort((a, b) => {
        const aPriority = this.calculatePriority(a, now);
        const bPriority = this.calculatePriority(b, now);
        return bPriority - aPriority;
      });

    return dueWords.map(p => p.vocabularyId);
  }

  private static calculatePriority(progress: StudyProgress, now: Date): number {
    const timeSinceReview = now.getTime() - progress.nextReview.getTime();
    const errorRate = progress.incorrectCount / Math.max(1, progress.correctCount + progress.incorrectCount);
    
    return timeSinceReview + (errorRate * 1000 * 60 * 60);
  }
}