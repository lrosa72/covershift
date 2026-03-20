/**
 * 增强版 Prompt 构建器 - 专注于人脸一致性
 */

export interface PromptConfig {
  magazineId: string;
  decade: string;
  creativeStyle?: string;
  customPrompt?: string;
  enhanceFaceConsistency?: boolean;
}

// 杂志名称映射
const MAGAZINE_NAMES: Record<string, string> = {
  'bazaar': "Harper's Bazaar",
  'vogue': 'Vogue',
  'elle': 'Elle',
  'gq': 'GQ',
  'vanity-fair': 'Vanity Fair',
  'lofficiel': "L'Officiel",
  'interview': 'Interview',
  'id-magazine': 'i-D',
  'w-magazine': 'W Magazine'
};

/**
 * 构建增强人脸一致性的 Prompt
 */
export function buildFaceConsistentPrompt(config: PromptConfig): string {
  const {
    magazineId,
    decade,
    creativeStyle,
    customPrompt,
    enhanceFaceConsistency = true
  } = config;

  const magazineName = MAGAZINE_NAMES[magazineId] || "Harper's Bazaar";

  // 基础 prompt
  let basePrompt = customPrompt?.trim();

  if (!basePrompt) {
    basePrompt = `Transform the person in this photo into a ${decade} high-fashion editorial portrait for ${magazineName} magazine cover.`;
  }

  // 人脸一致性核心指令
  const faceConsistencyInstructions = enhanceFaceConsistency ? `
  
=== CRITICAL IDENTITY PRESERVATION ===
This is the MOST IMPORTANT requirement. Study the source photo carefully and maintain EXACT facial identity:

1. **FACE IDENTITY**: The output MUST show the EXACT SAME PERSON from the source photo. Every facial feature must be identical - eye shape, nose bridge, lip shape, chin, cheekbones, brow line, overall face structure.

2. **RECOGNIZABLE**: The person in the generated image must be immediately recognizable as the same individual in your source photo.

3. **ONLY TRANSFORM**: Change ONLY these elements:
   - Clothing and fashion (to match ${decade} style)
   - Hairstyle and hair color (${decade} aesthetic)
   - Makeup and styling
   - Lighting (professional studio lighting)
   - Background and setting
   - Magazine typography and layout

4. **DO NOT CHANGE**: 
   - Face shape and bone structure
   - Eye color, shape, and size
   - Nose shape and size
   - Lip shape and fullness
   - Chin shape
   - Overall facial proportions
   - Any unique identifying features

5. **QUALITY**: The output must be photorealistic, high-resolution, magazine-quality editorial photography.

Use the source photo as your ONLY reference for the person's identity. This is a fashion transformation, NOT a different person.` : '';

  // 风格附加
  let styleAddition = '';
  if (creativeStyle && creativeStyle !== 'none') {
    styleAddition = getStyleAddition(creativeStyle);
  }

  return basePrompt + faceConsistencyInstructions + styleAddition;
}

/**
 * 获取风格附加描述
 */
function getStyleAddition(styleId: string): string {
  const styleMap: Record<string, string> = {
    'cyberpunk': `
=== CREATIVE STYLE: CYBERPUNK ===
- Neon lights, rain-soaked streets
- High-tech, low-life aesthetic
- RGB color grading with cyan and magenta highlights
- Moody, atmospheric lighting`,
    
    'vaporwave': `
=== CREATIVE STYLE: VAPORWAVE ===
- 80s/90s nostalgia aesthetic
- Pastel pink, blue, and purple tones
- Greek statues and retro computer graphics
- Dreamy, surreal atmosphere`,
    
    'neoclassical': `
=== CREATIVE STYLE: NEOCLASSICAL ===
- Renaissance-inspired beauty standards
- Oil painting texture and lighting
- Dramatic chiaroscuro
- Museum-quality composition`,
    
    'renaissance': `
=== CREATIVE STYLE: RENAISSANCE ===
- Italian Renaissance aesthetics
- Rich, warm color palette
- Classical beauty idealization
- Master painting lighting techniques`,
    
    'film-noir': `
=== CREATIVE STYLE: FILM NOIR ===
- Classic black and white cinematography
- Dramatic shadows and high contrast
- Mysterious, moody atmosphere
- Hard lighting with distinct shadows`,
    
    'japanese-ink': `
=== CREATIVE STYLE: JAPANESE INK ===
- Traditional East Asian aesthetics
- Sumi-e (ink wash) painting influence
- Minimalist composition
- Serene, contemplative mood`,
    
    'glitch-art': `
=== CREATIVE STYLE: GLITCH ART ===
- Digital corruption effects
- RGB color shifting
- Pixel displacement
- Cyber aesthetic`,
    
    'art-deco': `
=== CREATIVE STYLE: ART DECO ===
- 1920s-1930s geometric elegance
- Gold and black color scheme
- Bold, graphic compositions
- Glamorous Hollywood influence`,
    
    'retro': `
=== CREATIVE STYLE: RETRO ===
- Vintage photograph aesthetic
- Warm, faded color tones
- Classic styling from the era
- Timeless elegance`,
    
    'future': `
=== CREATIVE STYLE: FUTURE ===
- Sci-fi inspired fashion
- Metallic and holographic elements
- Clean, minimalist lines
- Advanced technology aesthetic`
  };

  return styleMap[styleId] || '';
}

/**
 * 生成变体 Prompt（用于多次生成选择最佳）
 */
export function generateVariantPrompts(
  basePrompt: string,
  variantCount: number = 3
): string[] {
  const variants = [
    "Focus on exact facial feature preservation while transforming the fashion.",
    "Maintain 100% face identity, emphasize the person's unique facial characteristics.",
    "The face must be identical - focus transformation on clothing, hairstyle, and setting only."
  ];

  return variants.slice(0, variantCount).map(v => basePrompt + '\n\n' + v);
}
