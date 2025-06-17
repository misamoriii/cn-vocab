export interface VocabularyItem {
  id: string;
  japanese: string;
  chinese: string;
  pinyin: string;
  example: string;
  examplePinyin: string;
  exampleJapanese?: string;
  hskLevel: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  vocabulary: VocabularyItem;
  optionVocabularies: VocabularyItem[];
}

export interface StudyProgress {
  vocabularyId: string;
  correctCount: number;
  incorrectCount: number;
  lastStudied: Date;
  nextReview: Date;
  reviewInterval: number;
}

export interface QuizSettings {
  showPinyin: boolean;
  showChinese: boolean;
  hskLevel: number;
}