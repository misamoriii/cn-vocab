# Manual Icon and Splash Screen Conversion Guide

Since ImageMagick installation is taking time, here's how to manually convert the SVG files to PNG:

## Option 1: Online Converters (Recommended)

### Quick Steps:
1. Go to https://convertio.co/svg-png/ or https://cloudconvert.com/svg-to-png
2. Upload `assets/icons/app-icon.svg`
3. Set output size to 1024x1024
4. Download the PNG file
5. Repeat for splash screen

### Detailed Steps:

#### For App Icons:
1. Upload `assets/icons/app-icon.svg` to an online converter
2. Generate these sizes:
   - **iOS**: 180x180, 167x167, 152x152, 120x120, 87x87, 80x80, 76x76, 60x60, 58x58, 40x40, 29x29, 20x20
   - **Android**: 192x192, 144x144, 96x96, 72x72, 48x48, 36x36
   - **Store**: 1024x1024 (for App Store)

#### For Splash Screens:
1. Upload `assets/splash/splash-screen.svg` to an online converter
2. Generate these sizes:
   - **iPhone SE**: 640x1136
   - **iPhone 8**: 750x1334
   - **iPhone 8 Plus**: 1242x2208
   - **iPhone X/11/12**: 1125x2436
   - **iPad**: 1536x2048
   - **iPad Pro**: 2048x2732

## Option 2: Using Figma (Free)

1. Create a free Figma account
2. Create new file
3. Copy the SVG code into Figma as text, then convert to vector
4. Resize to required dimensions
5. Export as PNG

## Option 3: Using Canva

1. Create a Canva account
2. Upload the SVG files
3. Resize and export as PNG in required sizes

## Directory Structure After Conversion

After converting, create this structure:

```
assets/
├── icons/
│   ├── app-icon.svg (original)
│   └── generated/
│       ├── ios-20x20.png
│       ├── ios-29x29.png
│       ├── ios-40x40.png
│       ├── ios-58x58.png
│       ├── ios-60x60.png
│       ├── ios-76x76.png
│       ├── ios-80x80.png
│       ├── ios-87x87.png
│       ├── ios-120x120.png
│       ├── ios-152x152.png
│       ├── ios-167x167.png
│       ├── ios-180x180.png
│       ├── ios-1024x1024.png
│       ├── android-36x36.png
│       ├── android-48x48.png
│       ├── android-72x72.png
│       ├── android-96x96.png
│       ├── android-144x144.png
│       └── android-192x192.png
└── splash/
    ├── splash-screen.svg (original)
    └── generated/
        ├── splash-iphone-se-640x1136.png
        ├── splash-iphone-8-750x1334.png
        ├── splash-iphone-8-plus-1242x2208.png
        ├── splash-iphone-x-1125x2436.png
        ├── splash-ipad-1536x2048.png
        └── splash-ipad-pro-2048x2732.png
```

## Next Steps After Conversion

1. Copy iOS icons to: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. Copy Android icons to: `android/app/src/main/res/mipmap-*/`
3. Copy splash screens to their respective directories
4. Update the `Contents.json` files in the iOS asset catalogs
5. Update `capacitor.config.ts` with proper paths

## Quick Test

You can preview the SVG files by:
1. Opening them in a web browser
2. Using VS Code with SVG preview extension
3. Using the built-in preview in macOS Finder

The designs include:
- **App Icon**: Gradient background with Chinese character "学" (study/learn)
- **Splash Screen**: Similar design with loading animation elements