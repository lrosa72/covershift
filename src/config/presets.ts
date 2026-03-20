/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 预设主题配置 - 定义快捷年代组合
 */

export interface PresetConfig {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  icon: string;
  decades: string[];
  color: string;  // 主题色
}

export const presets: PresetConfig[] = [
  {
    id: 'golden-age',
    name: 'Golden Age',
    nameCn: '黄金时代',
    description: 'The elegant decades of fashion revolution',
    icon: '👑',
    decades: ['1940s', '1950s', '1960s'],
    color: '#d4af37'
  },
  {
    id: 'disco-era',
    name: 'Disco Era',
    nameCn: '迪斯科时代',
    description: 'Groovy 70s and flashy 80s vibes',
    icon: '🪩',
    decades: ['1970s', '1980s'],
    color: '#ff1493'
  },
  {
    id: 'millennium',
    name: 'Millennium',
    nameCn: '千禧一代',
    description: 'Y2K to Instagram age transformation',
    icon: '📱',
    decades: ['1990s', '2000s', '2010s'],
    color: '#00ced1'
  },
  {
    id: 'contemporary',
    name: 'Contemporary',
    nameCn: '当代纪元',
    description: 'Now and near future aesthetics',
    icon: '✨',
    decades: ['2010s', '2020s', '2030s'],
    color: '#98fb98'
  },
  {
    id: 'future-forward',
    name: 'Future Forward',
    nameCn: '未来已来',
    description: 'Embrace the cyber and beyond',
    icon: '🚀',
    decades: ['2040s', '2050s', '2100s'],
    color: '#9400d3'
  },
  {
    id: 'retro-futurism',
    name: 'Retro-Futurism',
    nameCn: '复古未来',
    description: 'Past meets future in style',
    icon: '🔮',
    decades: ['1960s', '1980s', '2020s', '2040s'],
    color: '#ff6b6b'
  },
  {
    id: 'full-century',
    name: 'Full Century',
    nameCn: '完整百年',
    description: '1950s to 2050s every decade',
    icon: '📅',
    decades: ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s', '2030s', '2040s', '2050s'],
    color: '#ffa500'
  },
  {
    id: 'chaos-mode',
    name: 'Chaos Mode',
    nameCn: '疯狂模式',
    description: 'All eras randomly combined',
    icon: '🌀',
    decades: ['1920s', '1950s', '1970s', '1980s', '1990s', '2000s', '2020s', '2040s', '2100s'],
    color: '#ff4500'
  },
  {
    id: 'historical',
    name: 'Historical Journey',
    nameCn: '历史穿越',
    description: 'Travel through time from Roaring 20s',
    icon: '⏳',
    decades: ['1920s', '1930s', '1940s', '1950s', '1960s'],
    color: '#8b4513'
  },
  {
    id: 'yin-yang',
    name: 'Past & Future',
    nameCn: '过去与未来',
    description: '1950s classic meets 2050s futuristic',
    icon: '☯️',
    decades: ['1950s', '2050s'],
    color: '#000000'
  }
];

// Helper functions
export const getPresetById = (id: string): PresetConfig | undefined => {
  return presets.find(p => p.id === id);
};

export const DEFAULT_PRESET = 'full-century';
