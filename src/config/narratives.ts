/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 叙事配置 - 为每个年代/风格添加故事背景和文化上下文
 */

export interface NarrativeCard {
  decade: string;
  eraName: string;
  yearRange?: string;         // 年份范围（可选，从eras.ts获取）
  headline: string;           // 档案卡标题
  subheadline: string;        // 副标题
  culturalIcon: string;       // 文化偶像
  iconicEvent: string;        // 标志性事件
  fashionQuote: string;       // 时尚名言
  musicVibe: string;          // 音乐氛围
  movieReference: string;     // 电影参考
  funFact: string;            // 趣闻
  aestheticDescription: string; // 美学描述
  coverLines: string[];       // 封面文案
  colorPalette?: string[];    // 配色方案（可选，从eras.ts获取）
}

export interface MagazineNarrative {
  magazineId: string;
  foundingYear: number;
  philosophy: string;         // 杂志哲学
  legendaryEditor: string;    // 传奇主编
  signatureStyle: string;     // 标志性风格
  famousCover: string;        // 著名封面
}

export const eraNarratives: Record<string, NarrativeCard> = {
  '1920s': {
    decade: '1920s',
    eraName: 'Roaring Twenties',
    headline: '爵士时代的黎明',
    subheadline: '女性获得投票权，裙摆开始飞扬',
    culturalIcon: 'Coco Chanel',
    iconicEvent: '1925年巴黎装饰艺术博览会',
    fashionQuote: '时尚易逝，风格永存。—— Coco Chanel',
    musicVibe: 'Louis Armstrong 的爵士乐，Speakeasy 地下酒吧',
    movieReference: '《了不起的盖茨比》(1925小说)',
    funFact: '女性第一次在公共场合吸烟，被称为"火炬女孩"',
    aestheticDescription: 'Art Deco几何图案、流苏裙摆、钟形帽，一种既优雅又反叛的美学',
    coverLines: [
      'The New Woman of Tomorrow',
      'Jazz Age Glamour Unleashed',
      'Flappers Rule the Night'
    ]
  },
  '1930s': {
    decade: '1930s',
    eraName: 'Golden Age of Hollywood',
    headline: '好莱坞黄金时代',
    subheadline: '在大萧条中寻找梦幻',
    culturalIcon: 'Greta Garbo',
    iconicEvent: '1939年《乱世佳人》上映',
    fashionQuote: '我只想一个人呆着。—— Greta Garbo',
    musicVibe: 'Fred Astaire 的踢踏舞，优雅的摇摆乐',
    movieReference: '《摩登时代》《一夜风流》',
    funFact: 'bias cut（斜裁）技术发明，让裙子能贴合身体曲线',
    aestheticDescription: '好莱坞柔光、斜裁礼服、宽肩套装，在困境中保持优雅',
    coverLines: [
      'Silver Screen Dreams',
      'Glamour in Hard Times',
      'The Garbo Mystique'
    ]
  },
  '1940s': {
    decade: '1940s',
    eraName: 'Wartime & Post-War',
    headline: '女性力量的崛起',
    subheadline: '铆钉女工Rosie成为时代偶像',
    culturalIcon: 'Rosie the Riveter',
    iconicEvent: '1947年Dior发布"New Look"',
    fashionQuote: '我们能做到！—— Rosie the Riveter',
    musicVibe: 'Bing Crosby 的抒情歌曲，Andrews Sisters',
    movieReference: '《卡萨布兰卡》《出水芙蓉》',
    funFact: '由于战时物资短缺，尼龙丝袜成了奢侈品，女性用笔画"袜子缝线"',
    aestheticDescription: '实用主义时尚、垫肩强调、收腰设计、红唇成为爱国主义象征',
    coverLines: [
      'Victory in Style',
      'The New Look Arrives',
      'Fashion Fights On'
    ]
  },
  '1950s': {
    decade: '1950s',
    eraName: 'Golden Age of Couture',
    headline: '黄金年代的优雅',
    subheadline: '战后繁荣，女性化回归',
    culturalIcon: 'Audrey Hepburn',
    iconicEvent: '1953年《罗马假日》上映',
    fashionQuote: '优雅是唯一不会褪色的美。—— Audrey Hepburn',
    musicVibe: 'Elvis Presley 的摇滚，Billie Holiday 的蓝调',
    movieReference: '《蒂凡尼的早餐》《后窗》',
    funFact: 'Dior的"New Look"用了20码布料，招致战时节约主义者的抗议',
    aestheticDescription: '沙漏型身材、圆裙、细腰、猫眼镜、珍珠项链，完美的50年代甜心',
    coverLines: [
      'The Perfect Hourglass',
      'Couture Dreams Come True',
      'Audrey\'s Timeless Charm'
    ]
  },
  '1960s': {
    decade: '1960s',
    eraName: 'Swinging Sixties',
    headline: '青春革命',
    subheadline: '迷你裙与太空竞赛',
    culturalIcon: 'Twiggy',
    iconicEvent: '1969年人类登月',
    fashionQuote: '未来就是现在。—— Pierre Cardin',
    musicVibe: 'The Beatles, The Rolling Stones, 迷幻摇滚',
    movieReference: '《2001太空漫游》《毕业生》',
    funFact: 'Mary Quant发明迷你裙时说："好品味是死亡之吻"',
    aestheticDescription: '几何图案、A字裙、太空时代风格、波普艺术、迷你裙',
    coverLines: [
      'Youthquake!',
      'Space Age Fashion',
      'London Swings'
    ]
  },
  '1970s': {
    decade: '1970s',
    eraName: 'Disco & Bohemian',
    headline: '迪斯科与波西米亚',
    subheadline: 'Studio 54的狂欢夜',
    culturalIcon: 'Farrah Fawcett',
    iconicEvent: '1977年《周末夜狂热》上映',
    fashionQuote: '如果你能记得70年代，说明你根本没在那儿。—— Robin Williams',
    musicVibe: 'Donna Summer, Bee Gees, 迪斯科节拍',
    movieReference: '《周末夜狂热》《油脂》',
    funFact: '平台鞋的高度可达6英寸，走路成了一项极限运动',
    aestheticDescription: '喇叭裤、平台鞋、裹身裙、迪斯科亮片、波西米亚流苏',
    coverLines: [
      'Disco Inferno!',
      'Bohemian Rhapsody',
      'Studio 54 Dreams'
    ]
  },
  '1980s': {
    decade: '1980s',
    eraName: 'Excess & Power',
    headline: '贪婪是好的',
    subheadline: '权力着装与MTV一代',
    culturalIcon: 'Madonna',
    iconicEvent: '1981年MTV开播',
    fashionQuote: '我很强势，我很有野心，我知道我想要什么。—— Madonna',
    musicVibe: 'Michael Jackson, Madonna, Prince',
    movieReference: '《华尔街》《闪电舞》',
    funFact: '肩垫大到需要专门的"肩垫包"来存放备用肩垫',
    aestheticDescription: '大 shoulder pads、霓虹色、健身时尚、朋克元素、权力套装',
    coverLines: [
      'Power Dressing!',
      'Material Girl Era',
      'I Want My MTV'
    ]
  },
  '1990s': {
    decade: '1990s',
    eraName: 'Minimalism & Grunge',
    headline: '反时尚的时尚',
    subheadline: '垃圾摇滚与极简主义',
    culturalIcon: 'Kate Moss',
    iconicEvent: '1991年Nirvana《Nevermind》发行',
    fashionQuote: 'Nothing tastes as good as skinny feels.（争议）—— Kate Moss',
    musicVibe: 'Nirvana, Tupac, Notorious B.I.G., 辣妹组合',
    movieReference: '《独领风骚》《低俗小说》',
    funFact: '"Heroin chic"（海洛因时髦）潮流因Kurt Cobain逝世而终结',
    aestheticDescription: 'Grunge法兰绒、吊带裙、choker项圈、Doc Martens、极简主义',
    coverLines: [
      'Grunge & Glamour',
      'Heroin Chic Era',
      'Gen X Takes Over'
    ]
  },
  '2000s': {
    decade: '2000s',
    eraName: 'Y2K & Digital',
    headline: '千禧年 optimism',
    subheadline: '低腰裤与Juicy Couture',
    culturalIcon: 'Paris Hilton',
    iconicEvent: '2006年Twitter上线',
    fashionQuote: 'Dress cute wherever you go, life is too short to blend in. — Paris Hilton',
    musicVibe: 'Britney Spears, Lady Gaga, Justin Timberlake',
    movieReference: '《穿普拉达的女王》《贱女孩》',
    funFact: 'Von Dutch卡车司机帽曾是身份象征，如今成了时尚反面教材',
    aestheticDescription: '低腰牛仔裤、Juicy运动套装、蝴蝶发夹、露脐装、Y2K未来风',
    coverLines: [
      'Y2K Baby!',
      'Juicy Couture Era',
      'That\'s Hot!'
    ]
  },
  '2010s': {
    decade: '2010s',
    eraName: 'Instagram Era',
    headline: '网红时代',
    subheadline: 'Instagram滤镜与运动休闲风',
    culturalIcon: 'Kim Kardashian',
    iconicEvent: '2010年Instagram上线',
    fashionQuote: '我不做时尚，我就是时尚。—— Kim Kardashian',
    musicVibe: 'Taylor Swift, Drake, Billie Eilish',
    movieReference: '《一个明星的诞生》《疯狂动物城》',
    funFact: 'The"dad sneaker"（老爹鞋）潮流证明了丑就是新的帅',
    aestheticDescription: '运动休闲风、Normcore极简、街头时尚、Instagram妆容、轮廓塑形',
    coverLines: [
      'Influencer Style',
      'Athleisure Takes Over',
      'Instagram Perfect'
    ]
  },
  '2020s': {
    decade: '2020s',
    eraName: 'Post-Pandemic',
    headline: '静奢风与元宇宙',
    subheadline: '疫情后的时尚反思',
    culturalIcon: 'Zendaya',
    iconicEvent: '2023年ChatGPT发布',
    fashionQuote: '时尚是你表达自己的一种方式。—— Zendaya',
    musicVibe: 'Olivia Rodrigo, Bad Bunny, 全球流行',
    movieReference: '《芭比》《奥本海默》',
    funFact: 'Barbiecore（芭比粉）潮流因一部电影席卷全球',
    aestheticDescription: '静奢风、Clean Girl美学、可持续时尚、Metaverse虚拟服装、Cottagecore',
    coverLines: [
      'Quiet Luxury',
      'Barbiecore Summer',
      'Sustainable Chic'
    ]
  },
  '2030s': {
    decade: '2030s',
    eraName: 'Neo-Human',
    headline: '新人类纪元',
    subheadline: '气候适应型时尚',
    culturalIcon: '未来的你',
    iconicEvent: '第一个永久月球基地建立',
    fashionQuote: '时尚不是跟随潮流，而是创造未来。—— 未来的你',
    musicVibe: 'AI创作的音乐，脑机接口直接播放',
    movieReference: '《银翼杀手2099》',
    funFact: '智能面料可以根据心情改变颜色',
    aestheticDescription: '生物整合服装、气候响应面料、太阳能纺织、简约未来主义',
    coverLines: [
      'Bio-Integrated Fashion',
      'Climate-Adaptive Style',
      'Neo-Human Elegance'
    ]
  },
  '2040s': {
    decade: '2040s',
    eraName: 'Transhumanist',
    headline: '超人类主义',
    subheadline: '赛博美学的崛起',
    culturalIcon: 'Enhanced Human',
    iconicEvent: '首例大脑芯片商业植入',
    fashionQuote: '人类是可以改进的作品。—— 超人类宣言',
    musicVibe: '神经音乐，直接刺激愉悦中枢',
    movieReference: '《攻壳机动队 2045》',
    funFact: 'AR眼镜成了"新的美瞳"',
    aestheticDescription: '赛博朋克美学、纳米纤维服装、情绪响应面料、后性别时尚、全息高定',
    coverLines: [
      'Cybernetic Elegance',
      'Post-Gender Glamour',
      'Beyond Human'
    ]
  },
  '2050s': {
    decade: '2050s',
    eraName: 'Post-Singular',
    headline: '后奇点时代',
    subheadline: '意识表达时尚',
    culturalIcon: 'Cosmic Self',
    iconicEvent: '意识上传技术验证',
    fashionQuote: '我们的穿着就是我们思想的外在表现。—— 宇宙哲学家',
    musicVibe: '宇宙共振音乐，与星系同步振动',
    movieReference: '《星际穿越2》',
    funFact: '衣服可以读取你的情绪并实时调整外观',
    aestheticDescription: '量子面料、意识响应服装、星际优雅、能量美学、超验时尚',
    coverLines: [
      'Consciousness Couture',
      'Cosmic Elegance',
      'Beyond Physical'
    ]
  },
  '2100s': {
    decade: '2100s',
    eraName: 'Galactic Civilization',
    headline: '星际文明',
    subheadline: '跨星球时尚',
    culturalIcon: 'Galactic Citizen',
    iconicEvent: '银河系时尚周开幕',
    fashionQuote: '在宇宙中，唯一的限制是你的想象力。—— 银河时尚编辑',
    musicVibe: '星尘交响曲，由超新星数据创作',
    movieReference: '《银河漫游指南 终极版》',
    funFact: '零重力时装秀成为最大的时尚盛事',
    aestheticDescription: '星际高定、反重力轮廓、多行星时尚、恒星面料、宇宙优雅',
    coverLines: [
      'Interstellar Couture',
      'Galactic Glamour',
      'Fashion Beyond Earth'
    ]
  }
};

export const magazineNarratives: Record<string, MagazineNarrative> = {
  'bazaar': {
    magazineId: 'bazaar',
    foundingYear: 1867,
    philosophy: '时尚是艺术，不是商业',
    legendaryEditor: 'Carmel Snow',
    signatureStyle: '博物馆级别的时尚摄影',
    famousCover: '1992年3月号，Linda Evangelista 裸身登场'
  },
  'vogue': {
    magazineId: 'vogue',
    foundingYear: 1892,
    philosophy: '我们定义时尚，其他人跟随',
    legendaryEditor: 'Anna Wintour',
    signatureStyle: '奢华、大胆、超模文化',
    famousCover: '1973年8月号，Lauren Hutton 穿牛仔裤'
  },
  'elle': {
    magazineId: 'elle',
    foundingYear: 1945,
    philosophy: '时尚应该是有趣的、可及的',
    legendaryEditor: 'Francoise Giroud',
    signatureStyle: '巴黎式的轻松优雅',
    famousCover: '1960年代，Twiggy 成为 Elle 的标志'
  },
  'gq': {
    magazineId: 'gq',
    foundingYear: 1931,
    philosophy: '绅士不仅是穿着，更是生活方式',
    legendaryEditor: 'Art Cooper',
    signatureStyle: '成熟、都市、精致',
    famousCover: '1993年2月号，Bill Clinton 当选总统'
  },
  'vanity-fair': {
    magazineId: 'vanity-fair',
    foundingYear: 1913,
    philosophy: '名人、政治、艺术的完美融合',
    legendaryEditor: 'Graydon Carter',
    signatureStyle: '戏剧性肖像、文学深度',
    famousCover: '1991年8月号，Demi Moore 全裸孕照'
  },
  'lofficiel': {
    magazineId: 'lofficiel',
    foundingYear: 1921,
    philosophy: '前卫，永远向前一步',
    legendaryEditor: 'Yves Saint Laurent',
    signatureStyle: '艺术、实验、前沿',
    famousCover: '1960年代，与毕加索合作的特刊'
  },
  'interview': {
    magazineId: 'interview',
    foundingYear: 1969,
    philosophy: '名人之间的对话，波普艺术的精神',
    legendaryEditor: 'Andy Warhol',
    signatureStyle: '宝丽来风格、名人文化',
    famousCover: '1972年，Mick Jagger 宝丽来肖像'
  },
  'id-magazine': {
    magazineId: 'id-magazine',
    foundingYear: 1980,
    philosophy: '街头文化，青年声音，真实态度',
    legendaryEditor: 'Terry Jones',
    signatureStyle: '纪实风格、青春能量',
    famousCover: '1990年代，Kate Moss 眨眼封面'
  },
  'w-magazine': {
    magazineId: 'w-magazine',
    foundingYear: 1972,
    philosophy: '时尚是艺术表达的终极形式',
    legendaryEditor: 'Stefano Tonchi',
    signatureStyle: '概念性、美术馆品质',
    famousCover: '2014年12月号，Kim Kardashian 全裸油封面'
  }
};

// 获取叙事卡片
export const getNarrativeByDecade = (decade: string): NarrativeCard | undefined => {
  return eraNarratives[decade];
};

// 获取杂志叙事
export const getMagazineNarrative = (magazineId: string): MagazineNarrative | undefined => {
  return magazineNarratives[magazineId];
};

// 获取随机封面文案
export const getRandomCoverLine = (decade: string): string => {
  const narrative = eraNarratives[decade];
  if (!narrative) return 'The Icon';
  return narrative.coverLines[Math.floor(Math.random() * narrative.coverLines.length)];
};
