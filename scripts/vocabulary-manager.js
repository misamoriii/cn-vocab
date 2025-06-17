#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎯 HSK単語管理システム');
console.log('========================\n');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function showMenu() {
  console.log('利用可能なオプション:');
  console.log('1. 基本テンプレート作成（50単語）');
  console.log('2. 包括的単語データ作成（223単語、HSK1-6）');
  console.log('3. カスタム単語データ作成');
  console.log('4. 既存データに単語追加');
  console.log('5. HSKレベル別データ抽出');
  console.log('6. 単語統計表示');
  console.log('0. 終了\n');
  
  const choice = await askQuestion('選択してください (0-6): ');
  return choice;
}

async function createCustomVocabulary() {
  console.log('\n📝 カスタム単語データ作成');
  console.log('=====================\n');
  
  const words = [];
  
  while (true) {
    console.log(`現在の単語数: ${words.length}`);
    const japanese = await askQuestion('日本語 (空白で終了): ');
    if (!japanese) break;
    
    const chinese = await askQuestion('中国語: ');
    const pinyin = await askQuestion('拼音: ');
    const example = await askQuestion('例文: ');
    const examplePinyin = await askQuestion('例文拼音: ');
    const hskLevel = await askQuestion('HSKレベル (1-6): ');
    
    words.push([japanese, chinese, pinyin, example, examplePinyin, parseInt(hskLevel)]);
    console.log('✅ 追加しました\n');
  }
  
  if (words.length > 0) {
    saveVocabularyData(words, 'custom-vocabulary.csv');
    console.log(`✅ ${words.length}個の単語をcustom-vocabulary.csvに保存しました。`);
  }
}

async function addToExistingData() {
  console.log('\n➕ 既存データに追加');
  console.log('================\n');
  
  // 既存ファイルの一覧表示
  const files = fs.readdirSync('.').filter(f => f.endsWith('-vocabulary.csv'));
  if (files.length === 0) {
    console.log('既存の単語ファイルが見つかりません。');
    return;
  }
  
  console.log('既存ファイル:');
  files.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });
  
  const fileChoice = await askQuestion('ファイル番号を選択: ');
  const selectedFile = files[parseInt(fileChoice) - 1];
  
  if (!selectedFile) {
    console.log('無効な選択です。');
    return;
  }
  
  // 既存データを読み込み
  const existingData = readVocabularyData(selectedFile);
  console.log(`${selectedFile}から${existingData.length}個の単語を読み込みました。`);
  
  // 新しい単語を追加
  const newWords = [];
  while (true) {
    console.log(`追加予定: ${newWords.length}個`);
    const japanese = await askQuestion('日本語 (空白で終了): ');
    if (!japanese) break;
    
    const chinese = await askQuestion('中国語: ');
    const pinyin = await askQuestion('拼音: ');
    const example = await askQuestion('例文: ');
    const examplePinyin = await askQuestion('例文拼音: ');
    const hskLevel = await askQuestion('HSKレベル (1-6): ');
    
    newWords.push([japanese, chinese, pinyin, example, examplePinyin, parseInt(hskLevel)]);
    console.log('✅ 追加予定リストに追加\n');
  }
  
  if (newWords.length > 0) {
    const allWords = [...existingData, ...newWords];
    saveVocabularyData(allWords, selectedFile);
    console.log(`✅ ${newWords.length}個の単語を${selectedFile}に追加しました。`);
    console.log(`総単語数: ${allWords.length}個`);
  }
}

async function extractByHSKLevel() {
  console.log('\n🎯 HSKレベル別抽出');
  console.log('================\n');
  
  const files = fs.readdirSync('.').filter(f => f.endsWith('-vocabulary.csv'));
  if (files.length === 0) {
    console.log('単語ファイルが見つかりません。');
    return;
  }
  
  console.log('ファイル:');
  files.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });
  
  const fileChoice = await askQuestion('ファイル番号を選択: ');
  const selectedFile = files[parseInt(fileChoice) - 1];
  
  if (!selectedFile) {
    console.log('無効な選択です。');
    return;
  }
  
  const level = await askQuestion('抽出するHSKレベル (1-6): ');
  const targetLevel = parseInt(level);
  
  if (targetLevel < 1 || targetLevel > 6) {
    console.log('HSKレベルは1-6で指定してください。');
    return;
  }
  
  const allWords = readVocabularyData(selectedFile);
  const levelWords = allWords.filter(word => word[5] === targetLevel);
  
  if (levelWords.length === 0) {
    console.log(`HSK${targetLevel}の単語が見つかりません。`);
    return;
  }
  
  const outputFile = `hsk${targetLevel}-vocabulary.csv`;
  saveVocabularyData(levelWords, outputFile);
  console.log(`✅ HSK${targetLevel}の${levelWords.length}個の単語を${outputFile}に抽出しました。`);
}

function showStatistics() {
  console.log('\n📊 単語統計');
  console.log('==========\n');
  
  const files = fs.readdirSync('.').filter(f => f.endsWith('-vocabulary.csv'));
  if (files.length === 0) {
    console.log('単語ファイルが見つかりません。');
    return;
  }
  
  files.forEach(file => {
    console.log(`📄 ${file}:`);
    const words = readVocabularyData(file);
    console.log(`  総単語数: ${words.length}個`);
    
    const levelCounts = words.reduce((acc, word) => {
      const level = word[5];
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});
    
    for (let level = 1; level <= 6; level++) {
      const count = levelCounts[level] || 0;
      console.log(`  HSK${level}: ${count}個`);
    }
    console.log('');
  });
}

function readVocabularyData(filename) {
  try {
    const content = fs.readFileSync(filename, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());
    // ヘッダー行をスキップ
    const dataLines = lines.slice(1);
    
    return dataLines.map(line => {
      // CSVパース（簡易版）
      const fields = line.split(',').map(field => 
        field.replace(/^"|"$/g, '').replace(/""/g, '"')
      );
      return [
        fields[0], // 日本語
        fields[1], // 中国語
        fields[2], // 拼音
        fields[3], // 例文
        fields[4], // 例文拼音
        parseInt(fields[5]) || 1 // HSKレベル
      ];
    });
  } catch (error) {
    console.error(`ファイル読み込みエラー: ${error.message}`);
    return [];
  }
}

function saveVocabularyData(words, filename) {
  const headers = ['日本語', '中国語', '拼音', '例文', '例文拼音', 'HSKレベル'];
  const csvContent = [headers, ...words]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  fs.writeFileSync(filename, csvContent, 'utf8');
}

async function main() {
  try {
    while (true) {
      const choice = await showMenu();
      
      switch (choice) {
        case '1':
          console.log('\n基本テンプレートを作成中...');
          require('./create-template.js');
          break;
          
        case '2':
          console.log('\n包括的単語データを作成中...');
          require('./create-comprehensive-vocabulary.js');
          break;
          
        case '3':
          await createCustomVocabulary();
          break;
          
        case '4':
          await addToExistingData();
          break;
          
        case '5':
          await extractByHSKLevel();
          break;
          
        case '6':
          showStatistics();
          break;
          
        case '0':
          console.log('\n👋 終了します。');
          process.exit(0);
          break;
          
        default:
          console.log('\n❌ 無効な選択です。0-6の数字を入力してください。\n');
      }
      
      if (choice !== '6') {
        await askQuestion('\nEnterキーを押して続行...');
        console.clear();
      }
    }
  } catch (error) {
    console.error('エラーが発生しました:', error.message);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main();
}