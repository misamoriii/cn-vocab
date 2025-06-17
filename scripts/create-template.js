#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📊 Googleスプレッドシート用テンプレートCSVを作成中...\n');

// より多くのサンプルデータを作成
const vocabularyData = [
  // HSK 1レベル
  ['こんにちは', '你好', 'nǐ hǎo', '你好！很高兴见到你。', 'nǐ hǎo! hěn gāo xìng jiàn dào nǐ.', 1],
  ['ありがとう', '谢谢', 'xiè xie', '谢谢你的帮助。', 'xiè xie nǐ de bāng zhù.', 1],
  ['すみません', '对不起', 'duì bu qǐ', '对不起，我来晚了。', 'duì bu qǐ, wǒ lái wǎn le.', 1],
  ['はい', '是', 'shì', '是的，我明白了。', 'shì de, wǒ míng bái le.', 1],
  ['いいえ', '不是', 'bù shì', '不是，我不知道。', 'bù shì, wǒ bù zhī dào.', 1],
  ['私', '我', 'wǒ', '我是中国人。', 'wǒ shì zhōng guó rén.', 1],
  ['あなた', '你', 'nǐ', '你叫什么名字？', 'nǐ jiào shén me míng zi?', 1],
  ['彼', '他', 'tā', '他是我的朋友。', 'tā shì wǒ de péng you.', 1],
  ['彼女', '她', 'tā', '她很漂亮。', 'tā hěn piào liang.', 1],
  ['家', '家', 'jiā', '我的家很大。', 'wǒ de jiā hěn dà.', 1],
  ['学校', '学校', 'xué xiào', '学校在哪里？', 'xué xiào zài nǎ lǐ?', 1],
  ['先生', '老师', 'lǎo shī', '老师很好。', 'lǎo shī hěn hǎo.', 1],
  ['学生', '学生', 'xué sheng', '我是学生。', 'wǒ shì xué sheng.', 1],
  ['本', '书', 'shū', '这本书很有趣。', 'zhè běn shū hěn yǒu qù.', 1],
  ['水', '水', 'shuǐ', '我想喝水。', 'wǒ xiǎng hē shuǐ.', 1],
  ['お金', '钱', 'qián', '这个多少钱？', 'zhè ge duō shao qián?', 1],
  ['時間', '时间', 'shí jiān', '现在几点？', 'xiàn zài jǐ diǎn?', 1],
  ['今日', '今天', 'jīn tiān', '今天天气很好。', 'jīn tiān tiān qì hěn hǎo.', 1],
  ['明日', '明天', 'míng tiān', '明天见！', 'míng tiān jiàn!', 1],
  ['昨日', '昨天', 'zuó tiān', '昨天我很忙。', 'zuó tiān wǒ hěn máng.', 1],
  
  // HSK 2レベル
  ['好き', '喜欢', 'xǐ huan', '我喜欢中国菜。', 'wǒ xǐ huan zhōng guó cài.', 2],
  ['嫌い', '不喜欢', 'bù xǐ huan', '我不喜欢下雨。', 'wǒ bù xǐ huan xià yǔ.', 2],
  ['欲しい', '想要', 'xiǎng yào', '我想要一杯咖啡。', 'wǒ xiǎng yào yī bēi kā fēi.', 2],
  ['必要', '需要', 'xū yào', '我需要你的帮助。', 'wǒ xū yào nǐ de bāng zhù.', 2],
  ['できる', '可以', 'kě yǐ', '我可以帮你吗？', 'wǒ kě yǐ bāng nǐ ma?', 2],
  ['理解する', '明白', 'míng bái', '我明白你的意思。', 'wǒ míng bái nǐ de yì si.', 2],
  ['知っている', '知道', 'zhī dào', '我知道这个地方。', 'wǒ zhī dào zhè ge dì fang.', 2],
  ['覚えている', '记得', 'jì de', '我记得你的名字。', 'wǒ jì de nǐ de míng zi.', 2],
  ['忘れる', '忘记', 'wàng jì', '我忘记带钥匙了。', 'wǒ wàng jì dài yào shi le.', 2],
  ['勉強する', '学习', 'xué xí', '我在学习中文。', 'wǒ zài xué xí zhōng wén.', 2],
  ['働く', '工作', 'gōng zuò', '我在银行工作。', 'wǒ zài yín háng gōng zuò.', 2],
  ['休む', '休息', 'xiū xi', '我想休息一下。', 'wǒ xiǎng xiū xi yī xià.', 2],
  ['買う', '买', 'mǎi', '我想买这个。', 'wǒ xiǎng mǎi zhè ge.', 2],
  ['売る', '卖', 'mài', '这里卖什么？', 'zhè lǐ mài shén me?', 2],
  ['食べる', '吃', 'chī', '你吃早饭了吗？', 'nǐ chī zǎo fàn le ma?', 2],
  ['飲む', '喝', 'hē', '我想喝茶。', 'wǒ xiǎng hē chá.', 2],
  ['料理', '菜', 'cài', '中国菜很好吃。', 'zhōng guó cài hěn hǎo chī.', 2],
  ['美味しい', '好吃', 'hǎo chī', '这个很好吃。', 'zhè ge hěn hǎo chī.', 2],
  ['高い', '贵', 'guì', '这个太贵了。', 'zhè ge tài guì le.', 2],
  ['安い', '便宜', 'pián yi', '这个很便宜。', 'zhè ge hěn pián yi.', 2],
  
  // HSK 3レベル
  ['努力する', '努力', 'nǔ lì', '我会努力学习的。', 'wǒ huì nǔ lì xué xí de.', 3],
  ['決定する', '决定', 'jué dìng', '我决定去北京。', 'wǒ jué dìng qù běi jīng.', 3],
  ['準備する', '准备', 'zhǔn bèi', '我在准备考试。', 'wǒ zài zhǔn bèi kǎo shì.', 3],
  ['説明する', '解释', 'jiě shì', '请解释一下这个问题。', 'qǐng jiě shì yī xià zhè ge wèn tí.', 3],
  ['発見する', '发现', 'fā xiàn', '我发现了一个问题。', 'wǒ fā xiàn le yī ge wèn tí.', 3],
  ['比較する', '比较', 'bǐ jiào', '请比较这两个产品。', 'qǐng bǐ jiào zhè liǎng ge chǎn pǐn.', 3],
  ['選択する', '选择', 'xuǎn zé', '你可以选择你喜欢的。', 'nǐ kě yǐ xuǎn zé nǐ xǐ huan de.', 3],
  ['提案する', '建议', 'jiàn yì', '我建议你早点休息。', 'wǒ jiàn yì nǐ zǎo diǎn xiū xi.', 3],
  ['経験', '经验', 'jīng yàn', '这是很好的经验。', 'zhè shì hěn hǎo de jīng yàn.', 3],
  ['機会', '机会', 'jī huì', '这是一个好机会。', 'zhè shì yī ge hǎo jī huì.', 3]
];

// CSVヘッダー
const headers = ['日本語', '中国語', '拼音', '例文', '例文拼音', 'HSKレベル'];

// CSVフォーマットに変換
const csvContent = [headers, ...vocabularyData]
  .map(row => row.map(cell => `"${cell}"`).join(','))
  .join('\n');

// ファイルに保存
const outputPath = path.join(process.cwd(), 'vocabulary-template.csv');
fs.writeFileSync(outputPath, csvContent, 'utf8');

console.log(`✅ テンプレートCSVファイルを作成しました: ${outputPath}`);
console.log(`📝 ${vocabularyData.length}個の単語が含まれています\n`);

console.log('次のステップ:');
console.log('1. vocabulary-template.csvをGoogleスプレッドシートにインポート');
console.log('2. または手動でデータをコピー&ペースト');
console.log('3. スプレッドシートを共有設定にする');
console.log('4. npm run setup-sheets でAPIキーを設定\n');

console.log('HSKレベル別内訳:');
const levelCounts = vocabularyData.reduce((acc, row) => {
  const level = row[5];
  acc[level] = (acc[level] || 0) + 1;
  return acc;
}, {});

Object.entries(levelCounts).forEach(([level, count]) => {
  console.log(`  HSK ${level}: ${count}個`);
});