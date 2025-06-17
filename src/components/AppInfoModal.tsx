'use client';

import { useState } from 'react';

interface AppInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppInfoModal({ isOpen, onClose }: AppInfoModalProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'privacy' | 'terms'>('about');

  if (!isOpen) return null;

  const openExternalLink = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">アプリ情報</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* タブナビゲーション */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'about'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            アプリについて
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'privacy'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            プライバシー
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'terms'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            利用規約
          </button>
        </div>

        {/* タブコンテンツ */}
        <div className="p-4 overflow-y-auto max-h-96">
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">🇨🇳</div>
                <h3 className="text-xl font-bold text-gray-800">CN Vocab</h3>
                <p className="text-gray-600">中国語単語学習アプリ</p>
                <p className="text-sm text-gray-500 mt-1">Version 1.0.0</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">主な機能</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• HSK1-6レベル対応の単語学習</li>
                  <li>• 音声認識による発音練習</li>
                  <li>• 忘却曲線を利用した復習システム</li>
                  <li>• 学習進捗の追跡</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">技術情報</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Next.js + Capacitor</li>
                  <li>• Google Sheets API</li>
                  <li>• Web Speech API</li>
                  <li>• ローカルストレージ</li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  © 2024 CN Vocab. All rights reserved.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h4 className="font-semibold">プライバシーポリシー</h4>
              <div className="text-sm text-gray-700 space-y-3">
                <p>
                  CN Vocabはお客様のプライバシーを重視しています。
                  本アプリが収集・使用する情報について説明します。
                </p>
                
                <div>
                  <h5 className="font-medium mb-1">収集する情報</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>学習進捗データ（正答率、学習履歴）</li>
                    <li>アプリ使用状況（匿名化）</li>
                    <li>音声データ（ローカル処理のみ）</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium mb-1">データの使用目的</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>学習体験の個人化</li>
                    <li>アプリの機能改善</li>
                    <li>統計的分析（匿名化データ）</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium mb-1">データの保護</h5>
                  <p>
                    すべての学習データはデバイス内に安全に保存され、
                    外部に送信されることはありません。
                  </p>
                </div>
              </div>

              <button
                onClick={() => openExternalLink('/privacy-policy')}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                詳細なプライバシーポリシーを見る
              </button>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h4 className="font-semibold">利用規約</h4>
              <div className="text-sm text-gray-700 space-y-3">
                <p>
                  CN Vocabをご利用いただき、ありがとうございます。
                  本アプリの利用に関する重要な条件をご確認ください。
                </p>

                <div>
                  <h5 className="font-medium mb-1">サービスの利用</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>個人の学習目的でのみご利用ください</li>
                    <li>アプリの改変や逆コンパイルは禁止です</li>
                    <li>他のユーザーに迷惑をかける行為は禁止です</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium mb-1">知的財産権</h5>
                  <p>
                    本アプリおよび学習コンテンツの著作権は当方に帰属します。
                    個人利用の範囲でのみご利用いただけます。
                  </p>
                </div>

                <div>
                  <h5 className="font-medium mb-1">免責事項</h5>
                  <p>
                    学習効果の保証はできません。
                    アプリの利用はお客様の責任において行ってください。
                  </p>
                </div>
              </div>

              <button
                onClick={() => openExternalLink('/terms-of-service')}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                詳細な利用規約を見る
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              お問い合わせ: support@cnvocab.app
            </div>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}