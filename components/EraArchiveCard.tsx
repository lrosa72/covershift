/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 时代档案卡组件 - 展示叙事内容
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNarrativeByDecade, getMagazineNarrative } from '../src/config/narratives';
import { getMagazineById } from '../src/config/magazines';
import { getEraById } from '../src/config/eras';
import { RandomEvent, getRarityColor, getRarityName } from '../src/config/randomEvents';

interface EraArchiveCardProps {
  decade: string;
  magazineId: string;
  randomEvent?: RandomEvent | null;
  onClose: () => void;
}

const EraArchiveCard: React.FC<EraArchiveCardProps> = ({
  decade,
  magazineId,
  randomEvent,
  onClose
}) => {
  const narrative = getNarrativeByDecade(decade);
  const eraConfig = getEraById(decade);
  const magazineConfig = getMagazineById(magazineId);
  const magazineNarrative = getMagazineNarrative(magazineId);

  if (!narrative) return null;

  // 从 eraConfig 获取配色，如果没有则使用默认值
  const colorPalette = eraConfig?.colorPalette || ['#1a1a2e', '#d4af37', '#c0c0c0', '#8b0000', '#f5f5dc'];
  const yearRange = eraConfig?.yearRange || `${decade}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-2xl w-full mx-4 overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="relative p-6 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${colorPalette[0]} 0%, ${colorPalette[1] || '#333'} 100%)`
            }}
          >
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/60 text-sm font-mono uppercase tracking-widest">
                    {yearRange}
                  </p>
                  <h2 className="text-3xl font-playfair text-white font-bold mt-1">
                    {narrative.headline}
                  </h2>
                  <p className="text-white/80 mt-1 italic">
                    {narrative.subheadline}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Random Event Banner */}
          {randomEvent && (
            <div
              className="px-6 py-3 border-b border-neutral-700"
              style={{ backgroundColor: getRarityColor(randomEvent.rarity) + '20' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{randomEvent.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{randomEvent.nameCn}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: getRarityColor(randomEvent.rarity),
                        color: randomEvent.rarity === 'common' ? '#000' : '#fff'
                      }}
                    >
                      {getRarityName(randomEvent.rarity)}
                    </span>
                  </div>
                  <p className="text-neutral-400 text-sm">{randomEvent.descriptionCn}</p>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Culture Icons Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">👤</span>
                  <h3 className="text-white font-semibold text-sm">文化偶像</h3>
                </div>
                <p className="text-neutral-300">{narrative.culturalIcon}</p>
              </div>
              <div className="bg-neutral-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📅</span>
                  <h3 className="text-white font-semibold text-sm">标志性事件</h3>
                </div>
                <p className="text-neutral-300">{narrative.iconicEvent}</p>
              </div>
            </div>

            {/* Quote */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-transparent border-l-2 border-yellow-500 pl-4 py-2">
              <p className="text-neutral-300 italic text-sm">"{narrative.fashionQuote}"</p>
            </div>

            {/* More Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-neutral-500 text-xs uppercase tracking-wider mb-1">音乐氛围</h4>
                  <p className="text-neutral-300 text-sm">🎵 {narrative.musicVibe}</p>
                </div>
                <div>
                  <h4 className="text-neutral-500 text-xs uppercase tracking-wider mb-1">电影参考</h4>
                  <p className="text-neutral-300 text-sm">🎬 {narrative.movieReference}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="text-neutral-500 text-xs uppercase tracking-wider mb-1">趣闻</h4>
                  <p className="text-neutral-300 text-sm">💡 {narrative.funFact}</p>
                </div>
                <div>
                  <h4 className="text-neutral-500 text-xs uppercase tracking-wider mb-1">美学</h4>
                  <p className="text-neutral-300 text-sm">{narrative.aestheticDescription}</p>
                </div>
              </div>
            </div>

            {/* Magazine Info */}
            {magazineNarrative && (
              <div className="border-t border-neutral-700 pt-4">
                <h4 className="text-neutral-500 text-xs uppercase tracking-wider mb-2">
                  {magazineConfig?.nameCn || magazineId} · 创刊于 {magazineNarrative.foundingYear}
                </h4>
                <p className="text-neutral-400 text-sm italic">"{magazineNarrative.philosophy}"</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EraArchiveCard;
