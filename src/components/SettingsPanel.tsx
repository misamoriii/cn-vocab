'use client';

import { QuizSettings } from '@/types/vocabulary';

interface SettingsPanelProps {
  settings: QuizSettings;
  onSettingsChange: (settings: QuizSettings) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function SettingsPanel({ 
  settings, 
  onSettingsChange, 
  onClose, 
  isOpen 
}: SettingsPanelProps) {
  if (!isOpen) return null;

  const handleChange = (key: keyof QuizSettings, value: unknown) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">設定</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HSKレベル
            </label>
            <select
              value={settings.hskLevel}
              onChange={(e) => handleChange('hskLevel', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={1}>HSK 1</option>
              <option value={2}>HSK 2</option>
              <option value={3}>HSK 3</option>
              <option value={4}>HSK 4</option>
              <option value={5}>HSK 5</option>
              <option value={6}>HSK 6</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              表示オプション
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.showChinese}
                  onChange={(e) => handleChange('showChinese', e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">漢字を表示</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.showPinyin}
                  onChange={(e) => handleChange('showPinyin', e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">拼音を表示</span>
              </label>
            </div>
            
            {!settings.showChinese && !settings.showPinyin && (
              <p className="text-red-500 text-xs mt-2">
                少なくとも一つの表示オプションを選択してください
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">学習モードについて</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 漢字のみ: 漢字の読み方を覚える</li>
              <li>• 拼音のみ: 発音から意味を理解する</li>
              <li>• 両方表示: 総合的な理解を深める</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            設定を保存
          </button>
        </div>
      </div>
    </div>
  );
}