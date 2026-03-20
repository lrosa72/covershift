/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 风格选择器组件 - 杂志风格 + 创意风格
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { magazines, MagazineConfig } from '../config/magazines';
import { creativeStyles, CreativeStyleConfig } from '../config/creativeStyles';

type StyleTab = 'magazine' | 'creative';

interface StyleSelectorProps {
  selectedMagazine: string;
  selectedStyle: string;
  onMagazineChange: (magazineId: string) => void;
  onStyleChange: (styleId: string) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedMagazine,
  selectedStyle,
  onMagazineChange,
  onStyleChange,
}) => {
  const [activeTab, setActiveTab] = useState<StyleTab>('magazine');
  const [hoveredMagazine, setHoveredMagazine] = useState<MagazineConfig | null>(null);
  const [hoveredStyle, setHoveredStyle] = useState<CreativeStyleConfig | null>(null);

  const currentMagazine = magazines.find((m) => m.id === selectedMagazine);
  const currentStyle = creativeStyles.find((s) => s.id === selectedStyle);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-neutral-900/50 rounded-xl backdrop-blur-sm">
      {/* Tab 切换 */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('magazine')}
          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'magazine'
              ? 'bg-white text-black'
              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
          }`}
        >
          📰 杂志风格
        </button>
        <button
          onClick={() => setActiveTab('creative')}
          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'creative'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
          }`}
        >
          ✨ 创意风格
        </button>
      </div>

      {/* 杂志风格选择 */}
      <AnimatePresence mode="wait">
        {activeTab === 'magazine' && (
          <motion.div
            key="magazine"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {/* 当前选中预览 */}
            {currentMagazine && (
              <div
                className="p-4 rounded-lg mb-4"
                style={{
                  backgroundColor: currentMagazine.colorScheme.background,
                  border: `1px solid ${currentMagazine.colorScheme.accent}`,
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h3
                      className="text-2xl font-black"
                      style={{ color: currentMagazine.colorScheme.text }}
                    >
                      {currentMagazine.name}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: currentMagazine.colorScheme.secondary }}
                    >
                      {currentMagazine.tagline}
                    </p>
                  </div>
                  <div className="text-xs text-neutral-500">
                    {currentMagazine.aesthetic.slice(0, 2).join(' • ')}
                  </div>
                </div>
              </div>
            )}

            {/* 杂志网格 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {magazines.map((magazine) => {
                const isSelected = selectedMagazine === magazine.id;
                return (
                  <button
                    key={magazine.id}
                    onClick={() => onMagazineChange(magazine.id)}
                    onMouseEnter={() => setHoveredMagazine(magazine)}
                    onMouseLeave={() => setHoveredMagazine(null)}
                    className={`p-4 rounded-lg text-left transition-all duration-200 border-2 ${
                      isSelected
                        ? 'border-yellow-400 bg-yellow-400/10'
                        : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: magazine.colorScheme.accent }}
                      />
                      <span className="font-bold text-white">{magazine.nameCn}</span>
                    </div>
                    <div className="text-xs text-neutral-400">{magazine.name}</div>
                  </button>
                );
              })}
            </div>

            {/* 杂志详情 */}
            {hoveredMagazine && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neutral-800 rounded-lg p-4"
              >
                <h4 className="font-bold text-white mb-2">{hoveredMagazine.name}</h4>
                <p className="text-sm text-neutral-400 mb-3">
                  {hoveredMagazine.characteristics.photography}
                </p>
                <div className="flex flex-wrap gap-2">
                  {hoveredMagazine.aesthetic.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-neutral-700 text-neutral-300 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* 创意风格选择 */}
        {activeTab === 'creative' && (
          <motion.div
            key="creative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* 当前选中预览 */}
            {currentStyle && currentStyle.id !== 'none' && (
              <div className="p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentStyle.icon}</span>
                  <div>
                    <h3 className="font-bold text-white">
                      {currentStyle.name} ({currentStyle.nameCn})
                    </h3>
                    <p className="text-sm text-neutral-400">
                      {currentStyle.descriptionCn}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 风格网格 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {creativeStyles.map((style) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => onStyleChange(style.id)}
                    onMouseEnter={() => setHoveredStyle(style)}
                    onMouseLeave={() => setHoveredStyle(null)}
                    className={`p-4 rounded-lg text-left transition-all duration-200 border-2 ${
                      isSelected
                        ? 'border-purple-400 bg-purple-400/10'
                        : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
                    }`}
                  >
                    <div className="text-2xl mb-2">{style.icon}</div>
                    <div className="font-bold text-white text-sm">{style.nameCn}</div>
                    <div className="text-xs text-neutral-400">{style.name}</div>
                  </button>
                );
              })}
            </div>

            {/* 风格详情 */}
            {hoveredStyle && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neutral-800 rounded-lg p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{hoveredStyle.icon}</span>
                  <div>
                    <h4 className="font-bold text-white">
                      {hoveredStyle.name} ({hoveredStyle.nameCn})
                    </h4>
                    <p className="text-sm text-neutral-400">{hoveredStyle.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-neutral-500">视觉：</span>
                    <span className="text-xs text-neutral-300 ml-2">
                      {hoveredStyle.promptAddon.visual}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500">氛围：</span>
                    <span className="text-xs text-neutral-300 ml-2">
                      {hoveredStyle.promptAddon.mood}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500">调色：</span>
                    <span className="text-xs text-neutral-300 ml-2">
                      {hoveredStyle.promptAddon.colorGrade}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部总结 */}
      <div className="mt-6 pt-4 border-t border-neutral-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-400">
            当前：{currentMagazine?.nameCn || '未选择'} + {currentStyle?.nameCn || '无'}
          </span>
          {selectedStyle === 'none' && (
            <span className="text-neutral-500">
              选择创意风格可添加特殊视觉效果
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StyleSelector;
