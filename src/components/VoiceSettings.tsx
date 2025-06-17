'use client';

import { useState, useEffect } from 'react';

interface VoiceSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentVoice: SpeechSynthesisVoice | null;
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
}

export default function VoiceSettings({ isOpen, onClose, currentVoice, onVoiceChange }: VoiceSettingsProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (isOpen && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const allVoices = speechSynthesis.getVoices();
        // 中国語音声のみフィルタリング
        const chineseVoices = allVoices.filter(voice => 
          voice.lang.startsWith('zh') || 
          voice.lang.includes('CN') ||
          voice.name.toLowerCase().includes('chinese')
        );
        setVoices(chineseVoices);
      };

      if (speechSynthesis.getVoices().length > 0) {
        loadVoices();
      } else {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, [isOpen]);

  const testVoice = (voice: SpeechSynthesisVoice) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance('你好，这是音声测试。');
    utterance.voice = voice;
    utterance.rate = 0.75;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">音声設定</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">
            中国語音声を選択してください（より自然な発音のため）：
          </p>
          
          {voices.length === 0 ? (
            <p className="text-gray-500 text-sm">音声を読み込み中...</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {voices.map((voice, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{voice.name}</div>
                    <div className="text-xs text-gray-500">{voice.lang}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => testVoice(voice)}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      テスト
                    </button>
                    <button
                      onClick={() => {
                        onVoiceChange(voice);
                        onClose();
                      }}
                      className={`px-2 py-1 text-xs rounded ${
                        currentVoice?.name === voice.name
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {currentVoice?.name === voice.name ? '選択中' : '選択'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500">
          <p>※ デバイスやブラウザによって利用可能な音声が異なります</p>
          <p>※ より高品質な音声のため、システムの言語設定で中国語を追加することをお勧めします</p>
        </div>
      </div>
    </div>
  );
}