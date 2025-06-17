#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// iOS App Icon Contents.json template
const iosAppIconContents = {
  "images": [
    {
      "filename": "AppIcon-20x20@1x.png",
      "idiom": "ipad",
      "scale": "1x",
      "size": "20x20"
    },
    {
      "filename": "AppIcon-20x20@2x.png",
      "idiom": "ipad",
      "scale": "2x",
      "size": "20x20"
    },
    {
      "filename": "AppIcon-20x20@2x.png",
      "idiom": "iphone",
      "scale": "2x",
      "size": "20x20"
    },
    {
      "filename": "AppIcon-20x20@3x.png",
      "idiom": "iphone",
      "scale": "3x",
      "size": "20x20"
    },
    {
      "filename": "AppIcon-29x29@1x.png",
      "idiom": "ipad",
      "scale": "1x",
      "size": "29x29"
    },
    {
      "filename": "AppIcon-29x29@2x.png",
      "idiom": "ipad",
      "scale": "2x",
      "size": "29x29"
    },
    {
      "filename": "AppIcon-29x29@2x.png",
      "idiom": "iphone",
      "scale": "2x",
      "size": "29x29"
    },
    {
      "filename": "AppIcon-29x29@3x.png",
      "idiom": "iphone",
      "scale": "3x",
      "size": "29x29"
    },
    {
      "filename": "AppIcon-40x40@1x.png",
      "idiom": "ipad",
      "scale": "1x",
      "size": "40x40"
    },
    {
      "filename": "AppIcon-40x40@2x.png",
      "idiom": "ipad",
      "scale": "2x",
      "size": "40x40"
    },
    {
      "filename": "AppIcon-40x40@2x.png",
      "idiom": "iphone",
      "scale": "2x",
      "size": "40x40"
    },
    {
      "filename": "AppIcon-40x40@3x.png",
      "idiom": "iphone",
      "scale": "3x",
      "size": "40x40"
    },
    {
      "filename": "AppIcon-60x60@2x.png",
      "idiom": "iphone",
      "scale": "2x",
      "size": "60x60"
    },
    {
      "filename": "AppIcon-60x60@3x.png",
      "idiom": "iphone",
      "scale": "3x",
      "size": "60x60"
    },
    {
      "filename": "AppIcon-76x76@1x.png",
      "idiom": "ipad",
      "scale": "1x",
      "size": "76x76"
    },
    {
      "filename": "AppIcon-76x76@2x.png",
      "idiom": "ipad",
      "scale": "2x",
      "size": "76x76"
    },
    {
      "filename": "AppIcon-83.5x83.5@2x.png",
      "idiom": "ipad",
      "scale": "2x",
      "size": "83.5x83.5"
    },
    {
      "filename": "AppIcon-1024x1024@1x.png",
      "idiom": "ios-marketing",
      "scale": "1x",
      "size": "1024x1024"
    }
  ],
  "info": {
    "author": "capacitor",
    "version": 1
  }
};

// iOS Splash Screen Contents.json template
const iosSplashContents = {
  "images": [
    {
      "filename": "splash-2732x2732-1.png",
      "idiom": "universal",
      "scale": "1x"
    },
    {
      "filename": "splash-2732x2732-2.png",
      "idiom": "universal",
      "scale": "2x"
    },
    {
      "filename": "splash-2732x2732.png",
      "idiom": "universal",
      "scale": "3x"
    }
  ],
  "info": {
    "author": "capacitor",
    "version": 1
  }
};

// Android strings.xml template
const androidStrings = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">CN Vocab</string>
    <string name="title_activity_main">CN Vocab</string>
    <string name="package_name">com.cnvocab.app</string>
    <string name="custom_url_scheme">com.cnvocab.app</string>
</resources>`;

// Function to ensure directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Function to write JSON file
function writeJSONFile(filePath, content) {
  ensureDirectoryExists(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
  console.log(`Created: ${filePath}`);
}

// Function to write text file
function writeTextFile(filePath, content) {
  ensureDirectoryExists(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created: ${filePath}`);
}

// Main setup function
function setupAppAssets() {
  console.log('Setting up app assets configuration...\n');

  // iOS App Icon configuration
  const iosAppIconDir = path.join(__dirname, '..', 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset');
  writeJSONFile(path.join(iosAppIconDir, 'Contents.json'), iosAppIconContents);

  // iOS Splash Screen configuration
  const iosSplashDir = path.join(__dirname, '..', 'ios', 'App', 'App', 'Assets.xcassets', 'Splash.imageset');
  writeJSONFile(path.join(iosSplashDir, 'Contents.json'), iosSplashContents);

  // Android strings configuration
  const androidStringsDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'values');
  writeTextFile(path.join(androidStringsDir, 'strings.xml'), androidStrings);

  // Create directories for generated assets
  const assetDirs = [
    path.join(__dirname, '..', 'assets', 'icons', 'generated'),
    path.join(__dirname, '..', 'assets', 'splash', 'generated'),
  ];

  assetDirs.forEach(dir => {
    ensureDirectoryExists(dir);
    console.log(`Created directory: ${dir}`);
  });

  // Create placeholder files to show what's needed
  const placeholderReadme = `# Generated Assets

This directory will contain the PNG files generated from the SVG assets.

## Required Files for iOS App Icons:
- AppIcon-20x20@1x.png (20x20)
- AppIcon-20x20@2x.png (40x40)
- AppIcon-20x20@3x.png (60x60)
- AppIcon-29x29@1x.png (29x29)
- AppIcon-29x29@2x.png (58x58)
- AppIcon-29x29@3x.png (87x87)
- AppIcon-40x40@1x.png (40x40)
- AppIcon-40x40@2x.png (80x80)
- AppIcon-40x40@3x.png (120x120)
- AppIcon-60x60@2x.png (120x120)
- AppIcon-60x60@3x.png (180x180)
- AppIcon-76x76@1x.png (76x76)
- AppIcon-76x76@2x.png (152x152)
- AppIcon-83.5x83.5@2x.png (167x167)
- AppIcon-1024x1024@1x.png (1024x1024)

## Required Files for Android Icons:
- ic_launcher-ldpi.png (36x36) → android/app/src/main/res/mipmap-ldpi/
- ic_launcher-mdpi.png (48x48) → android/app/src/main/res/mipmap-mdpi/
- ic_launcher-hdpi.png (72x72) → android/app/src/main/res/mipmap-hdpi/
- ic_launcher-xhdpi.png (96x96) → android/app/src/main/res/mipmap-xhdpi/
- ic_launcher-xxhdpi.png (144x144) → android/app/src/main/res/mipmap-xxhdpi/
- ic_launcher-xxxhdpi.png (192x192) → android/app/src/main/res/mipmap-xxxhdpi/

## Copy Instructions:
1. Generate PNG files from SVG using online converters
2. Rename files according to the above naming convention
3. Copy iOS icons to: ios/App/App/Assets.xcassets/AppIcon.appiconset/
4. Copy Android icons to their respective mipmap-* directories
5. Copy splash screens to: ios/App/App/Assets.xcassets/Splash.imageset/
`;

  writeTextFile(path.join(__dirname, '..', 'assets', 'icons', 'generated', 'README.md'), placeholderReadme);

  console.log('\n✅ App asset configuration completed!');
  console.log('\nNext steps:');
  console.log('1. Convert SVG files to PNG using online converters or ImageMagick');
  console.log('2. Copy the generated PNG files to their respective directories');
  console.log('3. Run: npm run build:mobile');
  console.log('4. Test on iOS: npm run open:ios');
  console.log('5. Test on Android: npm run open:android');
}

// Run the setup
setupAppAssets();