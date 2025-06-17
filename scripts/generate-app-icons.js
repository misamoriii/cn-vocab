#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// SVG template for CN Vocab app icon
const appIconSVG = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4ECDC4;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="4" dy="8" stdDeviation="6" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background Circle -->
  <circle cx="512" cy="512" r="480" fill="url(#bgGradient)" stroke="#FFFFFF" stroke-width="12"/>
  
  <!-- Chinese Character Background -->
  <circle cx="512" cy="400" r="200" fill="#FFFFFF" opacity="0.9" filter="url(#shadow)"/>
  
  <!-- Chinese Character "学" (Study) -->
  <text x="512" y="480" font-family="Arial, sans-serif" font-size="180" font-weight="bold" text-anchor="middle" fill="#2C3E50">学</text>
  
  <!-- App Name -->
  <text x="512" y="700" font-family="Arial, sans-serif" font-size="80" font-weight="bold" text-anchor="middle" fill="#FFFFFF">CN</text>
  <text x="512" y="780" font-family="Arial, sans-serif" font-size="60" font-weight="normal" text-anchor="middle" fill="#FFFFFF">Vocab</text>
  
  <!-- Decorative Elements -->
  <circle cx="300" cy="250" r="20" fill="#FFFFFF" opacity="0.6"/>
  <circle cx="724" cy="300" r="15" fill="#FFFFFF" opacity="0.4"/>  
  <circle cx="200" cy="700" r="12" fill="#FFFFFF" opacity="0.5"/>
  <circle cx="824" cy="750" r="18" fill="#FFFFFF" opacity="0.3"/>
</svg>`;

// Splash screen SVG template
const splashScreenSVG = `<svg width="2048" height="2048" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="splashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="20" flood-color="#FFFFFF" flood-opacity="0.8"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="2048" height="2048" fill="url(#splashGradient)"/>
  
  <!-- Main Logo Circle -->
  <circle cx="1024" cy="900" r="300" fill="#FFFFFF" opacity="0.95" filter="url(#glow)"/>
  
  <!-- Chinese Character "学" -->
  <text x="1024" y="1020" font-family="Arial, sans-serif" font-size="280" font-weight="bold" text-anchor="middle" fill="#2C3E50">学</text>
  
  <!-- App Title -->
  <text x="1024" y="1350" font-family="Arial, sans-serif" font-size="120" font-weight="bold" text-anchor="middle" fill="#FFFFFF">CN Vocab</text>
  <text x="1024" y="1450" font-family="Arial, sans-serif" font-size="60" font-weight="normal" text-anchor="middle" fill="#FFFFFF" opacity="0.8">中国語単語学習</text>
  
  <!-- Loading Animation Elements -->
  <circle cx="900" cy="1600" r="8" fill="#FFFFFF" opacity="0.8">
    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="0s"/>
  </circle>
  <circle cx="1024" cy="1600" r="8" fill="#FFFFFF" opacity="0.8">
    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="0.5s"/>
  </circle>
  <circle cx="1148" cy="1600" r="8" fill="#FFFFFF" opacity="0.8">
    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="1s"/>
  </circle>
  
  <!-- Decorative Pattern -->
  <g opacity="0.1">
    <circle cx="200" cy="200" r="40" fill="#FFFFFF"/>
    <circle cx="1848" cy="300" r="30" fill="#FFFFFF"/>
    <circle cx="100" cy="1800" r="25" fill="#FFFFFF"/>
    <circle cx="1900" cy="1700" r="35" fill="#FFFFFF"/>
  </g>
</svg>`;

// Function to create directories if they don't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Function to write SVG files
function writeSVGFile(filePath, content) {
  ensureDirectoryExists(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created: ${filePath}`);
}

// Create directories
const assetsDir = path.join(__dirname, '..', 'assets');
const iconsDir = path.join(assetsDir, 'icons');
const splashDir = path.join(assetsDir, 'splash');

ensureDirectoryExists(iconsDir);
ensureDirectoryExists(splashDir);

// Write SVG files
writeSVGFile(path.join(iconsDir, 'app-icon.svg'), appIconSVG);
writeSVGFile(path.join(splashDir, 'splash-screen.svg'), splashScreenSVG);

// Create a simple PNG generation script (requires conversion tool)
const pngGenerationScript = `#!/usr/bin/env node

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
    const outputFile = path.join(outputDir, \`ios-\${size}x\${size}.png\`);
    execSync(\`convert "\${inputSVG}" -resize \${size}x\${size} "\${outputFile}"\`);
    console.log(\`Generated: ios-\${size}x\${size}.png\`);
  });
  
  // Generate Android icons
  androidSizes.forEach(size => {
    const outputFile = path.join(outputDir, \`android-\${size}x\${size}.png\`);
    execSync(\`convert "\${inputSVG}" -resize \${size}x\${size} "\${outputFile}"\`);
    console.log(\`Generated: android-\${size}x\${size}.png\`);
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
    const outputFile = path.join(splashOutputDir, \`splash-\${name}-\${width}x\${height}.png\`);
    execSync(\`convert "\${splashSVG}" -resize \${width}x\${height} "\${outputFile}"\`);
    console.log(\`Generated: splash-\${name}-\${width}x\${height}.png\`);
  });
  
} catch (error) {
  console.log('ImageMagick not found. Please install it or use an online converter.');
  console.log('Install via: brew install imagemagick (macOS) or apt-get install imagemagick (Ubuntu)');
  console.log('Or use online converters with the generated SVG files.');
}
`;

writeSVGFile(path.join(assetsDir, 'generate-png.js'), pngGenerationScript);

// Create README for assets
const assetsReadme = `# CN Vocab App Assets

This directory contains all the assets needed for the CN Vocab mobile app.

## Structure

- \`icons/\` - App icons in SVG format
- \`splash/\` - Splash screen assets in SVG format
- \`generated/\` - PNG files generated from SVG (created by generate-png.js)

## Usage

### Step 1: Generate PNG files

Run the PNG generation script:
\`\`\`bash
node assets/generate-png.js
\`\`\`

This will create PNG files in various sizes needed for iOS and Android.

### Step 2: Copy to platform directories

#### iOS
Copy the generated icons to \`ios/App/App/Assets.xcassets/AppIcon.appiconset/\`
Copy splash screens to \`ios/App/App/Assets.xcassets/Splash.imageset/\`

#### Android
Copy icons to \`android/app/src/main/res/mipmap-*/\`
Copy splash screens to \`android/app/src/main/res/drawable-*/\`

### Step 3: Update Capacitor configuration

The \`capacitor.config.ts\` file should be updated with the proper icon and splash screen paths.

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
`;

writeSVGFile(path.join(assetsDir, 'README.md'), assetsReadme);

console.log('\n✅ App icons and splash screens created successfully!');
console.log('\nNext steps:');
console.log('1. Run: node assets/generate-png.js (requires ImageMagick)');
console.log('2. Or use online converters to create PNG files from the SVG files');
console.log('3. Copy the generated PNG files to iOS and Android directories');
console.log('4. Update capacitor.config.ts with the new asset paths');