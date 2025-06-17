import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, RewardAdOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export interface AdConfig {
  // テスト用のAdMob ID（本番では実際のIDに変更）
  testBannerId: string;
  testInterstitialId: string;
  testRewardedId: string;
  
  // iOS本番用のAdMob ID
  bannerId?: string;
  interstitialId?: string;
  rewardedId?: string;
  
  // Android本番用のAdMob ID
  androidBannerId?: string;
  androidInterstitialId?: string;
  androidRewardedId?: string;
}

export class AdMobService {
  private static instance: AdMobService;
  private isInitialized: boolean = false;
  private isNativeAvailable: boolean = false;
  private adConfig: AdConfig;

  static getInstance(): AdMobService {
    if (!AdMobService.instance) {
      AdMobService.instance = new AdMobService();
    }
    return AdMobService.instance;
  }

  constructor() {
    this.isNativeAvailable = typeof window !== 'undefined' ? Capacitor.isNativePlatform() : false;
    
    // AdMob設定（本番ID）
    this.adConfig = {
      // テスト用AdMob ID（開発時のみ使用）
      testBannerId: 'ca-app-pub-3940256099942544/6300978111',
      testInterstitialId: 'ca-app-pub-3940256099942544/1033173712',
      testRewardedId: 'ca-app-pub-3940256099942544/5224354917',
      
      // 本番用ID
      bannerId: 'ca-app-pub-4632799259365267/4528564022', // iOS バナー
      interstitialId: 'ca-app-pub-4632799259365267/2735333723', // iOS インタースティシャル
      rewardedId: 'ca-app-pub-4632799259365267/6594687683', // iOS リワード
      
      // Android用ID
      androidBannerId: 'ca-app-pub-4632799259365267/1422252057',
      androidInterstitialId: 'ca-app-pub-4632799259365267/9895638442',
      androidRewardedId: 'ca-app-pub-4632799259365267/7796088718',
    };

    if (this.isNativeAvailable) {
      this.initializeAdMob();
    }
  }

  private async initializeAdMob(): Promise<void> {
    try {
      // AdMobの初期化
      await AdMob.initialize({
        testingDevices: ['YOUR_DEVICE_ID'], // デバッグ用デバイスID
        initializeForTesting: false, // 本番モードに変更
      });

      this.isInitialized = true;
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('AdMob initialization failed:', error);
      this.isInitialized = false;
    }
  }

  // プラットフォーム別広告ID取得
  private async getBannerAdId(): Promise<string> {
    if (typeof window === 'undefined') {
      return this.adConfig.testBannerId;
    }
    
    try {
      const { Capacitor } = await import('@capacitor/core');
      const platform = Capacitor.getPlatform();
      
      if (platform === 'android') {
        return this.adConfig.androidBannerId || this.adConfig.testBannerId;
      } else {
        return this.adConfig.bannerId || this.adConfig.testBannerId;
      }
    } catch {
      return this.adConfig.testBannerId;
    }
  }

  private async getInterstitialAdId(): Promise<string> {
    if (typeof window === 'undefined') {
      return this.adConfig.testInterstitialId;
    }
    
    try {
      const { Capacitor } = await import('@capacitor/core');
      const platform = Capacitor.getPlatform();
      
      if (platform === 'android') {
        return this.adConfig.androidInterstitialId || this.adConfig.testInterstitialId;
      } else {
        return this.adConfig.interstitialId || this.adConfig.testInterstitialId;
      }
    } catch {
      return this.adConfig.testInterstitialId;
    }
  }

  private async getRewardedAdId(): Promise<string> {
    if (typeof window === 'undefined') {
      return this.adConfig.testRewardedId;
    }
    
    try {
      const { Capacitor } = await import('@capacitor/core');
      const platform = Capacitor.getPlatform();
      
      if (platform === 'android') {
        return this.adConfig.androidRewardedId || this.adConfig.testRewardedId;
      } else {
        return this.adConfig.rewardedId || this.adConfig.testRewardedId;
      }
    } catch {
      return this.adConfig.testRewardedId;
    }
  }

  // バナー広告の表示
  async showBannerAd(position: BannerAdPosition = BannerAdPosition.BOTTOM_CENTER): Promise<void> {
    if (!this.isNativeAvailable || !this.isInitialized) {
      console.log('AdMob not available or not initialized');
      return;
    }

    try {
      const options: BannerAdOptions = {
        adId: await this.getBannerAdId(),
        adSize: BannerAdSize.BANNER,
        position: position,
        margin: 0,
        isTesting: false, // 本番モードに変更
      };

      await AdMob.showBanner(options);
      console.log('Banner ad displayed');
    } catch (error) {
      console.error('Failed to show banner ad:', error);
    }
  }

  // バナー広告の非表示
  async hideBannerAd(): Promise<void> {
    if (!this.isNativeAvailable || !this.isInitialized) {
      return;
    }

    try {
      await AdMob.hideBanner();
      console.log('Banner ad hidden');
    } catch (error) {
      console.error('Failed to hide banner ad:', error);
    }
  }

  // インタースティシャル広告の準備
  async prepareInterstitialAd(): Promise<void> {
    if (!this.isNativeAvailable || !this.isInitialized) {
      return;
    }

    try {
      const options = {
        adId: await this.getInterstitialAdId(),
        isTesting: false, // 本番モードに変更
      };

      await AdMob.prepareInterstitial(options);
      console.log('Interstitial ad prepared');
    } catch (error) {
      console.error('Failed to prepare interstitial ad:', error);
    }
  }

  // インタースティシャル広告の表示
  async showInterstitialAd(): Promise<void> {
    if (!this.isNativeAvailable || !this.isInitialized) {
      return;
    }

    try {
      await AdMob.showInterstitial();
      console.log('Interstitial ad shown');
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
    }
  }

  // リワード広告の準備
  async prepareRewardedAd(): Promise<void> {
    if (!this.isNativeAvailable || !this.isInitialized) {
      return;
    }

    try {
      const options: RewardAdOptions = {
        adId: await this.getRewardedAdId(),
        isTesting: false, // 本番モードに変更
      };

      await AdMob.prepareRewardVideoAd(options);
      console.log('Rewarded ad prepared');
    } catch (error) {
      console.error('Failed to prepare rewarded ad:', error);
    }
  }

  // リワード広告の表示
  async showRewardedAd(): Promise<boolean> {
    if (!this.isNativeAvailable || !this.isInitialized) {
      return false;
    }

    try {
      const result = await AdMob.showRewardVideoAd();
      console.log('Rewarded ad shown, reward earned:', result);
      return true;
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      return false;
    }
  }

  // 広告イベントリスナーの設定（後で実装）
  setupAdEventListeners(): void {
    if (!this.isNativeAvailable) {
      return;
    }

    // TODO: AdMobプラグインの正しいイベント名を確認後に実装
    console.log('AdMob event listeners setup - to be implemented');
    
    /*
    try {
      // 実際のイベント名は AdMob プラグインのドキュメントを参照
      // https://github.com/capacitor-community/admob
    } catch (error) {
      console.log('AdMob event listeners setup failed:', error);
    }
    */
  }

  // 広告の可用性確認
  isAdAvailable(): boolean {
    return this.isNativeAvailable && this.isInitialized;
  }

  // テストモードの有効/無効
  setTestMode(enabled: boolean): void {
    // 実装時にここでテストモードを切り替え
    console.log('Test mode:', enabled ? 'enabled' : 'disabled');
  }

  // 広告設定の更新（本番用IDの設定）
  updateAdConfig(config: Partial<AdConfig>): void {
    this.adConfig = { ...this.adConfig, ...config };
    console.log('Ad config updated');
  }
}