/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * CoverShiftPassport - 生成记录 (时尚杂志风格)
 *
 * 高级感、有格调的历史记录和统计展示
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eras, getEraById } from '../src/config/eras';

interface VisitedEra {
  decade: string;
  visitCount: number;
  firstVisit: Date;
  lastVisit: Date;
}

interface CoverShiftPassportProps {
  visitedEras?: VisitedEra[];
  totalGenerations?: number;
  currentStreak?: number;
  className?: string;
  onClose?: () => void;
}

const CoverShiftPassport: React.FC<CoverShiftPassportProps> = ({
  visitedEras = [],
  totalGenerations = 0,
  currentStreak = 0,
  className = '',
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'stats'>('history');

  // 默认数据
  const defaultVisited: VisitedEra[] = eras.slice(0, 8).map((era, index) => ({
    decade: era.id,
    visitCount: Math.floor(Math.random() * 5) + 1,
    firstVisit: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    lastVisit: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  }));

  const displayVisited = visitedEras.length > 0 ? visitedEras : defaultVisited;
  const displayTotal = totalGenerations || displayVisited.reduce((sum, v) => sum + v.visitCount, 0);
  const displayStreak = currentStreak || Math.floor(Math.random() * 10) + 1;
  const mostVisited = displayVisited.reduce((max, v) => v.visitCount > max.visitCount ? v : max, displayVisited[0]);

  // 统计卡片
  const StatCard = ({ label, value, icon, color }: { label: string; value: string | number; icon: string; color?: string }) => (
    <div className="fashion-card p-6 text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <div className="fashion-title text-3xl text-fashion-cream" style={color ? { color } : undefined}>
        {value}
      </div>
      <div className="text-white/50 text-xs tracking-widest uppercase mt-2">
        {label}
      </div>
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      <div className="fashion-card overflow-hidden">
        {/* 头部 */}
        <div className="p-8 pb-0">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="fashion-subtitle text-fashion-gold text-xs tracking-widest mb-2">
                COVERSHIFT ARCHIVE
              </p>
              <h3 className="fashion-title text-4xl text-fashion-cream">
                YOUR LEGACY
              </h3>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="w-10 h-10 border border-white/20 text-white/50 hover:text-fashion-gold hover:border-fashion-gold/50 transition-all flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* 标签切换 - 时尚风格 */}
          <div className="flex items-center gap-1 p-1 bg-white/5">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-sm transition-all duration-300 ${
                activeTab === 'history'
                  ? 'bg-fashion-gold text-fashion-black'
                  : 'text-white/50 hover:text-white/80'
              }`}
              style={{ clipPath: activeTab === 'history' ? 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)' : undefined }}
            >
              <span className="tracking-widest uppercase font-semibold">
                HISTORY
              </span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-3 text-sm transition-all duration-300 ${
                activeTab === 'stats'
                  ? 'bg-fashion-gold text-fashion-black'
                  : 'text-white/50 hover:text-white/80'
              }`}
              style={{ clipPath: activeTab === 'stats' ? 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)' : undefined }}
            >
              <span className="tracking-widest uppercase font-semibold">
                STATISTICS
              </span>
            </button>
          </div>
        </div>

        {/* 装饰线 */}
        <div className="px-8 pt-6">
          <div className="fashion-divider" />
        </div>

        {/* 内容区域 */}
        <div className="p-8 pt-6">
          <AnimatePresence mode="wait">
            {activeTab === 'history' ? (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  {displayVisited.map((visited, i) => {
                    const era = getEraById(visited.decade);
                    return (
                      <motion.div
                        key={visited.decade}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-5 border border-white/10 hover:border-fashion-gold/30 transition-colors"
                      >
                        <div className="flex items-center gap-5">
                          {/* 配色圆点 */}
                          <div
                            className="w-12 h-12 flex items-center justify-center"
                            style={{
                              backgroundColor: era?.colorPalette[0] || '#d4af37',
                              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                            }}
                          >
                            <span className="font-mono text-xs text-fashion-black font-bold">
                              {visited.decade.replace('s', '')}
                            </span>
                          </div>
                          <div>
                            <div className="font-display text-lg text-fashion-cream">
                              {era?.eraName || visited.decade}
                            </div>
                            <div className="text-white/40 text-xs tracking-wider font-mono mt-1">
                              Last: {visited.lastVisit.toLocaleDateString('zh-CN')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="fashion-title text-3xl gold-text">
                            {visited.visitCount}
                          </div>
                          <div className="text-white/40 text-xs tracking-widest uppercase">
                            edits
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {/* 统计卡片网格 */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <StatCard
                    label="Total Edits"
                    value={displayTotal}
                    icon="📸"
                    color="#d4af37"
                  />
                  <StatCard
                    label="Eras Explored"
                    value={displayVisited.length}
                    icon="🌍"
                    color="#d4af37"
                  />
                  <StatCard
                    label="Day Streak"
                    value={displayStreak}
                    icon="🔥"
                    color="#d4af37"
                  />
                  <StatCard
                    label="Favorite Era"
                    value={mostVisited?.decade || '-'}
                    icon="⭐"
                    color="#d4af37"
                  />
                </div>

                {/* 访问频率图 */}
                <div className="fashion-card p-6">
                  <h4 className="text-white/60 text-xs tracking-widest uppercase mb-5">
                    Editorial Frequency
                  </h4>
                  <div className="space-y-3">
                    {displayVisited.slice(0, 5).map((visited, i) => {
                      const era = getEraById(visited.decade);
                      const maxCount = Math.max(...displayVisited.map(v => v.visitCount));
                      return (
                        <div key={visited.decade} className="flex items-center gap-4">
                          <span className="w-16 text-xs font-mono text-white/50 tracking-widest">
                            {visited.decade}
                          </span>
                          <div className="flex-1 h-2 bg-white/10 relative overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(visited.visitCount / maxCount) * 100}%` }}
                              transition={{ delay: i * 0.1 }}
                              className="h-full bg-gold-gradient"
                            />
                          </div>
                          <span className="w-8 text-xs font-mono text-fashion-gold text-right">
                            {visited.visitCount}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 底部装饰 */}
        <div className="px-8 pb-8 pt-2">
          <div className="flex items-center gap-4">
            <div className="flex-1 fashion-rule-double" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-1.5 h-1.5 bg-fashion-gold/40" />
              ))}
            </div>
            <div className="flex-1 fashion-rule-double" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverShiftPassport;
