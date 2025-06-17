import { VocabularyItem, QuizQuestion } from '@/types/vocabulary';

export class QuizGenerator {
  static generateQuizQuestion(
    targetVocabulary: VocabularyItem,
    allVocabulary: VocabularyItem[]
  ): QuizQuestion {
    const optionVocabularies = this.generateOptionVocabularies(targetVocabulary, allVocabulary);
    const correctAnswer = Math.floor(Math.random() * 4);
    
    // 正解を正しい位置に配置
    optionVocabularies[correctAnswer] = targetVocabulary;
    
    return {
      id: `quiz_${targetVocabulary.id}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      question: targetVocabulary.japanese,
      options: optionVocabularies.map(v => v.chinese),
      correctAnswer,
      vocabulary: targetVocabulary,
      optionVocabularies, // 拼音表示用に追加
    };
  }

  private static generateOptionVocabularies(
    correct: VocabularyItem,
    allVocabulary: VocabularyItem[]
  ): VocabularyItem[] {
    // 正解を除外した候補リストを作成
    const candidates = allVocabulary.filter(v => 
      v.id !== correct.id && 
      v.chinese !== correct.chinese && 
      v.pinyin !== correct.pinyin
    );
    
    // 同じHSKレベルから優先的に選択
    const sameLevel = candidates.filter(v => v.hskLevel === correct.hskLevel);
    const otherLevels = candidates.filter(v => v.hskLevel !== correct.hskLevel);
    
    // 重複を避けながら3つの選択肢を選出
    const selectedOptions: VocabularyItem[] = [];
    const usedChinese = new Set<string>();
    const usedPinyin = new Set<string>();
    
    // 同じレベルから優先選択
    const priorityList = [...this.shuffleArray(sameLevel), ...this.shuffleArray(otherLevels)];
    
    for (const candidate of priorityList) {
      if (selectedOptions.length >= 3) break;
      
      // 漢字と拼音の重複チェック
      if (!usedChinese.has(candidate.chinese) && !usedPinyin.has(candidate.pinyin)) {
        selectedOptions.push(candidate);
        usedChinese.add(candidate.chinese);
        usedPinyin.add(candidate.pinyin);
      }
    }
    
    // 足りない場合のフォールバック
    while (selectedOptions.length < 3 && candidates.length > selectedOptions.length) {
      const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
      if (!selectedOptions.some(v => v.id === randomCandidate.id)) {
        selectedOptions.push(randomCandidate);
      }
    }
    
    // 4つにパディング（正解が後で挿入される）
    while (selectedOptions.length < 4) {
      selectedOptions.push(selectedOptions[0] || correct);
    }
    
    return selectedOptions.slice(0, 4);
  }

  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static generateQuizSequence(
    vocabulary: VocabularyItem[],
    count: number = 10
  ): QuizQuestion[] {
    const shuffled = this.shuffleArray(vocabulary);
    return shuffled.slice(0, count).map(vocab => 
      this.generateQuizQuestion(vocab, vocabulary)
    );
  }
}