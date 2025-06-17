#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Googleスプレッドシート連携セットアップ');
console.log('==========================================\n');

console.log('このスクリプトは.env.localファイルを作成します。\n');

console.log('事前準備:');
console.log('1. SETUP_GUIDE.mdの手順に従ってGoogleスプレッドシートを作成');
console.log('2. Google Cloud ConsoleでAPIキーを取得');
console.log('3. スプレッドシートを共有設定にする\n');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  try {
    const apiKey = await askQuestion('Google Sheets APIキーを入力してください: ');
    if (!apiKey) {
      console.log('❌ APIキーが入力されていません。');
      process.exit(1);
    }

    const spreadsheetId = await askQuestion('スプレッドシートIDを入力してください: ');
    if (!spreadsheetId) {
      console.log('❌ スプレッドシートIDが入力されていません。');
      process.exit(1);
    }

    const envContent = `# Google Sheets API設定
GOOGLE_SHEETS_API_KEY=${apiKey}
NEXT_PUBLIC_SPREADSHEET_ID=${spreadsheetId}
`;

    const envPath = path.join(process.cwd(), '.env.local');
    
    // 既存の.env.localファイルがある場合の確認
    if (fs.existsSync(envPath)) {
      const overwrite = await askQuestion('.env.localファイルが既に存在します。上書きしますか？ (y/N): ');
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        console.log('❌ セットアップを中止しました。');
        process.exit(0);
      }
    }

    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env.localファイルを作成しました！');
    
    console.log('\n次のステップ:');
    console.log('1. npm run dev でアプリを起動');
    console.log('2. http://localhost:3000 にアクセス');
    console.log('3. 単語データが正常に読み込まれることを確認');
    
    // 接続テスト
    const testConnection = await askQuestion('\n接続テストを実行しますか？ (Y/n): ');
    if (testConnection.toLowerCase() !== 'n' && testConnection.toLowerCase() !== 'no') {
      console.log('\n🔄 接続テストを実行中...');
      await testGoogleSheetsConnection(apiKey, spreadsheetId);
    }
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

async function testGoogleSheetsConnection(apiKey, spreadsheetId) {
  try {
    const fetch = (await import('node-fetch')).default;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:F2?key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok && data.values) {
      console.log('✅ 接続テスト成功！');
      console.log('📊 取得されたデータ例:');
      data.values.forEach((row, index) => {
        console.log(`  行${index + 1}: ${row.join(' | ')}`);
      });
    } else {
      console.log('❌ 接続テスト失敗');
      console.log('エラー詳細:', data.error?.message || 'Unknown error');
      console.log('\n確認事項:');
      console.log('- スプレッドシートが「リンクを知っている全員が閲覧できる」設定になっているか');
      console.log('- スプレッドシートIDが正しいか');
      console.log('- APIキーが有効か');
    }
  } catch (error) {
    console.log('❌ 接続テストでエラーが発生しました:', error.message);
  }
}

if (require.main === module) {
  main();
}