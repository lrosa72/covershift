/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * CoverShift 跃像 - 全局类型定义
 */

// 应用状态
export type AppState = 'idle' | 'image-uploaded' | 'generating' | 'results-shown';
export type ViewMode = 'scattered' | 'gallery';

// 生成图片状态
export interface GeneratedImageState {
  status: 'pending' | 'done' | 'error';
  url?: string;
  error?: string;
  magazineId?: string;
  creativeStyle?: string;
  randomEvent?: RandomEvent | null;
}

// 生成任务
export interface GenerationTask {
  key: string;
  decade: string;
  magazineId: string;
  creativeStyle: string;
  randomEvent: RandomEvent | null;
}

// 随机事件
export interface RandomEvent {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  descriptionCn: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  probability: number;
  icon: string;
  effectType: 'style_bonus' | 'magazine_bonus' | 'secret_combination' | 'easter_egg' | 'special_caption';
  effect?: {
    styleId?: string;
    magazineId?: string;
    bonusPrompt?: string;
    specialCaption?: string;
  };
}

// 成就
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

// 玩家统计
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
  totalTimeSpent: number;
  rareEventsFound: string[];
  secretCombosFound: string[];
}

// Toast 消息类型
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

// 下载选项
export interface DownloadOptions {
  format?: 'zip' | 'album';
  quality?: 'original' | 'high' | 'medium';
}

// API 错误类型
export interface ApiError {
  code: string;
  message: string;
  details?: string;
}

// 生成选项
export interface GenerationOptions {
  useCustomPrompt: boolean;
  promptTemplate: string;
  enhanceFaceConsistency: boolean;
  concurrencyLimit?: number;
}

// 历史记录项
export interface HistoryItem {
  id: string;
  timestamp: number;
  originalImage: string;
  generatedImages: Record<string, string>;
  selectedDecades: string[];
}

// 时代档案
export interface EraArchive {
  decade: string;
  magazineId: string;
  randomEvent: RandomEvent | null;
}

// ==================== TransformOption 类型定义 ====================

/**
 * 变换选项分类
 */
export type TransformCategory = 'era' | 'universe' | 'role' | 'artStyle';

/**
 * 变换选项接口 - 统一的风格/时代/角色转换选项
 */
export interface TransformOption {
  /** 唯一标识符 */
  id: string;
  /** 显示名称 */
  name: string;
  /** 详细描述 */
  description: string;
  /** 预览图片URL */
  previewImage?: string;
  /** Prompt修饰函数 - 接收基础prompt并返回修改后的prompt */
  promptModifier: (basePrompt: string) => string;
  /** 分类 */
  category: TransformCategory;
  /** 年代范围 [起始年份, 结束年份] - 仅 era 类型需要 */
  eraRange?: [number, number];
}

/**
 * 冲突规则 - 定义互斥的选项组合
 */
export interface ConflictRule {
  /** 规则ID */
  id: string;
  /** 规则描述 */
  description: string;
  /** 互斥的选项ID列表 */
  mutuallyExclusiveIds: string[];
  /** 冲突提示消息 */
  message: string;
}
