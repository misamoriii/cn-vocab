import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cnvocab.app',
  appName: 'CN Vocab',
  webDir: 'out',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      backgroundColor: '#667eea',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff',
      splashFullScreen: true,
      splashImmersive: true,
    },
    TextToSpeech: {
      // TTS設定
    },
    SpeechRecognition: {
      // 音声認識設定
    },
    AdMob: {
      appId: 'ca-app-pub-4632799259365267~1751740339', // iOS用本番ID
      testDeviceIds: ['YOUR_DEVICE_ID'],
      initializeForTesting: false, // 本番モードに変更
    },
  },
  ios: {
    allowsLinkPreview: false,
    backgroundColor: '#667eea',
    // contentInset: 'automatic',
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#667eea',
    // buildOptions: {
    //   keystorePath: 'path/to/keystore',
    //   keystorePassword: 'password',
    //   keystoreAlias: 'alias',
    //   keystoreAliasPassword: 'password'
    // }
  },
};

export default config;
