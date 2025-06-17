'use client';

import { useState, useEffect } from 'react';
import QuizQuestion from '@/components/QuizQuestion';
import SettingsPanel from '@/components/SettingsPanel';
import VoiceSettings from '@/components/VoiceSettings';
import { VocabularyItem, QuizQuestion as QuizQuestionType, QuizSettings } from '@/types/vocabulary';
import { GoogleSheetsService } from '@/lib/googleSheets';
import { QuizGenerator } from '@/lib/quizGenerator';
import { SpacedRepetitionSystem } from '@/lib/spacedRepetition';
import { LocalStorageService } from '@/lib/localStorage';
import { NativeTTSService } from '@/lib/nativeTTS';

export default function Home() {
  const [vocabularyData, setVocabularyData] = useState<VocabularyItem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<QuizSettings>({
    showPinyin: true,
    showChinese: true,
    hskLevel: 1,
  });
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showSettings, setShowSettings] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [speechInitialized, setSpeechInitialized] = useState(false);
  const [chineseVoice, setChineseVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [ttsService, setTtsService] = useState<NativeTTSService | null>(null);

  // ネイティブTTSサービスの初期化
  useEffect(() => {
    if (typeof window !== 'undefined' && !ttsService) {
      setTtsService(NativeTTSService.getInstance());
    }
  }, [ttsService]);

  // 音声エンジンの初期化と中国語音声の選択
  useEffect(() => {
    if ('speechSynthesis' in window && !speechInitialized) {
      const initializeSpeech = () => {
        const voices = speechSynthesis.getVoices();
        
        // 中国語の女性音声を優先順位で選択
        const chineseVoiceOptions = [
          // iOS/Safari用
          'Ting-Ting',
          'Sin-ji',
          // Chrome/Edge用
          'Google 中文 (中国大陆)',
          'Microsoft Huihui - Chinese (Simplified)',
          'Microsoft Yaoyao - Chinese (Simplified)', 
          // Android用
          'Chinese (China)',
          'zh-CN-XiaoxiaoNeural',
          'zh-CN-XiaoyiNeural',
          // その他
          'Chinese Female'
        ];
        
        let selectedVoice = null;
        
        // 優先順位で音声を検索
        for (const voiceName of chineseVoiceOptions) {
          selectedVoice = voices.find(voice => 
            voice.name.includes(voiceName) || 
            (voice.lang.includes('zh') && voice.name.toLowerCase().includes('female'))
          );
          if (selectedVoice) break;
        }
        
        // 中国語音声が見つからない場合は言語で検索
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.lang.startsWith('zh') || voice.lang.includes('CN')
          );
        }
        
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
        console.log('Selected Chinese voice:', selectedVoice?.name, selectedVoice?.lang);
        
        setChineseVoice(selectedVoice || null);
        
        // 音声エンジンを初期化するため空の音声を再生
        const utterance = new SpeechSynthesisUtterance('');
        utterance.volume = 0;
        if (selectedVoice) utterance.voice = selectedVoice;
        speechSynthesis.speak(utterance);
        
        setSpeechInitialized(true);
      };
      
      // 音声リストが読み込まれるまで待機
      if (speechSynthesis.getVoices().length > 0) {
        initializeSpeech();
      } else {
        speechSynthesis.onvoiceschanged = initializeSpeech;
      }
    }
  }, [speechInitialized]);

  useEffect(() => {
    const init = async () => {
      const sheetsService = GoogleSheetsService.getInstance();
      const spreadsheetId = process.env.NEXT_PUBLIC_SPREADSHEET_ID || '';
      
      if (!spreadsheetId) {
        console.error('Spreadsheet ID not configured');
        setLoading(false);
        return;
      }

      try {
        const data = await sheetsService.fetchVocabularyData(spreadsheetId);
        setVocabularyData(data);
        if (data.length > 0) {
          const levelVocabulary = data.filter(v => v.hskLevel === settings.hskLevel);
          if (levelVocabulary.length === 0) return;
          
          const randomVocab = levelVocabulary[Math.floor(Math.random() * levelVocabulary.length)];
          const question = QuizGenerator.generateQuizQuestion(randomVocab, data);
          setCurrentQuestion(question);
        }
      } catch (error) {
        console.error('Failed to load vocabulary data:', error);
      } finally {
        setLoading(false);
      }
    };

    const savedSettings = LocalStorageService.loadSettings();
    if (savedSettings && 
        typeof savedSettings.showPinyin === 'boolean' &&
        typeof savedSettings.showChinese === 'boolean' &&
        typeof savedSettings.hskLevel === 'number') {
      setSettings(savedSettings as unknown as QuizSettings);
    }
    
    init();
  }, [settings.hskLevel]);

  useEffect(() => {
    if (vocabularyData.length > 0) {
      const levelVocabulary = vocabularyData.filter(v => v.hskLevel === settings.hskLevel);
      if (levelVocabulary.length === 0) return;
      
      const allProgress = LocalStorageService.loadProgress();
      const priorityIds = SpacedRepetitionSystem.getVocabularyPriority(allProgress);
      
      let selectedVocab: VocabularyItem;
      if (priorityIds.length > 0) {
        const priorityVocab = levelVocabulary.find(v => priorityIds.includes(v.id));
        selectedVocab = priorityVocab || levelVocabulary[Math.floor(Math.random() * levelVocabulary.length)];
      } else {
        selectedVocab = levelVocabulary[Math.floor(Math.random() * levelVocabulary.length)];
      }
      
      const question = QuizGenerator.generateQuizQuestion(selectedVocab, vocabularyData);
      setCurrentQuestion(question);
    }
  }, [settings.hskLevel, vocabularyData]);

  const generateNewQuestion = () => {
    if (vocabularyData.length === 0) return;
    
    const levelVocabulary = vocabularyData.filter(v => v.hskLevel === settings.hskLevel);
    if (levelVocabulary.length === 0) return;
    
    const allProgress = LocalStorageService.loadProgress();
    const priorityIds = SpacedRepetitionSystem.getVocabularyPriority(allProgress);
    
    let selectedVocab: VocabularyItem;
    if (priorityIds.length > 0) {
      const priorityVocab = levelVocabulary.find(v => priorityIds.includes(v.id));
      selectedVocab = priorityVocab || levelVocabulary[Math.floor(Math.random() * levelVocabulary.length)];
    } else {
      selectedVocab = levelVocabulary[Math.floor(Math.random() * levelVocabulary.length)];
    }
    
    const question = QuizGenerator.generateQuizQuestion(selectedVocab, vocabularyData);
    console.log('Generated new question:', question.id, question.question);
    setCurrentQuestion(question);
  };

  const handleAnswer = (selectedAnswer: number, isCorrect: boolean) => {
    if (!currentQuestion) return;
    
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    const existingProgress = LocalStorageService.getProgressForVocabulary(currentQuestion.vocabulary.id);
    const currentProgress = existingProgress || SpacedRepetitionSystem.createInitialProgress(currentQuestion.vocabulary.id);
    const updatedProgress = SpacedRepetitionSystem.updateProgress(currentProgress, isCorrect);
    LocalStorageService.updateVocabularyProgress(updatedProgress);
  };

  const handleNextQuestion = () => {
    console.log('Next question requested');
    console.log('Current vocabulary data length:', vocabularyData.length);
    console.log('Current HSK level:', settings.hskLevel);
    try {
      generateNewQuestion();
      console.log('New question generated successfully');
    } catch (error) {
      console.error('Error generating new question:', error);
    }
  };

  const playAudio = async () => {
    if (currentQuestion && ttsService) {
      try {
        await ttsService.stop(); // 既存の音声を停止
        
        await ttsService.speak({
          text: currentQuestion.vocabulary.chinese,
          language: 'zh-CN',
          rate: 0.75,
          pitch: 1.0,
          volume: 1.0,
        });
      } catch (error) {
        console.error('TTS error:', error);
      }
    }
  };

  const playExample = async () => {
    if (currentQuestion && ttsService) {
      try {
        await ttsService.speak({
          text: currentQuestion.vocabulary.example,
          language: 'zh-CN',
          rate: 0.65,
          pitch: 1.0,
          volume: 1.0,
        });
      } catch (error) {
        console.error('TTS error:', error);
      }
    }
  };

  const handleSettingsChange = (newSettings: QuizSettings) => {
    if (!newSettings.showChinese && !newSettings.showPinyin) {
      return;
    }
    setSettings(newSettings);
    LocalStorageService.saveSettings(newSettings as unknown as Record<string, unknown>);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">単語データを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  if (vocabularyData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">中国語単語学習アプリ</h1>
          <p className="text-gray-600 mb-4">
            単語データが見つかりません。.env.localファイルを確認してください。
          </p>
          <div className="bg-gray-50 p-4 rounded-lg text-left text-sm">
            <p className="font-semibold mb-2">設定が必要な環境変数:</p>
            <ul className="list-disc list-inside text-gray-700">
              <li>GOOGLE_SHEETS_API_KEY</li>
              <li>NEXT_PUBLIC_SPREADSHEET_ID</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <h1 className="text-3xl font-bold text-gray-800">中国語単語学習</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowVoiceSettings(true)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="音声設定"
              >
                🔊
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="設定"
              >
                ⚙️
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center gap-6 text-sm text-gray-600">
            <div>スコア: {score.correct}/{score.total}</div>
            <div>HSKレベル: {settings.hskLevel}</div>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded ${settings.showPinyin ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                拼音{settings.showPinyin ? 'ON' : 'OFF'}
              </span>
              <span className={`px-2 py-1 rounded ${settings.showChinese ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                漢字{settings.showChinese ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        </header>

        {currentQuestion && (
          <QuizQuestion
            question={currentQuestion}
            settings={settings}
            onAnswer={handleAnswer}
            onPlayAudio={playAudio}
            onPlayExample={playExample}
            onNextQuestion={handleNextQuestion}
          />
        )}

        <SettingsPanel
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
          isOpen={showSettings}
        />

        <VoiceSettings
          isOpen={showVoiceSettings}
          onClose={() => setShowVoiceSettings(false)}
          currentVoice={chineseVoice}
          onVoiceChange={setChineseVoice}
        />
      </div>
    </div>
  );
}