/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * ShareTicket - 分享卡片 (时尚杂志风格)
 *
 * 高级感、杂志感的分享卡片
 */

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { getEraById } from '../src/config/eras';
import { getMagazineById } from '../src/config/magazines';
import BrandMark from './BrandMark';

interface ShareTicketProps {
  imageUrl: string;
  decade: string;
  magazineId: string;
  userName?: string;
  onExport?: (ticketElement: HTMLDivElement | null) => void | Promise<void>;
  className?: string;
}

const ShareTicket: React.FC<ShareTicketProps> = ({
  imageUrl,
  decade,
  magazineId,
  userName = 'CoverShift',
  onExport,
  className = ''
}) => {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const era = getEraById(decade);
  const magazine = getMagazineById(magazineId);

  const handleExportClick = async () => {
    if (isExporting) return;

    if (onExport) {
      await onExport(ticketRef.current);
      return;
    }

    if (!ticketRef.current) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: '#0a0a0a',
        useCORS: true,
        scale: Math.min(3, window.devicePixelRatio || 2),
      });

      const link = document.createElement('a');
      link.download = `covershift-${decade}-${magazineId}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Share export failed:', error);
      alert('导出失败，请稍后重试。');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* 分享卡片主体 - 时尚杂志风格 */}
      <div className="fashion-card overflow-hidden">
        <div ref={ticketRef} className="p-6 md:p-8 bg-fashion-black">
          {/* 头部 - 时尚杂志页眉 */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-baseline gap-2">
                <BrandMark
                  imgClassName="h-9 w-auto object-contain"
                  fallbackClassName="fashion-title text-3xl gold-text"
                />
                <span className="text-fashion-gold/40 text-xs tracking-widest font-mono">
                  EDITION
                </span>
              </div>
              <p className="font-serif text-white/40 text-sm mt-1 italic">
                "Redefine yourself, be the cover"
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/30 text-xs tracking-widest font-mono mb-1">
                {decade}
              </p>
              <p className="text-fashion-gold font-display text-lg">
                {magazine?.name?.toUpperCase() || magazineId}
              </p>
            </div>
          </div>

          {/* 装饰线 */}
          <div className="fashion-rule-double mb-6" />

          {/* 主图片 */}
          <div className="relative mb-6">
            <div className="aspect-[3/4] overflow-hidden relative group">
              <img
                src={imageUrl}
                alt={`${decade} ${magazine?.name}`}
                className="w-full h-full object-cover img-hover"
              />
              {/* 图片叠加层 */}
              <div className="absolute inset-0 bg-gradient-to-t from-fashion-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* 左下角年代标签 */}
              <div className="absolute bottom-4 left-4 bg-fashion-black/80 backdrop-blur-sm px-4 py-2">
                <span className="font-display text-fashion-gold text-sm tracking-wider">
                  {decade}
                </span>
              </div>

              {/* 右上角杂志标签 */}
              <div className="absolute top-4 right-4 border border-fashion-gold/40 px-3 py-1.5">
                <span className="font-serif text-white/80 text-xs italic">
                  {magazine?.name}
                </span>
              </div>
            </div>
          </div>

          {/* 信息区域 */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-white/40 text-xs tracking-widest font-mono mb-1">
                ERA
              </p>
              <p className="font-display text-xl text-fashion-cream">
                {era?.eraName || decade}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs tracking-widest font-mono mb-1">
                SUBJECT
              </p>
              <p className="font-serif text-lg text-fashion-cream italic">
                {userName}
              </p>
            </div>
          </div>

          {/* 配色圆点 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {era?.colorPalette.slice(0, 4).map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 border border-white/20"
                  style={{
                    backgroundColor: color,
                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
                  }}
                />
              ))}
            </div>
            <div className="text-right">
              <p className="text-white/30 text-xs tracking-widest font-mono">
                {new Date().toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* 底部装饰 */}
          <div className="fashion-divider mb-4" />
          <div className="text-center">
            <p className="font-serif text-white/50 text-sm italic">
              "重新定义你，做人生的封面"
            </p>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleExportClick}
          disabled={isExporting}
          className="flex-1 fashion-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? 'EXPORTING...' : 'SAVE EDITORIAL'}
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText('CoverShift 生成的封面');
          }}
          className="fashion-btn-secondary"
        >
          COPY
        </button>
      </div>
    </div>
  );
};

export default ShareTicket;
