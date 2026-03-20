/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 年代配置 - 定义支持的年代及其风格特征
 */

export interface EraConfig {
  id: string;
  decade: string;            // e.g., '1970s'
  year: number;               // e.g., 1975
  yearRange: string;          // e.g., '1970-1979'
  displayName: string;        // e.g., '1970s'
  eraName?: string;          // e.g., 'Disco Era'
  
  fashionKeywords: string[];  // 服装关键词
  hairstyleKeywords: string[]; // 发型关键词
  makeupKeywords: string[];   // 妆容关键词
  lightingStyle: string;       // 光线风格
  colorPalette: string[];      // 配色方案
  mood: string;                // 整体氛围
  culturalContext: string;     // 文化背景
  
  // 时代特征描述
  characteristics: {
    style: string[];
    accessories: string[];
    fabrics: string[];
    silhouettes: string[];
  };
  
  // 杂志封面的特定元素
  coverElements?: {
    headlines: string[];
    themes: string[];
  };
}

export const eras: EraConfig[] = [
  // ===== 历史年代 =====
  {
    id: '1920s',
    decade: '1920s',
    year: 1925,
    yearRange: '1920-1929',
    displayName: '1920s',
    eraName: 'Roaring Twenties',
    fashionKeywords: [
      'flapper dress',
      'drop waist',
      'beaded fringe',
      'art deco patterns',
      'cloche hat',
      'long pearl necklace',
      't-strap heels',
    ],
    hairstyleKeywords: [
      'bob cut',
      'finger waves',
      'Marcel wave',
      'cloche styling',
    ],
    makeupKeywords: [
      'bold red lips',
      'thin arched eyebrows',
      'rosy cheeks',
      'dark eyeshadow',
    ],
    lightingStyle: 'soft diffused light, art deco glamour, venetian blind shadows',
    colorPalette: ['#1a1a2e', '#d4af37', '#c0c0c0', '#8b0000', '#f5f5dc'],
    mood: 'glamorous rebellion, jazz age excess, speakeasy elegance',
    culturalContext: 'Prohibition Era, Jazz Age, Art Deco, women suffrage movement',
    characteristics: {
      style: ['flapper', 'art deco', 'roaring twenties', 'speakeasy chic'],
      accessories: ['pearls', 'feathers', 'headbands', 't-straps'],
      fabrics: ['silk', 'chiffon', 'velvet', 'beaded fabrics'],
      silhouettes: ['drop waist', 'straight', 'relaxed fit'],
    },
    coverElements: {
      headlines: ['The New Woman', 'Jazz Age Glamour', 'Flapper Chic'],
      themes: ['independence', 'liberation', 'celebration'],
    },
  },
  {
    id: '1930s',
    decade: '1930s',
    year: 1935,
    yearRange: '1930-1939',
    displayName: '1930s',
    eraName: 'Golden Age of Hollywood',
    fashionKeywords: [
      'bias cut gown',
      'silk charmeuse',
      'halter neck',
      'ruched details',
      'shoulder pads',
      'wide leg trousers',
      'fedoras',
    ],
    hairstyleKeywords: [
      'finger waves',
      'victory rolls',
      'long waves',
      'pageboy bob',
    ],
    makeupKeywords: [
      'sculpted brows',
      'full lips',
      'glowing complexion',
      'defined cheekbones',
    ],
    lightingStyle: 'classic Hollywood glamour lighting, soft focus, dramatic shadows',
    colorPalette: ['#000000', '#d4af37', '#800020', '#f0e68c', '#2f4f4f'],
    mood: 'silver screen elegance, old Hollywood glamour, sophisticated romance',
    culturalContext: 'Great Depression, Golden Age of Hollywood, Art Deco高峰',
    characteristics: {
      style: ['hollywood glamour', 'old money', 'silver screen'],
      accessories: ['furs', 'diamonds', 'gloves', 'fedoras'],
      fabrics: ['silk', 'satin', 'velvet', 'crepe'],
      silhouettes: ['bias cut', 'flowing', 'defined waist'],
    },
    coverElements: {
      headlines: ['Silver Screen Icon', 'Golden Age Beauty', 'Classic Elegance'],
      themes: ['glamour', 'romance', 'escapism'],
    },
  },
  {
    id: '1940s',
    decade: '1940s',
    year: 1945,
    yearRange: '1940-1949',
    displayName: '1940s',
    eraName: 'Wartime & Post-War',
    fashionKeywords: [
      'shoulder pads',
      'nipped waist',
      'full skirt',
      'utility dresses',
      'polka dots',
      'seamed stockings',
      'red lipstick',
    ],
    hairstyleKeywords: [
      'victory rolls',
      'pin curls',
      'short waves',
      'headscarves',
    ],
    makeupKeywords: [
      'bold red lips',
      'defined brows',
      'rosy cheeks',
      'winged eyeliner',
    ],
    lightingStyle: 'dramatic portrait lighting, war poster aesthetic, patriotic colors',
    colorPalette: ['#000080', '#c41e3a', '#f5f5dc', '#2e8b57', '#8b4513'],
    mood: 'patriotic, resourceful, feminine strength, post-war optimism',
    culturalContext: 'World War II, Rosie the Riveter, Post-war boom, New Look by Dior',
    characteristics: {
      style: ['military chic', 'utility fashion', 'new look', 'pin-up'],
      accessories: ['scarves', 'gloves', 'pearls', 'hats'],
      fabrics: ['cotton', 'wool', 'nylon', 'silk (rationed)'],
      silhouettes: ['shoulder emphasis', 'nipped waist', 'full skirt'],
    },
    coverElements: {
      headlines: ['Victory Beauty', 'The New Look', 'American Glamour'],
      themes: ['strength', 'hope', 'beauty in hardship'],
    },
  },

  // ===== 经典年代 =====
  {
    id: '1950s',
    decade: '1950s',
    year: 1955,
    yearRange: '1950-1959',
    displayName: '1950s',
    eraName: 'Golden Age of Couture',
    fashionKeywords: [
      'full circle skirt',
      'poodle skirt',
      'fitted bodice',
      'cat eye glasses',
      'waist cincher',
      'petticoats',
      'saddle shoes',
      'cardigan sets',
    ],
    hairstyleKeywords: [
      'victory rolls',
      'rockabilly waves',
      'bouffant',
      'ponytail with fringe',
    ],
    makeupKeywords: [
      'red lipstick',
      'twin peaks brows',
      'rosy cheeks',
      'subtle eyeshadow',
    ],
    lightingStyle: 'soft studio lighting, glamorous portrait, warm tones',
    colorPalette: ['#ff69b4', '#1e90ff', '#ff6347', '#98fb98', '#ffd700'],
    mood: 'wholesome glamour, suburban elegance, feminine sweetness, rockabilly edge',
    culturalContext: 'Post-war prosperity, rock and roll emergence, television age, poodle skirts',
    characteristics: {
      style: ['pin-up', 'greaser', 'new look', 'sweater girl'],
      accessories: ['cat eye glasses', 'pearls', 'scarves', 'gloves'],
      fabrics: ['cotton', 'tulle', 'taffeta', 'cashmere'],
      silhouettes: ['hourglass', 'full skirt', 'defined waist'],
    },
    coverElements: {
      headlines: ['All-American Beauty', 'Pin-Up Classic', 'Retro Glamour'],
      themes: ['innocence', 'glamour', 'wholesome beauty'],
    },
  },
  {
    id: '1960s',
    decade: '1960s',
    year: 1967,
    yearRange: '1960-1969',
    displayName: '1960s',
    eraName: 'Swinging Sixties',
    fashionKeywords: [
      'mini skirt',
      'a-line dress',
      'bold geometric patterns',
      'go-go boots',
      'mod fashion',
      'pucci prints',
      'shift dress',
      'paper doll aesthetic',
    ],
    hairstyleKeywords: [
      'beehive',
      'flip hairstyle',
      'pixie cut',
      'flower power waves',
    ],
    makeupKeywords: [
      'white or pale lips',
      'heavy eyeliner',
      'false lashes',
      'bold eye makeup',
      'mod white',
    ],
    lightingStyle: 'pop art colors, bold contrast, mod photography style',
    colorPalette: ['#ff00ff', '#00ffff', '#ffff00', '#ff6b6b', '#4ecdc4'],
    mood: 'youth revolution, psychedelic, optimistic, space age, mod culture',
    culturalContext: 'The Beatles, Space Race, Civil Rights, Counterculture, Moon Landing',
    characteristics: {
      style: ['mod', 'psychedelic', 'space age', 'flower power', 'hippie'],
      accessories: ['go-go boots', 'geometric jewelry', 'headbands', 'tinted glasses'],
      fabrics: ['vinyl', 'plastic', 'bright colors', 'pop art prints'],
      silhouettes: ['a-line', 'mini length', 'geometric shapes'],
    },
    coverElements: {
      headlines: ['Mod Revolution', 'Swinging Sixties', 'Space Age Beauty'],
      themes: ['youth', 'revolution', 'optimism', 'space age'],
    },
  },
  {
    id: '1970s',
    decade: '1970s',
    year: 1975,
    yearRange: '1970-1979',
    displayName: '1970s',
    eraName: 'Disco & Bohemian Era',
    fashionKeywords: [
      'bell bottoms',
      'platform shoes',
      'wrap dresses',
      'polyester suits',
      'hot pants',
      'crop tops',
      'maxi dresses',
      'flares',
    ],
    hairstyleKeywords: [
      'feathered hair',
      'afro',
      'long straight',
      'shag haircut',
      'disco curls',
    ],
    makeupKeywords: [
      'earth tone makeup',
      'bronzer',
      'natural glam',
      'dramatic lashes',
      'glitter',
    ],
    lightingStyle: 'disco ball lighting, warm golden hour, film grain, nostalgic warmth',
    colorPalette: ['#daa520', '#8b4513', '#9932cc', '#ff1493', '#00ced1'],
    mood: 'disco fever, bohemian freedom, laid-back cool, glamorous excess',
    culturalContext: 'Disco culture, Vietnam War, Watergate, Studio 54, Star Wars, punk rock',
    characteristics: {
      style: ['disco', 'bohemian', 'punk', 'hippie', 'fatigue chic'],
      accessories: ['platform shoes', 'hoop earrings', 'sunglasses', 'bandanas'],
      fabrics: ['polyester', 'velvet', 'suede', 'denim'],
      silhouettes: ['bell bottom', 'flowing', 'relaxed fit'],
    },
    coverElements: {
      headlines: ['Disco Queen', 'Retro Revival', '70s Groove'],
      themes: ['freedom', 'party', 'bohemian spirit'],
    },
  },
  {
    id: '1980s',
    decade: '1980s',
    year: 1985,
    yearRange: '1980-1989',
    displayName: '1980s',
    eraName: 'Excess & Power Dressing',
    fashionKeywords: [
      'power suits',
      'shoulder pads',
      'neon colors',
      'leg warmers',
      'acid wash denim',
      'leather jackets',
      'punk accessories',
      'aerobics fashion',
    ],
    hairstyleKeywords: [
      'big hair',
      'mullet',
      'perms',
      'crimped hair',
      'ponytail with volume',
    ],
    makeupKeywords: [
      'bright blush',
      'heavy contouring',
      'bold lips',
      'dramatic eyes',
      'frosted makeup',
    ],
    lightingStyle: 'flash photography, high contrast, neon lights, bold colors',
    colorPalette: ['#ff00ff', '#00ff00', '#ff6600', '#0000ff', '#ff0000'],
    mood: 'excessive, bold, power, rebellion, fitness culture, material girl',
    culturalContext: 'MTV era, Reaganomics, Wall Street, fitness craze, Madonna, Michael Jackson',
    characteristics: {
      style: ['power dressing', 'punk', 'new wave', 'preppy', 'fitness'],
      accessories: ['scrunchies', 'chunky jewelry', 'doc martens', 'high tops'],
      fabrics: ['neon polyester', 'denim', 'leather', 'spandex'],
      silhouettes: ['oversized shoulders', 'fitted waist', 'short skirts'],
    },
    coverElements: {
      headlines: ['Power Beauty', 'Flashdance Era', 'Excess Glamour'],
      themes: ['ambition', 'power', 'excess', 'materialism'],
    },
  },
  {
    id: '1990s',
    decade: '1990s',
    year: 1995,
    yearRange: '1990-1999',
    displayName: '1990s',
    eraName: 'Minimalism & Grunge',
    fashionKeywords: [
      'slip dresses',
      'chokers',
      'doc martens',
      'plaid shirts',
      'oversized blazers',
      'baby tees',
      'mom jeans',
      'platform sneakers',
    ],
    hairstyleKeywords: [
      'clai hair',
      'block brows',
      'crimped',
      'bob cut',
      'messy bun',
    ],
    makeupKeywords: [
      'brown lips',
      'natural makeup',
      'thin brows',
      'barely there makeup',
      'brown lip liner',
    ],
    lightingStyle: 'neutral lighting, indie film aesthetic, grunge photography, muted tones',
    colorPalette: ['#000000', '#808080', '#c0c0c0', '#556b2f', '#b22222'],
    mood: 'anti-fashion fashion, minimalist, grunge, heroin chic, indie cool',
    culturalContext: 'Grunge music, Internet birth, Spice Girls, Friends, Windows 95, heroin chic',
    characteristics: {
      style: ['grunge', 'minimalist', 'heroin chic', 'preppy', 'hip hop'],
      accessories: ['chokers', 'doc martens', 'band tees', 'slap bracelets'],
      fabrics: ['flannel', 'denim', 'cotton', 'velvet'],
      silhouettes: ['oversized', 'slip dress', 'slim fit'],
    },
    coverElements: {
      headlines: ['Gen X Cool', 'Minimalist Beauty', '90s Nostalgia'],
      themes: ['indifference', 'authenticity', 'rebellion through apathy'],
    },
  },

  // ===== 现代年代 =====
  {
    id: '2000s',
    decade: '2000s',
    year: 2005,
    yearRange: '2000-2009',
    displayName: '2000s',
    eraName: 'Y2K & Digital Age',
    fashionKeywords: [
      'low rise jeans',
      'Von Dutch hats',
      'Juicy Couture',
      'buttondown shirts',
      'mini skirts',
      'cargo pants',
      'flip phones',
      'butterfly clips',
    ],
    hairstyleKeywords: [
      'chunky highlights',
      'straightener waves',
      'low ponytail',
      'feathered layers',
    ],
    makeupKeywords: [
      'frosted lips',
      'blue eyeshadow',
      'thin brows',
      'glow makeup',
      'glitter',
    ],
    lightingStyle: 'flash photography, bright lights, Y2K aesthetic, digital crisp',
    colorPalette: ['#ff69b4', '#00ffff', '#c0c0c0', '#ff1493', '#ffffff'],
    mood: 'Y2K optimism, digital revolution, maximalist minimalism, paris hilton aesthetic',
    culturalContext: 'MySpace, Paris Hilton, iPod era, social media birth, 9/11, Iraq War',
    characteristics: {
      style: ['Y2K', 'Blair Waldorf', 'Paris Hilton', 'boho chic', 'indie sleaze'],
      accessories: ['butterfly clips', 'Von Dutch', 'Juicy tracksuits', 'low rise everything'],
      fabrics: ['velour', 'denim', 'satin', 'velvet'],
      silhouettes: ['low rise', 'tiny', 'bodycon'],
    },
    coverElements: {
      headlines: ['Y2K Icon', 'Digital Age Beauty', 'Millennium Glamour'],
      themes: ['optimism', 'technology', 'celebrity culture'],
    },
  },
  {
    id: '2010s',
    decade: '2010s',
    year: 2015,
    yearRange: '2010-2019',
    displayName: '2010s',
    eraName: 'Instagram Era',
    fashionKeywords: [
      'normcore',
      'athleisure',
      'off-duty model',
      'streetwear meets high fashion',
      'logomania',
      'minimalist capsule wardrobe',
      'vintage revival',
      'statement sleeves',
    ],
    hairstyleKeywords: [
      'beach waves',
      'sleek ponytail',
      'lob (long bob)',
      'glazed donuts',
      'natural texture',
    ],
    makeupKeywords: [
      'no-makeup makeup',
      'brows on fleek',
      'contouring',
      'highlighting',
      'Instagram makeup',
    ],
    lightingStyle: 'soft natural light, golden hour, Instagram filter aesthetic, clean',
    colorPalette: ['#000000', '#ffffff', '#f5f5dc', '#d3d3d3', '#e6e6fa'],
    mood: 'Instagram perfect, wellness culture, hustle grind, sustainable fashion, influencer culture',
    culturalContext: 'Instagram dominance, MeToo, social media influencers, fast fashion, sustainability movement',
    characteristics: {
      style: ['athleisure', 'minimalist', 'streetwear', 'normcore', 'boho'],
      accessories: ['designer bags', 'sneakers', 'sunglasses', 'minimal jewelry'],
      fabrics: ['cotton', 'cashmere', 'leather', 'activewear materials'],
      silhouettes: ['oversized', 'fitted', 'layered'],
    },
    coverElements: {
      headlines: ['Influencer Style', 'Instagram Icon', 'Modern Beauty'],
      themes: ['authenticity', 'influence', 'curated perfection'],
    },
  },
  {
    id: '2020s',
    decade: '2020s',
    year: 2025,
    yearRange: '2020-2029',
    displayName: '2020s',
    eraName: 'Post-Pandemic & Metaverse',
    fashionKeywords: [
      'sustainable luxury',
      'quiet luxury',
      'cottagecore',
      'metaverse fashion',
      'oversized blazers',
      'satin slip dresses',
      'masculine feminine',
      'digital fashion',
    ],
    hairstyleKeywords: [
      'natural texture',
      'wet hair look',
      'butterfly haircut',
      'clean girl aesthetic',
      'wolf cut',
    ],
    makeupKeywords: [
      'clean girl aesthetic',
      'blurred lips',
      'soft glam',
      'soap brows',
      'quiet luxury makeup',
    ],
    lightingStyle: 'natural lighting, editorial quality, moody tones, cinematic',
    colorPalette: ['#f5f5dc', '#c4b7a6', '#2c3e50', '#d4af37', '#e8d5b7'],
    mood: 'post-pandemic reflection, sustainability, digital-physical blur, quiet luxury, #oldmoney',
    culturalContext: 'COVID-19, remote work, metaverse, sustainability, quiet luxury, Barbie pink',
    characteristics: {
      style: ['quiet luxury', 'clean girl', 'cottagecore', 'metaverse ready', 'sustainable'],
      accessories: ['minimal gold jewelry', 'designer bags', 'quality over quantity'],
      fabrics: ['silk', 'cashmere', 'organic cotton', 'innovative materials'],
      silhouettes: ['relaxed', 'tailored', 'effortless'],
    },
    coverElements: {
      headlines: ['Future Classic', 'Quiet Luxury', 'Modern Icon'],
      themes: ['sustainability', 'quality', 'timelessness'],
    },
  },

  // ===== 未来年代 =====
  {
    id: '2030s',
    decade: '2030s',
    year: 2035,
    yearRange: '2030-2039',
    displayName: '2030s',
    eraName: 'Neo-Human Era',
    fashionKeywords: [
      'adaptive fashion',
      'bio-integrated clothing',
      'climate-responsive fabrics',
      'holographic elements',
      'minimalist futurism',
      'solar-powered textiles',
      'smart accessories',
    ],
    hairstyleKeywords: [
      'sleek futuristic',
      'geometric cuts',
      'color-changing hair',
      'augmented reality hair',
    ],
    makeupKeywords: [
      'subtle bioluminescence',
      'natural-tech fusion',
      'sustainable beauty',
      'glass skin',
    ],
    lightingStyle: 'biophilic lighting, natural meets technology, sustainable aesthetic, soft glow',
    colorPalette: ['#e0e5ec', '#7c9a92', '#d4af37', '#f0f0f0', '#2c3e50'],
    mood: 'sustainable futurism, neo-natural, post-consumer consciousness, climate-adaptive living',
    culturalContext: 'Climate adaptation, AI integration, space colonization beginnings, sustainable living',
    characteristics: {
      style: ['neo-futurism', 'bio-adaptive', 'sustainable luxury', 'tech-wear'],
      accessories: ['smart wearables', 'solar accessories', 'adaptive tech'],
      fabrics: ['bio-fabrics', 'recycled materials', 'smart textiles'],
      silhouettes: ['flowing', 'adaptive', 'versatile'],
    },
    coverElements: {
      headlines: ['Neo-Human Beauty', 'Future Sustainable', '2030 Visionary'],
      themes: ['innovation', 'sustainability', 'human-tech harmony'],
    },
  },
  {
    id: '2040s',
    decade: '2040s',
    year: 2045,
    yearRange: '2040-2049',
    displayName: '2040s',
    eraName: 'Transhumanist Era',
    fashionKeywords: [
      'cybernetic aesthetics',
      'nano-fiber clothing',
      'mood-responsive fabrics',
      'augmented reality fashion',
      'body modification friendly',
      'post-gender fashion',
      'holographic couture',
    ],
    hairstyleKeywords: [
      'multi-dimensional hair',
      'LED-integrated',
      'morphing styles',
      'digital hair',
    ],
    makeupKeywords: [
      'bioluminescent accents',
      '3D printed makeup',
      'augmented features',
      'customizable beauty tech',
    ],
    lightingStyle: 'neon accents with natural light, cyberpunk elegance, soft tech glow',
    colorPalette: ['#0a0a0a', '#00ffff', '#ff00ff', '#c0c0c0', '#7b68ee'],
    mood: 'transhumanist beauty, post-human elegance, cybernetic sophistication, augmented humanity',
    culturalContext: 'Advanced AI, space cities, genetic customization, post-human philosophy',
    characteristics: {
      style: ['transhumanist', 'cybernetic', 'post-gender', 'digital couture'],
      accessories: ['tech implants', 'AR accessories', 'holographic jewelry'],
      fabrics: ['nano-materials', 'smart fabrics', 'phase-change materials'],
      silhouettes: ['flowing tech', 'sculptural', 'adaptive'],
    },
    coverElements: {
      headlines: ['Transhumanist Icon', 'Cybernetic Beauty', 'Beyond Human'],
      themes: ['evolution', 'augmentation', 'post-human beauty'],
    },
  },
  {
    id: '2050s',
    decade: '2050s',
    year: 2050,
    yearRange: '2050-2059',
    displayName: '2050s',
    eraName: 'Post-Singular Era',
    fashionKeywords: [
      'consciousness-expressive fashion',
      'quantum fabrics',
      'emotion-responsive clothing',
      'interdimensional aesthetics',
      'cosmic elegance',
      'thought-reactive garments',
      'post-physical beauty',
    ],
    hairstyleKeywords: [
      'zero-gravity waves',
      'energy-based hair',
      'morphing ethereal',
      'quantum hair simulation',
    ],
    makeupKeywords: [
      'light-based makeup',
      'consciousness makeup',
      'energy aesthetics',
      'ethereal glow',
    ],
    lightingStyle: 'ethereal light, consciousness illumination, cosmic energy, transcendent glow',
    colorPalette: ['#000000', '#ffffff', '#9400d3', '#00ff7f', '#ffd700'],
    mood: 'post-singularity beauty, cosmic consciousness, transcendent elegance, beyond physical limitation',
    culturalContext: 'Post-singularity, consciousness uploading, space civilization, unified humanity',
    characteristics: {
      style: ['cosmic', 'consciousness-expressive', 'post-physical', 'ethereal futurism'],
      accessories: ['energy accessories', 'consciousness amplifiers', 'quantum jewelry'],
      fabrics: ['quantum materials', 'light-based fabrics', 'consciousness-responsive'],
      silhouettes: ['flowing', 'transcendent', 'morphing'],
    },
    coverElements: {
      headlines: ['Post-Singular Beauty', 'Cosmic Visionary', '2050 Icon'],
      themes: ['transcendence', 'consciousness', 'cosmic evolution'],
    },
  },

  // ===== 更远的未来 =====
  {
    id: '2100s',
    decade: '2100s',
    year: 2100,
    yearRange: '2100-2199',
    displayName: '2100s',
    eraName: 'Galactic Civilization',
    fashionKeywords: [
      'interstellar couture',
      'gravity-defying silhouettes',
      'multi-planetary fashion',
      'stellar fabrics',
      'galactic elegance',
      'light-speed aesthetics',
    ],
    hairstyleKeywords: [
      'stellar-styled',
      'zero-gravity elegance',
      'cosmic texture',
    ],
    makeupKeywords: [
      'planetary glow',
      'stellar luminescence',
      'cosmic artistry',
    ],
    lightingStyle: 'stellar illumination, cosmic backdrop, interdimensional light',
    colorPalette: ['#000011', '#1e90ff', '#ff4500', '#9400d3', '#ffffff'],
    mood: 'galactic grandeur, stellar elegance, interdimensional sophistication',
    culturalContext: 'Multi-planetary humanity, galactic civilization, stellar engineering',
    characteristics: {
      style: ['galactic', 'interstellar', 'stellar couture'],
      accessories: ['stellar jewelry', 'gravity accessories', 'cosmic elements'],
      fabrics: ['stellar materials', 'gravity-responsive', 'light fabrics'],
      silhouettes: ['flowing', 'gravity-defying', 'sculptural'],
    },
    coverElements: {
      headlines: ['Galactic Icon', 'Stellar Beauty', '2100 Visionary'],
      themes: ['expansion', 'cosmic beauty', 'interstellar elegance'],
    },
  },
];

// Helper functions
export const getEraById = (id: string): EraConfig | undefined => {
  return eras.find((e) => e.id === id);
};

export const getErasByRange = (startDecade: string, endDecade: string): EraConfig[] => {
  const startIndex = eras.findIndex((e) => e.id === startDecade);
  const endIndex = eras.findIndex((e) => e.id === endDecade);
  if (startIndex === -1 || endIndex === -1) return [];
  return eras.slice(startIndex, endIndex + 1);
};

export const getDecadeIds = (): string[] => {
  return eras.map((e) => e.id);
};

// Default eras for backwards compatibility
export const DEFAULT_DECADES = ['1970s', '1980s', '1990s', '2000s', '2010s', '2020s', '2030s', '2040s', '2050s'];
