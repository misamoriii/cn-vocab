#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📚 HSK1-6レベル対応の包括的単語データを作成中...\n');

// HSKレベル別の包括的な単語データ
const vocabularyData = [
  // HSK 1レベル（基本的な単語150語程度から50語選出）
  ['私', '我', 'wǒ', '我是学生。', 'wǒ shì xué shēng.', '私は学生です。', 1],
  ['あなた', '你', 'nǐ', '你好吗？', 'nǐ hǎo ma?', 'お元気ですか？', 1],
  ['彼', '他', 'tā', '他是老师。', 'tā shì lǎo shī.', '彼は先生です。', 1],
  ['彼女', '她', 'tā', '她很漂亮。', 'tā hěn piào liang.', '彼女はとても綺麗です。', 1],
  ['これ', '这', 'zhè', '这是什么？', 'zhè shì shén me?', 'これは何ですか？', 1],
  ['それ', '那', 'nà', '那个很好。', 'nà ge hěn hǎo.', 1],
  ['どこ', '哪儿', 'nǎr', '你去哪儿？', 'nǐ qù nǎr?', 1],
  ['何', '什么', 'shén me', '这是什么？', 'zhè shì shén me?', 1],
  ['誰', '谁', 'shéi', '他是谁？', 'tā shì shéi?', 1],
  ['いくつ', '几', 'jǐ', '你几岁？', 'nǐ jǐ suì?', 1],
  ['いくら', '多少', 'duō shao', '这个多少钱？', 'zhè ge duō shao qián?', 1],
  ['一', '一', 'yī', '我有一本书。', 'wǒ yǒu yī běn shū.', 1],
  ['二', '二', 'èr', '我要二十块钱。', 'wǒ yào èr shí kuài qián.', 1],
  ['三', '三', 'sān', '三点钟见面。', 'sān diǎn zhōng jiàn miàn.', 1],
  ['四', '四', 'sì', '我家有四口人。', 'wǒ jiā yǒu sì kǒu rén.', 1],
  ['五', '五', 'wǔ', '五分钟后回来。', 'wǔ fēn zhōng hòu huí lái.', 1],
  ['六', '六', 'liù', '六点下班。', 'liù diǎn xià bān.', 1],
  ['七', '七', 'qī', '星期七不上班。', 'xīng qī qī bù shàng bān.', 1],
  ['八', '八', 'bā', '八月很热。', 'bā yuè hěn rè.', 1],
  ['九', '九', 'jiǔ', '九点睡觉。', 'jiǔ diǎn shuì jiào.', 1],
  ['十', '十', 'shí', '十个苹果。', 'shí ge píng guǒ.', 1],
  ['人', '人', 'rén', '他是好人。', 'tā shì hǎo rén.', 1],
  ['大', '大', 'dà', '这个房子很大。', 'zhè ge fáng zi hěn dà.', 1],
  ['小', '小', 'xiǎo', '我有一个小狗。', 'wǒ yǒu yī ge xiǎo gǒu.', 1],
  ['多', '多', 'duō', '人很多。', 'rén hěn duō.', 1],
  ['少', '少', 'shǎo', '钱太少了。', 'qián tài shǎo le.', 1],
  ['好', '好', 'hǎo', '今天天气很好。', 'jīn tiān tiān qì hěn hǎo.', 1],
  ['はい', '是', 'shì', '是的，我知道。', 'shì de, wǒ zhī dào.', 1],
  ['いいえ', '不', 'bù', '不，我不去。', 'bù, wǒ bù qù.', 1],
  ['ある/いる', '有', 'yǒu', '我有一个朋友。', 'wǒ yǒu yī ge péng you.', 1],
  ['来る', '来', 'lái', '他明天来。', 'tā míng tiān lái.', 1],
  ['行く', '去', 'qù', '我去学校。', 'wǒ qù xué xiào.', 1],
  ['見る', '看', 'kàn', '我看电视。', 'wǒ kàn diàn shì.', 1],
  ['聞く', '听', 'tīng', '我听音乐。', 'wǒ tīng yīn yuè.', 1],
  ['話す', '说', 'shuō', '他说中文。', 'tā shuō zhōng wén.', 1],
  ['読む', '读', 'dú', '我读书。', 'wǒ dú shū.', 1],
  ['書く', '写', 'xiě', '我写汉字。', 'wǒ xiě hàn zì.', 1],
  ['食べる', '吃', 'chī', '我吃饭。', 'wǒ chī fàn.', 1],
  ['飲む', '喝', 'hē', '我喝水。', 'wǒ hē shuǐ.', 1],
  ['する', '做', 'zuò', '我做作业。', 'wǒ zuò zuò yè.', 1],
  ['買う', '买', 'mǎi', '我买东西。', 'wǒ mǎi dōng xi.', 1],
  ['家', '家', 'jiā', '我回家。', 'wǒ huí jiā.', 1],
  ['学校', '学校', 'xué xiào', '学校很大。', 'xué xiào hěn dà.', 1],
  ['本', '书', 'shū', '这本书很好。', 'zhè běn shū hěn hǎo.', 1],
  ['水', '水', 'shuǐ', '我要喝水。', 'wǒ yào hē shuǐ.', 1],
  ['お金', '钱', 'qián', '我没有钱。', 'wǒ méi yǒu qián.', 1],
  ['今日', '今天', 'jīn tiān', '今天是星期一。', 'jīn tiān shì xīng qī yī.', 1],
  ['明日', '明天', 'míng tiān', '明天见！', 'míng tiān jiàn!', 1],
  ['昨日', '昨天', 'zuó tiān', '昨天很忙。', 'zuó tiān hěn máng.', 1],
  ['年', '年', 'nián', '今年我二十岁。', 'jīn nián wǒ èr shí suì.', 1],
  ['月', '月', 'yuè', '这个月很忙。', 'zhè ge yuè hěn máng.', 1],
  ['日', '日', 'rì', '今日天气好。', 'jīn rì tiān qì hǎo.', 1],

  // HSK 2レベル（300語程度から60語選出）
  ['時間', '时间', 'shí jiān', '我没有时间。', 'wǒ méi yǒu shí jiān.', 2],
  ['働く', '工作', 'gōng zuò', '我在银行工作。', 'wǒ zài yín háng gōng zuò.', 2],
  ['勉強', '学习', 'xué xí', '我学习中文。', 'wǒ xué xí zhōng wén.', 2],
  ['好き', '喜欢', 'xǐ huan', '我喜欢看电影。', 'wǒ xǐ huan kàn diàn yǐng.', 2],
  ['思う', '觉得', 'jué de', '我觉得很有趣。', 'wǒ jué de hěn yǒu qù.', 2],
  ['知る', '知道', 'zhī dào', '我知道他的名字。', 'wǒ zhī dào tā de míng zi.', 2],
  ['住む', '住', 'zhù', '我住在北京。', 'wǒ zhù zài běi jīng.', 2],
  ['起きる', '起床', 'qǐ chuáng', '我七点起床。', 'wǒ qī diǎn qǐ chuáng.', 2],
  ['寝る', '睡觉', 'shuì jiào', '我十点睡觉。', 'wǒ shí diǎn shuì jiào.', 2],
  ['出かける', '出去', 'chū qù', '我要出去买东西。', 'wǒ yào chū qù mǎi dōng xi.', 2],
  ['帰る', '回来', 'huí lái', '我五点回来。', 'wǒ wǔ diǎn huí lái.', 2],
  ['会う', '见面', 'jiàn miàn', '我们明天见面。', 'wǒ men míng tiān jiàn miàn.', 2],
  ['待つ', '等', 'děng', '我等你。', 'wǒ děng nǐ.', 2],
  ['手伝う', '帮助', 'bāng zhù', '我帮助朋友。', 'wǒ bāng zhù péng you.', 2],
  ['運動', '运动', 'yùn dòng', '我喜欢运动。', 'wǒ xǐ huan yùn dòng.', 2],
  ['音楽', '音乐', 'yīn yuè', '我听音乐。', 'wǒ tīng yīn yuè.', 2],
  ['映画', '电影', 'diàn yǐng', '这个电影很好看。', 'zhè ge diàn yǐng hěn hǎo kàn.', 2],
  ['料理', '菜', 'cài', '中国菜很好吃。', 'zhōng guó cài hěn hǎo chī.', 2],
  ['美味しい', '好吃', 'hǎo chī', '这个菜很好吃。', 'zhè ge cài hěn hǎo chī.', 2],
  ['高い', '贵', 'guì', '这个太贵了。', 'zhè ge tài guì le.', 2],
  ['安い', '便宜', 'pián yi', '这个很便宜。', 'zhè ge hěn pián yi.', 2],
  ['新しい', '新', 'xīn', '这是新车。', 'zhè shì xīn chē.', 2],
  ['古い', '旧', 'jiù', '这是旧书。', 'zhè shì jiù shū.', 2],
  ['忙しい', '忙', 'máng', '我很忙。', 'wǒ hěn máng.', 2],
  ['暇', '有空', 'yǒu kòng', '你有空吗？', 'nǐ yǒu kòng ma?', 2],
  ['早い', '早', 'zǎo', '我起得很早。', 'wǒ qǐ de hěn zǎo.', 2],
  ['遅い', '晚', 'wǎn', '今天我来晚了。', 'jīn tiān wǒ lái wǎn le.', 2],
  ['快い', '快', 'kuài', '你走得很快。', 'nǐ zǒu de hěn kuài.', 2],
  ['遅い', '慢', 'màn', '车开得很慢。', 'chē kāi de hěn màn.', 2],
  ['天気', '天气', 'tiān qì', '今天天气很好。', 'jīn tiān tiān qì hěn hǎo.', 2],
  ['雨', '雨', 'yǔ', '今天下雨。', 'jīn tiān xià yǔ.', 2],
  ['雪', '雪', 'xuě', '冬天下雪。', 'dōng tiān xià xuě.', 2],
  ['暑い', '热', 'rè', '夏天很热。', 'xià tiān hěn rè.', 2],
  ['寒い', '冷', 'lěng', '今天很冷。', 'jīn tiān hěn lěng.', 2],
  ['服', '衣服', 'yī fu', '这件衣服很漂亮。', 'zhè jiàn yī fu hěn piào liang.', 2],
  ['靴', '鞋', 'xié', '我买了新鞋。', 'wǒ mǎi le xīn xié.', 2],
  ['体', '身体', 'shēn tǐ', '我身体很好。', 'wǒ shēn tǐ hěn hǎo.', 2],
  ['目', '眼睛', 'yǎn jing', '她的眼睛很大。', 'tā de yǎn jing hěn dà.', 2],
  ['口', '嘴', 'zuǐ', '我嘴疼。', 'wǒ zuǐ téng.', 2],
  ['手', '手', 'shǒu', '我的手很冷。', 'wǒ de shǒu hěn lěng.', 2],
  ['足', '脚', 'jiǎo', '我脚疼。', 'wǒ jiǎo téng.', 2],

  // HSK 3レベル（600語程度から50語選出）
  ['努力', '努力', 'nǔ lì', '我会努力学习。', 'wǒ huì nǔ lì xué xí.', 3],
  ['決定', '决定', 'jué dìng', '我决定去中国。', 'wǒ jué dìng qù zhōng guó.', 3],
  ['準備', '准备', 'zhǔn bèi', '我在准备考试。', 'wǒ zài zhǔn bèi kǎo shì.', 3],
  ['完成', '完成', 'wán chéng', '我完成了作业。', 'wǒ wán chéng le zuò yè.', 3],
  ['始める', '开始', 'kāi shǐ', '我们开始上课吧。', 'wǒ men kāi shǐ shàng kè ba.', 3],
  ['終わる', '结束', 'jié shù', '电影结束了。', 'diàn yǐng jié shù le.', 3],
  ['続ける', '继续', 'jì xù', '请继续说。', 'qǐng jì xù shuō.', 3],
  ['停める', '停止', 'tíng zhǐ', '请停止说话。', 'qǐng tíng zhǐ shuō huà.', 3],
  ['選ぶ', '选择', 'xuǎn zé', '请选择你喜欢的。', 'qǐng xuǎn zé nǐ xǐ huan de.', 3],
  ['比較', '比较', 'bǐ jiào', '请比较这两个。', 'qǐng bǐ jiào zhè liǎng ge.', 3],
  ['発見', '发现', 'fā xiàn', '我发现了问题。', 'wǒ fā xiàn le wèn tí.', 3],
  ['研究', '研究', 'yán jiū', '我研究中国历史。', 'wǒ yán jiū zhōng guó lì shǐ.', 3],
  ['分析', '分析', 'fēn xī', '请分析这个问题。', 'qǐng fēn xī zhè ge wèn tí.', 3],
  ['説明', '说明', 'shuō míng', '请说明一下。', 'qǐng shuō míng yī xià.', 3],
  ['討論', '讨论', 'tǎo lùn', '我们讨论这个话题。', 'wǒ men tǎo lùn zhè ge huà tí.', 3],
  ['発表', '发表', 'fā biǎo', '明天我要发表演讲。', 'míng tiān wǒ yào fā biǎo yǎn jiǎng.', 3],
  ['参加', '参加', 'cān jiā', '我参加会议。', 'wǒ cān jiā huì yì.', 3],
  ['組織', '组织', 'zǔ zhī', '我们组织活动。', 'wǒ men zǔ zhī huó dòng.', 3],
  ['管理', '管理', 'guǎn lǐ', '他管理这个项目。', 'tā guǎn lǐ zhè ge xiàng mù.', 3],
  ['責任', '责任', 'zé rèn', '这是我的责任。', 'zhè shì wǒ de zé rèn.', 3],
  ['経験', '经验', 'jīng yàn', '他有很多经验。', 'tā yǒu hěn duō jīng yàn.', 3],
  ['能力', '能力', 'néng lì', '我的能力有限。', 'wǒ de néng lì yǒu xiàn.', 3],
  ['機会', '机会', 'jī huì', '这是好机会。', 'zhè shì hǎo jī huì.', 3],
  ['条件', '条件', 'tiáo jiàn', '条件很重要。', 'tiáo jiàn hěn zhòng yào.', 3],
  ['環境', '环境', 'huán jìng', '环境很好。', 'huán jìng hěn hǎo.', 3],
  ['社会', '社会', 'shè huì', '现代社会很复杂。', 'xiàn dài shè huì hěn fù zá.', 3],
  ['文化', '文化', 'wén huà', '中国文化很有趣。', 'zhōng guó wén huà hěn yǒu qù.', 3],
  ['歴史', '历史', 'lì shǐ', '我学习中国历史。', 'wǒ xué xí zhōng guó lì shǐ.', 3],
  ['政治', '政治', 'zhèng zhì', '我不谈政治。', 'wǒ bù tán zhèng zhì.', 3],
  ['経済', '经济', 'jīng jì', '经济发展很快。', 'jīng jì fā zhǎn hěn kuài.', 3],
  ['教育', '教育', 'jiào yù', '教育很重要。', 'jiào yù hěn zhòng yào.', 3],
  ['科学', '科学', 'kē xué', '科学技术发达。', 'kē xué jì shù fā dá.', 3],
  ['技術', '技术', 'jì shù', '这是新技术。', 'zhè shì xīn jì shù.', 3],
  ['交通', '交通', 'jiāo tōng', '交通很方便。', 'jiāo tōng hěn fāng biàn.', 3],
  ['旅行', '旅游', 'lǚ yóu', '我喜欢旅游。', 'wǒ xǐ huan lǚ yóu.', 3],
  ['健康', '健康', 'jiàn kāng', '健康最重要。', 'jiàn kāng zuì zhòng yào.', 3],
  ['安全', '安全', 'ān quán', '安全第一。', 'ān quán dì yī.', 3],
  ['危険', '危险', 'wēi xiǎn', '这里很危险。', 'zhè lǐ hěn wēi xiǎn.', 3],
  ['成功', '成功', 'chéng gōng', '我希望你成功。', 'wǒ xī wàng nǐ chéng gōng.', 3],
  ['失敗', '失败', 'shī bài', '失败是成功之母。', 'shī bài shì chéng gōng zhī mǔ.', 3],

  // HSK 4レベル（1200語程度から40語選出）
  ['態度', '态度', 'tài du', '他的态度很好。', 'tā de tài du hěn hǎo.', 4],
  ['性格', '性格', 'xìng gé', '她性格很开朗。', 'tā xìng gé hěn kāi lǎng.', 4],
  ['習慣', '习惯', 'xí guàn', '我习惯早起。', 'wǒ xí guàn zǎo qǐ.', 4],
  ['興味', '兴趣', 'xìng qù', '我对音乐有兴趣。', 'wǒ duì yīn yuè yǒu xìng qù.', 4],
  ['趣味', '爱好', 'ài hào', '我的爱好是读书。', 'wǒ de ài hào shì dú shū.', 4],
  ['特徴', '特点', 'tè diǎn', '这个城市的特点是什么？', 'zhè ge chéng shì de tè diǎn shì shén me?', 4],
  ['優点', '优点', 'yōu diǎn', '他有很多优点。', 'tā yǒu hěn duō yōu diǎn.', 4],
  ['欠点', '缺点', 'quē diǎn', '每个人都有缺点。', 'měi ge rén dōu yǒu quē diǎn.', 4],
  ['影響', '影响', 'yǐng xiǎng', '这件事影响很大。', 'zhè jiàn shì yǐng xiǎng hěn dà.', 4],
  ['関係', '关系', 'guān xi', '我们关系很好。', 'wǒ men guān xi hěn hǎo.', 4],
  ['原因', '原因', 'yuán yīn', '什么原因？', 'shén me yuán yīn?', 4],
  ['結果', '结果', 'jié guǒ', '结果很好。', 'jié guǒ hěn hǎo.', 4],
  ['目的', '目的', 'mù dì', '你的目的是什么？', 'nǐ de mù dì shì shén me?', 4],
  ['方法', '方法', 'fāng fǎ', '这个方法很好。', 'zhè ge fāng fǎ hěn hǎo.', 4],
  ['過程', '过程', 'guò chéng', '学习是一个过程。', 'xué xí shì yī ge guò chéng.', 4],
  ['進歩', '进步', 'jìn bù', '你进步很快。', 'nǐ jìn bù hěn kuài.', 4],
  ['発展', '发展', 'fā zhǎn', '经济发展很快。', 'jīng jì fā zhǎn hěn kuài.', 4],
  ['変化', '变化', 'biàn huà', '社会变化很大。', 'shè huì biàn huà hěn dà.', 4],
  ['改善', '改善', 'gǎi shàn', '我们要改善环境。', 'wǒ men yào gǎi shàn huán jìng.', 4],
  ['向上', '提高', 'tí gāo', '我要提高中文水平。', 'wǒ yào tí gāo zhōng wén shuǐ píng.', 4],
  ['計画', '计划', 'jì huà', '你有什么计划？', 'nǐ yǒu shén me jì huà?', 4],
  ['予定', '安排', 'ān pái', '明天的安排是什么？', 'míng tiān de ān pái shì shén me?', 4],
  ['約束', '约定', 'yuē dìng', '我们约定明天见面。', 'wǒ men yuē dìng míng tiān jiàn miàn.', 4],
  ['要求', '要求', 'yāo qiú', '老师的要求很严格。', 'lǎo shī de yāo qiú hěn yán gé.', 4],
  ['希望', '希望', 'xī wàng', '我希望你成功。', 'wǒ xī wàng nǐ chéng gōng.', 4],
  ['期待', '期待', 'qī dài', '我期待你的回答。', 'wǒ qī dài nǐ de huí dá.', 4],
  ['予想', '预测', 'yù cè', '天气预测说明天下雨。', 'tiān qì yù cè shuō míng tiān xià yǔ.', 4],
  ['判断', '判断', 'pàn duàn', '你的判断是对的。', 'nǐ de pàn duàn shì duì de.', 4],
  ['意見', '意见', 'yì jiàn', '你有什么意见？', 'nǐ yǒu shén me yì jiàn?', 4],
  ['建議', '建议', 'jiàn yì', '我建议你早点休息。', 'wǒ jiàn yì nǐ zǎo diǎn xiū xi.', 4],
  ['提案', '提议', 'tí yì', '我有个提议。', 'wǒ yǒu ge tí yì.', 4],
  ['批判', '批评', 'pī píng', '老师批评了我。', 'lǎo shī pī píng le wǒ.', 4],
  ['賞賛', '表扬', 'biǎo yáng', '老师表扬了他。', 'lǎo shī biǎo yáng le tā.', 4],
  ['励まし', '鼓励', 'gǔ lì', '谢谢你的鼓励。', 'xiè xie nǐ de gǔ lì.', 4],
  ['支持', '支持', 'zhī chí', '谢谢你的支持。', 'xiè xie nǐ de zhī chí.', 4],
  ['反対', '反对', 'fǎn duì', '我反对这个计划。', 'wǒ fǎn duì zhè ge jì huà.', 4],
  ['賛成', '赞成', 'zàn chéng', '我赞成你的意见。', 'wǒ zàn chéng nǐ de yì jiàn.', 4],
  ['合意', '同意', 'tóng yì', '我同意你的看法。', 'wǒ tóng yì nǐ de kàn fǎ.', 4],
  ['拒絶', '拒绝', 'jù jué', '我拒绝这个提议。', 'wǒ jù jué zhè ge tí yì.', 4],
  ['受け入れ', '接受', 'jiē shòu', '我接受你的道歉。', 'wǒ jiē shòu nǐ de dào qiàn.', 4],

  // HSK 5レベル（2500語程度から30語選出）
  ['価値', '价值', 'jiā zhí', '这本书很有价值。', 'zhè běn shū hěn yǒu jiā zhí.', 5],
  ['意義', '意义', 'yì yì', '这件事很有意义。', 'zhè jiàn shì hěn yǒu yì yì.', 5],
  ['効果', '效果', 'xiào guǒ', '这个药效果很好。', 'zhè ge yào xiào guǒ hěn hǎo.', 5],
  ['質', '质量', 'zhì liàng', '这个产品质量很好。', 'zhè ge chǎn pǐn zhì liàng hěn hǎo.', 5],
  ['数量', '数量', 'shù liàng', '数量不够。', 'shù liàng bù gòu.', 5],
  ['規模', '规模', 'guī mó', '这个项目规模很大。', 'zhè ge xiàng mù guī mó hěn dà.', 5],
  ['範囲', '范围', 'fàn wéi', '这个在我的范围内。', 'zhè ge zài wǒ de fàn wéi nèi.', 5],
  ['程度', '程度', 'chéng dù', '污染程度很严重。', 'wū rǎn chéng dù hěn yán zhòng.', 5],
  ['水準', '水平', 'shuǐ píng', '我的中文水平不高。', 'wǒ de zhōng wén shuǐ píng bù gāo.', 5],
  ['標準', '标准', 'biāo zhǔn', '这是国际标准。', 'zhè shì guó jì biāo zhǔn.', 5],
  ['原則', '原则', 'yuán zé', '这是我的原则。', 'zhè shì wǒ de yuán zé.', 5],
  ['規則', '规则', 'guī zé', '请遵守规则。', 'qǐng zūn shǒu guī zé.', 5],
  ['法律', '法律', 'fǎ lǜ', '法律面前人人平等。', 'fǎ lǜ miàn qián rén rén píng děng.', 5],
  ['權利', '权利', 'quán lì', '这是我的权利。', 'zhè shì wǒ de quán lì.', 5],
  ['義務', '义务', 'yì wù', '这是我的义务。', 'zhè shì wǒ de yì wù.', 5],
  ['競争', '竞争', 'jìng zhēng', '市场竞争很激烈。', 'shì chǎng jìng zhēng hěn jī liè.', 5],
  ['協力', '合作', 'hé zuò', '我们需要合作。', 'wǒ men xū yào hé zuò.', 5],
  ['交流', '交流', 'jiāo liú', '文化交流很重要。', 'wén huà jiāo liú hěn zhòng yào.', 5],
  ['疎通', '沟通', 'gōu tōng', '我们需要沟通。', 'wǒ men xū yào gōu tōng.', 5],
  ['理解', '理解', 'lǐ jiě', '我理解你的感受。', 'wǒ lǐ jiě nǐ de gǎn shòu.', 5],
  ['誤解', '误解', 'wù jiě', '这是个误解。', 'zhè shì ge wù jiě.', 5],
  ['矛盾', '矛盾', 'máo dùn', '这里有矛盾。', 'zhè lǐ yǒu máo dùn.', 5],
  ['衝突', '冲突', 'chōng tū', '我们要避免冲突。', 'wǒ men yào bì miǎn chōng tū.', 5],
  ['解決', '解决', 'jiě jué', '我们要解决问题。', 'wǒ men yào jiě jué wèn tí.', 5],
  ['処理', '处理', 'chǔ lǐ', '怎么处理这个问题？', 'zěn me chǔ lǐ zhè ge wèn tí?', 5],
  ['対応', '对待', 'duì dài', '他对待工作很认真。', 'tā duì dài gōng zuò hěn rèn zhēn.', 5],
  ['態度', '对待', 'duì dài', '你怎么对待这件事？', 'nǐ zěn me duì dài zhè jiàn shì?', 5],
  ['評価', '评价', 'píng jià', '你对他的评价如何？', 'nǐ duì tā de píng jià rú hé?', 5],
  ['判定', '判定', 'pàn dìng', '法官做出了判定。', 'fǎ guān zuò chū le pàn dìng.', 5],
  ['証明', '证明', 'zhèng míng', '事实证明他是对的。', 'shì shí zhèng míng tā shì duì de.', 5],

  // HSK 6レベル（5000語程度から20語選出）
  ['概念', '概念', 'gài niàn', '这个概念很抽象。', 'zhè ge gài niàn hěn chōu xiàng.', 6],
  ['理論', '理论', 'lǐ lùn', '理论和实践要结合。', 'lǐ lùn hé shí jiàn yào jié hé.', 6],
  ['実践', '实践', 'shí jiàn', '实践是检验真理的标准。', 'shí jiàn shì jiǎn yàn zhēn lǐ de biāo zhǔn.', 6],
  ['抽象', '抽象', 'chōu xiàng', '这个概念太抽象了。', 'zhè ge gài niàn tài chōu xiàng le.', 6],
  ['具体', '具体', 'jù tǐ', '请说得具体一点。', 'qǐng shuō de jù tǐ yī diǎn.', 6],
  ['複雑', '复杂', 'fù zá', '这个问题很复杂。', 'zhè ge wèn tí hěn fù zá.', 6],
  ['単純', '简单', 'jiǎn dān', '这个问题很简单。', 'zhè ge wèn tí hěn jiǎn dān.', 6],
  ['精確', '精确', 'jīng què', '这个数据很精确。', 'zhè ge shù jù hěn jīng què.', 6],
  ['曖昧', '模糊', 'mó hu', '这个说法很模糊。', 'zhè ge shuō fǎ hěn mó hu.', 6],
  ['客観', '客观', 'kè guān', '我们要客观分析。', 'wǒ men yào kè guān fēn xī.', 6],
  ['主観', '主观', 'zhǔ guān', '这是主观看法。', 'zhè shì zhǔ guān kàn fǎ.', 6],
  ['全面', '全面', 'quán miàn', '我们要全面考虑。', 'wǒ men yào quán miàn kǎo lǜ.', 6],
  ['部分', '部分', 'bù fen', '这只是部分原因。', 'zhè zhǐ shì bù fen yuán yīn.', 6],
  ['整体', '整体', 'zhěng tǐ', '要从整体考虑。', 'yào cóng zhěng tǐ kǎo lǜ.', 6],
  ['系統', '系统', 'xì tǒng', '这是一个完整的系统。', 'zhè shì yī ge wán zhěng de xì tǒng.', 6],
  ['構造', '结构', 'jié gòu', '这个结构很复杂。', 'zhè ge jié gòu hěn fù zá.', 6],
  ['機能', '功能', 'gōng néng', '这个功能很有用。', 'zhè ge gōng néng hěn yǒu yòng.', 6],
  ['効率', '效率', 'xiào lǜ', '我们要提高效率。', 'wǒ men yào tí gāo xiào lǜ.', 6],
  ['創新', '创新', 'chuàng xīn', '我们需要创新思维。', 'wǒ men xū yào chuàng xīn sī wéi.', 6],
  ['革新', '革新', 'gé xīn', '技术革新很重要。', 'jì shù gé xīn hěn zhòng yào.', 6]
];

// CSVヘッダー
const headers = ['日本語', '中国語', '拼音', '例文', '例文拼音', 'HSKレベル'];

// CSVフォーマットに変換
const csvContent = [headers, ...vocabularyData]
  .map(row => row.map(cell => `"${cell}"`).join(','))
  .join('\n');

// ファイルに保存
const outputPath = path.join(process.cwd(), 'comprehensive-vocabulary.csv');
fs.writeFileSync(outputPath, csvContent, 'utf8');

console.log(`✅ 包括的な単語データCSVファイルを作成しました: ${outputPath}`);
console.log(`📝 ${vocabularyData.length}個の単語が含まれています\n`);

console.log('HSKレベル別内訳:');
const levelCounts = vocabularyData.reduce((acc, row) => {
  const level = row[5];
  acc[level] = (acc[level] || 0) + 1;
  return acc;
}, {});

Object.entries(levelCounts).forEach(([level, count]) => {
  console.log(`  HSK ${level}: ${count}個`);
});

console.log('\n特徴:');
console.log('- HSK1: 基本的な挨拶、数字、基本動詞');
console.log('- HSK2: 日常生活、時間、感情表現');
console.log('- HSK3: 社会、文化、抽象概念');
console.log('- HSK4: 心理、関係性、複雑な概念');
console.log('- HSK5: 価値観、制度、専門用語');
console.log('- HSK6: 哲学、理論、高度な抽象概念');

console.log('\n次のステップ:');
console.log('1. comprehensive-vocabulary.csvをGoogleスプレッドシートにインポート');
console.log('2. npm run setup-sheets でAPI設定');
console.log('3. npm run dev でアプリを起動し、すべてのレベルをテスト\n');