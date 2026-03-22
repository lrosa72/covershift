/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import html2canvas from 'html2canvas';
import ChronoDial from './ChronoDial';
import GenerationDarkroom from './GenerationDarkroom';
import ShareTicket from './ShareTicket';
import CoverShiftPassport from './CoverShiftPassport';
import { eras, getEraById } from '../src/config/eras';

type DemoPreset = {
  id: string;
  label: string;
  decade: string;
  magazineId: string;
  userName: string;
};

const DEMO_PRESETS: DemoPreset[] = [
  {
    id: '1920s',
    label: '1920s',
    decade: '1920s',
    magazineId: 'vanity-fair',
    userName: 'Luna',
  },
  {
    id: '1980s',
    label: '1980s',
    decade: '1980s',
    magazineId: 'vogue',
    userName: 'Neo',
  },
  {
    id: '2020s',
    label: '2020s',
    decade: '2020s',
    magazineId: 'lofficiel',
    userName: 'Astra',
  },
];

const TOTAL_IMAGES = 6;

const buildMockCoverImage = (decade: string, userName: string) => {
  const era = getEraById(decade);
  const colorA = era?.colorPalette[0] || '#d4af37';
  const colorB = era?.colorPalette[1] || '#e8d5a3';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
      <rect width="100%" height="100%" fill="#1a1a1a" />
      <rect x="60" y="60" width="780" height="1080" fill="${colorA}" opacity="0.15" />
      <text x="80" y="180" fill="#d4af37" font-size="56" font-family="Playfair Display, serif" font-weight="700" letter-spacing="-2">COVERSHIFT</text>
      <text x="80" y="240" fill="#666666" font-size="18" font-family="Inter, sans-serif" letter-spacing="6">FASHION EDITORIAL</text>
      <circle cx="450" cy="650" r="200" fill="${colorA}" opacity="0.2" />
      <text x="450" y="680" text-anchor="middle" fill="#d4af37" font-size="140" font-family="Playfair Display, serif" font-weight="800" letter-spacing="-4">${decade.replace('s', '')}</text>
      <text x="80" y="1020" fill="#f0ebe3" font-size="32" font-family="Playfair Display, serif" font-weight="600">${userName}</text>
      <text x="80" y="1080" fill="#86868b" font-size="16" font-family="Inter, sans-serif" letter-spacing="3">COVERSHIFT EDITORIAL</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const createVisitedSamples = (activeDecade: string) =>
  eras.slice(0, 9).map((era, index) => {
    const now = Date.now();
    const highlightBoost = era.id === activeDecade ? 3 : 0;
    return {
      decade: era.id,
      visitCount: (index % 4) + 1 + highlightBoost,
      firstVisit: new Date(now - (45 - index * 4) * 24 * 60 * 60 * 1000),
      lastVisit: new Date(now - (8 - (index % 6)) * 24 * 60 * 60 * 1000),
    };
  });

const UXShowcase: React.FC = () => {
  const [activePresetId, setActivePresetId] = useState(DEMO_PRESETS[1].id);
  const [selectedDecade, setSelectedDecade] = useState(DEMO_PRESETS[1].decade);
  const [selectedMagazineId, setSelectedMagazineId] = useState(DEMO_PRESETS[1].magazineId);
  const [actorName, setActorName] = useState(DEMO_PRESETS[1].userName);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const currentEra = getEraById(selectedDecade);
  const mockCoverImage = useMemo(
    () => buildMockCoverImage(selectedDecade, actorName),
    [selectedDecade, actorName]
  );
  const visitedEras = useMemo(() => createVisitedSamples(selectedDecade), [selectedDecade]);
  const completedImages = Math.min(
    TOTAL_IMAGES,
    Math.max(0, Math.round((progress / 100) * TOTAL_IMAGES))
  );

  useEffect(() => {
    if (!isGenerating) return;

    setProgress(0);
    const timer = window.setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + 8 + Math.random() * 12);
        return next;
      });
    }, 320);

    return () => window.clearInterval(timer);
  }, [isGenerating]);

  useEffect(() => {
    if (progress < 100 || !isGenerating) return;
    const stopTimer = window.setTimeout(() => setIsGenerating(false), 800);
    return () => window.clearTimeout(stopTimer);
  }, [progress, isGenerating]);

  const handleApplyPreset = (preset: DemoPreset) => {
    setActivePresetId(preset.id);
    setSelectedDecade(preset.decade);
    setSelectedMagazineId(preset.magazineId);
    setActorName(preset.userName);
    setExportMessage(`Now viewing ${preset.decade}`);
  };

  const handleExportTicket = async (ticketElement: HTMLDivElement | null) => {
    if (!ticketElement) return;

    try {
      const canvas = await html2canvas(ticketElement, {
        backgroundColor: '#0a0a0a',
        useCORS: true,
        scale: Math.min(3, window.devicePixelRatio || 2),
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `covershift-${selectedDecade}-${selectedMagazineId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExportMessage('Editorial saved successfully');
    } catch (error) {
      console.error('Ticket export failed:', error);
      setExportMessage('Export failed');
    }
  };

  const mainPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  return (
    <main className="min-h-screen bg-fashion-black text-fashion-cream py-10 px-6 md:px-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* 头部 - 时尚杂志风格 */}
        <header className="text-center">
          <p className="fashion-subtitle text-fashion-gold text-xs tracking-[0.4em] mb-4">
            UX PREVIEW LAB
          </p>
          <h1 className="fashion-title text-5xl md:text-7xl text-fashion-cream mb-4">
            CoverShift
          </h1>
          <div className="flex items-center justify-center gap-6">
            <div className="w-16 h-px bg-fashion-gold/30" />
            <p className="font-serif text-white/50 text-lg italic">
              Editorial Component Showcase
            </p>
            <div className="w-16 h-px bg-fashion-gold/30" />
          </div>
          <p className="mt-6 text-white/50 font-mono text-sm tracking-widest">
            {currentEra?.eraName || selectedDecade} · {selectedDecade}
          </p>
        </header>

        {/* 导航 - 返回按钮 */}
        <div className="flex justify-end">
          <a
            href={mainPath}
            className="fashion-btn-secondary text-sm"
          >
            Back to App
          </a>
        </div>

        {/* 快速选择 */}
        <section className="fashion-card p-8">
          <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
            {DEMO_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`px-6 py-3 text-sm transition-all duration-300 ${
                  activePresetId === preset.id
                    ? 'bg-fashion-gold text-fashion-black'
                    : 'border border-white/20 text-white/50 hover:border-white/40 hover:text-white/80'
                }`}
                style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}
              >
                <span className="font-display font-bold tracking-wide">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
          <ChronoDial selectedDecade={selectedDecade} onDecadeChange={setSelectedDecade} />
        </section>

        {/* 主要内容网格 */}
        <section className="grid gap-10 lg:grid-cols-2">
          {/* 生成进度组件 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="fashion-subtitle text-fashion-gold text-xs tracking-widest mb-2">
                  DARKROOM
                </p>
                <h2 className="fashion-title text-3xl text-fashion-cream">
                  Generation
                </h2>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setProgress(0);
                    setIsGenerating(true);
                  }}
                  className="fashion-btn-primary text-sm"
                >
                  Start
                </button>
                <button
                  onClick={() => {
                    setIsGenerating(false);
                    setProgress(0);
                  }}
                  className="fashion-btn-secondary text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
            <GenerationDarkroom
              isGenerating={isGenerating}
              progress={progress}
              currentDecade={selectedDecade}
              totalImages={TOTAL_IMAGES}
              completedImages={completedImages}
            />
          </div>

          {/* 分享卡片组件 */}
          <div className="space-y-6">
            <div>
              <p className="fashion-subtitle text-fashion-gold text-xs tracking-widest mb-2">
                EDITORIAL
              </p>
              <h2 className="fashion-title text-3xl text-fashion-cream mb-4">
                Share Card
              </h2>
              <label className="block">
                <span className="text-white/50 text-sm tracking-wider">
                  Subject Name
                </span>
                <input
                  value={actorName}
                  onChange={(event) => setActorName(event.target.value)}
                  className="mt-2 fashion-input"
                  placeholder="Enter name"
                />
              </label>
            </div>

            <ShareTicket
              imageUrl={mockCoverImage}
              decade={selectedDecade}
              magazineId={selectedMagazineId}
              userName={actorName || 'CoverShift User'}
              onExport={handleExportTicket}
            />
            {exportMessage && (
              <p className="text-fashion-gold text-sm tracking-wider text-center">
                {exportMessage}
              </p>
            )}
          </div>
        </section>

        {/* 生成记录组件 */}
        <section>
          <div className="text-center mb-8">
            <p className="fashion-subtitle text-fashion-gold text-xs tracking-widest mb-2">
              ARCHIVE
            </p>
            <h2 className="fashion-title text-4xl text-fashion-cream">
              Your Legacy
            </h2>
          </div>
          <CoverShiftPassport
            visitedEras={visitedEras}
            totalGenerations={visitedEras.reduce((sum, item) => sum + item.visitCount, 0)}
            currentStreak={6}
          />
        </section>

        {/* 底部装饰 */}
        <footer className="text-center pt-10">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex-1 fashion-rule-double" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-1.5 h-1.5 bg-fashion-gold/40" />
              ))}
            </div>
            <div className="flex-1 fashion-rule-double" />
          </div>
          <p className="font-serif text-white/40 text-sm italic">
            "Redefine yourself, be the cover"
          </p>
        </footer>
      </div>
    </main>
  );
};

export default UXShowcase;
