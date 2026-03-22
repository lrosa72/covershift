/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import { AppState, ViewMode, GeneratedImageState, RandomEvent } from '../types';
import { DEFAULT_DECADES } from '../config/eras';
import { getStoredApiKey } from '../components/ApiKeyModal';

export interface AppStateValue {
  // 状态
  uploadedImage: string | null;
  generatedImages: Record<string, GeneratedImageState>;
  isLoading: boolean;
  isDownloading: boolean;
  appState: AppState;
  hasApiKey: boolean;
  selectedDecades: string[];
  selectedMagazines: string[];
  selectedCreativeStyles: string[];
  viewMode: ViewMode;
  promptTemplate: string;
  useCustomPrompt: boolean;
  showAdvanced: boolean;
  enhanceFaceConsistency: boolean;
  showApiKeyModal: boolean;
  currentApiKey: string;
  currentRandomEvent: RandomEvent | null;
  showPassport: boolean;
}

export interface AppStateActions {
  // 设置函数
  setUploadedImage: (image: string | null) => void;
  setGeneratedImages: (images: Record<string, GeneratedImageState>) => void;
  updateGeneratedImage: (key: string, image: GeneratedImageState) => void;
  setIsLoading: (loading: boolean) => void;
  setIsDownloading: (downloading: boolean) => void;
  setAppState: (state: AppState) => void;
  setSelectedDecades: (decades: string[]) => void;
  setSelectedMagazines: (magazines: string[]) => void;
  setSelectedCreativeStyles: (styles: string[]) => void;
  setViewMode: (mode: ViewMode) => void;
  setPromptTemplate: (template: string) => void;
  setUseCustomPrompt: (use: boolean) => void;
  setShowAdvanced: (show: boolean) => void;
  setEnhanceFaceConsistency: (enhance: boolean) => void;
  setShowApiKeyModal: (show: boolean) => void;
  setCurrentApiKey: (key: string) => void;
  setCurrentRandomEvent: (event: RandomEvent | null) => void;
  setShowPassport: (show: boolean) => void;

  // 操作函数
  resetToIdle: () => void;
  resetSelections: () => void;
}

export function useAppState() {
  // 核心状态
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<string, GeneratedImageState>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [appState, setAppState] = useState<AppState>('idle');
  const [hasApiKey, setHasApiKey] = useState<boolean>(!!getStoredApiKey());
  const [selectedDecades, setSelectedDecades] = useState<string[]>([...DEFAULT_DECADES]);
  const [selectedMagazines, setSelectedMagazines] = useState<string[]>(['bazaar']);
  const [selectedCreativeStyles, setSelectedCreativeStyles] = useState<string[]>(['none']);
  const [viewMode, setViewMode] = useState<ViewMode>('scattered');
  const [promptTemplate, setPromptTemplate] = useState<string>('');
  const [useCustomPrompt, setUseCustomPrompt] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [enhanceFaceConsistency, setEnhanceFaceConsistency] = useState<boolean>(true);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [currentApiKey, setCurrentApiKey] = useState<string>(getStoredApiKey());
  const [currentRandomEvent, setCurrentRandomEvent] = useState<RandomEvent | null>(null);
  const [showPassport, setShowPassport] = useState<boolean>(false);

  // 检查 API Key 状态
  useEffect(() => {
    const storedKey = getStoredApiKey();
    if (storedKey) {
      setHasApiKey(true);
    } else {
      // 首次用户 - 短暂延迟后显示弹窗
      setTimeout(() => setShowApiKeyModal(true), 500);
    }
  }, []);

  // 重置到空闲状态
  const resetToIdle = useCallback(() => {
    setUploadedImage(null);
    setGeneratedImages({});
    setAppState('idle');
    setSelectedDecades([...DEFAULT_DECADES]);
    setSelectedMagazines(['bazaar']);
    setSelectedCreativeStyles(['none']);
    setPromptTemplate('');
    setUseCustomPrompt(false);
    setCurrentRandomEvent(null);
  }, []);

  // 重置选择（保持上传的图片）
  const resetSelections = useCallback(() => {
    setSelectedDecades([...DEFAULT_DECADES]);
    setSelectedMagazines(['bazaar']);
    setSelectedCreativeStyles(['none']);
    setPromptTemplate('');
    setUseCustomPrompt(false);
  }, []);

  // 更新单个生成的图片
  const updateGeneratedImage = useCallback((key: string, image: GeneratedImageState) => {
    setGeneratedImages(prev => ({
      ...prev,
      [key]: image,
    }));
  }, []);

  // API Key 保存处理
  const handleApiKeySave = useCallback((key: string) => {
    setCurrentApiKey(key);
    setHasApiKey(!!key);
  }, []);

  return {
    // 状态
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

    // 设置函数
    setUploadedImage,
    setGeneratedImages,
    updateGeneratedImage,
    setIsLoading,
    setIsDownloading,
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

    // 操作函数
    resetToIdle,
    resetSelections,
    handleApiKeySave,
  };
}

export type UseAppStateReturn = ReturnType<typeof useAppState>;
