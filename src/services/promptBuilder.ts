/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 提示词构建器 - 支持多维度组合
 */

import { 
  MagazineConfig, 
  getMagazineById, 
  EraConfig, 
  getEraById, 
  CreativeStyleConfig, 
  getCreativeStyleById 
} from '../config';

/**
 * 人脸一致性基础提示词
 */
export const BASE_IDENTITY_PROMPT = `CRITICAL: Maintain strict facial consistency. Preserve all unique facial features, bone structure, eye shape, nose shape, lip shape, and the specific identity of the person in the original image. 
Only transform the clothing, hairstyle, makeup, professional studio lighting, and the overall aesthetic to match the specified era and style. 
The output must be a photorealistic, professional studio portrait where the person is clearly recognizable as the individual in the source photo.`;

export class PromptBuilder {
  private magazine: MagazineConfig | null = null;
  private era: EraConfig | null = null;
  private creativeStyle: CreativeStyleConfig | null = null;
  private customPrompt: string = '';

  /**
   * 设置杂志风格
   */
  setMagazine(magazineId: string): this {
    this.magazine = getMagazineById(magazineId) || null;
    return this;
  }

  /**
   * 设置年代风格
   */
  setEra(eraId: string): this {
    this.era = getEraById(eraId) || null;
    return this;
  }

  /**
   * 设置创意风格
   */
  setCreativeStyle(styleId: string): this {
    this.creativeStyle = getCreativeStyleById(styleId) || null;
    return this;
  }

  /**
   * 设置自定义提示词
   */
  setCustomPrompt(prompt: string): this {
    this.customPrompt = prompt;
    return this;
  }

  /**
   * 构建杂志封面提示词
   */
  buildMagazineCoverPrompt(): string {
    const parts: string[] = [];

    // 杂志名称和风格
    if (this.magazine) {
      parts.push(`Create a professional ${this.magazine.name} magazine cover photograph`);
      parts.push(`featuring the EXACT SAME PERSON from this source image.`);
      parts.push(`\n\n${this.magazine.name} Style Characteristics:`);
      parts.push(`- Magazine aesthetic: ${this.magazine.aesthetic.join(', ')}`);
      parts.push(`- Photography style: ${this.magazine.characteristics.photography}`);
      parts.push(`- Typography: ${this.magazine.characteristics.typography}`);
      parts.push(`- Layout: ${this.magazine.characteristics.layout}`);
    } else {
      parts.push(`Create a professional high-fashion magazine cover photograph`);
      parts.push(`featuring the EXACT SAME PERSON from this source image.`);
    }

    // 年代风格
    if (this.era) {
      parts.push(`\n\n${this.era.decade} Era (${this.era.eraName || ''}) Fashion:`);
      parts.push(`- Fashion: ${this.era.fashionKeywords.slice(0, 5).join(', ')}`);
      parts.push(`- Hairstyle: ${this.era.hairstyleKeywords.slice(0, 3).join(', ')}`);
      parts.push(`- Makeup: ${this.era.makeupKeywords.slice(0, 3).join(', ')}`);
      parts.push(`- Lighting: ${this.era.lightingStyle}`);
      parts.push(`- Mood: ${this.era.mood}`);
      parts.push(`- Cultural context: ${this.era.culturalContext}`);
    }

    // 创意风格
    if (this.creativeStyle && this.creativeStyle.id !== 'none') {
      parts.push(`\n\nCreative Style - ${this.creativeStyle.name} (${this.creativeStyle.nameCn}):`);
      parts.push(`- Visual: ${this.creativeStyle.promptAddon.visual}`);
      parts.push(`- Mood: ${this.creativeStyle.promptAddon.mood}`);
      parts.push(`- Lighting: ${this.creativeStyle.promptAddon.lighting}`);
      parts.push(`- Color grading: ${this.creativeStyle.promptAddon.colorGrade}`);
      parts.push(`- Composition: ${this.creativeStyle.promptAddon.composition}`);
    }

    // 自定义提示词
    if (this.customPrompt) {
      parts.push(`\n\nCustom requirements: ${this.customPrompt}`);
    }

    // 人脸一致性
    parts.push(`\n\n${BASE_IDENTITY_PROMPT}`);

    return parts.join('\n');
  }

  /**
   * 构建备用提示词（用于原提示词被屏蔽时）
   */
  buildFallbackPrompt(): string {
    const parts: string[] = [];

    const magazineName = this.magazine?.name || 'fashion magazine';
    const eraName = this.era?.decade || 'modern';
    const eraStyle = this.era?.eraName || '';

    parts.push(`Create a ${magazineName} cover photograph of the EXACT SAME PERSON from this source image as if they were in the ${eraName} (${eraStyle}).`);
    
    if (this.era) {
      parts.push(`Fashion: ${this.era.characteristics.style.join(', ')}`);
      parts.push(`The person must be clearly recognizable while wearing era-appropriate clothing, hairstyle, and makeup.`);
    }

    parts.push(BASE_IDENTITY_PROMPT);

    return parts.join('\n');
  }

  /**
   * 提取年代信息（用于备用提示词）
   */
  extractEraFromPrompt(prompt: string): string | null {
    const match = prompt.match(/(\d{4}s|\d{2}00s)/);
    return match ? match[1] : null;
  }

  /**
   * 重置构建器
   */
  reset(): this {
    this.magazine = null;
    this.era = null;
    this.creativeStyle = null;
    this.customPrompt = '';
    return this;
  }
}

// 工厂函数
export const createPromptBuilder = (): PromptBuilder => {
  return new PromptBuilder();
};

/**
 * 快速构建提示词
 */
export const buildPrompt = (
  magazineId: string,
  eraId: string,
  styleId: string = 'none',
  customPrompt?: string
): { primary: string; fallback: string } => {
  const builder = new PromptBuilder();
  builder
    .setMagazine(magazineId)
    .setEra(eraId)
    .setCreativeStyle(styleId);
  
  if (customPrompt) {
    builder.setCustomPrompt(customPrompt);
  }

  return {
    primary: builder.buildMagazineCoverPrompt(),
    fallback: builder.buildFallbackPrompt(),
  };
};

/**
 * 生成随机年代的提示词
 */
export const buildRandomEraPrompt = (
  magazineId: string,
  styleId: string = 'none',
  yearRange: { min: number; max: number } = { min: 1920, max: 2100 }
): { primary: string; fallback: string; selectedEra: string } => {
  // 随机选择年份
  const randomYear = Math.floor(Math.random() * (yearRange.max - yearRange.min + 1)) + yearRange.min;
  // 向下取整到 decade
  const decade = Math.floor(randomYear / 10) * 10;
  const eraId = `${decade}s`;

  const builder = new PromptBuilder();
  builder
    .setMagazine(magazineId)
    .setEra(eraId)
    .setCreativeStyle(styleId);

  return {
    primary: builder.buildMagazineCoverPrompt(),
    fallback: builder.buildFallbackPrompt(),
    selectedEra: eraId,
  };
};

/**
 * 生成多风格组合提示词
 */
export const buildMultiStylePrompt = (
  magazineId: string,
  eraId: string,
  styleIds: string[]
): { prompts: Array<{ styleId: string; primary: string; fallback: string }> } => {
  const prompts = styleIds.map(styleId => {
    const builder = new PromptBuilder();
    builder
      .setMagazine(magazineId)
      .setEra(eraId)
      .setCreativeStyle(styleId);

    return {
      styleId,
      primary: builder.buildMagazineCoverPrompt(),
      fallback: builder.buildFallbackPrompt(),
    };
  });

  return { prompts };
};
