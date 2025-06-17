#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📋 Google Sheetsにデータをインポートする手順\n');

// CSVファイルの存在確認
const csvPath = path.join(__dirname, '..', 'vocabulary-with-translation.csv');
if (!fs.existsSync(csvPath)) {
  console.error('❌ vocabulary-with-translation.csv が見つかりません');
  process.exit(1);
}

console.log('✅ CSVファイルが見つかりました:', csvPath);
console.log('\n📝 Google Sheetsを更新する手順:');
console.log('==========================================');
console.log('1. 以下のCSVデータをコピーしてください:');
console.log('2. Google Sheetsの "comprehensive-vocabulary" シートを開く');
console.log('3. A1セルを選択');
console.log('4. 既存のデータをすべて削除 (Ctrl+A → Delete)');
console.log('5. 以下のデータを貼り付け (Ctrl+V)');
console.log('6. データが正しく7列（A〜G）に分かれることを確認');
console.log('\n📋 コピー用CSVデータ:');
console.log('==========================================');

// CSVファイルの内容を表示
const csvContent = fs.readFileSync(csvPath, 'utf-8');
console.log(csvContent);

console.log('\n==========================================');
console.log('✅ 上記のデータをコピーしてGoogle Sheetsに貼り付けてください');
console.log('🔄 完了後、アプリを再読み込みすると和訳が表示されます');