'use client';

import { useEffect, useState } from 'react';
import { AdMobService } from '@/lib/adMobService';

interface AdBannerProps {
  className?: string;
  show?: boolean;
}

export default function AdBanner({ className = '', show = true }: AdBannerProps) {
  const [adService] = useState(() => AdMobService.getInstance());
  const [isNativeAd, setIsNativeAd] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAvailable = adService.isAdAvailable();
      setIsNativeAd(isAvailable);
      
      if (isAvailable && show) {
        // ネイティブ広告を表示
        adService.showBannerAd();
      }
    }

    // クリーンアップ
    return () => {
      if (isNativeAd) {
        adService.hideBannerAd();
      }
    };
  }, [adService, show, isNativeAd]);

  // ネイティブ広告が利用可能な場合は空のdivを返す（広告はネイティブで表示）
  if (isNativeAd) {
    return <div className={`ad-banner-native ${className}`} />;
  }

  // Web環境では代替広告またはプレースホルダーを表示
  if (!show) {
    return null;
  }

  return (
    <div className={`ad-banner-web ${className}`}>
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
        <div className="text-sm text-gray-500 mb-2">広告</div>
        <div className="bg-gradient-to-r from-blue-400 to-purple-500 text-white p-6 rounded">
          <p className="font-bold text-lg">CN Vocab Pro</p>
          <p className="text-sm">広告なしで快適な学習体験</p>
          <button className="mt-2 bg-white text-blue-500 px-4 py-2 rounded font-medium text-sm">
            詳細を見る
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          ※ モバイルアプリでは実際の広告が表示されます
        </div>
      </div>
    </div>
  );
}