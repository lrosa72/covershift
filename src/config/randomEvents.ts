/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 偶然随机性系统 - 添加惊喜元素、稀有风格、彩蛋等
 */

export interface RandomEvent {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  descriptionCn: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  probability: number;  // 0-1
  icon: string;
  effectType: 'style_bonus' | 'magazine_bonus' | 'secret_combination' | 'easter_egg' | 'special_caption';
  effect?: {
    styleId?: string;
    magazineId?: string;
    bonusPrompt?: string;
    specialCaption?: string;
  };
}

export interface SecretCombination {
  id: string;
  name: string;
  nameCn: string;
  requiredDecades: string[];
  requiredMagazines: string[];
  requiredStyles: string[];
  reward: {
    title: string;
    titleCn: string;
    description: string;
    descriptionCn: string;
    bonusPrompt?: string;
  };
}

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  titleCn: string;
  description: string;
  descriptionCn: string;
  requirement: {
    type: 'decades' | 'magazines' | 'styles' | 'combination';
    target: string[];
  };
  reward: {
    type: 'badge' | 'title' | 'bonus_style';
    value: string;
  };
  icon: string;
}

// 稀有风格事件
export const randomEvents: RandomEvent[] = [
  // Common (30%)
  {
    id: 'bonus-lighting',
    name: 'Golden Hour Magic',
    nameCn: '金色时刻魔法',
    description: 'The sun hits just right',
    descriptionCn: '阳光恰到好处',
    rarity: 'common',
    probability: 0.15,
    icon: '🌅',
    effectType: 'style_bonus',
    effect: {
      bonusPrompt: 'golden hour lighting, warm magical glow, lens flares, cinematic atmosphere'
    }
  },
  {
    id: 'bonus-bokeh',
    name: 'Bokeh Dreams',
    nameCn: '散景之梦',
    description: 'Beautiful background blur',
    descriptionCn: '美丽的背景虚化',
    rarity: 'common',
    probability: 0.15,
    icon: '✨',
    effectType: 'style_bonus',
    effect: {
      bonusPrompt: 'shallow depth of field, beautiful bokeh background, dreamy atmosphere, professional portrait photography'
    }
  },

  // Uncommon (15%)
  {
    id: 'secret-vogue-italia',
    name: 'Vogue Italia Twist',
    nameCn: '意大利版Vogue惊喜',
    description: 'High-fashion editorial with Italian flair',
    descriptionCn: '意大利风情的高级时尚大片',
    rarity: 'uncommon',
    probability: 0.08,
    icon: '🇮🇹',
    effectType: 'magazine_bonus',
    effect: {
      magazineId: 'vogue',
      bonusPrompt: 'Vogue Italia editorial style, bold artistic choices, Italian elegance, dramatic high fashion photography'
    }
  },
  {
    id: 'bonus-film-grain',
    name: 'Film Grain Aesthetic',
    nameCn: '胶片颗粒质感',
    description: 'Authentic analog film look',
    descriptionCn: '真实的模拟胶片质感',
    rarity: 'uncommon',
    probability: 0.07,
    icon: '🎞️',
    effectType: 'style_bonus',
    effect: {
      bonusPrompt: 'shot on 35mm film, authentic film grain, film photography, analog aesthetic, Portra 400 look'
    }
  },

  // Rare (8%)
  {
    id: 'secret-magazine-crossover',
    name: 'Magazine Crossover',
    nameCn: '杂志联名',
    description: 'Two magazines styles merge',
    descriptionCn: '两种杂志风格融合',
    rarity: 'rare',
    probability: 0.05,
    icon: '🔀',
    effectType: 'magazine_bonus',
    effect: {
      bonusPrompt: 'experimental editorial combining multiple high-fashion magazine aesthetics, boundary-pushing fashion photography, avant-garde styling'
    }
  },
  {
    id: 'bonus-celebrity-photographer',
    name: 'Celebrity Photographer',
    nameCn: '名人摄影师',
    description: 'Shot by a legendary photographer',
    descriptionCn: '传奇掌镜',
    rarity: 'rare',
    probability: 0.03,
    icon: '📸',
    effectType: 'style_bonus',
    effect: {
      bonusPrompt: 'photographed by Annie Leibovitz, iconic portrait style, intimate and powerful, celebrity portrait quality, museum-worthy photography'
    }
  },

  // Epic (3%)
  {
    id: 'easter-egg-andy-warhol',
    name: 'Andy Warhol Factory',
    nameCn: '安迪沃霍尔工厂',
    description: 'Pop art legend style',
    descriptionCn: '波普艺术传奇风格',
    rarity: 'epic',
    probability: 0.02,
    icon: '🥫',
    effectType: 'easter_egg',
    effect: {
      styleId: 'none',
      bonusPrompt: 'Andy Warhol pop art style, silkscreen effect, vibrant colors, Factory aesthetic, 1960s New York art scene'
    }
  },
  {
    id: 'secret-met-gala',
    name: 'Met Gala Exclusive',
    nameCn: 'Met Gala 独家',
    description: 'Camp! Notes on Fashion theme',
    descriptionCn: 'Camp! 时尚笔记主题',
    rarity: 'epic',
    probability: 0.01,
    icon: '👑',
    effectType: 'special_caption',
    effect: {
      specialCaption: 'MET GALA EXCLUSIVE',
      bonusPrompt: 'Met Gala fashion, camp aesthetic, over-the-top, theatrical, high fashion meets performance art, red carpet royalty'
    }
  },

  // Legendary (1%)
  {
    id: 'legendary-time-portal',
    name: 'Time Portal',
    nameCn: '时空门户',
    description: 'Past and future collide',
    descriptionCn: '过去与未来碰撞',
    rarity: 'legendary',
    probability: 0.005,
    icon: '🌀',
    effectType: 'secret_combination',
    effect: {
      bonusPrompt: 'time portal aesthetic, multiple timelines merging, past meets future, quantum mechanics visual, temporal distortion, chrono-aesthetic'
    }
  },
  {
    id: 'legendary-haute-couture',
    name: 'Haute Couture Original',
    nameCn: '高级定制原作',
    description: 'One-of-a-kind masterpiece',
    descriptionCn: '独一无二的杰作',
    rarity: 'legendary',
    probability: 0.005,
    icon: '💎',
    effectType: 'style_bonus',
    effect: {
      bonusPrompt: 'Paris Haute Couture, one-of-a-kind original design, museum-quality craftsmanship, high-fashion editorial, couture perfection, runway quality, editorial masterpiece'
    }
  }
];

// 秘密组合
export const secretCombinations: SecretCombination[] = [
  {
    id: 'golden-age-combo',
    name: 'Hollywood Royalty',
    nameCn: '好莱坞皇室',
    requiredDecades: ['1930s', '1940s', '1950s'],
    requiredMagazines: ['vogue', 'vanity-fair', 'bazaar'],
    requiredStyles: ['none'],
    reward: {
      title: 'Old Hollywood Soul',
      titleCn: '老好莱坞灵魂',
      description: 'You belong to the silver screen',
      descriptionCn: '你属于银色银幕',
      bonusPrompt: 'Old Hollywood royalty, silver screen legend, cinematic portrait, film noir lighting'
    }
  },
  {
    id: 'disco-cyber-combo',
    name: 'Time Traveler',
    nameCn: '时间旅人',
    requiredDecades: ['1970s', '2050s'],
    requiredMagazines: ['interview', 'id-magazine'],
    requiredStyles: ['vaporwave', 'cyberpunk'],
    reward: {
      title: 'Chrono-Style Master',
      titleCn: '时空风格大师',
      description: 'You span centuries with style',
      descriptionCn: '你跨越世纪依然时尚',
      bonusPrompt: 'time traveller aesthetic, retro-futurism, 70s meets 2050s, temporal fusion'
    }
  },
  {
    id: 'full-spectrum',
    name: 'The Full Spectrum',
    nameCn: '全光谱',
    requiredDecades: ['1920s', '1950s', '1980s', '2020s', '2100s'],
    requiredMagazines: ['bazaar'],
    requiredStyles: ['none'],
    reward: {
      title: 'Era Explorer',
      titleCn: '年代探索者',
      description: 'You have witnessed fashion evolve',
      descriptionCn: '你见证了时尚的演变',
      bonusPrompt: 'fashion evolution timeline, full century of style, transformation through time'
    }
  }
];

// 每日挑战模板
const dailyChallengeTemplates: Omit<DailyChallenge, 'date'>[] = [
  {
    id: 'challenge-retro',
    title: 'Retro Explorer',
    titleCn: '复古探索者',
    description: 'Generate 3 pre-2000 covers',
    descriptionCn: '生成3张2000年前的封面',
    requirement: {
      type: 'decades',
      target: ['1920s', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s']
    },
    reward: {
      type: 'badge',
      value: 'retro-explorer'
    },
    icon: '📼'
  },
  {
    id: 'challenge-future',
    title: 'Future Visionary',
    titleCn: '未来幻想家',
    description: 'Explore the years beyond 2030',
    descriptionCn: '探索2030年后的年代',
    requirement: {
      type: 'decades',
      target: ['2030s', '2040s', '2050s', '2100s']
    },
    reward: {
      type: 'badge',
      value: 'future-visionary'
    },
    icon: '🔮'
  },
  {
    id: 'challenge-all-magazines',
    title: 'Magazine Connoisseur',
    titleCn: '杂志鉴赏家',
    description: 'Try 3 different magazines',
    descriptionCn: '尝试3种不同的杂志',
    requirement: {
      type: 'magazines',
      target: ['vogue', 'bazaar', 'elle', 'gq', 'vanity-fair', 'lofficiel', 'interview', 'id-magazine', 'w-magazine']
    },
    reward: {
      type: 'badge',
      value: 'magazine-connoisseur'
    },
    icon: '📚'
  },
  {
    id: 'challenge-creative',
    title: 'Creative Spirit',
    titleCn: '创意精神',
    description: 'Experiment with 3 creative styles',
    descriptionCn: '尝试3种创意风格',
    requirement: {
      type: 'styles',
      target: ['cyberpunk', 'vaporwave', 'neoclassical', 'japanese-ink', 'pixel-art', 'glitch-art']
    },
    reward: {
      type: 'bonus_style',
      value: 'secret-styles-unlocked'
    },
    icon: '🎨'
  }
];

// 获取今日挑战
export function getDailyChallenge(): DailyChallenge {
  const today = new Date().toISOString().split('T')[0];
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const templateIndex = dayOfYear % dailyChallengeTemplates.length;
  const template = dailyChallengeTemplates[templateIndex];

  return {
    ...template,
    date: today
  };
}

// 获取随机事件
export function rollRandomEvent(): RandomEvent | null {
  // 按稀有度排序，稀有事件先检查
  const sortedEvents = [...randomEvents].sort((a, b) => {
    const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
    return rarityOrder[a.rarity] - rarityOrder[b.rarity];
  });

  // 使用累计概率抽样，未命中总概率时返回 null
  const roll = Math.random();
  let cumulative = 0;
  for (const event of sortedEvents) {
    cumulative += event.probability;
    if (roll < cumulative) {
      return event;
    }
  }

  return null;
}

// 获取稀有度颜色
export function getRarityColor(rarity: string): string {
  const colors = {
    common: '#9CA3AF',
    uncommon: '#10B981',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B'
  };
  return colors[rarity as keyof typeof colors] || '#9CA3AF';
}

// 获取稀有度名称
export function getRarityName(rarity: string): string {
  const names = {
    common: '普通',
    uncommon: '稀有',
    rare: '珍贵',
    epic: '史诗',
    legendary: '传说'
  };
  return names[rarity as keyof typeof names] || '普通';
}

// 检查秘密组合
export function checkSecretCombination(
  selectedDecades: string[],
  selectedMagazines: string[],
  selectedStyles: string[]
): SecretCombination | null {
  for (const combo of secretCombinations) {
    const decadesMatch = combo.requiredDecades.some(d => selectedDecades.includes(d));
    const magazinesMatch = combo.requiredMagazines.some(m => selectedMagazines.includes(m));
    const stylesMatch = combo.requiredStyles.length === 0 || combo.requiredStyles.some(s => selectedStyles.includes(s));

    if (decadesMatch && magazinesMatch && stylesMatch) {
      // 检查是否满足数量要求
      const hasEnoughDecades = selectedDecades.length >= combo.requiredDecades.length;
      if (hasEnoughDecades) {
        return combo;
      }
    }
  }
  return null;
}
