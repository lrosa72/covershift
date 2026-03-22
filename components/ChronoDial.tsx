/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * ChronoDial - 年代选择器 (时尚杂志风格)
 *
 * 优雅、大胆、有格调的年代选择组件
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eras, getEraById, EraConfig } from '../src/config/eras';

interface ChronoDialProps {
  selectedDecade: string;
  onDecadeChange: (decade: string) => void;
  className?: string;
}

const ChronoDial: React.FC<ChronoDialProps> = ({
  selectedDecade,
  onDecadeChange,
  className = ''
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentIndex = eras.findIndex(e => e.id === selectedDecade);
  const currentEra = getEraById(selectedDecade);

  // 滚动到选中的年代
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const buttonWidth = 100;
      const targetScroll = currentIndex * buttonWidth - (container.clientWidth / 2) + (buttonWidth / 2);
      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  return (
    <div className={`relative ${className}`}>
      {/* 标题区域 - 时尚杂志风格 */}
      <div className="text-center mb-10">
        <p className="fashion-subtitle text-fashion-gold text-xs mb-3 tracking-widest">
          SELECT ERA
        </p>
        <AnimatePresence mode="wait">
          <motion.h2
            key={selectedDecade}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="fashion-title text-5xl md:text-7xl text-fashion-cream"
          >
            {currentEra?.eraName || selectedDecade}
          </motion.h2>
        </AnimatePresence>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="w-16 h-px bg-fashion-gold/30" />
          <span className="text-white/40 font-mono text-sm tracking-widest">
            {currentEra?.yearRange || ''}
          </span>
          <div className="w-16 h-px bg-fashion-gold/30" />
        </div>
      </div>

      {/* 年代横向滚动选择器 - 时尚胶囊按钮 */}
      <div className="relative mb-8">
        {/* 左渐变 */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-fashion-black to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto hide-scrollbar pb-4 px-8"
          style={{ scrollBehavior: 'smooth' }}
        >
          {eras.map((era) => {
            const isSelected = era.id === selectedDecade;
            return (
              <motion.button
                key={era.id}
                onClick={() => onDecadeChange(era.id)}
                className={`flex-shrink-0 px-6 py-4 text-sm transition-all duration-500 ${
                  isSelected
                    ? 'bg-fashion-gold text-fashion-black shadow-gold'
                    : 'bg-transparent border border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'
                }`}
                style={{
                  clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
                  minWidth: '90px'
                }}
                whileHover={{ scale: isSelected ? 1 : 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={`font-display font-bold tracking-tight ${isSelected ? '' : ''}`}>
                  {era.id.replace('s', '')}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* 右渐变 */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-fashion-black to-transparent z-10 pointer-events-none" />
      </div>

      {/* 年代详情 - 时尚排版 */}
      <AnimatePresence mode="wait">
        {currentEra && (
          <motion.div
            key={selectedDecade}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fashion-card p-8 md:p-12"
          >
            <div className="grid md:grid-cols-12 gap-8 items-start">
              {/* 左侧 - 大引号 */}
              <div className="md:col-span-1">
                <span className="font-display text-8xl text-fashion-gold/20 leading-none">
                  "
                </span>
              </div>

              {/* 中间 - 描述 */}
              <div className="md:col-span-8">
                <p className="font-serif text-xl md:text-2xl text-white/80 leading-relaxed italic">
                  {currentEra.mood}
                </p>
              </div>

              {/* 右侧 - 配色 */}
              <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                {currentEra.colorPalette.slice(0, 4).map((color, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="w-10 h-10 border border-white/20"
                    style={{
                      backgroundColor: color,
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 底部装饰线 */}
            <div className="mt-10 flex items-center gap-6">
              <div className="flex-1 fashion-divider" />
              <span className="font-mono text-xs text-fashion-gold/50 tracking-widest">
                {selectedDecade}
              </span>
              <div className="flex-1 fashion-divider" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChronoDial;
