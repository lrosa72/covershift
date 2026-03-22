/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useRef } from 'react';
import {
  createGenerationTasks,
  createInitialGeneratedImages,
  runGenerationTasks,
  generateTaskImage,
  GenerationTask,
  GeneratedImageState,
} from '../services/generationService';
import { rollRandomEvent } from '../config/randomEvents';

export interface UseGenerationOptions {
  uploadedImage: string | null;
  selectedDecades: string[];
  selectedMagazines: string[];
  selectedCreativeStyles: string[];
  useCustomPrompt: boolean;
  promptTemplate: string;
  enhanceFaceConsistency: boolean;
  concurrencyLimit?: number;
}

export interface UseGenerationReturn {
  startGeneration: (
    options: UseGenerationOptions,
    onTaskComplete: (task: GenerationTask, result: GeneratedImageState) => void
  ) => Promise<{ globalEvent: ReturnType<typeof rollRandomEvent> }>;
  regenerateSingle: (
    key: string,
    currentImage: GeneratedImageState | undefined,
    options: Omit<UseGenerationOptions, 'selectedDecades' | 'selectedMagazines' | 'selectedCreativeStyles'>
  ) => Promise<GeneratedImageState>;
  createTasks: typeof createGenerationTasks;
  createInitialImages: typeof createInitialGeneratedImages;
}

export function useGeneration(): UseGenerationReturn {
  // 用于取消请求的 AbortController 引用
  const abortControllerRef = useRef<AbortController | null>(null);

  // 开始生成
  const startGeneration = useCallback(
    async (
      options: UseGenerationOptions,
      onTaskComplete: (task: GenerationTask, result: GeneratedImageState) => void
    ) => {
      const {
        uploadedImage,
        selectedDecades,
        selectedMagazines,
        selectedCreativeStyles,
        useCustomPrompt,
        promptTemplate,
        enhanceFaceConsistency,
        concurrencyLimit = 2,
      } = options;

      if (!uploadedImage) {
        throw new Error('No image uploaded');
      }

      // 创建任务
      const tasks = createGenerationTasks(
        selectedDecades,
        selectedMagazines,
        selectedCreativeStyles
      );

      // 触发随机事件
      const globalEvent = rollRandomEvent();

      // 运行任务
      await runGenerationTasks(uploadedImage, tasks, {
        useCustomPrompt,
        promptTemplate,
        enhanceFaceConsistency,
        concurrencyLimit,
        onTaskComplete,
      });

      return { globalEvent };
    },
    []
  );

  // 重新生成单个
  const regenerateSingle = useCallback(
    async (
      key: string,
      currentImage: GeneratedImageState | undefined,
      options: Omit<UseGenerationOptions, 'selectedDecades' | 'selectedMagazines' | 'selectedCreativeStyles'>
    ) => {
      const { uploadedImage, useCustomPrompt, promptTemplate, enhanceFaceConsistency } = options;

      if (!uploadedImage) {
        throw new Error('No image uploaded');
      }

      // 解析 key
      const parsed = key.split('-');
      const decade = parsed[0] || '1980s';
      const magazineId = currentImage?.magazineId || parsed[1] || 'bazaar';
      const creativeStyle = currentImage?.creativeStyle || parsed[2] || 'none';

      const task: GenerationTask = {
        key,
        decade,
        magazineId,
        creativeStyle,
        randomEvent: Math.random() < 0.2 ? rollRandomEvent() : currentImage?.randomEvent || null,
      };

      return await generateTaskImage(uploadedImage, task, {
        useCustomPrompt,
        promptTemplate,
        enhanceFaceConsistency,
      });
    },
    []
  );

  return {
    startGeneration,
    regenerateSingle,
    createTasks: createGenerationTasks,
    createInitialImages: createInitialGeneratedImages,
  };
}

export default useGeneration;
