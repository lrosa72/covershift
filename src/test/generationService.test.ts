import { describe, it, expect } from 'vitest';
import {
  createGenerationTasks,
  createInitialGeneratedImages,
  parseGenerationKey,
} from '../../services/generationService';

describe('generationService', () => {
  describe('createGenerationTasks', () => {
    it('should create tasks for all combinations', () => {
      const decades = ['1980s', '1990s'];
      const magazines = ['vogue', 'bazaar'];
      const styles = ['none'];

      const tasks = createGenerationTasks(decades, magazines, styles);

      expect(tasks).toHaveLength(4); // 2 decades × 2 magazines × 1 style
      expect(tasks[0]).toMatchObject({
        decade: '1980s',
        magazineId: 'vogue',
        creativeStyle: 'none',
      });
    });

    it('should create unique keys for each task', () => {
      const decades = ['1980s'];
      const magazines = ['vogue'];
      const styles = ['cyberpunk'];

      const tasks = createGenerationTasks(decades, magazines, styles);

      expect(tasks[0].key).toBe('1980s-vogue-cyberpunk');
    });

    it('should handle empty arrays', () => {
      const tasks = createGenerationTasks([], [], []);
      expect(tasks).toHaveLength(0);
    });
  });

  describe('createInitialGeneratedImages', () => {
    it('should create pending state for all tasks', () => {
      const tasks = createGenerationTasks(['1980s'], ['bazaar'], ['none']);
      const images = createInitialGeneratedImages(tasks);

      expect(Object.keys(images)).toHaveLength(1);
      expect(images['1980s-bazaar-none']).toEqual({
        status: 'pending',
        magazineId: 'bazaar',
        creativeStyle: 'none',
        randomEvent: expect.anything(),
      });
    });
  });

  describe('parseGenerationKey', () => {
    it('should parse simple decade-magazine-style key', () => {
      const result = parseGenerationKey('1980s-vogue-none');

      expect(result).toEqual({
        decade: '1980s',
        magazineId: 'vogue',
        creativeStyle: 'none',
      });
    });

    it('should parse key with multi-part magazine id', () => {
      const result = parseGenerationKey('1980s-vanity-fair-none');

      expect(result).toEqual({
        decade: '1980s',
        magazineId: 'vanity-fair',
        creativeStyle: 'none',
      });
    });

    it('should handle two-part key', () => {
      const result = parseGenerationKey('1990s-vogue');

      expect(result).toEqual({
        decade: '1990s',
        magazineId: 'vogue',
        creativeStyle: 'none',
      });
    });

    it('should default to bazaar for unknown magazines', () => {
      const result = parseGenerationKey('1980s');

      expect(result).toEqual({
        decade: '1980s',
        magazineId: 'bazaar',
        creativeStyle: 'none',
      });
    });
  });
});
