#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// アイコンサイズ定義
const iconSizes = {
  ios: [
    { name: 'AppIcon-20x20@1x', size: 20 },
    { name: 'AppIcon-20x20@2x', size: 40 },
    { name: 'AppIcon-20x20@3x', size: 60 },
    { name: 'AppIcon-29x29@1x', size: 29 },
    { name: 'AppIcon-29x29@2x', size: 58 },
    { name: 'AppIcon-29x29@3x', size: 87 },
    { name: 'AppIcon-40x40@1x', size: 40 },
    { name: 'AppIcon-40x40@2x', size: 80 },
    { name: 'AppIcon-40x40@3x', size: 120 },
    { name: 'AppIcon-60x60@2x', size: 120 },
    { name: 'AppIcon-60x60@3x', size: 180 },
    { name: 'AppIcon-76x76@1x', size: 76 },
    { name: 'AppIcon-76x76@2x', size: 152 },
    { name: 'AppIcon-83.5x83.5@2x', size: 167 },
    { name: 'AppIcon-1024x1024@1x', size: 1024 }
  ],
  android: [
    { name: 'ic_launcher', folder: 'mipmap-ldpi', size: 36 },
    { name: 'ic_launcher', folder: 'mipmap-mdpi', size: 48 },
    { name: 'ic_launcher', folder: 'mipmap-hdpi', size: 72 },
    { name: 'ic_launcher', folder: 'mipmap-xhdpi', size: 96 },
    { name: 'ic_launcher', folder: 'mipmap-xxhdpi', size: 144 },
    { name: 'ic_launcher', folder: 'mipmap-xxxhdpi', size: 192 }
  ]
};

// スプラッシュスクリーンサイズ定義
const splashSizes = [
  { name: 'splash-2732x2732-1', width: 2732, height: 2732 },
  { name: 'splash-2732x2732-2', width: 2732, height: 2732 },
  { name: 'splash-2732x2732', width: 2732, height: 2732 },
  // Android用
  { name: 'splash', folder: 'drawable-port-ldpi', width: 200, height: 320 },
  { name: 'splash', folder: 'drawable-port-mdpi', width: 320, height: 480 },
  { name: 'splash', folder: 'drawable-port-hdpi', width: 480, height: 800 },
  { name: 'splash', folder: 'drawable-port-xhdpi', width: 720, height: 1280 },
  { name: 'splash', folder: 'drawable-port-xxhdpi', width: 960, height: 1600 },
  { name: 'splash', folder: 'drawable-port-xxxhdpi', width: 1280, height: 1920 }
];

// ディレクトリ作成関数
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// SVGからPNG変換関数
async function convertSVGToPNG(svgPath, outputPath, width, height = width) {
  try {
    await sharp(svgPath)
      .resize(width, height)
      .png()
      .toFile(outputPath);
    console.log(`✅ Created: ${outputPath} (${width}x${height})`);
  } catch (error) {
    console.error(`❌ Failed to create ${outputPath}:`, error.message);
  }
}

// メイン変換関数
async function convertAssets() {
  console.log('🚀 Starting PNG conversion...\n');

  const projectRoot = path.join(__dirname, '..');
  const assetsDir = path.join(projectRoot, 'assets');
  const iconSVG = path.join(assetsDir, 'icons', 'app-icon.svg');
  const splashSVG = path.join(assetsDir, 'splash', 'splash-screen.svg');

  // SVGファイルの存在確認
  if (!fs.existsSync(iconSVG)) {
    console.error('❌ App icon SVG not found:', iconSVG);
    return;
  }
  if (!fs.existsSync(splashSVG)) {
    console.error('❌ Splash screen SVG not found:', splashSVG);
    return;
  }

  // 1. iOSアイコン変換
  console.log('📱 Converting iOS app icons...');
  const iosIconDir = path.join(projectRoot, 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset');
  ensureDirectoryExists(iosIconDir);

  for (const icon of iconSizes.ios) {
    const outputPath = path.join(iosIconDir, `${icon.name}.png`);
    await convertSVGToPNG(iconSVG, outputPath, icon.size);
  }

  // 2. Androidアイコン変換
  console.log('\n🤖 Converting Android app icons...');
  for (const icon of iconSizes.android) {
    const androidIconDir = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res', icon.folder);
    ensureDirectoryExists(androidIconDir);
    const outputPath = path.join(androidIconDir, `${icon.name}.png`);
    await convertSVGToPNG(iconSVG, outputPath, icon.size);
  }

  // 3. iOSスプラッシュスクリーン変換
  console.log('\n🌟 Converting iOS splash screens...');
  const iosSplashDir = path.join(projectRoot, 'ios', 'App', 'App', 'Assets.xcassets', 'Splash.imageset');
  ensureDirectoryExists(iosSplashDir);

  for (const splash of splashSizes.filter(s => !s.folder)) {
    const outputPath = path.join(iosSplashDir, `${splash.name}.png`);
    await convertSVGToPNG(splashSVG, outputPath, splash.width, splash.height);
  }

  // 4. Androidスプラッシュスクリーン変換
  console.log('\n🤖 Converting Android splash screens...');
  for (const splash of splashSizes.filter(s => s.folder)) {
    const androidSplashDir = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res', splash.folder);
    ensureDirectoryExists(androidSplashDir);
    const outputPath = path.join(androidSplashDir, `${splash.name}.png`);
    await convertSVGToPNG(splashSVG, outputPath, splash.width, splash.height);
  }

  console.log('\n✅ All PNG conversions completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`   📱 iOS icons: ${iconSizes.ios.length} files`);
  console.log(`   🤖 Android icons: ${iconSizes.android.length} files`);
  console.log(`   🌟 iOS splash: 3 files`);
  console.log(`   🤖 Android splash: ${splashSizes.filter(s => s.folder).length} files`);
  
  console.log('\n🔧 Next steps:');
  console.log('   1. Run: npm run build:mobile');
  console.log('   2. Test iOS: npm run open:ios');
  console.log('   3. Test Android: npm run open:android');
}

// メイン実行
convertAssets().catch(error => {
  console.error('❌ Conversion failed:', error);
  process.exit(1);
});