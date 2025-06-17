'use client';

import { useState } from 'react';
import { NativeSpeechRecognitionService } from '@/lib/nativeSpeechRecognition';

interface VoiceAnswerButtonProps {
  correctAnswers: string[];
  onVoiceResult: (isCorrect: boolean, recognizedText: string) => void;
  disabled?: boolean;
}

export default function VoiceAnswerButton({ 
  correctAnswers, 
  onVoiceResult, 
  disabled = false 
}: VoiceAnswerButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognitionService] = useState(() => NativeSpeechRecognitionService.getInstance());

  const handleVoiceInput = async () => {
    const isAvailable = await recognitionService.checkAvailability();
    if (!isAvailable) {
      alert('お使いのデバイスは音声認識をサポートしていません。');
      return;
    }

    setIsListening(true);

    try {
      const results = await recognitionService.startListening({
        language: 'zh-CN',
        maxResults: 5,
        prompt: '中国語で発音してください',
        partialResults: false,
        popup: true,
      });
      
      if (results && results.length > 0) {
        const bestResult = findBestMatch(results, correctAnswers);
        onVoiceResult(bestResult.isCorrect, bestResult.transcript);
      } else {
        onVoiceResult(false, '認識できませんでした');
      }
    } catch (error) {
      console.error('Voice recognition error:', error);
      alert('音声認識中にエラーが発生しました。もう一度お試しください。');
      onVoiceResult(false, 'エラー');
    } finally {
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    await recognitionService.stopListening();
    setIsListening(false);
  };

  // 音声認識結果と正解を比較
  const findBestMatch = (results: { transcript: string; confidence: number }[], correctAnswers: string[]) => {
    let bestMatch = results[0]?.transcript || '';
    let isCorrect = false;
    let highestScore = 0;

    for (const result of results) {
      for (const correct of correctAnswers) {
        const score = calculateSimilarity(result.transcript, correct);
        if (score > highestScore) {
          highestScore = score;
          bestMatch = result.transcript;
          isCorrect = score > 0.7; // 70%以上の類似度で正解とする
        }
      }
    }

    return { isCorrect, transcript: bestMatch };
  };

  // 文字列の類似度を計算（簡易版）
  const calculateSimilarity = (str1: string, str2: string): number => {
    const s1 = str1.toLowerCase().replace(/[^\u4e00-\u9fff\w]/g, '');
    const s2 = str2.toLowerCase().replace(/[^\u4e00-\u9fff\w]/g, '');
    
    if (s1 === s2) return 1.0;
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;
    
    // Levenshtein距離による類似度計算
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
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
  };

  // ネイティブサポートの確認は動的に行うため、常にボタンを表示

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={isListening ? stopListening : handleVoiceInput}
        disabled={disabled}
        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isListening
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {isListening ? (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            録音中... クリックで停止
          </span>
        ) : (
          <span className="flex items-center gap-2">
            🎤 音声で回答
          </span>
        )}
      </button>
      
      {isListening && (
        <p className="text-sm text-gray-600 text-center">
          中国語で発音してください
        </p>
      )}
    </div>
  );
}