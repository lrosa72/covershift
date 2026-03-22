import { creativeStyles } from '../src/config/creativeStyles';
import { RandomEvent } from '../src/config/randomEvents';

export interface BuildGenerationPromptInput {
  magazineId: string;
  decade: string;
  creativeStyle: string;
  customPrompt?: string;
  randomEvent?: RandomEvent | null;
  enhanceFaceConsistency?: boolean;
}

const MAGAZINE_NAMES: Record<string, string> = {
  bazaar: "Harper's Bazaar",
  vogue: 'Vogue',
  elle: 'Elle',
  gq: 'GQ',
  'vanity-fair': 'Vanity Fair',
  lofficiel: "L'Officiel",
  interview: 'Interview',
  'id-magazine': 'i-D',
  'w-magazine': 'W Magazine',
};

export function buildGenerationPrompt({
  magazineId,
  decade,
  creativeStyle,
  customPrompt,
  randomEvent,
  enhanceFaceConsistency = true,
}: BuildGenerationPromptInput): string {
  const styleConfig = creativeStyles.find((style) => style.id === creativeStyle);
  const magazineName = MAGAZINE_NAMES[magazineId] || "Harper's Bazaar";

  let styleAddition = '';
  if (styleConfig && styleConfig.id !== 'none') {
    styleAddition = `
        ${styleConfig.descriptionCn}风格: ${styleConfig.promptAddon.visual}.
        光线风格: ${styleConfig.promptAddon.lighting}.
        色调: ${styleConfig.promptAddon.colorGrade}.
        氛围: ${styleConfig.promptAddon.mood}.`;
  }

  let eventAddition = '';
  if (randomEvent?.effect?.bonusPrompt) {
    eventAddition = `\n        Bonus style: ${randomEvent.effect.bonusPrompt}.`;
  }

  const identityInstructions = enhanceFaceConsistency ? `

=== CRITICAL IDENTITY PRESERVATION ===
This is the MOST IMPORTANT requirement. Study the source photo carefully and maintain EXACT facial identity:

1. **FACE IDENTITY**: The output MUST show the EXACT SAME PERSON from the source photo. Every facial feature must be identical - eye shape, nose bridge, lip shape, chin, cheekbones, brow line, overall face structure, skin tone.

2. **RECOGNIZABLE**: The person in the generated image must be immediately recognizable as the same individual in your source photo. The face must be IDENTICAL.

3. **ONLY TRANSFORM**: Change ONLY these elements:
   - Clothing and fashion (to match ${decade} ${magazineName} style)
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
   - Skin tone and texture
   - Any unique identifying features

5. **QUALITY**: The output must be photorealistic, high-resolution, magazine-quality editorial photography.

Use the source photo as your ONLY reference for the person's identity. This is a fashion transformation, NOT a different person.` : '';

  if (customPrompt && customPrompt.trim()) {
    return customPrompt
      .replace(/\{decade\}/g, decade)
      .replace(/\{magazine\}/g, magazineName)
      + styleAddition
      + eventAddition
      + identityInstructions;
  }

  return `Transform the person in this photo into a ${decade} high-fashion editorial portrait for ${magazineName} magazine cover.${styleAddition}${eventAddition}${identityInstructions}`;
}
