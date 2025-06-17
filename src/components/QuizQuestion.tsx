'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuizQuestion as QuizQuestionType, QuizSettings } from '@/types/vocabulary';
import VoiceAnswerButton from './VoiceAnswerButton';

interface QuizQuestionProps {
  question: QuizQuestionType;
  settings: QuizSettings;
  onAnswer: (selectedAnswer: number, isCorrect: boolean) => void;
  onPlayAudio: () => void;
  onPlayExample: () => void;
  onNextQuestion: () => void;
}

export default function QuizQuestion({ question, settings, onAnswer, onPlayAudio, onPlayExample, onNextQuestion }: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // 新しい問題が来た時に状態をリセット
  useEffect(() => {
    console.log('Question changed, resetting state:', question.id);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(30);
  }, [question.id]);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    const isCorrect = answerIndex === question.correctAnswer;
    
    // 即座にスコア更新と音声再生
    onAnswer(answerIndex, isCorrect);
    
    // 単語音声を即座に再生
    onPlayAudio();
    
    // 少し間をおいて例文も再生
    setTimeout(() => {
      onPlayExample();
    }, 1500);
  }, [showResult, onAnswer, onPlayAudio, onPlayExample, question.correctAnswer]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (selectedAnswer === null) {
            handleAnswer(-1);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedAnswer, handleAnswer]);


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">HSK {question.vocabulary.hskLevel}</div>
        <div className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-blue-600'}`}>
          {timeLeft}s
        </div>
      </div>
      
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {question.question}
        </h2>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onPlayAudio}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            🔊 単語音声
          </button>
          <button
            onClick={onPlayExample}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
          >
            📖 例文音声
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          const optionVocab = question.optionVocabularies[index];
          
          let buttonClass = 'p-4 text-lg border-2 rounded-lg transition-all duration-200 ';
          
          if (showResult) {
            if (isCorrect) {
              buttonClass += 'bg-green-100 border-green-500 text-green-800';
            } else if (isSelected && !isCorrect) {
              buttonClass += 'bg-red-100 border-red-500 text-red-800';
            } else {
              buttonClass += 'bg-gray-100 border-gray-300 text-gray-600';
            }
          } else {
            buttonClass += isSelected 
              ? 'bg-blue-100 border-blue-500 text-blue-800' 
              : 'bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-gray-400';
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              className={buttonClass}
            >
              <div className="text-center">
                {settings.showChinese && (
                  <div className="text-xl font-bold mb-1">{option}</div>
                )}
                {settings.showPinyin && optionVocab && (
                  <div className="text-sm text-gray-600">{optionVocab.pinyin}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {!showResult && (
        <div className="text-center mt-6">
          <VoiceAnswerButton
            correctAnswers={[question.vocabulary.chinese, question.vocabulary.pinyin]}
            onVoiceResult={(isCorrect, recognizedText) => {
              console.log('Voice result:', { isCorrect, recognizedText });
              handleAnswer(isCorrect ? question.correctAnswer : -1);
            }}
            disabled={showResult}
          />
        </div>
      )}

      {showResult && (
        <div className="text-center">
          <div className={`text-lg font-bold mb-4 ${
            selectedAnswer === question.correctAnswer ? 'text-green-600' : 'text-red-600'
          }`}>
            {selectedAnswer === question.correctAnswer ? '正解！' : '不正解'}
          </div>
          <div className="text-gray-700 mb-6">
            <div className="mb-2">
              <span className="font-semibold">正解:</span> {question.vocabulary.chinese} ({question.vocabulary.pinyin})
            </div>
            <div className="text-sm">
              <span className="font-semibold">例文:</span> {question.vocabulary.example}
            </div>
            <div className="text-sm text-gray-600">
              {question.vocabulary.examplePinyin}
            </div>
            {question.vocabulary.exampleJapanese && (
              <div className="text-sm text-gray-700 mt-1">
                <span className="font-semibold">和訳:</span> {question.vocabulary.exampleJapanese}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={onPlayAudio}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              🔊 単語音声
            </button>
            <button
              onClick={onPlayExample}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
            >
              📖 例文音声
            </button>
            <button
              onClick={onNextQuestion}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              次の問題 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}