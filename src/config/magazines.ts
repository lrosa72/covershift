/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 杂志配置 - 定义支持的杂志风格
 */

export interface MagazineConfig {
  id: string;
  name: string;
  nameCn: string;
  tagline: string;
  coverLayout: {
    headerPosition: 'top' | 'center' | 'bottom';
    captionStyle: 'handwritten' | 'typewriter' | 'modern' | 'classic' | 'bold';
    borderStyle: 'none' | 'thin' | 'thick' | 'ornate' | 'double';
  };
  colorScheme: {
    background: string;
    accent: string;
    text: string;
    secondary: string;
    highlight?: string;
  };
  fonts: {
    brand: string;
    headline: string;
    caption: string;
  };
  aesthetic: string[];
  characteristics: {
    photography: string;
    typography: string;
    layout: string;
  };
}

export const magazines: MagazineConfig[] = [
  {
    id: 'bazaar',
    name: "Harper's Bazaar",
    nameCn: '时尚芭莎',
    tagline: 'The Art of Fashion',
    coverLayout: {
      headerPosition: 'top',
      captionStyle: 'classic',
      borderStyle: 'none',
    },
    colorScheme: {
      background: '#ffffff',
      accent: '#d4af37',
      text: '#000000',
      secondary: '#666666',
      highlight: '#f5f5f5',
    },
    fonts: {
      brand: 'Playfair Display',
      headline: 'Playfair Display',
      caption: 'Cormorant Garamond',
    },
    aesthetic: [
      'sophisticated',
      'artistic',
      'timeless elegance',
      'museum-quality',
      'high fashion editorial',
    ],
    characteristics: {
      photography: 'artistic, gallery-like, cinematic lighting',
      typography: 'classic serif, generous spacing, understated luxury',
      layout: 'minimalist with focus on imagery, art museum aesthetic',
    },
  },
  {
    id: 'vogue',
    name: 'Vogue',
    nameCn: '时尚 Vogue',
    tagline: 'The Fashion Authority',
    coverLayout: {
      headerPosition: 'top',
      captionStyle: 'bold',
      borderStyle: 'none',
    },
    colorScheme: {
      background: '#ffffff',
      accent: '#000000',
      text: '#000000',
      secondary: '#333333',
      highlight: '#fafafa',
    },
    fonts: {
      brand: 'Didot',
      headline: 'Didot',
      caption: 'Avenir Next',
    },
    aesthetic: [
      'high fashion',
      'luxurious',
      'trend-setting',
      'celebrity',
      'glamorous',
    ],
    characteristics: {
      photography: 'high contrast, dramatic, larger-than-life, supermodel aesthetic',
      typography: 'bold sans-serif, gold lettering, prestigious',
      layout: 'dominant imagery, minimal text, fashion-forward',
    },
  },
  {
    id: 'elle',
    name: 'Elle',
    nameCn: 'Elle',
    tagline: 'elle est feminine',
    coverLayout: {
      headerPosition: 'top',
      captionStyle: 'modern',
      borderStyle: 'thin',
    },
    colorScheme: {
      background: '#ffffff',
      accent: '#e91e8c',
      text: '#1a1a1a',
      secondary: '#666666',
      highlight: '#fff0f5',
    },
    fonts: {
      brand: 'Montserrat',
      headline: 'Montserrat',
      caption: 'Open Sans',
    },
    aesthetic: [
      'energetic',
      'feminine',
      'modern',
      'playful sophistication',
      ' Parisian chic',
    ],
    characteristics: {
      photography: 'vibrant, youthful, natural lighting, candid moments',
      typography: 'bold colors, geometric, contemporary',
      layout: 'dynamic, asymmetric, pops of color',
    },
  },
  {
    id: 'gq',
    name: 'GQ',
    nameCn: 'GQ 男士',
    tagline: 'Gentlemens Quarterly',
    coverLayout: {
      headerPosition: 'top',
      captionStyle: 'modern',
      borderStyle: 'none',
    },
    colorScheme: {
      background: '#ffffff',
      accent: '#1e3a5f',
      text: '#000000',
      secondary: '#555555',
      highlight: '#f0f4f8',
    },
    fonts: {
      brand: 'Bebas Neue',
      headline: 'Roboto Condensed',
      caption: 'Roboto',
    },
    aesthetic: [
      'masculine elegance',
      'urban',
      'professional',
      'sophisticated',
      'modern gentleman',
    ],
    characteristics: {
      photography: 'clean, studio lighting, tailored fashion, city backdrop',
      typography: 'bold condensed, clean lines, military precision',
      layout: 'structured, column-based, sophisticated',
    },
  },
  {
    id: 'vanity-fair',
    name: 'Vanity Fair',
    nameCn: '名利场',
    tagline: 'The Magazine of Vanity',
    coverLayout: {
      headerPosition: 'center',
      captionStyle: 'classic',
      borderStyle: 'ornate',
    },
    colorScheme: {
      background: '#f8f4e8',
      accent: '#c9a227',
      text: '#1a1a1a',
      secondary: '#4a4a4a',
      highlight: '#fdfbf5',
    },
    fonts: {
      brand: 'Bodoni Moda',
      headline: 'Cormorant',
      caption: 'Libre Baskerville',
    },
    aesthetic: [
      'old-world glamour',
      'literary',
      'celebrity portrait',
      'hollywood golden age',
      'dramatic',
    ],
    characteristics: {
      photography: 'dramatic portrait lighting, black and white, theatrical',
      typography: 'elegant serif, gold embossed, literary',
      layout: 'portrait-focused, dramatic, theatrical',
    },
  },
  {
    id: 'lofficiel',
    name: "L'Officiel",
    nameCn: '时装Officiel',
    tagline: 'Le Fashion Absolu',
    coverLayout: {
      headerPosition: 'top',
      captionStyle: 'modern',
      borderStyle: 'thin',
    },
    colorScheme: {
      background: '#0a0a0a',
      accent: '#ff0033',
      text: '#ffffff',
      secondary: '#888888',
      highlight: '#1a1a1a',
    },
    fonts: {
      brand: 'Bodoni Moda',
      headline: 'Space Grotesk',
      caption: 'Inter',
    },
    aesthetic: [
      'avant-garde',
      'experimental',
      'artistic',
      'fashion-forward',
      'intellectual',
    ],
    characteristics: {
      photography: 'artistic, conceptual, unconventional angles, high contrast',
      typography: 'editorial, artistic, asymmetric',
      layout: 'experimental, magazine as art piece',
    },
  },
  {
    id: 'interview',
    name: 'Interview',
    nameCn: '访谈',
    tagline: 'Famous for Being Famous',
    coverLayout: {
      headerPosition: 'center',
      captionStyle: 'bold',
      borderStyle: 'none',
    },
    colorScheme: {
      background: '#000000',
      accent: '#ffffff',
      text: '#ffffff',
      secondary: '#cccccc',
      highlight: '#1a1a1a',
    },
    fonts: {
      brand: 'American Typewriter',
      headline: 'American Typewriter',
      caption: 'Helvetica Neue',
    },
    aesthetic: [
      'pop art',
      'andy warhol',
      'celebrity',
      'polaroid aesthetic',
      'iconic',
    ],
    characteristics: {
      photography: 'polaroid-style, pop art, celebrity portrait, stark contrast',
      typography: 'typewriter, bold headlines, pop art style',
      layout: 'polaroid frames, conversation-style',
    },
  },
  {
    id: 'id-magazine',
    name: 'i-D',
    nameCn: 'i-D',
    tagline: 'The Original',
    coverLayout: {
      headerPosition: 'top',
      captionStyle: 'bold',
      borderStyle: 'none',
    },
    colorScheme: {
      background: '#ffdd00',
      accent: '#000000',
      text: '#000000',
      secondary: '#333333',
      highlight: '#ffffff',
    },
    fonts: {
      brand: 'Helvetica Neue',
      headline: 'Arial Black',
      caption: 'Helvetica Neue',
    },
    aesthetic: [
      'street culture',
      'youth rebellion',
      'documentary',
      'authentic',
      'raw energy',
    ],
    characteristics: {
      photography: 'candid, street style, documentary, flash-forward',
      typography: 'bold, unpolished, energetic, graffiti influence',
      layout: 'dynamic, unformulaic, youthful chaos',
    },
  },
  {
    id: 'w-magazine',
    name: 'W Magazine',
    nameCn: 'W时尚',
    tagline: 'Fashion',
    coverLayout: {
      headerPosition: 'top',
      captionStyle: 'modern',
      borderStyle: 'none',
    },
    colorScheme: {
      background: '#ffffff',
      accent: '#000000',
      text: '#000000',
      secondary: '#444444',
      highlight: '#f5f5f5',
    },
    fonts: {
      brand: 'Caslon',
      headline: 'Georgia',
      caption: 'Trebuchet MS',
    },
    aesthetic: [
      'contemporary art',
      'conceptual',
      'editorial',
      'museum-quality',
      'artistic',
    ],
    characteristics: {
      photography: 'conceptual, artistic, gallery exhibition style',
      typography: 'editorial, classic with modern twist',
      layout: 'art-focused, editorial storytelling',
    },
  },
];

// Helper function to get magazine by ID
export const getMagazineById = (id: string): MagazineConfig | undefined => {
  return magazines.find((m) => m.id === id);
};

// Get all magazine IDs
export const getMagazineIds = (): string[] => {
  return magazines.map((m) => m.id);
};

// Default magazine
export const DEFAULT_MAGAZINE = 'bazaar';
