import { describe, it, expect } from 'vitest';
import { buildGenerationPrompt } from '../../services/promptBuilder';

describe('promptBuilder', () => {
  describe('buildGenerationPrompt', () => {
    it('should build basic prompt with decade and magazine', () => {
      const prompt = buildGenerationPrompt({
        magazineId: 'vogue',
        decade: '1980s',
        creativeStyle: 'none',
      });

      expect(prompt).toContain('1980s');
      expect(prompt).toContain('Vogue');
    });

    it('should include identity preservation instructions when enhanceFaceConsistency is true', () => {
      const prompt = buildGenerationPrompt({
        magazineId: 'bazaar',
        decade: '1990s',
        creativeStyle: 'none',
        enhanceFaceConsistency: true,
      });

      expect(prompt).toContain('CRITICAL IDENTITY PRESERVATION');
      expect(prompt).toContain('FACE IDENTITY');
    });

    it('should not include identity instructions when enhanceFaceConsistency is false', () => {
      const prompt = buildGenerationPrompt({
        magazineId: 'bazaar',
        decade: '1990s',
        creativeStyle: 'none',
        enhanceFaceConsistency: false,
      });

      expect(prompt).not.toContain('CRITICAL IDENTITY PRESERVATION');
    });

    it('should handle custom prompt with placeholders', () => {
      const prompt = buildGenerationPrompt({
        magazineId: 'vogue',
        decade: '1980s',
        creativeStyle: 'none',
        customPrompt: 'Make it look like a {decade} {magazine} cover',
      });

      expect(prompt).toContain('1980s');
      expect(prompt).toContain('Vogue');
    });

    it('should include random event bonus prompt when event is provided', () => {
      const mockEvent = {
        id: 'test-event',
        name: 'Test Event',
        nameCn: '测试事件',
        description: 'Test description',
        descriptionCn: '测试描述',
        rarity: 'rare' as const,
        probability: 0.1,
        icon: '✨',
        effectType: 'style_bonus' as const,
        effect: {
          bonusPrompt: 'bonus prompt text',
        },
      };

      const prompt = buildGenerationPrompt({
        magazineId: 'vogue',
        decade: '1980s',
        creativeStyle: 'none',
        randomEvent: mockEvent,
      });

      expect(prompt).toContain('bonus prompt text');
    });
  });
});
