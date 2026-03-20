/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 创意风格配置 - 定义特殊视觉效果和艺术风格
 */

export interface CreativeStyleConfig {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  descriptionCn: string;
  icon: string;
  
  promptAddon: {
    visual: string;
    mood: string;
    lighting: string;
    colorGrade: string;
    composition: string;
  };
  
  // 风格特定的装饰元素
  decorativeElements?: string[];
  
  // 兼容的杂志
  compatibleMagazines: string[];
  
  // 是否是高级风格（可选）
  isPremium?: boolean;
}

export const creativeStyles: CreativeStyleConfig[] = [
  {
    id: 'none',
    name: 'Original Era Style',
    nameCn: '原时代风格',
    description: 'Pure historical fashion without any special effects',
    descriptionCn: '纯粹的历史时尚，无特殊效果',
    icon: '✨',
    promptAddon: {
      visual: 'authentic period-accurate fashion',
      mood: 'authentic historical',
      lighting: 'natural period lighting',
      colorGrade: 'authentic colors',
      composition: 'classic portrait',
    },
    compatibleMagazines: ['bazaar', 'vogue', 'elle', 'gq', 'vanity-fair', 'lofficiel', 'interview', 'id-magazine', 'w-magazine'],
  },
  {
    id: 'vintage-retro',
    name: 'Vintage Retro',
    nameCn: '复古怀旧',
    description: 'Aged photo effect with film grain and sepia tones',
    descriptionCn: '老照片质感，带有胶片颗粒和棕褐色调',
    icon: '📷',
    promptAddon: {
      visual: 'vintage photograph, aged, weathered, film grain texture',
      mood: 'nostalgic, melancholic, warm memories',
      lighting: 'soft diffused light, window light, golden hour glow',
      colorGrade: 'sepia tones, faded colors, Kodak film palette, warm yellows',
      composition: 'classic portrait composition',
    },
    decorativeElements: ['film grain', 'vignette', 'torn edges', 'coffee stains'],
    compatibleMagazines: ['bazaar', 'vanity-fair', 'interview', 'vogue'],
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    nameCn: '赛博朋克',
    description: 'Neon lights, rain-soaked streets, and high-tech low-life aesthetics',
    descriptionCn: '霓虹灯光、雨夜城市、高科技低生活美学',
    icon: '🌃',
    promptAddon: {
      visual: 'cyberpunk cityscape, neon signs, holographic advertisements, futuristic technology, rain-soaked streets',
      mood: 'edgy, futuristic, rebellious, dystopian glamour',
      lighting: 'neon lighting, purple and cyan color splashes, dramatic rim lighting, volumetric fog',
      colorGrade: 'high contrast, neon blues and pinks, dark shadows with vibrant highlights',
      composition: 'dramatic cinematic composition with depth',
    },
    decorativeElements: ['neon glow', 'digital rain', 'holographic elements', 'glitch effects'],
    compatibleMagazines: ['vogue', 'lofficiel', 'w-magazine', 'id-magazine'],
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave',
    nameCn: '蒸汽波',
    description: '80s nostalgia with pastel colors and surreal aesthetics',
    descriptionCn: '80年代怀旧，粉彩色调和超现实美学',
    icon: '💗',
    promptAddon: {
      visual: 'vaporwave aesthetic, pastel pink and blue, Greek sculptures, marble statues, surreal dreamscape',
      mood: 'nostalgic, dreamy, surreal, optimistic about the past',
      lighting: 'soft pink and blue gradient lighting, sunset glow, ethereal atmosphere',
      colorGrade: 'pastel pink, cyan, lavender, soft purple, sunset gradients',
      composition: 'surrealist composition with floating elements',
    },
    decorativeElements: ['grid lines', 'Greek statues', 'palm trees', 'sunset gradients', 'Japanese text'],
    compatibleMagazines: ['elle', 'interview', 'id-magazine'],
  },
  {
    id: 'neoclassical',
    name: 'Neoclassical',
    nameCn: '新古典主义',
    description: 'Renaissance-inspired with oil painting texture and classical beauty',
    descriptionCn: '文艺复兴风格，油画质感和古典美',
    icon: '🏛️',
    promptAddon: {
      visual: 'classical oil painting, Renaissance aesthetics, marble columns, ornate frames, mythological elements',
      mood: 'elegant, timeless, refined, intellectual',
      lighting: 'Rembrandt lighting, chiaroscuro, warm golden light, classical studio lighting',
      colorGrade: 'rich warm tones, golden highlights, deep shadows, museum-quality colors',
      composition: 'classical portrait composition with mythological framing',
    },
    decorativeElements: ['laurel wreaths', 'classical columns', 'ornate frames', 'angelic wings'],
    compatibleMagazines: ['vanity-fair', 'bazaar', 'vogue', 'lofficiel'],
  },
  {
    id: 'minimalism',
    name: 'Minimalist',
    nameCn: '极简主义',
    description: 'Clean, modern, and sophisticated with ample white space',
    descriptionCn: '简洁、现代、高雅，大面积留白',
    icon: '◻️',
    promptAddon: {
      visual: 'minimalist photography, clean background, modern fashion, sophisticated elegance',
      mood: 'calm, sophisticated, modern, effortless luxury',
      lighting: 'soft natural light, clean studio lighting, subtle shadows',
      colorGrade: 'monochromatic, muted tones, blacks and whites, subtle pastels',
      composition: 'generous white space, centered subject, clean lines',
    },
    decorativeElements: ['geometric shapes', 'clean lines', 'subtle textures'],
    compatibleMagazines: ['vogue', 'w-magazine', 'bazaar'],
  },
  {
    id: 'streetwear',
    name: 'Streetwear',
    nameCn: '街头潮流',
    description: 'Urban culture with graffiti, hypebeast, and hip-hop elements',
    descriptionCn: '街头文化，涂鸦、潮牌、嘻哈元素',
    icon: '👊',
    promptAddon: {
      visual: 'streetwear fashion, urban backdrop, graffiti walls, sneaker culture, hypebeast style',
      mood: 'bold, energetic, youthful, rebellious',
      lighting: 'natural outdoor light, flash photography, high contrast urban lighting',
      colorGrade: 'vibrant colors, high saturation, urban palette, neon accents',
      composition: 'dynamic urban composition, street-level perspective',
    },
    decorativeElements: ['graffiti', 'sneakers', 'chain jewelry', 'logo prints'],
    compatibleMagazines: ['id-magazine', 'gq', 'elle'],
  },
  {
    id: 'art-deco',
    name: 'Art Deco',
    nameCn: '装饰艺术',
    description: '1920s geometric elegance with gold accents and jazz vibes',
    descriptionCn: '1920年代几何优雅，金色点缀，爵士氛围',
    icon: '🟡',
    promptAddon: {
      visual: 'art deco design, geometric patterns, golden accents, 1920s jazz age, ornate borders',
      mood: 'glamorous, luxurious, sophisticated, roaring twenties',
      lighting: 'art deco studio lighting, golden spotlight, dramatic shadows',
      colorGrade: 'black and gold, emerald green, champagne, ivory, bold contrasts',
      composition: 'symmetrical art deco composition with geometric framing',
    },
    decorativeElements: ['sunburst patterns', 'geometric borders', 'fan shapes', 'chevron patterns'],
    compatibleMagazines: ['vanity-fair', 'bazaar', 'lofficiel'],
  },
  {
    id: 'japanese-ink',
    name: 'Japanese Ink',
    nameCn: '水墨东方',
    description: 'Traditional East Asian aesthetics with ink wash painting style',
    descriptionCn: '传统东亚美学，水墨画风格',
    icon: '🖌️',
    promptAddon: {
      visual: 'traditional Japanese ink wash painting (sumi-e), bamboo, cherry blossoms, zen garden, East Asian aesthetics',
      mood: 'serene, contemplative, elegant simplicity, zen',
      lighting: 'soft natural light, ink wash gradients, atmospheric mist',
      colorGrade: 'black ink, subtle gray washes, occasional red or gold accents, traditional palette',
      composition: 'traditional East Asian scroll composition with generous negative space',
    },
    decorativeElements: ['calligraphy', 'cherry blossoms', 'bamboo', 'mountains', 'waves'],
    compatibleMagazines: ['bazaar', 'w-magazine', 'elle'],
  },
  {
    id: 'renaissance',
    name: 'Renaissance',
    nameCn: '文艺复兴',
    description: 'Authentic Renaissance art with chiaroscuro and classical beauty',
    descriptionCn: '正统文艺复兴艺术，明暗对照法和古典美',
    icon: '🎨',
    promptAddon: {
      visual: 'Renaissance oil painting style, Botticelli or Da Vinci aesthetic, religious iconography, classical mythology',
      mood: 'divine, ethereal, transcendent, classical beauty',
      lighting: 'chiaroscuro, sfumato technique, divine light from above, Renaissance studio lighting',
      colorGrade: 'Renaissance palette, deep reds, royal blues, gold leaf, flesh tones',
      composition: 'classical religious or mythological composition with divine proportion',
    },
    decorativeElements: ['halos', 'classical columns', 'drapery', 'symbolic objects'],
    compatibleMagazines: ['vanity-fair', 'bazaar', 'vogue'],
  },
  {
    id: 'pixel-art',
    name: 'Pixel Art',
    nameCn: '像素艺术',
    description: 'Retro 8-bit video game aesthetic',
    descriptionCn: '复古8位电子游戏美学',
    icon: '👾',
    promptAddon: {
      visual: 'pixel art style, 8-bit video game character, retro gaming aesthetic, sprite art',
      mood: 'playful, nostalgic, retro gaming, 8-bit charm',
      lighting: 'flat pixel lighting, video game style illumination',
      colorGrade: 'limited color palette, 16-bit colors, NES or SNES palette',
      composition: 'video game character portrait, sprite-style framing',
    },
    decorativeElements: ['pixel grid', 'game UI elements', 'stars', 'blocks'],
    compatibleMagazines: ['id-magazine', 'elle'],
  },
  {
    id: 'glitch-art',
    name: 'Glitch Art',
    nameCn: '故障艺术',
    description: 'Digital corruption and RGB shift effects',
    descriptionCn: '数字故障和RGB偏移效果',
    icon: '⚡',
    promptAddon: {
      visual: 'glitch art, digital corruption, RGB split, data moshing, cyber distortion',
      mood: 'experimental, edgy, digital chaos, futuristic',
      lighting: 'harsh digital lighting, scan lines, CRT monitor glow',
      colorGrade: 'RGB channel separation, chromatic aberration, high contrast digital colors',
      composition: 'fragmented digital composition with glitched elements',
    },
    decorativeElements: ['scan lines', 'digital noise', 'RGB split', 'corrupted pixels'],
    compatibleMagazines: ['lofficiel', 'id-magazine', 'w-magazine'],
  },
  {
    id: 'film-noir',
    name: 'Film Noir',
    nameCn: '黑色电影',
    description: 'Classic noir aesthetic with high contrast black and white',
    descriptionCn: '经典黑色电影美学，高对比黑白',
    icon: '🎬',
    promptAddon: {
      visual: 'film noir style, 1940s detective aesthetic, shadowy atmosphere, mysterious woman',
      mood: 'mysterious, dangerous, sophisticated, femme fatale',
      lighting: 'high contrast black and white, dramatic shadows, venetian blind shadows, single light source',
      colorGrade: 'pure black and white, no gray tones, deep shadows, bright highlights',
      composition: 'cinematic noir composition with dramatic shadows',
    },
    decorativeElements: ['venetian blind shadows', 'cigarette smoke', 'rain', 'fedora hat'],
    compatibleMagazines: ['vanity-fair', 'vogue', 'interview', 'bazaar'],
  },
  {
    id: 'solarpunk',
    name: 'Solarpunk',
    nameCn: '太阳朋克',
    description: 'Eco-futurism with sustainable living and optimistic future',
    descriptionCn: '生态未来主义，可持续生活和乐观未来',
    icon: '🌻',
    promptAddon: {
      visual: 'solarpunk aesthetic, green cities, solar panels, vertical gardens, eco-technology, natural and technological harmony',
      mood: 'optimistic, sustainable, community-focused, hopeful future',
      lighting: 'warm golden sunlight, natural light, lush green ambient glow',
      colorGrade: 'warm greens, yellows, earth tones, sunset oranges, eco-palette',
      composition: 'utopian composition with nature and technology in harmony',
    },
    decorativeElements: ['leaves', 'solar panels', 'gardens', 'butterflies', 'rainbows'],
    compatibleMagazines: ['elle', 'bazaar', 'vogue', 'w-magazine'],
  },
  {
    id: 'dieselpunk',
    name: 'Dieselpunk',
    nameCn: '柴油朋克',
    description: 'Industrial revolution aesthetics with vintage machinery',
    descriptionCn: '工业革命美学，复古机械',
    icon: '⚙️',
    promptAddon: {
      visual: 'dieselpunk aesthetic, industrial machinery, Art Deco meets factory, gears and pipes, vintage factory setting',
      mood: 'rugged, industrial, masculine, mechanical',
      lighting: 'industrial lighting, warm amber from furnaces, dramatic shadows from machinery',
      colorGrade: 'copper, brass, steel grays, warm browns, industrial palette',
      composition: 'industrial portrait composition with mechanical elements',
    },
    decorativeElements: ['gears', 'pipes', 'levers', 'steam', 'industrial textures'],
    compatibleMagazines: ['gq', 'vanity-fair', 'lofficiel'],
  },
  {
    id: 'atompunk',
    name: 'Atompunk',
    nameCn: '原子朋克',
    description: '1950s atomic age sci-fi with rockets and optimism',
    descriptionCn: '50年代原子时代科幻，火箭和乐观主义',
    icon: '🚀',
    promptAddon: {
      visual: 'atompunk aesthetic, 1950s sci-fi, atomic age, rocket ships, atomic patterns, space age optimism',
      mood: 'optimistic, retro-futuristic, curious, space age excitement',
      lighting: 'atomic glow, atomic test footage aesthetic, bright studio lighting with atomic accents',
      colorGrade: 'atomic teal, rocket red, starburst yellows, retro atomic colors',
      composition: 'space age composition with atomic elements',
    },
    decorativeElements: ['atoms', 'rockets', 'satellites', 'atomic bursts', 'starbursts'],
    compatibleMagazines: ['vogue', 'bazaar', 'lofficiel'],
  },
  {
    id: 'biopunk',
    name: 'Biopunk',
    nameCn: '生物朋克',
    description: 'Genetic engineering and bio-technology aesthetics',
    descriptionCn: '基因工程和生物技术美学',
    icon: '🧬',
    promptAddon: {
      visual: 'biopunk aesthetic, genetic modification, bio-luminescent organisms, laboratory setting, organic meets technology',
      mood: 'revolutionary, scientific, organic yet artificial, unsettling beauty',
      lighting: 'bioluminescent glow, laboratory lighting, organic light sources',
      colorGrade: 'bioluminescent greens and blues, organic purples, clinical whites, bio-palette',
      composition: 'clinical portrait composition with bio-organic elements',
    },
    decorativeElements: ['DNA helixes', 'cells', 'bio-luminescent plants', 'laboratory equipment'],
    compatibleMagazines: ['lofficiel', 'w-magazine', 'vogue'],
  },
  {
    id: 'comic-book',
    name: 'Comic Book',
    nameCn: '漫画风格',
    description: 'Bold comic book illustration with halftone dots',
    descriptionCn: '大胆的漫画风格，带有网点效果',
    icon: '💥',
    promptAddon: {
      visual: 'comic book illustration, Marvel or DC style, bold outlines, action pose, superhero aesthetic',
      mood: 'powerful, dynamic, heroic, action-packed',
      lighting: 'dramatic comic lighting, spotlight effect, bold shadow patterns',
      colorGrade: 'bold primary colors, high contrast, halftone dots, comic book palette',
      composition: 'dynamic comic panel composition with action lines',
    },
    decorativeElements: ['action lines', 'halftone dots', 'speed lines', 'impact bursts'],
    compatibleMagazines: ['id-magazine', 'elle', 'gq'],
  },
  {
    id: 'oil-painting',
    name: 'Oil Painting',
    nameCn: '油画质感',
    description: 'Traditional fine art oil painting texture and brushwork',
    descriptionCn: '传统油画质感，笔触感',
    icon: '🖼️',
    promptAddon: {
      visual: 'fine art oil painting, visible brushwork, thick impasto, classical technique, museum quality',
      mood: 'timeless, artistic, refined, museum-worthy',
      lighting: 'Renaissance-style lighting, museum gallery lighting, natural window light',
      colorGrade: 'rich oil paint colors, deep pigments, warm undertones, gallery-quality colors',
      composition: 'classical portrait composition with artistic framing',
    },
    decorativeElements: ['thick brushstrokes', 'impasto texture', 'canvas weave visible'],
    compatibleMagazines: ['vanity-fair', 'bazaar', 'vogue', 'w-magazine'],
  },
];

// Helper functions
export const getCreativeStyleById = (id: string): CreativeStyleConfig | undefined => {
  return creativeStyles.find((s) => s.id === id);
};

export const getCreativeStyleIds = (): string[] => {
  return creativeStyles.map((s) => s.id);
};

export const DEFAULT_CREATIVE_STYLE = 'none';
