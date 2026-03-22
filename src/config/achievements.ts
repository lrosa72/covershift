/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 成就系统 - 游戏化元素
 */

export interface Achievement {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  descriptionCn: string;
  icon: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum';
  type: 'generation' | 'exploration' | 'collection' | 'social' | 'secret';
  requirement: {
    type: 'count' | 'unique' | 'combo' | 'streak' | 'secret';
    target: number;
    category?: string;
    specific?: string[];
  };
  reward?: {
    type: 'title' | 'unlock' | 'bonus';
    value: string;
  };
}

export interface PlayerStats {
  totalGenerations: number;
  uniqueDecades: string[];
  uniqueMagazines: string[];
  uniqueStyles: string[];
  completedAchievements: string[];
  currentStreak: number;
  longestStreak: number;
  lastPlayed: string | null;
  favoriteDecade?: string;
  favoriteMagazine?: string;
  totalTimeSpent: number; // in seconds
  rareEventsFound: string[];
  secretCombosFound: string[];
}

export interface Badge {
  id: string;
  name: string;
  nameCn: string;
  icon: string;
  earnedAt: string;
}

export interface Title {
  id: string;
  name: string;
  nameCn: string;
  isEquipped: boolean;
}

// 成就定义
export const achievements: Achievement[] = [
  // ===== 生成类成就 =====
  {
    id: 'first-generation',
    name: 'First Cover',
    nameCn: '第一张封面',
    description: 'Generate your first magazine cover',
    descriptionCn: '生成你的第一张杂志封面',
    icon: '📸',
    rarity: 'bronze',
    type: 'generation',
    requirement: {
      type: 'count',
      target: 1
    }
  },
  {
    id: 'ten-covers',
    name: 'Rising Star',
    nameCn: '冉冉升起',
    description: 'Generate 10 covers',
    descriptionCn: '生成10张封面',
    icon: '⭐',
    rarity: 'bronze',
    type: 'generation',
    requirement: {
      type: 'count',
      target: 10
    }
  },
  {
    id: 'hundred-covers',
    name: 'Cover Artist',
    nameCn: '封面艺术家',
    description: 'Generate 100 covers',
    descriptionCn: '生成100张封面',
    icon: '🎨',
    rarity: 'gold',
    type: 'generation',
    requirement: {
      type: 'count',
      target: 100
    },
    reward: {
      type: 'title',
      value: 'cover-artist'
    }
  },
  {
    id: 'five-hundred-covers',
    name: 'Cover Legend',
    nameCn: '封面传奇',
    description: 'Generate 500 covers',
    descriptionCn: '生成500张封面',
    icon: '👑',
    rarity: 'platinum',
    type: 'generation',
    requirement: {
      type: 'count',
      target: 500
    },
    reward: {
      type: 'title',
      value: 'cover-legend'
    }
  },

  // ===== 探索类成就 =====
  {
    id: 'time-traveler',
    name: 'Time Traveler',
    nameCn: '时间旅行者',
    description: 'Try 5 different decades',
    descriptionCn: '尝试5个不同的年代',
    icon: '⏰',
    rarity: 'bronze',
    type: 'exploration',
    requirement: {
      type: 'unique',
      target: 5,
      category: 'decades'
    }
  },
  {
    id: 'century-explorer',
    name: 'Century Explorer',
    nameCn: '世纪探索者',
    description: 'Try all decades from 1920s to 2020s',
    descriptionCn: '尝试从1920s到2020s的所有年代',
    icon: '🌍',
    rarity: 'silver',
    type: 'exploration',
    requirement: {
      type: 'unique',
      target: 11,
      category: 'decades',
      specific: ['1920s', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s']
    }
  },
  {
    id: 'future-visionary',
    name: 'Future Visionary',
    nameCn: '未来幻想家',
    description: 'Explore beyond 2030',
    descriptionCn: '探索2030年后的年代',
    icon: '🚀',
    rarity: 'gold',
    type: 'exploration',
    requirement: {
      type: 'unique',
      target: 4,
      category: 'decades',
      specific: ['2030s', '2040s', '2050s', '2100s']
    }
  },
  {
    id: 'magazine-collector',
    name: 'Magazine Collector',
    nameCn: '杂志收藏家',
    description: 'Try all 9 magazines',
    descriptionCn: '尝试全部9种杂志',
    icon: '📚',
    rarity: 'silver',
    type: 'exploration',
    requirement: {
      type: 'unique',
      target: 9,
      category: 'magazines'
    }
  },
  {
    id: 'style-adventurer',
    name: 'Style Adventurer',
    nameCn: '风格冒险家',
    description: 'Try 10 creative styles',
    descriptionCn: '尝试10种创意风格',
    icon: '🎭',
    rarity: 'silver',
    type: 'exploration',
    requirement: {
      type: 'unique',
      target: 10,
      category: 'styles'
    }
  },
  {
    id: 'all-styles',
    name: 'Style Master',
    nameCn: '风格大师',
    description: 'Try all creative styles',
    descriptionCn: '尝试所有创意风格',
    icon: '🎨',
    rarity: 'gold',
    type: 'exploration',
    requirement: {
      type: 'unique',
      target: 18,
      category: 'styles'
    },
    reward: {
      type: 'title',
      value: 'style-master'
    }
  },

  // ===== 收藏类成就 =====
  {
    id: 'first-favorite',
    name: 'First Favorite',
    nameCn: '第一个收藏',
    description: 'Save your first cover to favorites',
    descriptionCn: '收藏你的第一张封面',
    icon: '❤️',
    rarity: 'bronze',
    type: 'collection',
    requirement: {
      type: 'count',
      target: 1
    }
  },
  {
    id: 'favorites-collector',
    name: 'Curator',
    nameCn: '策展人',
    description: 'Save 20 covers to favorites',
    descriptionCn: '收藏20张封面',
    icon: '🖼️',
    rarity: 'silver',
    type: 'collection',
    requirement: {
      type: 'count',
      target: 20
    }
  },

  // ===== 连续登录成就 =====
  {
    id: 'three-day-streak',
    name: 'Weekend Warrior',
    nameCn: '周末战士',
    description: 'Use CoverShift 3 days in a row',
    descriptionCn: '连续3天使用CoverShift',
    icon: '🔥',
    rarity: 'bronze',
    type: 'generation',
    requirement: {
      type: 'streak',
      target: 3
    }
  },
  {
    id: 'seven-day-streak',
    name: 'CoverShift Addict',
    nameCn: 'CoverShift 迷',
    description: 'Use CoverShift 7 days in a row',
    descriptionCn: '连续7天使用CoverShift',
    icon: '💫',
    rarity: 'silver',
    type: 'generation',
    requirement: {
      type: 'streak',
      target: 7
    }
  },
  {
    id: 'thirty-day-streak',
    name: 'Loyal Creator',
    nameCn: '忠实创作者',
    description: 'Use CoverShift 30 days in a row',
    descriptionCn: '连续30天使用CoverShift',
    icon: '💎',
    rarity: 'platinum',
    type: 'generation',
    requirement: {
      type: 'streak',
      target: 30
    },
    reward: {
      type: 'title',
      value: 'loyal-creator'
    }
  },

  // ===== 秘密成就 =====
  {
    id: 'rare-event-finder',
    name: 'Lucky Finder',
    nameCn: '幸运发现者',
    description: 'Discover a rare random event',
    descriptionCn: '发现一个稀有随机事件',
    icon: '🍀',
    rarity: 'gold',
    type: 'secret',
    requirement: {
      type: 'secret',
      target: 1,
      category: 'rare-events'
    }
  },
  {
    id: 'legendary-event',
    name: 'Legendary Encounter',
    nameCn: '传说邂逅',
    description: 'Witness a legendary event',
    descriptionCn: '见证一个传说级事件',
    icon: '🌟',
    rarity: 'platinum',
    type: 'secret',
    requirement: {
      type: 'secret',
      target: 1,
      category: 'legendary-events'
    },
    reward: {
      type: 'title',
      value: 'legendary-finder'
    }
  },
  {
    id: 'secret-combo',
    name: 'Combination Master',
    nameCn: '组合大师',
    description: 'Discover a secret combination',
    descriptionCn: '发现一个秘密组合',
    icon: '🔐',
    rarity: 'gold',
    type: 'secret',
    requirement: {
      type: 'secret',
      target: 1,
      category: 'secret-combos'
    }
  }
];

// 可用称号
export const titles: Omit<Title, 'isEquipped'>[] = [
  { id: 'default', name: 'The Creator', nameCn: '创作者' },
  { id: 'cover-artist', name: 'Cover Artist', nameCn: '封面艺术家' },
  { id: 'cover-legend', name: 'Cover Legend', nameCn: '封面传奇' },
  { id: 'style-master', name: 'Style Master', nameCn: '风格大师' },
  { id: 'time-lord', name: 'Time Lord', nameCn: '时间之主' },
  { id: 'fashion-icon', name: 'Fashion Icon', nameCn: '时尚偶像' },
  { id: 'legendary-finder', name: 'Legendary Finder', nameCn: '传说发现者' },
  { id: 'loyal-creator', name: 'Loyal Creator', nameCn: '忠实创作者' }
];

// 稀有度颜色
export function getAchievementRarityColor(rarity: string): string {
  const colors = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2'
  };
  return colors[rarity as keyof typeof colors] || '#CD7F32';
}

// 初始化玩家统计
export function initializePlayerStats(): PlayerStats {
  return {
    totalGenerations: 0,
    uniqueDecades: [],
    uniqueMagazines: [],
    uniqueStyles: [],
    completedAchievements: [],
    currentStreak: 0,
    longestStreak: 0,
    lastPlayed: null,
    totalTimeSpent: 0,
    rareEventsFound: [],
    secretCombosFound: []
  };
}

// 从本地存储加载玩家统计
export function loadPlayerStats(): PlayerStats {
  try {
    const saved = localStorage.getItem('covershift_player_stats');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load player stats:', e);
  }
  return initializePlayerStats();
}

// 保存玩家统计
export function savePlayerStats(stats: PlayerStats): void {
  try {
    localStorage.setItem('covershift_player_stats', JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save player stats:', e);
  }
}

// 更新玩家统计（生成一次）
export function updatePlayerStatsOnGeneration(
  stats: PlayerStats,
  decades: string[],
  magazines: string[],
  styles: string[]
): { stats: PlayerStats; newAchievements: Achievement[] } {
  const updatedStats = { ...stats };
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // 更新总生成数
  updatedStats.totalGenerations += 1;

  // 更新唯一项
  decades.forEach(decade => {
    if (!updatedStats.uniqueDecades.includes(decade)) {
      updatedStats.uniqueDecades.push(decade);
    }
  });
  magazines.forEach(magazine => {
    if (!updatedStats.uniqueMagazines.includes(magazine)) {
      updatedStats.uniqueMagazines.push(magazine);
    }
  });
  styles.forEach(style => {
    if (style !== 'none' && !updatedStats.uniqueStyles.includes(style)) {
      updatedStats.uniqueStyles.push(style);
    }
  });

  // 更新连续登录
  if (updatedStats.lastPlayed) {
    const lastPlayedDate = new Date(updatedStats.lastPlayed);
    const dayDiff = Math.floor((now.getTime() - lastPlayedDate.getTime()) / (1000 * 60 * 60 * 24));

    if (dayDiff === 0) {
      // 同一天，不改变
    } else if (dayDiff === 1) {
      // 连续第二天
      updatedStats.currentStreak += 1;
      if (updatedStats.currentStreak > updatedStats.longestStreak) {
        updatedStats.longestStreak = updatedStats.currentStreak;
      }
    } else {
      // 中断了，重置
      updatedStats.currentStreak = 1;
    }
  } else {
    updatedStats.currentStreak = 1;
    updatedStats.longestStreak = 1;
  }
  updatedStats.lastPlayed = today;

  // 检查新成就
  const newAchievements = checkAchievements(updatedStats, stats.completedAchievements);
  newAchievements.forEach(achievement => {
    if (!updatedStats.completedAchievements.includes(achievement.id)) {
      updatedStats.completedAchievements.push(achievement.id);
    }
  });

  return { stats: updatedStats, newAchievements };
}

// 检查成就
function checkAchievements(stats: PlayerStats, previousCompleted: string[]): Achievement[] {
  const newAchievements: Achievement[] = [];

  for (const achievement of achievements) {
    if (previousCompleted.includes(achievement.id)) continue;

    let completed = false;

    switch (achievement.requirement.type) {
      case 'count':
        completed = stats.totalGenerations >= achievement.requirement.target;
        break;
      case 'unique':
        let uniqueCount = 0;
        if (achievement.requirement.category === 'decades') {
          uniqueCount = stats.uniqueDecades.length;
        } else if (achievement.requirement.category === 'magazines') {
          uniqueCount = stats.uniqueMagazines.length;
        } else if (achievement.requirement.category === 'styles') {
          uniqueCount = stats.uniqueStyles.length;
        }
        if (achievement.requirement.specific) {
          // 检查特定项
          const hasAllSpecific = achievement.requirement.specific.every(s => {
            if (achievement.requirement.category === 'decades') return stats.uniqueDecades.includes(s);
            if (achievement.requirement.category === 'magazines') return stats.uniqueMagazines.includes(s);
            if (achievement.requirement.category === 'styles') return stats.uniqueStyles.includes(s);
            return false;
          });
          completed = hasAllSpecific;
        } else {
          completed = uniqueCount >= achievement.requirement.target;
        }
        break;
      case 'streak':
        completed = stats.longestStreak >= achievement.requirement.target;
        break;
      case 'secret':
        if (achievement.requirement.category === 'rare-events') {
          completed = stats.rareEventsFound.length >= achievement.requirement.target;
        } else if (achievement.requirement.category === 'legendary-events') {
          completed = stats.rareEventsFound.some(id => id.includes('legendary'));
        } else if (achievement.requirement.category === 'secret-combos') {
          completed = stats.secretCombosFound.length >= achievement.requirement.target;
        }
        break;
    }

    if (completed) {
      newAchievements.push(achievement);
    }
  }

  return newAchievements;
}

// 记录稀有事件
export function recordRareEvent(stats: PlayerStats, eventId: string): PlayerStats {
  const updated = { ...stats };
  if (!updated.rareEventsFound.includes(eventId)) {
    updated.rareEventsFound.push(eventId);
  }
  return updated;
}

// 记录秘密组合
export function recordSecretCombo(stats: PlayerStats, comboId: string): PlayerStats {
  const updated = { ...stats };
  if (!updated.secretCombosFound.includes(comboId)) {
    updated.secretCombosFound.push(comboId);
  }
  return updated;
}

// 获取成就进度
export function getAchievementProgress(achievement: Achievement, stats: PlayerStats): number {
  switch (achievement.requirement.type) {
    case 'count':
      return Math.min(100, (stats.totalGenerations / achievement.requirement.target) * 100);
    case 'unique':
      let current = 0;
      if (achievement.requirement.category === 'decades') current = stats.uniqueDecades.length;
      if (achievement.requirement.category === 'magazines') current = stats.uniqueMagazines.length;
      if (achievement.requirement.category === 'styles') current = stats.uniqueStyles.length;
      return Math.min(100, (current / achievement.requirement.target) * 100);
    case 'streak':
      return Math.min(100, (stats.longestStreak / achievement.requirement.target) * 100);
    case 'secret':
      return stats.completedAchievements.includes(achievement.id) ? 100 : 0;
    default:
      return 0;
  }
}
