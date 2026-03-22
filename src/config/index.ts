/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 配置模块导出
 */

export * from './magazines';
export * from './eras';
export * from './creativeStyles';
export * from './presets';
export * from './narratives';
export * from './randomEvents';
export * from './achievements';

// 统一的生成配置接口
export interface GenerationConfig {
  mode: 'era' | 'movie' | 'career' | 'historical' | 'custom' | 'parallel';
  magazines: string[];
  eras: string[];
  creativeStyle: string;
  customPrompt?: string;
  count: number;
  parallelMode?: 'same-era' | 'same-magazine' | 'random';
}

// 默认配置
export const DEFAULT_GENERATION_CONFIG: GenerationConfig = {
  mode: 'era',
  magazines: ['bazaar'],
  eras: ['1970s', '1980s', '1990s', '2000s', '2010s', '2020s', '2030s', '2040s', '2050s'],
  creativeStyle: 'none',
  count: 9,
};
