/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import MagazineCover from './MagazineCover';
import ViewToggle from './ViewToggle';
import { GeneratedImageState, RandomEvent } from '../types';
import { creativeStyles } from '../config/creativeStyles';
import { parseGenerationKey } from '../services/generationService';
import { DEFAULT_DECADES } from '../config/eras';

interface ResultsSectionProps {
  generatedImages: Record<string, GeneratedImageState>;
  displayKeys: string[];
  viewMode: 'scattered' | 'gallery';
  isMobile: boolean;
  isDownloading: boolean;
  onViewModeChange: (mode: 'scattered' | 'gallery') => void;
  onSaveToHistory: () => void;
  onRegenerate: (key: string) => void;
  onDownloadSingle: (key: string) => void;
  onCoverClick: (key: string) => void;
  onDownloadAll: () => void;
  onDownloadAlbum: () => void;
  onStartOver: () => void;
}

// 散点视图位置
const POSITIONS = [
  { top: '2%', left: '5%', rotate: -5 },
  { top: '5%', left: '35%', rotate: 2 },
  { top: '2%', left: '65%', rotate: -3 },
  { top: '35%', left: '2%', rotate: 4 },
  { top: '32%', left: '33%', rotate: -2 },
  { top: '35%', left: '68%', rotate: 6 },
  { top: '65%', left: '5%', rotate: -4 },
  { top: '68%', left: '35%', rotate: 3 },
  { top: '65%', left: '65%', rotate: -2 },
];

const primaryButtonClasses = "font-permanent-marker text-xl text-center text-black bg-yellow-400 py-3 px-8 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:hover:rotate-2";
const secondaryButtonClasses = "font-permanent-marker text-xl text-center text-white bg-white/10 backdrop-blur-sm border-2 border-white/80 py-3 px-8 rounded-sm transform transition-all duration-200 hover:scale-[1.02] hover:-rotate-1 hover:bg-white hover:text-black";

function buildCaption(decade: string, magazineId: string, creativeStyle: string, randomEvent?: RandomEvent | null): string {
  const style = creativeStyles.find(s => s.id === creativeStyle);
  const styleName = style && style.id !== 'none' ? ` · ${style.nameCn}` : '';
  const eventName = randomEvent ? ` ✨${randomEvent.nameCn}` : '';
  return `${decade}${styleName}${eventName}`;
}

export default function ResultsSection({
  generatedImages,
  displayKeys,
  viewMode,
  isMobile,
  isDownloading,
  onViewModeChange,
  onSaveToHistory,
  onRegenerate,
  onDownloadSingle,
  onCoverClick,
  onDownloadAll,
  onDownloadAlbum,
  onStartOver,
}: ResultsSectionProps) {
  const dragAreaRef = useRef<HTMLDivElement>(null);

  // 计算进度
  const doneCount = displayKeys.filter(k => generatedImages[k]?.status === 'done').length;
  const totalCount = displayKeys.length;
  const allDone = doneCount === totalCount;

  return (
    <>
      {/* 工具栏 - 仅桌面端 */}
      {!isMobile && (
        <div className="mb-4 flex items-center gap-4">
          <ViewToggle viewMode={viewMode} onChange={onViewModeChange} />
          <button
            onClick={onSaveToHistory}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-sm font-sans uppercase tracking-wider rounded-lg transition-all"
          >
            Save to History
          </button>
        </div>
      )}

      {/* 进度指示器 */}
      {allDone && (
        <div className="mb-4 text-center">
          <p className="text-neutral-400 text-sm font-sans uppercase tracking-wider">
            Generating {displayKeys.length} covers...
          </p>
          <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
            {displayKeys.map((key) => {
              const status = generatedImages[key]?.status;
              const event = generatedImages[key]?.randomEvent;
              return (
                <div
                  key={key}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    status === 'done' ? 'bg-green-400' :
                    status === 'error' ? 'bg-red-400' :
                    'bg-yellow-400 animate-pulse'
                  }`}
                  title={`${key}: ${status}${event ? ` ✨${event.nameCn}` : ''}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 移动端视图 */}
      {isMobile ? (
        <div className="w-full max-w-sm flex-1 overflow-y-auto mt-2 space-y-6 p-4">
          {displayKeys.map((key) => {
            const parsed = parseGenerationKey(key);
            const magazineId = generatedImages[key]?.magazineId || parsed.magazineId;
            return (
              <div key={key} className="flex justify-center">
                <div onClick={() => onCoverClick(key)} className="cursor-pointer">
                  <MagazineCover
                    caption={buildCaption(parsed.decade, magazineId, parsed.creativeStyle, generatedImages[key]?.randomEvent)}
                    status={generatedImages[key]?.status || 'pending'}
                    imageUrl={generatedImages[key]?.url}
                    error={generatedImages[key]?.error}
                    onShake={() => onRegenerate(key)}
                    onDownload={() => onDownloadSingle(key)}
                    isMobile={isMobile}
                    magazineId={magazineId}
                    creativeStyle={generatedImages[key]?.creativeStyle}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === 'gallery' ? (
        /* 画廊视图 */
        <div className="w-full max-w-6xl flex-1 overflow-y-auto mt-2 p-4">
          <div className="grid grid-cols-3 gap-6 justify-items-center">
            {displayKeys.map((key, index) => {
              const parsed = parseGenerationKey(key);
              const magazineId = generatedImages[key]?.magazineId || parsed.magazineId;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onCoverClick(key)}
                  className="cursor-pointer"
                >
                  <MagazineCover
                    caption={buildCaption(parsed.decade, magazineId, parsed.creativeStyle, generatedImages[key]?.randomEvent)}
                    status={generatedImages[key]?.status || 'pending'}
                    imageUrl={generatedImages[key]?.url}
                    error={generatedImages[key]?.error}
                    onShake={() => onRegenerate(key)}
                    onDownload={() => onDownloadSingle(key)}
                    isMobile={isMobile}
                    magazineId={magazineId}
                    creativeStyle={generatedImages[key]?.creativeStyle}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 散点视图 */
        <div ref={dragAreaRef} className="relative w-full max-w-5xl h-[600px] mt-2">
          {displayKeys.map((key, index) => {
            const parsed = parseGenerationKey(key);
            const magazineId = generatedImages[key]?.magazineId || parsed.magazineId;
            const originalIndex = DEFAULT_DECADES.indexOf(parsed.decade);
            const { top, left, rotate } = POSITIONS[originalIndex === -1 ? index % POSITIONS.length : originalIndex];

            return (
              <motion.div
                key={key}
                className="absolute cursor-grab active:cursor-grabbing"
                style={{ top, left }}
                initial={{ opacity: 0, scale: 0.5, y: 100, rotate: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  rotate: `${rotate}deg`,
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 20, delay: index * 0.15 }}
                onClick={() => onCoverClick(key)}
              >
                <MagazineCover
                  caption={buildCaption(parsed.decade, magazineId, parsed.creativeStyle, generatedImages[key]?.randomEvent)}
                  status={generatedImages[key]?.status || 'pending'}
                  imageUrl={generatedImages[key]?.url}
                  error={generatedImages[key]?.error}
                  onShake={() => onRegenerate(key)}
                  onDownload={() => onDownloadSingle(key)}
                  isMobile={isMobile}
                  magazineId={magazineId}
                  creativeStyle={generatedImages[key]?.creativeStyle}
                />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 底部操作区 */}
      <div className="h-20 mt-2 flex items-center justify-center">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onDownloadAll}
            disabled={isDownloading}
            className={`${primaryButtonClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isDownloading ? 'Processing...' : 'Download All (ZIP)'}
          </button>
          <button
            onClick={onDownloadAlbum}
            disabled={isDownloading}
            className={`${secondaryButtonClasses} disabled:opacity-50 disabled:cursor-not-allowed !text-black !bg-white hover:!bg-neutral-200`}
          >
            {isDownloading ? 'Creating...' : 'Download Album'}
          </button>
          <button onClick={onStartOver} className={secondaryButtonClasses}>
            Start Over
          </button>
        </div>
      </div>
    </>
  );
}
