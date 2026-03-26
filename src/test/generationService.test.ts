import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  GenerationQueue,
  createGenerationTasks,
  createInitialGeneratedImages,
  parseGenerationKey,
  type QueueConfig,
} from '../services/generationService';

describe('generationService', () => {
  describe('GenerationQueue', () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    describe('构造函数', () => {
      it('应该使用有效配置创建队列', () => {
        const config: QueueConfig = {
          maxConcurrent: 3,
          retryAttempts: 2,
          retryDelay: 500,
        };

        const queue = new GenerationQueue<string>(config);

        expect(queue.getStats()).toEqual({
          pending: 0,
          running: 0,
          completed: 0,
          failed: 0,
          totalRetries: 0,
        });
      });

      it('应该在 maxConcurrent <= 0 时抛出错误', () => {
        expect(() => {
          new GenerationQueue<string>({
            maxConcurrent: 0,
            retryAttempts: 3,
          });
        }).toThrow('maxConcurrent must be greater than 0');

        expect(() => {
          new GenerationQueue<string>({
            maxConcurrent: -1,
            retryAttempts: 3,
          });
        }).toThrow('maxConcurrent must be greater than 0');
      });

      it('应该在 retryAttempts < 0 时抛出错误', () => {
        expect(() => {
          new GenerationQueue<string>({
            maxConcurrent: 3,
            retryAttempts: -1,
          });
        }).toThrow('retryAttempts must be non-negative');
      });

      it('应该使用默认的 retryDelay', () => {
        const queue = new GenerationQueue<string>({
          maxConcurrent: 3,
          retryAttempts: 3,
        });

        expect(queue).toBeDefined();
      });
    });

    describe('并发控制', () => {
      it('应该限制并发任务数量', async () => {
        const maxConcurrent = 2;
        const queue = new GenerationQueue<string>({
          maxConcurrent,
          retryAttempts: 0,
        });

        let runningCount = 0;
        let maxRunningCount = 0;

        const createTask = (id: string) => async () => {
          runningCount++;
          maxRunningCount = Math.max(maxRunningCount, runningCount);
          await new Promise(resolve => setTimeout(resolve, 100));
          runningCount--;
          return `result-${id}`;
        };

        // 添加 5 个任务
        const promises = [
          queue.add(createTask('1')),
          queue.add(createTask('2')),
          queue.add(createTask('3')),
          queue.add(createTask('4')),
          queue.add(createTask('5')),
        ];

        // 立即检查，应该只有 maxConcurrent 个任务在运行
        await new Promise(resolve => setImmediate(resolve));
        expect(maxRunningCount).toBeLessThanOrEqual(maxConcurrent);

        const results = await Promise.all(promises);

        expect(results).toHaveLength(5);
        expect(maxRunningCount).toBe(maxConcurrent);
      });

      it('应该按 FIFO 顺序执行任务', async () => {
        const queue = new GenerationQueue<string>({
          maxConcurrent: 1,
          retryAttempts: 0,
        });

        const executionOrder: string[] = [];

        const createTask = (id: string) => async () => {
          executionOrder.push(id);
          await new Promise(resolve => setTimeout(resolve, 10));
          return `result-${id}`;
        };

        const promises = [
          queue.add(createTask('1')),
          queue.add(createTask('2')),
          queue.add(createTask('3')),
        ];

        await Promise.all(promises);

        expect(executionOrder).toEqual(['1', '2', '3']);
      });

      it('应该正确统计队列状态', async () => {
        const queue = new GenerationQueue<string>({
          maxConcurrent: 2,
          retryAttempts: 0,
        });

        const createTask = () => async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return 'result';
        };

        // 添加任务
        queue.add(createTask());
        queue.add(createTask());
        queue.add(createTask());

        // 等待任务开始执行
        await new Promise(resolve => setImmediate(resolve));

        const stats = queue.getStats();
        expect(stats.running).toBeLessThanOrEqual(2);
        expect(stats.pending + stats.running).toBe(3);
      });
    });

    describe('自动重试', () => {
      it('应该在任务失败时自动重试', async () => {
        const queue = new GenerationQueue<string>({
          maxConcurrent: 1,
          retryAttempts: 2,
          retryDelay: 100,
        });

        let attemptCount = 0;

        const failingTask = async () => {
          attemptCount++;
          if (attemptCount < 3) {
            throw new Error(`Attempt ${attemptCount} failed`);
          }
          return 'success';
        };

        const result = await queue.add(failingTask);

        expect(result).toBe('success');
        expect(attemptCount).toBe(3);
      });

      it('应该在重试次数用尽后抛出错误', async () => {
        const queue = new GenerationQueue<string>({
          maxConcurrent: 1,
          retryAttempts: 2,
          retryDelay: 10,
        });

        const failingTask = async () => {
          throw new Error('Always fails');
        };

        await expect(queue.add(failingTask)).rejects.toThrow('Always fails');

        const stats = queue.getStats();
        expect(stats.totalRetries).toBe(2);
        expect(stats.failed).toBe(1);
      });

      it('应该使用指数退避延迟', async () => {
        const queue = new GenerationQueue<string>({
          maxConcurrent: 1,
          retryAttempts: 3,
          retryDelay: 100,
        });

        let attemptCount = 0;
        const startTime = Date.now();

        const failingTask = async () => {
          attemptCount++;
          if (attemptCount < 4) {
            throw new Error('Failed');
          }
          return 'success';
        };

        const promise = queue.add(failingTask);

        // 等待所有重试完成
        await promise;

        const endTime = Date.now();
        const duration = endTime - startTime;

        // 指数退避: 100ms + 200ms + 400ms = 700ms (加上一些执行时间)
        expect(duration).toBeGreaterThanOrEqual(600);
      });

      it('应该在零重试时立即失败', async () => {
        const queue = new GenerationQueue<string>({
          maxConcurrent: 1,
          retryAttempts: 0,
        });

        const failingTask = async () => {
          throw new Error('Immediate failure');
        };

        await expect(queue.add(failingTask)).rejects.toThrow('Immediate failure');

        const stats = queue.getStats();
        expect(stats.totalRetries).toBe(0);
        expect(stats.failed).toBe(1);
      });
    });

    describe('错误处理', () => {
      it('应该处理非 Error 类型的异常', async () => {
        const queue = new GenerationQueue<string>({
          maxConcurrent: 1,
          retryAttempts: 0,
        });

        const throwingTask = async () => {
          throw 'String error'; // 抛出非 Error 类型
        };

        await expect(queue.add(throwingTask)).rejects.toBeInstanceOf(Error);
      });

      it('应该处理 Promise 拒绝', async () => {
        const queue = new GenerationQueue<string>({
          maxConcurrent: 1,
          retryAttempts: 0,
        });

        const rejectingTask = async () => {
          return Promise.reject(new Error('Rejected'));
        };

        await expect(queue.add(rejectingTask)).rejects.toThrow('Rejected');
      });
    });

    describe('clear 方法', () => {
      it('应该清空等待中的任务并拒绝它们', async () => {
        const queue = new GenerationQueue<string>({
          maxConcurrent: 1,
          retryAttempts: 0,
        });

        const createTask = () => async () => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return 'result';
        };

        const promise1 = queue.add(createTask());
        const promise2 = queue.add(createTask());
        const promise3 = queue.add(createTask());

        // 等待第一个任务开始
        await new Promise(resolve => setTimeout(resolve, 50));

        queue.clear();

        // 第一个任务应该完成，其他应该被拒绝
        await expect(promise1).resolves.toBe('result');

        // 使用 Promise.allSettled 避免未处理的 rejection 警告
        const results = await Promise.allSettled([promise2, promise3]);
        expect(results[0].status).toBe('rejected');
        expect(results[1].status).toBe('rejected');
        if (results[0].status === 'rejected') {
          expect(results[0].reason.message).toBe('Task cancelled: queue cleared');
        }
      });

      it('应该支持不清空时只清空队列', () => {
        const queue = new GenerationQueue<string>({
          maxConcurrent: 1,
          retryAttempts: 0,
        });

        queue.add(async () => 'result');
        queue.add(async () => 'result');

        queue.clear(false);

        expect(queue.getStats().pending).toBe(0);
      });
    });

    describe('waitForAll 方法', () => {
      it('应该等待所有任务完成', async () => {
        const queue = new GenerationQueue<string>({
          maxConcurrent: 2,
          retryAttempts: 0,
        });

        let completed = 0;

        const createTask = () => async () => {
          await new Promise(resolve => setTimeout(resolve, 50));
          completed++;
          return 'result';
        };

        queue.add(createTask());
        queue.add(createTask());
        queue.add(createTask());

        await queue.waitForAll();

        expect(completed).toBe(3);
        const stats = queue.getStats();
        expect(stats.pending).toBe(0);
        expect(stats.running).toBe(0);
      });
    });

    describe('性能测试', () => {
      it('应该高效处理大量任务', async () => {
        const queue = new GenerationQueue<number>({
          maxConcurrent: 5,
          retryAttempts: 0,
        });

        const taskCount = 50;
        const promises: Promise<number>[] = [];

        const startTime = performance.now();

        for (let i = 0; i < taskCount; i++) {
          promises.push(
            queue.add(async () => {
              await new Promise(resolve => setTimeout(resolve, 10));
              return i;
            })
          );
        }

        const results = await Promise.all(promises);
        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(results).toHaveLength(taskCount);
        // 50 个任务，每个 10ms，并发 5，理论最小时间约 100ms
        // 实际应该接近这个值，不会线性增长
        expect(duration).toBeLessThan(1000);

        const stats = queue.getStats();
        expect(stats.completed).toBe(taskCount);
      });

      it('应该支持任意类型的异步任务', async () => {
        interface CustomResult {
          id: number;
          data: string;
          timestamp: number;
        }

        const queue = new GenerationQueue<CustomResult>({
          maxConcurrent: 2,
          retryAttempts: 0,
        });

        const result = await queue.add(async () => {
          return {
            id: 1,
            data: 'test',
            timestamp: Date.now(),
          };
        });

        expect(result).toMatchObject({
          id: 1,
          data: 'test',
        });
        expect(result.timestamp).toBeGreaterThan(0);
      });
    });
  });

  describe('createGenerationTasks', () => {
    it('should create tasks for all combinations', () => {
      const decades = ['1980s', '1990s'];
      const magazines = ['vogue', 'bazaar'];
      const styles = ['none'];

      const tasks = createGenerationTasks(decades, magazines, styles);

      expect(tasks).toHaveLength(4); // 2 decades × 2 magazines × 1 style
      expect(tasks[0]).toMatchObject({
        decade: '1980s',
        magazineId: 'vogue',
        creativeStyle: 'none',
      });
    });

    it('should create unique keys for each task', () => {
      const decades = ['1980s'];
      const magazines = ['vogue'];
      const styles = ['cyberpunk'];

      const tasks = createGenerationTasks(decades, magazines, styles);

      expect(tasks[0].key).toBe('1980s-vogue-cyberpunk');
    });

    it('should handle empty arrays', () => {
      const tasks = createGenerationTasks([], [], []);
      expect(tasks).toHaveLength(0);
    });

    it('should handle multiple styles', () => {
      const decades = ['1980s'];
      const magazines = ['vogue'];
      const styles = ['none', 'cyberpunk', 'vintage'];

      const tasks = createGenerationTasks(decades, magazines, styles);

      expect(tasks).toHaveLength(3);
      expect(tasks.map(t => t.creativeStyle)).toEqual(styles);
    });
  });

  describe('createInitialGeneratedImages', () => {
    it('should create pending state for all tasks', () => {
      const tasks = createGenerationTasks(['1980s'], ['bazaar'], ['none']);
      const images = createInitialGeneratedImages(tasks);

      expect(Object.keys(images)).toHaveLength(1);
      expect(images['1980s-bazaar-none']).toEqual({
        status: 'pending',
        magazineId: 'bazaar',
        creativeStyle: 'none',
        randomEvent: null,
      });
    });

    it('should handle empty task list', () => {
      const images = createInitialGeneratedImages([]);
      expect(Object.keys(images)).toHaveLength(0);
    });
  });

  describe('parseGenerationKey', () => {
    it('should parse simple decade-magazine-style key', () => {
      const result = parseGenerationKey('1980s-vogue-none');

      expect(result).toEqual({
        decade: '1980s',
        magazineId: 'vogue',
        creativeStyle: 'none',
      });
    });

    it('should parse key with multi-part magazine id', () => {
      const result = parseGenerationKey('1980s-vanity-fair-none');

      expect(result).toEqual({
        decade: '1980s',
        magazineId: 'vanity-fair',
        creativeStyle: 'none',
      });
    });

    it('should handle two-part key', () => {
      const result = parseGenerationKey('1990s-vogue');

      expect(result).toEqual({
        decade: '1990s',
        magazineId: 'vogue',
        creativeStyle: 'none',
      });
    });

    it('should default to bazaar for unknown magazines', () => {
      const result = parseGenerationKey('1980s');

      expect(result).toEqual({
        decade: '1980s',
        magazineId: 'bazaar',
        creativeStyle: 'none',
      });
    });

    it('should handle complex multi-part magazine names', () => {
      const result = parseGenerationKey('2000s-harpers-bazaar-cyberpunk');

      expect(result).toEqual({
        decade: '2000s',
        magazineId: 'harpers-bazaar',
        creativeStyle: 'cyberpunk',
      });
    });
  });
});
