#!/usr/bin/env node

// PNG Generation Instructions
// 
// To generate PNG files from SVG, you can use one of these methods:
//
// Method 1: Using ImageMagick (install via: brew install imagemagick)
// convert assets/icons/app-icon.svg -resize 1024x1024 assets/icons/app-icon-1024.png
//
// Method 2: Using Inkscape (install via: brew install inkscape)
// inkscape --export-png=assets/icons/app-icon-1024.png --export-width=1024 --export-height=1024 assets/icons/app-icon.svg
//
// Method 3: Online converter
// Upload the SVG files to an online converter like convertio.co or cloudconvert.com
//
// Required sizes for iOS:
// - 20x20, 29x29, 40x40, 58x58, 60x60, 76x76, 80x80, 87x87, 120x120, 152x152, 167x167, 180x180, 1024x1024
//
// Required sizes for Android:
// - 36x36 (ldpi), 48x48 (mdpi), 72x72 (hdpi), 96x96 (xhdpi), 144x144 (xxhdpi), 192x192 (xxxhdpi)
//
// Splash screen sizes:
// - Various sizes from 320x480 to 2732x2732 for different devices

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if ImageMagick is available
try {
  execSync('convert -version', { stdio: 'ignore' });
  console.log('ImageMagick detected. Generating PNG files...');
  
  // iOS App Icon sizes
  const iosSizes = [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024];
  const androidSizes = [36, 48, 72, 96, 144, 192];
  
  const inputSVG = path.join(__dirname, '..', 'assets', 'icons', 'app-icon.svg');
  const outputDir = path.join(__dirname, '..', 'assets', 'icons', 'generated');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Generate iOS icons
  iosSizes.forEach(size => {
    const outputFile = path.join(outputDir, `ios-${size}x${size}.png`);
    execSync(`convert "${inputSVG}" -resize ${size}x${size} "${outputFile}"`);
    console.log(`Generated: ios-${size}x${size}.png`);
  });
  
  // Generate Android icons
  androidSizes.forEach(size => {
    const outputFile = path.join(outputDir, `android-${size}x${size}.png`);
    execSync(`convert "${inputSVG}" -resize ${size}x${size} "${outputFile}"`);
    console.log(`Generated: android-${size}x${size}.png`);
  });
  
  // Generate splash screens
  const splashSVG = path.join(__dirname, '..', 'assets', 'splash', 'splash-screen.svg');
  const splashOutputDir = path.join(__dirname, '..', 'assets', 'splash', 'generated');
  
  if (!fs.existsSync(splashOutputDir)) {
    fs.mkdirSync(splashOutputDir, { recursive: true });
  }
  
  const splashSizes = [
    { name: 'iphone-se', width: 640, height: 1136 },
    { name: 'iphone-8', width: 750, height: 1334 },
    { name: 'iphone-8-plus', width: 1242, height: 2208 },
    { name: 'iphone-x', width: 1125, height: 2436 },
    { name: 'ipad', width: 1536, height: 2048 },
    { name: 'ipad-pro', width: 2048, height: 2732 },
    { name: 'android-port', width: 480, height: 800 },
    { name: 'android-land', width: 800, height: 480 }
  ];
  
  splashSizes.forEach(({ name, width, height }) => {
    const outputFile = path.join(splashOutputDir, `splash-${name}-${width}x${height}.png`);
    execSync(`convert "${splashSVG}" -resize ${width}x${height} "${outputFile}"`);
    console.log(`Generated: splash-${name}-${width}x${height}.png`);
  });
  
} catch (error) {
  console.log('ImageMagick not found. Please install it or use an online converter.');
  console.log('Install via: brew install imagemagick (macOS) or apt-get install imagemagick (Ubuntu)');
  console.log('Or use online converters with the generated SVG files.');
}
