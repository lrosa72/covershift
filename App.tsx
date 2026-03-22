/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, Suspense, useMemo, ChangeEvent, lazy } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from './hooks/useAppState';
import { useGeneration } from './hooks/useGeneration';
import { useDownload } from './hooks/useDownload';
import { usePlayerProgress } from './hooks/usePlayerProgress';
import { useMediaQuery } from './hooks/useMediaQuery';
import { useToast, ToastContainer } from './contexts/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import ApiKeyModal from './components/ApiKeyModal';
import MagazineCover from './components/MagazineCover';
import Footer from './components/Footer';
import HistoryPanel from './components/HistoryPanel';
import BrandMark from './components/BrandMark';
import UXShowcase from './components/UXShowcase';
import UploadSection from './components/UploadSection';
import ConfigurationSection from './components/ConfigurationSection';
import ResultsSection from './components/ResultsSection';
import { saveToHistory, HistoryItem } from './lib/historyUtils';
import { createGenerationTasks, createInitialGeneratedImages, parseGenerationKey } from './services/generationService';
import { rollRandomEvent, getRarityColor, getRarityName } from './src/config/randomEvents';
import { creativeStyles } from './src/config/creativeStyles';
import { DEFAULT_DECADES } from './src/config/eras';

const EraArchiveCard = lazy(() => import('./components/EraArchiveCard'));
const AchievementPopup = lazy(() => import('./components/AchievementPopup'));
const CoverShiftPassport = lazy(() => import('./components/CoverShiftPassport'));

// 创建访问时代数据（用于护照展示）
function buildVisitedEras(uniqueDecades: string[]) {
  const now = Date.now();
  return uniqueDecades.map((decade, index) => ({
    decade,
    visitCount: 1 + (index % 4),
    firstVisit: new Date(now - (28 - index * 2) * 24 * 60 * 60 * 1000),
    lastVisit: new Date(now - (index % 5) * 24 * 60 * 60 * 1000),
  }));
}

function App() {
  // UX 演示模式检查
  const isUxDemoMode =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('demo') === 'ux';

  if (isUxDemoMode) {
    return <UXShowcase />;
  }

  // Toast 通知
  const toast = useToast();

  // 媒体查询
  const isMobile = useMediaQuery('(max-width: 768px)');

  // 应用状态管理
  const {
    uploadedImage,
    generatedImages,
    isLoading,
    isDownloading,
    appState,
    hasApiKey,
    selectedDecades,
    selectedMagazines,
    selectedCreativeStyles,
    viewMode,
    promptTemplate,
    useCustomPrompt,
    showAdvanced,
    enhanceFaceConsistency,
    showApiKeyModal,
    currentApiKey,
    currentRandomEvent,
    showPassport,
    setUploadedImage,
    setGeneratedImages,
    updateGeneratedImage,
    setIsLoading,
    setAppState,
    setSelectedDecades,
    setSelectedMagazines,
    setSelectedCreativeStyles,
    setViewMode,
    setPromptTemplate,
    setUseCustomPrompt,
    setShowAdvanced,
    setEnhanceFaceConsistency,
    setShowApiKeyModal,
    setCurrentApiKey,
    setCurrentRandomEvent,
    setShowPassport,
    resetToIdle,
    handleApiKeySave,
  } = useAppState();

  // 生成服务
  const { startGeneration, regenerateSingle } = useGeneration();

  // 下载服务
  const { downloadSingle, downloadAll, downloadAlbum } = useDownload();

  // 游戏化
  const {
    playerStats,
    newAchievements,
    recordGeneration,
    dismissOldestAchievement,
  } = usePlayerProgress();

  // 叙事性状态
  const [showArchive, setShowArchive] = React.useState(false);
  const [archiveDecade, setArchiveDecade] = React.useState('1980s');
  const [archiveMagazine, setArchiveMagazine] = React.useState('bazaar');
  const [archiveEvent, setArchiveEvent] = React.useState<ReturnType<typeof rollRandomEvent>>(null);

  // 护照访问数据
  const visitedErasForPassport = useMemo(
    () => buildVisitedEras(playerStats.uniqueDecades),
    [playerStats.uniqueDecades]
  );

  // 护照 ESC 键关闭
  useEffect(() => {
    if (!showPassport) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowPassport(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showPassport]);

  // 图片上传处理
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setAppState('image-uploaded');
        setGeneratedImages({});
        setCurrentRandomEvent(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // 开始生成
  const handleGenerateClick = async () => {
    if (
      !uploadedImage ||
      selectedDecades.length === 0 ||
      selectedMagazines.length === 0 ||
      selectedCreativeStyles.length === 0
    ) {
      toast.warning('Missing selection', 'Please select at least one option');
      return;
    }

    // 触发随机事件
    const globalEvent = rollRandomEvent();
    setCurrentRandomEvent(globalEvent);
    if (globalEvent) {
      setShowRandomEventBanner(true);
      setTimeout(() => setShowRandomEventBanner(false), 5000);
    }

    setIsLoading(true);
    setAppState('generating');

    const tasks = createGenerationTasks(
      selectedDecades,
      selectedMagazines,
      selectedCreativeStyles
    );
    setGeneratedImages(createInitialGeneratedImages(tasks));

    try {
      await startGeneration(
        {
          uploadedImage,
          selectedDecades,
          selectedMagazines,
          selectedCreativeStyles,
          useCustomPrompt,
          promptTemplate,
          enhanceFaceConsistency,
        },
        (task, result) => {
          updateGeneratedImage(task.key, result);
        }
      );

      recordGeneration(
        selectedDecades,
        selectedMagazines,
        selectedCreativeStyles,
        globalEvent
      );

      setAppState('results-shown');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Generation failed', 'Please try again');
      setIsLoading(false);
    }
  };

  // 重新生成单个
  const handleRegenerateDecade = async (key: string) => {
    if (!uploadedImage) return;

    const image = generatedImages[key];
    if (image?.status === 'pending') return;

    try {
      const result = await regenerateSingle(key, image, {
        uploadedImage,
        useCustomPrompt,
        promptTemplate,
        enhanceFaceConsistency,
      });
      updateGeneratedImage(key, result);
      toast.success('Regenerated', 'Image updated');
    } catch (error) {
      console.error('Regenerate error:', error);
      toast.error('Regeneration failed', 'Please try again');
    }
  };

  // 重置
  const handleReset = () => {
    resetToIdle();
    toast.info('Reset', 'Ready for new generation');
  };

  // 下载单张
  const handleDownloadIndividualImage = (key: string) => {
    downloadSingle(key, generatedImages[key]);
  };

  // 下载全部
  const handleDownloadAll = () => {
    downloadAll(generatedImages);
  };

  // 下载相册
  const handleDownloadAlbum = () => {
    downloadAlbum(generatedImages);
  };

  // 保存到历史
  const handleSaveToHistory = () => {
    if (!uploadedImage) return;

    const doneImages: Record<string, string> = {};
    (Object.entries(generatedImages) as [string, typeof generatedImages[string]][]).forEach(([key, image]) => {
      if (image.status === 'done' && image.url) {
        doneImages[key] = image.url;
      }
    });

    if (Object.keys(doneImages).length === 0) {
      toast.warning('No images', 'Wait for generation to complete');
      return;
    }

    saveToHistory({
      originalImage: uploadedImage,
      generatedImages: doneImages,
      selectedDecades: [...selectedDecades],
    });

    toast.success('Saved', 'Added to history');
  };

  // 加载历史
  const handleLoadHistory = (item: HistoryItem) => {
    setUploadedImage(item.originalImage);
    const newGeneratedImages: Record<string, typeof generatedImages[string]> = {};
    Object.entries(item.generatedImages).forEach(([key, url]) => {
      const parsed = parseGenerationKey(key);
      newGeneratedImages[key] = {
        status: 'done',
        url,
        magazineId: parsed.magazineId,
        creativeStyle: parsed.creativeStyle,
      };
    });
    setGeneratedImages(newGeneratedImages);
    const decades = [...new Set(
      Object.keys(item.generatedImages)
        .map(k => k.includes('-') ? k.split('-')[0] : k)
    )];
    setSelectedDecades(decades.length > 0 ? decades : DEFAULT_DECADES);
    setAppState('results-shown');
    toast.success('History loaded', 'Your previous work is restored');
  };

  // 重置 Prompt
  const handleResetPrompt = () => {
    setPromptTemplate('');
    setUseCustomPrompt(false);
  };

  // 点击封面查看时代档案
  const handleCoverClick = (key: string) => {
    const parsed = parseGenerationKey(key);
    const image = generatedImages[key];
    setArchiveDecade(parsed.decade);
    setArchiveMagazine(image?.magazineId || parsed.magazineId);
    setArchiveEvent(image?.randomEvent || null);
    setShowArchive(true);
  };

  // 获取排序后的显示键
  const displayKeys = Object.keys(generatedImages).sort((a, b) => {
    const orderA = DEFAULT_DECADES.indexOf(a.split('-')[0]);
    const orderB = DEFAULT_DECADES.indexOf(b.split('-')[0]);
    return (orderA === -1 ? 999 : orderA) - (orderB === -1 ? 999 : orderB);
  });

  // 随机事件横幅状态
  const [showRandomEventBanner, setShowRandomEventBanner] = React.useState(false);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <main className="bg-black text-neutral-200 min-h-screen w-full flex flex-col items-center justify-center p-4 pb-24 overflow-hidden relative">
          {/* 背景网格 */}
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              opacity: 0.05,
            }}
          />

          <HistoryPanel onLoadHistory={handleLoadHistory} />

          {/* API Key 设置按钮 */}
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="absolute top-4 left-4 z-20 p-2 hit-target bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-white/70 hover:text-white transition-all"
            title="API Key 设置"
            aria-label="打开 API Key 设置"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* 玩家统计按钮 */}
          <button
            className="absolute top-4 right-20 z-20 p-2 hit-target bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-white/70 hover:text-white transition-all"
            title="玩家统计"
            onClick={() => setShowPassport(true)}
            aria-label="打开多元宇宙护照"
          >
            <div className="flex items-center gap-1">
              <span className="text-lg">🏆</span>
              <span className="text-xs">{playerStats.totalGenerations}</span>
            </div>
          </button>

          {/* API Key 状态提示 */}
          {!hasApiKey && (
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 hit-target bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 rounded-full text-yellow-400 text-xs font-medium transition-all animate-pulse"
                aria-label="配置图像模型 API Key"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                配置 API Key
              </button>
            </div>
          )}

          {/* 随机事件横幅 */}
          {showRandomEventBanner && currentRandomEvent && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 20 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40"
            >
              <div
                className="bg-neutral-900 border-2 rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-4"
                style={{ borderColor: getRarityColor(currentRandomEvent.rarity) }}
              >
                <div className="text-3xl">{currentRandomEvent.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{currentRandomEvent.nameCn}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full text-white font-bold"
                      style={{ backgroundColor: getRarityColor(currentRandomEvent.rarity) }}
                    >
                      {getRarityName(currentRandomEvent.rarity)}
                    </span>
                  </div>
                  <p className="text-neutral-400 text-sm">{currentRandomEvent.descriptionCn}</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="z-10 flex flex-col items-center justify-center w-full h-full flex-1 min-h-0">
            {/* 头部 */}
            <div className="text-center mb-6">
              <BrandMark
                className="flex justify-center"
                imgClassName="h-24 md:h-32 w-auto object-contain drop-shadow-[0_8px_24px_rgba(176,38,255,0.28)]"
                fallbackClassName="font-black uppercase tracking-tighter"
              />
              <p className="font-playfair italic text-neutral-300 mt-1 text-lg tracking-wide">重新定义你，做人生的封面</p>
              {/* 玩家小统计 */}
              <div className="flex items-center justify-center gap-4 mt-2 text-neutral-400 text-xs">
                <span>✨ 生成 {playerStats.totalGenerations} 张</span>
                <span>📅 连续 {playerStats.currentStreak} 天</span>
                <span>🏆 成就 {playerStats.completedAchievements.length}</span>
              </div>
            </div>

            {/* 主内容区 */}
            {appState === 'idle' && (
              <UploadSection
                selectedMagazine={selectedMagazines[0] || 'bazaar'}
                onImageUpload={handleImageUpload}
              />
            )}

            {appState === 'image-uploaded' && uploadedImage && (
              <ConfigurationSection
                uploadedImage={uploadedImage}
                selectedMagazines={selectedMagazines}
                selectedDecades={selectedDecades}
                selectedCreativeStyles={selectedCreativeStyles}
                showAdvanced={showAdvanced}
                enhanceFaceConsistency={enhanceFaceConsistency}
                promptTemplate={promptTemplate}
                useCustomPrompt={useCustomPrompt}
                hasApiKey={hasApiKey}
                onMagazinesChange={setSelectedMagazines}
                onDecadesChange={setSelectedDecades}
                onStylesChange={setSelectedCreativeStyles}
                onShowAdvancedChange={setShowAdvanced}
                onEnhanceFaceConsistencyChange={setEnhanceFaceConsistency}
                onPromptChange={(prompt) => {
                  setPromptTemplate(prompt);
                  setUseCustomPrompt(true);
                }}
                onPromptReset={handleResetPrompt}
                onDifferentPhoto={handleReset}
                onGenerate={handleGenerateClick}
              />
            )}

            {(appState === 'generating' || appState === 'results-shown') && (
              <ResultsSection
                generatedImages={generatedImages}
                displayKeys={displayKeys}
                viewMode={viewMode}
                isMobile={isMobile}
                isDownloading={isDownloading}
                onViewModeChange={setViewMode}
                onSaveToHistory={handleSaveToHistory}
                onRegenerate={handleRegenerateDecade}
                onDownloadSingle={handleDownloadIndividualImage}
                onCoverClick={handleCoverClick}
                onDownloadAll={handleDownloadAll}
                onDownloadAlbum={handleDownloadAlbum}
                onStartOver={handleReset}
              />
            )}
          </div>

          <Footer />

          {/* API Key Modal */}
          <ApiKeyModal
            isOpen={showApiKeyModal}
            onClose={() => setShowApiKeyModal(false)}
            onSave={handleApiKeySave}
            currentApiKey={currentApiKey}
          />

          {/* 时代档案卡 */}
          <Suspense fallback={null}>
            {showArchive && (
              <EraArchiveCard
                decade={archiveDecade}
                magazineId={archiveMagazine}
                randomEvent={archiveEvent}
                onClose={() => setShowArchive(false)}
              />
            )}
          </Suspense>

          {/* 成就弹窗 */}
          <Suspense fallback={null}>
            {newAchievements.map((achievement, index) => (
              <AchievementPopup
                key={`${achievement.id}-${index}`}
                achievement={achievement}
                onClose={dismissOldestAchievement}
              />
            ))}
          </Suspense>

          {/* 玩家护照 */}
          {showPassport && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPassport(false)}
            >
              <motion.div
                initial={{ scale: 0.96, y: 16, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                className="w-full max-w-3xl max-h-[88vh] overflow-auto"
                onClick={(event) => event.stopPropagation()}
              >
                <CoverShiftPassport
                  visitedEras={visitedErasForPassport}
                  totalGenerations={playerStats.totalGenerations}
                  currentStreak={playerStats.currentStreak}
                  onClose={() => setShowPassport(false)}
                />
              </motion.div>
            </motion.div>
          )}

          <ToastContainer />
        </main>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
