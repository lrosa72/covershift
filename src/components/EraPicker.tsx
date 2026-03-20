/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 年代选择器组件 - 支持预设、随机、自定义三种模式
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eras, getEraById, EraConfig } from '../config/eras';
import { presets, PresetConfig, getPresetById } from '../config/presets';

type SelectionMode = 'preset' | 'random' | 'custom' | 'chaos';

interface EraPickerProps {
  selectedEras: string[];
  onChange: (eras: string[]) => void;
  maxSelection?: number;
}

const EraPicker: React.FC<EraPickerProps> = ({
  selectedEras,
  onChange,
  maxSelection = 9,
}) => {
  const [mode, setMode] = useState<SelectionMode>('preset');
  const [selectedPreset, setSelectedPreset] = useState<string>('recent-decades');
  const [randomCount, setRandomCount] = useState(9);
  const [randomMinYear, setRandomMinYear] = useState(1920);
  const [randomMaxYear, setRandomMaxYear] = useState(2100);
  const [isRandomizing, setIsRandomizing] = useState(false);

  // 预设主题选择
  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);
    if (presetId === 'chaos-mode') {
      generateRandomEras();
    } else {
      const preset = getPresetById(presetId);
      if (preset && preset.decades.length > 0) {
        onChange(preset.decades.slice(0, maxSelection));
      }
    }
  };

  // 随机生成年代
  const generateRandomEras = () => {
    setIsRandomizing(true);
    
    // 随机选择指定数量的年代
    const availableEras = eras.filter(
      (era) => era.year >= randomMinYear && era.year <= randomMaxYear
    );
    
    const shuffled = [...availableEras].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(randomCount, shuffled.length));
    
    // 延迟一点让动画生效
    setTimeout(() => {
      onChange(selected.map((e) => e.id));
      setIsRandomizing(false);
    }, 300);
  };

  // 自定义选择
  const toggleEra = (eraId: string) => {
    if (selectedEras.includes(eraId)) {
      onChange(selectedEras.filter((e) => e !== eraId));
    } else if (selectedEras.length < maxSelection) {
      onChange([...selectedEras, eraId]);
    }
  };

  // 清除所有选择
  const clearSelection = () => {
    onChange([]);
  };

  // 获取选中预设的预览
  const presetPreview = useMemo(() => {
    if (mode === 'preset' && selectedPreset && selectedPreset !== 'chaos-mode') {
      const preset = getPresetById(selectedPreset);
      return preset ? `${preset.decades.length} 个年代` : '';
    }
    if (mode === 'random') {
      return `${randomCount} 个随机年代`;
    }
    if (mode === 'custom') {
      return `${selectedEras.length} / ${maxSelection} 个年代`;
    }
    return '';
  }, [mode, selectedPreset, selectedEras, randomCount, maxSelection]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-neutral-900/50 rounded-xl backdrop-blur-sm">
      {/* 模式切换 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'preset', label: '预设主题', icon: '📦' },
          { id: 'random', label: '随机生成', icon: '🎲' },
          { id: 'custom', label: '自定义', icon: '✏️' },
          { id: 'chaos', label: '疯狂模式', icon: '🌀' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setMode(item.id as SelectionMode);
              if (item.id === 'chaos') {
                generateRandomEras();
              } else if (item.id === 'preset') {
                handlePresetSelect(selectedPreset);
              }
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === item.id
                ? 'bg-yellow-400 text-black'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* 预设主题选择 */}
      <AnimatePresence mode="wait">
        {mode === 'preset' && (
          <motion.div
            key="preset"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`p-4 rounded-lg text-left transition-all duration-200 border-2 ${
                    selectedPreset === preset.id
                      ? 'border-yellow-400 bg-yellow-400/10'
                      : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
                  }`}
                  style={{
                    borderColor: preset.color && selectedPreset === preset.id ? preset.color : undefined,
                  }}
                >
                  <div className="text-2xl mb-2">{preset.icon}</div>
                  <div className="font-bold text-sm text-white">{preset.nameCn}</div>
                  <div className="text-xs text-neutral-400">{preset.name}</div>
                  <div className="text-xs text-neutral-500 mt-1 line-clamp-2">
                    {preset.description}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* 随机生成设置 */}
        {mode === 'random' && (
          <motion.div
            key="random"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="bg-neutral-800 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-300">生成数量</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRandomCount(Math.max(3, randomCount - 1))}
                    className="w-8 h-8 rounded bg-neutral-700 text-white hover:bg-neutral-600"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-yellow-400">
                    {randomCount}
                  </span>
                  <button
                    onClick={() => setRandomCount(Math.min(maxSelection, randomCount + 1))}
                    className="w-8 h-8 rounded bg-neutral-700 text-white hover:bg-neutral-600"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 block mb-2">起始年份</label>
                  <input
                    type="number"
                    value={randomMinYear}
                    onChange={(e) => setRandomMinYear(parseInt(e.target.value) || 1920)}
                    className="w-full bg-neutral-700 text-white px-3 py-2 rounded"
                    min={1900}
                    max={2150}
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-2">结束年份</label>
                  <input
                    type="number"
                    value={randomMaxYear}
                    onChange={(e) => setRandomMaxYear(parseInt(e.target.value) || 2100)}
                    className="w-full bg-neutral-700 text-white px-3 py-2 rounded"
                    min={1900}
                    max={2150}
                  />
                </div>
              </div>

              <button
                onClick={generateRandomEras}
                disabled={isRandomizing}
                className={`w-full py-3 rounded-lg font-bold text-black transition-all ${
                  isRandomizing
                    ? 'bg-yellow-300'
                    : 'bg-yellow-400 hover:bg-yellow-300'
                }`}
              >
                {isRandomizing ? '🎲 随机中...' : '🎲 随机生成年代'}
              </button>
            </div>

            {selectedEras.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedEras.map((eraId) => {
                  const era = getEraById(eraId);
                  return era ? (
                    <motion.span
                      key={eraId}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full text-sm"
                    >
                      {era.displayName}
                    </motion.span>
                  ) : null;
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* 自定义选择 */}
        {mode === 'custom' && (
          <motion.div
            key="custom"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 text-sm">
                已选择 {selectedEras.length} / {maxSelection} 个年代
              </span>
              <button
                onClick={clearSelection}
                className="text-xs text-neutral-500 hover:text-neutral-300"
              >
                清除全部
              </button>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {eras.map((era) => {
                const isSelected = selectedEras.includes(era.id);
                return (
                  <button
                    key={era.id}
                    onClick={() => toggleEra(era.id)}
                    className={`p-3 rounded-lg text-center transition-all duration-200 ${
                      isSelected
                        ? 'bg-yellow-400 text-black'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    <div className="font-bold">{era.decade}</div>
                    {era.eraName && (
                      <div className="text-xs opacity-75 truncate">{era.eraName}</div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部预览 */}
      {presetPreview && mode !== 'chaos' && (
        <div className="mt-6 pt-4 border-t border-neutral-700">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 text-sm">
              当前选择：{presetPreview}
            </span>
            {mode === 'custom' && selectedEras.length === 0 && (
              <span className="text-yellow-400 text-sm">请至少选择一个年代</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EraPicker;
