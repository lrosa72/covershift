/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { RandomEvent } from '../types/randomEvents';

/**
 * 队列配置接口
 */
export interface QueueConfig {
  /** 最大并发数 */
  maxConcurrent: number;
  /** 重试次数 */
  retryAttempts: number;
  /** 重试延迟（毫秒），默认 1000ms */
  retryDelay?: number;
}

/**
 * 队列任务接口
 */
interface QueueTask<T> {
  id: string;
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
  attempts: number;
}

/**
 * 任务执行结果统计
 */
export interface QueueStats {
  /** 队列中等待的任务数 */
  pending: number;
  /** 正在执行的任务数 */
  running: number;
  /** 已完成的任务数 */
  completed: number;
  /** 失败的任务数 */
  failed: number;
  /** 总重试次数 */
  totalRetries: number;
}

/**
 * 生成任务队列类
 *
 * 提供并发控制和自动重试机制，优化图像生成服务的性能
 *
 * @example
 * ```typescript
 * const queue = new GenerationQueue<string>({
 *   maxConcurrent: 3,
 *   retryAttempts: 3,
 *   retryDelay: 1000
 * });
 *
 * const result = await queue.add(() => generateImage(prompt));
 * ```
 */
export class GenerationQueue<T> {
  private config: Required<QueueConfig>;
  private queue: QueueTask<T>[] = [];
  private running = new Set<string>();
  private stats = {
    completed: 0,
    failed: 0,
    totalRetries: 0,
  };
  private taskIdCounter = 0;
  private isProcessing = false;

  constructor(config: QueueConfig) {
    if (config.maxConcurrent <= 0) {
      throw new Error('maxConcurrent must be greater than 0');
    }
    if (config.retryAttempts < 0) {
      throw new Error('retryAttempts must be non-negative');
    }

    this.config = {
      maxConcurrent: config.maxConcurrent,
      retryAttempts: config.retryAttempts,
      retryDelay: config.retryDelay ?? 1000,
    };
  }

  /**
   * 添加任务到队列
   *
   * @param execute - 异步任务函数
   * @returns Promise<T> - 任务执行结果
   */
  add(execute: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const task: QueueTask<T> = {
        id: `task-${++this.taskIdCounter}`,
        execute,
        resolve,
        reject,
        attempts: 0,
      };

      this.queue.push(task);
      this.processQueue();
    });
  }

  /**
   * 获取当前队列统计信息
   */
  getStats(): QueueStats {
    return {
      pending: this.queue.length,
      running: this.running.size,
      completed: this.stats.completed,
      failed: this.stats.failed,
      totalRetries: this.stats.totalRetries,
    };
  }

  /**
   * 清空队列（仅清除等待中的任务，正在执行的任务不受影响）
   *
   * @param rejectPending - 是否拒绝等待中的任务，默认为 true
   */
  clear(rejectPending = true): void {
    if (rejectPending) {
      while (this.queue.length > 0) {
        const task = this.queue.shift()!;
        task.reject(new Error('Task cancelled: queue cleared'));
        this.stats.failed++;
      }
    } else {
      this.queue.length = 0;
    }
  }

  /**
   * 等待所有任务完成
   *
   * @returns Promise<void>
   */
  async waitForAll(): Promise<void> {
    while (this.queue.length > 0 || this.running.size > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * 处理队列中的任务
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      while (
        this.queue.length > 0 &&
        this.running.size < this.config.maxConcurrent
      ) {
        const task = this.queue.shift();
        if (!task) continue;

        this.running.add(task.id);
        this.executeTask(task);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * 执行任务（包含重试逻辑）
   */
  private async executeTask(task: QueueTask<T>): Promise<void> {
    try {
      const result = await task.execute();
      this.running.delete(task.id);
      this.stats.completed++;
      task.resolve(result);
    } catch (error) {
      task.attempts++;

      if (task.attempts <= this.config.retryAttempts) {
        // 计算指数退避延迟
        const delay = this.calculateRetryDelay(task.attempts);
        this.stats.totalRetries++;

        // 将任务重新放回队列头部（优先重试）
        setTimeout(() => {
          this.queue.unshift(task);
          this.processQueue();
        }, delay);

        this.running.delete(task.id);
        return;
      }

      // 重试次数用尽，任务失败
      this.running.delete(task.id);
      this.stats.failed++;
      task.reject(error instanceof Error ? error : new Error(String(error)));
    } finally {
      // 继续处理队列中的其他任务
      this.processQueue();
    }
  }

  /**
   * 计算重试延迟（指数退避）
   */
  private calculateRetryDelay(attempt: number): number {
    // 指数退避: delay * 2^(attempt-1) + 随机抖动
    const baseDelay = this.config.retryDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 200; // 0-200ms 随机抖动
    return Math.min(baseDelay + jitter, 30000); // 最大 30 秒
  }
}

/**
 * 生成任务类型
 */
export interface GenerationTask {
  key: string;
  decade: string;
  magazineId: string;
  creativeStyle: string;
}

/**
 * 生成状态类型
 */
export type GenerationStatus = 'pending' | 'generating' | 'completed' | 'error';

/**
 * 生成图片状态
 */
export interface GeneratedImage {
  status: GenerationStatus;
  url?: string;
  magazineId: string;
  creativeStyle: string;
  randomEvent?: RandomEvent | null;
  error?: string;
  timestamp?: number;
}

/**
 * 创建生成任务列表
 *
 * @param decades - 年代列表
 * @param magazines - 杂志列表
 * @param styles - 风格列表
 * @returns GenerationTask[] - 任务列表
 */
export function createGenerationTasks(
  decades: string[],
  magazines: string[],
  styles: string[]
): GenerationTask[] {
  const tasks: GenerationTask[] = [];

  for (const decade of decades) {
    for (const magazineId of magazines) {
      for (const creativeStyle of styles) {
        const key = `${decade}-${magazineId}-${creativeStyle}`;
        tasks.push({
          key,
          decade,
          magazineId,
          creativeStyle,
        });
      }
    }
  }

  return tasks;
}

/**
 * 创建初始生成图片状态映射
 *
 * @param tasks - 生成任务列表
 * @returns Record<string, GeneratedImage> - 图片状态映射
 */
export function createInitialGeneratedImages(
  tasks: GenerationTask[]
): Record<string, GeneratedImage> {
  const images: Record<string, GeneratedImage> = {};

  for (const task of tasks) {
    images[task.key] = {
      status: 'pending',
      magazineId: task.magazineId,
      creativeStyle: task.creativeStyle,
      randomEvent: null,
    };
  }

  return images;
}

/**
 * 解析生成任务 key
 *
 * @param key - 任务 key (格式: decade-magazine-style 或 decade-magazine)
 * @returns 解析结果
 */
export function parseGenerationKey(key: string): {
  decade: string;
  magazineId: string;
  creativeStyle: string;
} {
  const parts = key.split('-');

  if (parts.length >= 3) {
    // 处理 magazine id 可能包含多个部分的情况
    // 例如: "1980s-vanity-fair-cyberpunk" -> decade="1980s", magazine="vanity-fair", style="cyberpunk"
    const decade = parts[0];
    const creativeStyle = parts[parts.length - 1];
    const magazineId = parts.slice(1, -1).join('-');
    return { decade, magazineId, creativeStyle };
  }

  if (parts.length === 2) {
    return {
      decade: parts[0],
      magazineId: parts[1],
      creativeStyle: 'none',
    };
  }

  // 默认返回
  return {
    decade: parts[0] || '1980s',
    magazineId: 'bazaar',
    creativeStyle: 'none',
  };
}

/**
 * 创建全局生成队列实例
 *
 * 默认配置：最大并发 3，重试 3 次
 */
export const globalGenerationQueue = new GenerationQueue<Blob>({
  maxConcurrent: 3,
  retryAttempts: 3,
  retryDelay: 1000,
});
