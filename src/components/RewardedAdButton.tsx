'use client';

import { useState } from 'react';
import { AdMobService } from '@/lib/adMobService';

interface RewardedAdButtonProps {
  onRewardEarned: () => void;
  rewardText?: string;
  buttonText?: string;
  className?: string;
  disabled?: boolean;
}

export default function RewardedAdButton({
  onRewardEarned,
  rewardText = 'ヒントを獲得',
  buttonText = '広告を見てヒントを獲得',
  className = '',
  disabled = false
}: RewardedAdButtonProps) {
  const [adService] = useState(() => AdMobService.getInstance());
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsAdReady] = useState(false);

  const handleWatchAd = async () => {
    if (!adService.isAdAvailable()) {
      // Web環境やネイティブ広告が利用できない場合の代替処理
      handleWebReward();
      return;
    }

    setIsLoading(true);

    try {
      // リワード広告を準備
      await adService.prepareRewardedAd();
      setIsAdReady(true);

      // リワード広告を表示
      const rewardEarned = await adService.showRewardedAd();
      
      if (rewardEarned) {
        onRewardEarned();
      }
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      // エラー時も報酬を付与（ユーザー体験を損なわないため）
      onRewardEarned();
    } finally {
      setIsLoading(false);
      setIsAdReady(false);
    }
  };

  // Web環境での代替処理
  const handleWebReward = () => {
    setIsLoading(true);
    
    // 3秒後に報酬を付与（広告視聴の代替）
    setTimeout(() => {
      onRewardEarned();
      setIsLoading(false);
    }, 3000);
  };

  const isNativeAdAvailable = adService.isAdAvailable();

  return (
    <div className={`rewarded-ad-container ${className}`}>
      <button
        onClick={handleWatchAd}
        disabled={disabled || isLoading}
        className={`
          px-6 py-3 rounded-lg font-medium transition-all duration-200
          ${disabled || isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600 text-white'
          }
          ${isLoading ? 'animate-pulse' : ''}
        `}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {isNativeAdAvailable ? '広告を読み込み中...' : '処理中...'}
          </div>
        ) : (
          <>
            <span className="mr-2">🎁</span>
            {buttonText}
          </>
        )}
      </button>
      
      <div className="text-xs text-gray-500 mt-2 text-center">
        {isNativeAdAvailable ? (
          <span>📺 短い動画広告を視聴して{rewardText}</span>
        ) : (
          <span>💻 Web版では自動で{rewardText}</span>
        )}
      </div>
    </div>
  );
}