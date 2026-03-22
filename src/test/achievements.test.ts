import { describe, it, expect, beforeEach } from 'vitest';
import {
  initializePlayerStats,
  loadPlayerStats,
  savePlayerStats,
  updatePlayerStatsOnGeneration,
  getAchievementProgress,
  achievements,
} from '../../src/config/achievements';

describe('achievements', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('initializePlayerStats', () => {
    it('should return initial player stats', () => {
      const stats = initializePlayerStats();

      expect(stats.totalGenerations).toBe(0);
      expect(stats.uniqueDecades).toEqual([]);
      expect(stats.uniqueMagazines).toEqual([]);
      expect(stats.uniqueStyles).toEqual([]);
      expect(stats.completedAchievements).toEqual([]);
      expect(stats.currentStreak).toBe(0);
    });
  });

  describe('loadPlayerStats', () => {
    it('should return initialized stats when localStorage is empty', () => {
      const stats = loadPlayerStats();

      expect(stats.totalGenerations).toBe(0);
    });

    it('should return parsed stats from localStorage', () => {
      const savedStats = {
        totalGenerations: 10,
        uniqueDecades: ['1980s'],
        uniqueMagazines: ['vogue'],
        uniqueStyles: ['cyberpunk'],
        completedAchievements: [],
        currentStreak: 1,
        longestStreak: 1,
        lastPlayed: '2024-01-01',
        totalTimeSpent: 0,
        rareEventsFound: [],
        secretCombosFound: [],
      };
      localStorage.setItem('covershift_player_stats', JSON.stringify(savedStats));

      const stats = loadPlayerStats();

      expect(stats.totalGenerations).toBe(10);
      expect(stats.uniqueDecades).toContain('1980s');
    });
  });

  describe('savePlayerStats', () => {
    it('should save stats to localStorage', () => {
      const stats = initializePlayerStats();
      stats.totalGenerations = 5;

      savePlayerStats(stats);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'covershift_player_stats',
        JSON.stringify(stats)
      );
    });
  });

  describe('updatePlayerStatsOnGeneration', () => {
    it('should increment total generations', () => {
      const stats = initializePlayerStats();
      const result = updatePlayerStatsOnGeneration(
        stats,
        ['1980s'],
        ['vogue'],
        ['none']
      );

      expect(result.stats.totalGenerations).toBe(1);
    });

    it('should track unique decades', () => {
      const stats = initializePlayerStats();
      const result = updatePlayerStatsOnGeneration(
        stats,
        ['1980s', '1990s'],
        ['vogue'],
        ['none']
      );

      expect(result.stats.uniqueDecades).toContain('1980s');
      expect(result.stats.uniqueDecades).toContain('1990s');
    });

    it('should track unique magazines', () => {
      const stats = initializePlayerStats();
      const result = updatePlayerStatsOnGeneration(
        stats,
        ['1980s'],
        ['vogue', 'bazaar'],
        ['none']
      );

      expect(result.stats.uniqueMagazines).toContain('vogue');
      expect(result.stats.uniqueMagazines).toContain('bazaar');
    });

    it('should not track "none" style', () => {
      const stats = initializePlayerStats();
      const result = updatePlayerStatsOnGeneration(
        stats,
        ['1980s'],
        ['vogue'],
        ['none', 'cyberpunk']
      );

      expect(result.stats.uniqueStyles).not.toContain('none');
      expect(result.stats.uniqueStyles).toContain('cyberpunk');
    });
  });

  describe('getAchievementProgress', () => {
    it('should calculate progress for count achievements', () => {
      const achievement = achievements.find(a => a.id === 'first-generation')!;
      const stats = initializePlayerStats();
      stats.totalGenerations = 0;

      const progress = getAchievementProgress(achievement, stats);
      expect(progress).toBe(0);

      stats.totalGenerations = 1;
      const progress2 = getAchievementProgress(achievement, stats);
      expect(progress2).toBe(100);
    });

    it('should calculate progress for unique achievements', () => {
      const achievement = achievements.find(a => a.id === 'time-traveler')!;
      const stats = initializePlayerStats();
      stats.uniqueDecades = ['1980s', '1990s', '2000s'];

      const progress = getAchievementProgress(achievement, stats);
      expect(progress).toBe(60); // 3/5 = 60%
    });

    it('should return 0 for unknown achievement types', () => {
      const achievement = achievements.find(a => a.id === 'first-generation')!;
      const stats = initializePlayerStats();

      const progress = getAchievementProgress({ ...achievement, requirement: { ...achievement.requirement, type: 'unknown' as any } }, stats);
      expect(progress).toBe(0);
    });
  });
});
