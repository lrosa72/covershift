/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import {
  buildPrompt,
  detectConflicts,
  createTransformOption,
} from '../services/promptBuilder';
import type { TransformOption, ConflictRule } from '../types';

describe('promptBuilder - TransformOption', () => {
  describe('buildPrompt', () => {
    it('should return base prompt when options array is empty', () => {
      const basePrompt = 'A portrait photo';
      const result = buildPrompt(basePrompt, []);
      expect(result).toBe(basePrompt);
    });

    it('should apply single option modifier correctly', () => {
      const basePrompt = 'A portrait photo';
      const option: TransformOption = {
        id: 'vintage-style',
        name: 'Vintage Style',
        description: 'Add vintage effect',
        category: 'artStyle',
        promptModifier: (prompt) => `${prompt}, vintage style, retro colors`,
      };

      const result = buildPrompt(basePrompt, [option]);
      expect(result).toBe('A portrait photo, vintage style, retro colors');
    });

    it('should apply multiple options in correct category order', () => {
      const basePrompt = 'Base photo';

      const eraOption: TransformOption = {
        id: '1980s',
        name: '1980s',
        description: '1980s era style',
        category: 'era',
        eraRange: [1980, 1989],
        promptModifier: (prompt) => `${prompt}, 1980s style`,
      };

      const universeOption: TransformOption = {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        description: 'Cyberpunk universe',
        category: 'universe',
        promptModifier: (prompt) => `${prompt}, neon lights, futuristic city`,
      };

      const roleOption: TransformOption = {
        id: 'detective',
        name: 'Detective',
        description: 'Detective role',
        category: 'role',
        promptModifier: (prompt) => `${prompt}, wearing detective coat`,
      };

      const artStyleOption: TransformOption = {
        id: 'noir',
        name: 'Film Noir',
        description: 'Film noir style',
        category: 'artStyle',
        promptModifier: (prompt) => `${prompt}, high contrast black and white`,
      };

      // 测试按 category 排序：era → universe → role → artStyle
      const result = buildPrompt(basePrompt, [
        artStyleOption,
        roleOption,
        universeOption,
        eraOption,
      ]);

      expect(result).toBe(
        'Base photo, 1980s style, neon lights, futuristic city, wearing detective coat, high contrast black and white'
      );
    });

    it('should handle options with same category', () => {
      const basePrompt = 'Photo';

      const option1: TransformOption = {
        id: 'opt1',
        name: 'Option 1',
        description: 'First option',
        category: 'artStyle',
        promptModifier: (prompt) => `${prompt} + modifier1`,
      };

      const option2: TransformOption = {
        id: 'opt2',
        name: 'Option 2',
        description: 'Second option',
        category: 'artStyle',
        promptModifier: (prompt) => `${prompt} + modifier2`,
      };

      const result = buildPrompt(basePrompt, [option1, option2]);
      // 同类别保持原始顺序
      expect(result).toBe('Photo + modifier1 + modifier2');
    });

    it('should preserve prompt through chained modifiers', () => {
      const basePrompt = 'Original';

      const options: TransformOption[] = [
        {
          id: 'wrap',
          name: 'Wrapper',
          description: 'Wrap prompt',
          category: 'era',
          promptModifier: (prompt) => `[${prompt}]`,
        },
        {
          id: 'emphasize',
          name: 'Emphasizer',
          description: 'Add emphasis',
          category: 'artStyle',
          promptModifier: (prompt) => `${prompt}!!!`,
        },
      ];

      const result = buildPrompt(basePrompt, options);
      expect(result).toBe('[Original]!!!');
    });
  });

  describe('detectConflicts', () => {
    it('should return empty array when no conflicts exist', () => {
      const options: TransformOption[] = [
        {
          id: '1980s',
          name: '1980s',
          description: '1980s era',
          category: 'era',
          eraRange: [1980, 1989],
          promptModifier: (p) => p,
        },
        {
          id: 'vintage',
          name: 'Vintage',
          description: 'Vintage style',
          category: 'artStyle',
          promptModifier: (p) => p,
        },
      ];

      const conflicts = detectConflicts(options);
      expect(conflicts).toEqual([]);
    });

    it('should detect multiple era options conflict', () => {
      const options: TransformOption[] = [
        {
          id: '1980s',
          name: '1980s',
          description: '1980s era',
          category: 'era',
          eraRange: [1980, 1989],
          promptModifier: (p) => p,
        },
        {
          id: '1990s',
          name: '1990s',
          description: '1990s era',
          category: 'era',
          eraRange: [1990, 1999],
          promptModifier: (p) => p,
        },
      ];

      const conflicts = detectConflicts(options);
      expect(conflicts.length).toBeGreaterThan(0);
      expect(conflicts[0]).toContain('不能同时选择多个年代风格');
      expect(conflicts[0]).toContain('1980s');
      expect(conflicts[0]).toContain('1990s');
    });

    it('should detect mutually exclusive art styles', () => {
      const options: TransformOption[] = [
        {
          id: 'realistic',
          name: 'Realistic',
          description: 'Realistic style',
          category: 'artStyle',
          promptModifier: (p) => p,
        },
        {
          id: 'cartoon',
          name: 'Cartoon',
          description: 'Cartoon style',
          category: 'artStyle',
          promptModifier: (p) => p,
        },
      ];

      const conflicts = detectConflicts(options);
      expect(conflicts.length).toBeGreaterThan(0);
      expect(conflicts[0]).toContain('写实、卡通和动漫风格不能同时选择');
    });

    it('should detect non-overlapping era ranges', () => {
      const options: TransformOption[] = [
        {
          id: 'ancient',
          name: 'Ancient Era',
          description: 'Ancient times',
          category: 'era',
          eraRange: [1000, 1500],
          promptModifier: (p) => p,
        },
        {
          id: 'future',
          name: 'Future Era',
          description: 'Future times',
          category: 'era',
          eraRange: [3000, 3500],
          promptModifier: (p) => p,
        },
      ];

      const conflicts = detectConflicts(options);
      expect(conflicts.length).toBeGreaterThan(0);
      expect(conflicts.some((c) => c.includes('年代范围不连续'))).toBe(true);
    });

    it('should allow overlapping era ranges', () => {
      const options: TransformOption[] = [
        {
          id: 'early-80s',
          name: 'Early 80s',
          description: '1980-1985',
          category: 'era',
          eraRange: [1980, 1985],
          promptModifier: (p) => p,
        },
        {
          id: 'late-80s',
          name: 'Late 80s',
          description: '1985-1990',
          category: 'era',
          eraRange: [1985, 1990],
          promptModifier: (p) => p,
        },
      ];

      // 有重叠的年代范围，不应该报年代不连续的冲突
      // 但仍然会报多 era 冲突
      const conflicts = detectConflicts(options);
      expect(conflicts.some((c) => c.includes('年代范围不连续'))).toBe(false);
    });

    it('should handle custom conflict rules', () => {
      const customRules: ConflictRule[] = [
        {
          id: 'custom-rule',
          description: 'Custom conflict',
          mutuallyExclusiveIds: ['sci-fi', 'fantasy'],
          message: '科幻与奇幻风格不能同时选择',
        },
      ];

      const options: TransformOption[] = [
        {
          id: 'sci-fi',
          name: 'Sci-Fi',
          description: 'Science fiction',
          category: 'universe',
          promptModifier: (p) => p,
        },
        {
          id: 'fantasy',
          name: 'Fantasy',
          description: 'Fantasy world',
          category: 'universe',
          promptModifier: (p) => p,
        },
      ];

      const conflicts = detectConflicts(options, customRules);
      expect(conflicts.length).toBeGreaterThan(0);
      expect(conflicts[0]).toContain('科幻与奇幻风格不能同时选择');
    });

    it('should return empty array for empty options', () => {
      const conflicts = detectConflicts([]);
      expect(conflicts).toEqual([]);
    });

    it('should detect multiple conflicts at once', () => {
      const options: TransformOption[] = [
        {
          id: '1980s',
          name: '1980s',
          description: '1980s era',
          category: 'era',
          eraRange: [1980, 1989],
          promptModifier: (p) => p,
        },
        {
          id: '1990s',
          name: '1990s',
          description: '1990s era',
          category: 'era',
          eraRange: [1990, 1999],
          promptModifier: (p) => p,
        },
        {
          id: 'realistic',
          name: 'Realistic',
          description: 'Realistic style',
          category: 'artStyle',
          promptModifier: (p) => p,
        },
        {
          id: 'anime',
          name: 'Anime',
          description: 'Anime style',
          category: 'artStyle',
          promptModifier: (p) => p,
        },
      ];

      const conflicts = detectConflicts(options);
      expect(conflicts.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('createTransformOption', () => {
    it('should create a valid TransformOption', () => {
      const option = createTransformOption(
        'test-id',
        'Test Option',
        'Test description',
        'artStyle',
        (prompt) => `${prompt}, modified`
      );

      expect(option.id).toBe('test-id');
      expect(option.name).toBe('Test Option');
      expect(option.description).toBe('Test description');
      expect(option.category).toBe('artStyle');
      expect(option.promptModifier('base')).toBe('base, modified');
    });

    it('should include optional fields when provided', () => {
      const option = createTransformOption(
        'era-80s',
        '1980s',
        'Eighties style',
        'era',
        (prompt) => `${prompt}, 80s vibe`,
        {
          previewImage: '/images/80s.jpg',
          eraRange: [1980, 1989],
        }
      );

      expect(option.previewImage).toBe('/images/80s.jpg');
      expect(option.eraRange).toEqual([1980, 1989]);
    });

    it('should work without optional fields', () => {
      const option = createTransformOption(
        'simple',
        'Simple',
        'Simple option',
        'role',
        (p) => p
      );

      expect(option.previewImage).toBeUndefined();
      expect(option.eraRange).toBeUndefined();
    });
  });

  describe('integration tests', () => {
    it('should build complex prompt with multiple categories', () => {
      const basePrompt = 'A professional portrait';

      const options: TransformOption[] = [
        createTransformOption(
          '1920s',
          'Roaring 20s',
          '1920s style',
          'era',
          (p) => `${p}, 1920s flapper style, art deco background`,
          { eraRange: [1920, 1929] }
        ),
        createTransformOption(
          'vogue',
          'Vogue Magazine',
          'Vogue cover style',
          'universe',
          (p) => `${p}, Vogue magazine cover, high fashion`
        ),
        createTransformOption(
          'model',
          'Fashion Model',
          'Model pose',
          'role',
          (p) => `${p}, elegant pose, confident expression`
        ),
        createTransformOption(
          'vintage-photo',
          'Vintage Photography',
          'Old photo look',
          'artStyle',
          (p) => `${p}, sepia tones, film grain, soft focus`
        ),
      ];

      const result = buildPrompt(basePrompt, options);
      expect(result).toContain('1920s flapper style');
      expect(result).toContain('Vogue magazine cover');
      expect(result).toContain('elegant pose');
      expect(result).toContain('sepia tones');
    });

    it('should detect conflicts in complex scenarios', () => {
      const options: TransformOption[] = [
        createTransformOption(
          '1950s',
          '1950s',
          'Fifties',
          'era',
          (p) => p,
          { eraRange: [1950, 1959] }
        ),
        createTransformOption(
          '1960s',
          '1960s',
          'Sixties',
          'era',
          (p) => p,
          { eraRange: [1960, 1969] }
        ),
        createTransformOption(
          'realistic',
          'Realistic',
          'Realistic rendering',
          'artStyle',
          (p) => p
        ),
        createTransformOption(
          'cartoon',
          'Cartoon',
          'Cartoon style',
          'artStyle',
          (p) => p
        ),
      ];

      const conflicts = detectConflicts(options);
      expect(conflicts.length).toBeGreaterThanOrEqual(2);
      expect(conflicts.some((c) => c.includes('年代'))).toBe(true);
      expect(conflicts.some((c) => c.includes('写实、卡通'))).toBe(true);
    });

    it('should handle modifier chaining order correctly', () => {
      const basePrompt = 'Start';

      const options: TransformOption[] = [
        {
          id: 'first',
          name: 'First',
          description: 'First modifier',
          category: 'era',
          promptModifier: (p) => `(${p})`,
        },
        {
          id: 'second',
          name: 'Second',
          description: 'Second modifier',
          category: 'universe',
          promptModifier: (p) => `[${p}]`,
        },
        {
          id: 'third',
          name: 'Third',
          description: 'Third modifier',
          category: 'role',
          promptModifier: (p) => `{${p}}`,
        },
        {
          id: 'fourth',
          name: 'Fourth',
          description: 'Fourth modifier',
          category: 'artStyle',
          promptModifier: (p) => `<${p}>`,
        },
      ];

      const result = buildPrompt(basePrompt, options);
      // era → universe → role → artStyle
      // (Start) -> [(Start)] -> {[(Start)]} -> <{[(Start)]}>
      expect(result).toBe('<{[(Start)]}>');
    });
  });
});
