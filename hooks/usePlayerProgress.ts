import { useState } from 'react';
import {
  loadPlayerStats,
  savePlayerStats,
  updatePlayerStatsOnGeneration,
  recordRareEvent,
  Achievement,
  PlayerStats,
} from '../src/config/achievements';
import { RandomEvent } from '../src/config/randomEvents';

export function usePlayerProgress() {
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => loadPlayerStats());
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  const recordGeneration = (
    selectedDecades: string[],
    selectedMagazines: string[],
    selectedCreativeStyles: string[],
    globalEvent: RandomEvent | null
  ) => {
    const result = updatePlayerStatsOnGeneration(
      playerStats,
      selectedDecades,
      selectedMagazines,
      selectedCreativeStyles
    );

    let updatedStats = result.stats;
    if (globalEvent) {
      updatedStats = recordRareEvent(updatedStats, globalEvent.id);
    }

    setPlayerStats(updatedStats);
    savePlayerStats(updatedStats);

    if (result.newAchievements.length > 0) {
      setNewAchievements(result.newAchievements);
    }
  };

  const dismissOldestAchievement = () => {
    setNewAchievements((prev) => prev.slice(1));
  };

  return {
    playerStats,
    newAchievements,
    recordGeneration,
    dismissOldestAchievement,
  };
}
