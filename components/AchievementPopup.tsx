/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 成就解锁弹窗组件
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement, getAchievementRarityColor } from '../src/config/achievements';

interface AchievementPopupProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({
  achievement,
  onClose
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const rarityColor = getAchievementRarityColor(achievement.rarity);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, x: '-50%' }}
        animate={{ opacity: 1, y: 20, x: '-50%' }}
        exit={{ opacity: 0, y: -100, x: '-50%' }}
        className="fixed top-0 left-1/2 z-50"
      >
        <div
          className="bg-neutral-900 border-2 rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-4 min-w-[320px]"
          style={{
            borderColor: rarityColor
          }}
        >
          {/* Glow effect */}
          <div
            className="absolute inset-0 rounded-2xl opacity-20 blur-xl"
            style={{ backgroundColor: rarityColor }}
          ></div>

          <div className="relative z-10 flex items-center gap-4">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-5xl"
            >
              {achievement.icon}
            </motion.div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p
                  className="text-xs px-2 py-0.5 rounded-full text-white font-bold uppercase tracking-wider"
                  style={{ backgroundColor: rarityColor }}
                >
                  成就解锁！
                </p>
              </div>
              <h3 className="text-white font-bold text-lg mt-1">
                {achievement.nameCn}
              </h3>
              <p className="text-neutral-400 text-sm">
                {achievement.descriptionCn}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AchievementPopup;
