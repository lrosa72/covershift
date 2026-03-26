import '@testing-library/jest-dom';
import { vi } from 'vitest';

// 模拟 localStorage - 使用内存存储实现
const localStorageStore = new Map<string, string>();
const localStorageMock = {
  getItem: vi.fn((key: string) => localStorageStore.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => localStorageStore.set(key, value)),
  removeItem: vi.fn((key: string) => localStorageStore.delete(key)),
  clear: vi.fn(() => localStorageStore.clear()),
};
global.localStorage = localStorageMock as unknown as Storage;

// 模拟 window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 模拟 framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => children,
    button: ({ children }: { children: React.ReactNode }) => children,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// 清理每次测试
afterEach(() => {
  vi.clearAllMocks();
});
