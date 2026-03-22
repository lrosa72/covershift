/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * GenerationDarkroom - 生成进度 (时尚杂志风格)
 *
 * 优雅、有仪式感的生成进度展示
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEraById } from '../src/config/eras';

interface GenerationDarkroomProps {
  isGenerating: boolean;
  progress: number; // 0-100
  currentDecade?: string;
  totalImages?: number;
  completedImages?: number;
  className?: string;
}

const GenerationDarkroom: React.FC<GenerationDarkroomProps> = ({
  isGenerating,
  progress,
  currentDecade,
  totalImages = 1,
  completedImages = 0,
  className = ''
}) => {
  const [phaseText, setPhaseText] = useState('READY');
  const era = currentDecade ? getEraById(currentDecade) : null;

  useEffect(() => {
    if (!isGenerating) {
      setPhaseText('READY');
      return;
    }

    if (progress < 20) setPhaseText('COMPOSING');
    else if (progress < 40) setPhaseText('STYLING');
    else if (progress < 60) setPhaseText('RENDERING');
    else if (progress < 80) setPhaseText('REFINING');
    else if (progress < 100) setPhaseText('POLISHING');
    else setPhaseText('COMPLETE');
  }, [isGenerating, progress]);

  const phases = ['COMPOSING', 'STYLING', 'RENDERING', 'REFINING', 'POLISHING'];

  return (
    <div className={`relative ${className}`}>
      <div className="fashion-card p-8 md:p-10">
        {/* 头部 - 时尚杂志排版 */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="fashion-subtitle text-fashion-gold text-xs tracking-widest mb-2">
              COVERSHOUT EDITORIAL
            </p>
            <h3 className="fashion-title text-4xl text-fashion-cream">
              {isGenerating ? 'IN PROGRESS' : 'DARKROOM'}
            </h3>
          </div>
          <div className="text-right">
            <motion.div
              key={Math.round(progress)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fashion-title text-6xl gold-text"
            >
              {Math.round(progress)}
              <span className="text-2xl text-fashion-gold/60">%</span>
            </motion.div>
            <div className="text-white/40 font-mono text-sm mt-1">
              {completedImages} / {totalImages}
            </div>
          </div>
        </div>

        {/* 进度条 - 时尚风格 */}
        <div className="mb-10">
          <div className="h-1 bg-white/10 relative overflow-hidden">
            <motion.div
              className="h-full bg-gold-gradient"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
            {/* 闪烁效果 */}
            {isGenerating && (
              <motion.div
                className="absolute inset-0 bg-shimmer bg-[length:200%_100%]"
                animate={{ backgroundPosition: ['-200% 0', '200% 0'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </div>
        </div>

        {/* 阶段指示 - 时尚胶囊 */}
        <div className="flex items-center justify-between mb-10">
          {phases.map((phase, i) => {
            const phaseProgress = (i + 1) * 20;
            const isActive = isGenerating && progress >= phaseProgress - 20 && progress < phaseProgress;
            const isComplete = progress >= phaseProgress;

            return (
              <div key={phase} className="flex flex-col items-center gap-2">
                <motion.div
                  className={`w-3 h-3 rounded-full ${
                    isComplete
                      ? 'bg-fashion-gold'
                      : isActive
                      ? 'bg-fashion-gold animate-pulse'
                      : 'bg-white/20'
                  }`}
                  animate={isActive ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className={`text-[10px] font-mono tracking-widest ${
                  isComplete
                    ? 'text-fashion-gold'
                    : isActive
                    ? 'text-fashion-cream'
                    : 'text-white/30'
                }`}>
                  {phase}
                </span>
              </div>
            );
          })}
        </div>

        {/* 当前年代信息 */}
        {era && isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="fashion-divider mb-6" />
            <p className="text-white/40 text-sm mb-2 tracking-widest">
              CURRENT EDITORIAL
            </p>
            <p className="font-display text-2xl text-fashion-cream">
              {era.eraName}
            </p>
            <p className="font-mono text-xs text-fashion-gold/60 mt-2 tracking-wider">
              {currentDecade}
            </p>
          </motion.div>
        )}

        {/* 底部装饰 */}
        <div className="mt-10 flex items-center gap-4">
          <div className="flex-1 fashion-rule-double" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-1 h-1 bg-fashion-gold/40" />
            ))}
          </div>
          <div className="flex-1 fashion-rule-double" />
        </div>
      </div>
    </div>
  );
};

export default GenerationDarkroom;
