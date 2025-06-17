# CN Vocab App Assets

This directory contains all the assets needed for the CN Vocab mobile app.

## Structure

- `icons/` - App icons in SVG format
- `splash/` - Splash screen assets in SVG format
- `generated/` - PNG files generated from SVG (created by generate-png.js)

## Usage

### Step 1: Generate PNG files

Run the PNG generation script:
```bash
node assets/generate-png.js
```

This will create PNG files in various sizes needed for iOS and Android.

### Step 2: Copy to platform directories

#### iOS
Copy the generated icons to `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
Copy splash screens to `ios/App/App/Assets.xcassets/Splash.imageset/`

#### Android
Copy icons to `android/app/src/main/res/mipmap-*/`
Copy splash screens to `android/app/src/main/res/drawable-*/`

### Step 3: Update Capacitor configuration

The `capacitor.config.ts` file should be updated with the proper icon and splash screen paths.

## Design Details

### App Icon
- **Base**: Gradient circle background (red to teal)
- **Symbol**: Chinese character "学" (study/learn)
- **Text**: "CN Vocab" below the symbol
- **Style**: Modern, clean design with subtle shadows

### Splash Screen
- **Background**: Purple gradient
- **Logo**: White circle with "学" character
- **Title**: "CN Vocab" and "中国语单语学习"
- **Animation**: Loading dots at the bottom

## Manual Conversion

If automatic PNG generation doesn't work, you can:

1. Use online converters like convertio.co or cloudconvert.com
2. Use design tools like Figma, Sketch, or Adobe Illustrator
3. Install ImageMagick or Inkscape for command-line conversion

## Required Sizes

### iOS App Icons
- 20x20, 29x29, 40x40, 58x58, 60x60, 76x76, 80x80, 87x87
- 120x120, 152x152, 167x167, 180x180, 1024x1024

### Android App Icons
- 36x36 (ldpi), 48x48 (mdpi), 72x72 (hdpi)
- 96x96 (xhdpi), 144x144 (xxhdpi), 192x192 (xxxhdpi)

### Splash Screens
- iPhone SE: 640x1136
- iPhone 8: 750x1334
- iPhone 8 Plus: 1242x2208
- iPhone X/11/12: 1125x2436
- iPad: 1536x2048
- iPad Pro: 2048x2732
- Android Portrait: 480x800
- Android Landscape: 800x480
