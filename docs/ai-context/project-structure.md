# CoverShift 跃像 - 项目结构文档

## 📋 项目概览

**项目名称**: CoverShift 跃像
**当前版本**: v2.0.0 (开发中)
**技术栈**: React 19 + TypeScript + Vite + Tailwind CSS + Tauri
**核心愿景**: 重新定义你，做人生的封面

---

## 🎯 产品定位

CoverShift 是一款创新的 AI 形象创作平台，让用户在多元宇宙中探索无限可能的自己。

### 核心功能
- **时间旅行**: 穿越历史年代（1920s-2100s），感受不同时代的时尚魅力
- **多元宇宙**: 探索平行世界、虚构宇宙中的自己
- **角色变身**: 成为超级英雄、电影角色或幻想生物
- **风格变换**: 尝试油画、素描、水墨等 18 种艺术风格
- **杂志封面**: 支持 9 种顶级时尚杂志风格

### v2.0 新增特性
1. **叙事性系统** - 时代档案卡、文化背景、故事生成
2. **偶然随机性系统** - 惊喜元素、稀有风格、彩蛋
3. **游戏化系统** - 成就系统、探索进度、每日挑战
4. **Mac 原生应用** - Tauri 框架支持

---

## 🛠 技术栈详解

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.1.1 | 前端框架 |
| TypeScript | 5.8.2 | 类型安全 |
| Vite | 6.2.0 | 构建工具 |
| TailwindCSS | - | 样式框架 |
| Framer Motion | 12.23.12 | 动画效果 |
| Tauri | 2.10.1 | 原生应用框架 |
| html2canvas | 1.4.1 | 截图/相册生成 |
| JSZip | 3.10.1 | ZIP 打包下载 |

---

## 📁 完整文件树

```
CoverShift/
├── App.tsx                          # 主应用组件
├── index.tsx                        # 应用入口
├── index.css                        # 全局样式
├── tailwind.config.js               # Tailwind 配置
├── vite.config.ts                   # Vite 配置
├── package.json                     # 项目依赖
├── tsconfig.json                    # TypeScript 配置
│
├── components/                      # React 组件目录
│   ├── ApiKeyModal.tsx             # API Key 配置弹窗
│   ├── AchievementPopup.tsx         # 成就解锁弹窗
│   ├── BrandMark.tsx                # 品牌标志组件
│   ├── ChronoDial.tsx               # 时间刻度选择器
│   ├── CoverShiftPassport.tsx       # 玩家护照/统计面板
│   ├── DecadeSelector.tsx           # 年代选择器
│   ├── EraArchiveCard.tsx           # 时代档案卡
│   ├── Footer.tsx                   # 页脚组件
│   ├── GenerationDarkroom.tsx       # 生成暗房组件
│   ├── HistoryPanel.tsx             # 历史记录面板
│   ├── MagazineCover.tsx            # 杂志封面展示
│   ├── MagazineSelector.tsx         # 杂志选择器
│   ├── CreativeStyleSelector.tsx    # 创意风格选择器
│   ├── CustomPromptEditor.tsx       # 自定义提示词编辑器
│   ├── ShareTicket.tsx              # 分享票据组件
│   ├── UXShowcase.tsx               # UX 展示组件
│   └── ViewToggle.tsx               # 视图切换器
│
├── hooks/                           # React Hooks
│   └── usePlayerProgress.ts         # 玩家进度与成就状态管理
│
├── services/                        # 业务逻辑服务
│   ├── generationService.ts         # 生成任务编排与并发执行
│   ├── imageModelService.ts         # 图像模型 API 调用与重试
│   └── promptBuilder.ts             # 统一 Prompt 构建器
│
├── lib/                             # 工具函数库
│   ├── albumUtils.ts                # 相册生成工具
│   ├── historyUtils.ts              # 历史记录存取
│   └── utils.ts                     # 通用工具函数
│
├── src/config/                      # 配置文件目录
│   ├── eras.ts                      # 年代配置 (1920s-2100s)
│   ├── magazines.ts                 # 杂志风格配置 (9种)
│   ├── creativeStyles.ts            # 创意风格配置 (18种)
│   ├── narratives.ts                # 叙事性系统配置
│   ├── randomEvents.ts              # 随机事件系统
│   └── achievements.ts              # 成就系统配置
│
├── src-tauri/                       # Tauri 原生壳层
│   ├── Cargo.toml                   # Rust 项目配置
│   ├── tauri.conf.json              # Tauri 应用配置
│   ├── icons/                       # 应用图标
│   └── src/                         # Rust 源代码
│
├── public/                          # 静态资源
│   ├── brand-cover.png              # 品牌封面图
│   └── fonts/                       # 字体文件
│
├── docs/                            # 文档目录
│   ├── features-v2.md               # v2.0 功能说明
│   └── ai-context/                  # AI 上下文文档
│       └── project-structure.md     # 本文件
│
└── memory/                          # Claude 记忆目录 (auto)
```

---

## 🔑 核心模块说明

### 1. 主应用 (App.tsx)

**职责**: 应用状态管理、UI 编排、用户交互

**关键状态**:
- `uploadedImage` - 用户上传的原始照片
- `generatedImages` - 生成的图像集合
- `selectedDecades` - 选中的年代列表
- `selectedMagazines` - 选中的杂志列表
- `selectedCreativeStyles` - 选中的创意风格
- `appState` - 应用状态机 (idle/image-uploaded/generating/results-shown)

**游戏化集成**:
- `usePlayerProgress` Hook - 玩家进度管理
- `EraArchiveCard` - 时代档案卡弹窗
- `AchievementPopup` - 成就解锁弹窗
- `CoverShiftPassport` - 玩家护照面板

---

### 2. 生成服务 (services/generationService.ts)

**职责**: 任务创建、并发执行、状态管理

**核心函数**:
```typescript
createGenerationTasks(decades, magazines, styles)  // 创建生成任务
createInitialGeneratedImages(tasks)                 // 初始化状态
runGenerationTasks(image, tasks, options)           // 并发执行任务
generateTaskImage(image, task, options)             // 单任务生成
parseGenerationKey(key)                              // 解析任务键
```

---

### 3. 图像模型服务 (services/imageModelService.ts)

**职责**: API 调用、错误重试、结果处理

**特性**:
- 可配置的 API 端点
- 自动重试机制
- 错误处理与降级
- 请求超时控制

---

### 4. 成就系统 (src/config/achievements.ts)

**成就类别**:
1. **生成类** - First Cover, Rising Star, Cover Artist, Cover Legend
2. **探索类** - Time Traveler, Century Explorer, Future Visionary, Magazine Collector, Style Adventurer, Style Master
3. **收藏类** - First Favorite, Curator
4. **连续登录** - Weekend Warrior, CoverShift Addict, Loyal Creator
5. **秘密成就** - Lucky Finder, Legendary Encounter, Combination Master

**数据结构**:
```typescript
interface PlayerStats {
  totalGenerations: number
  uniqueDecades: string[]
  uniqueMagazines: string[]
  uniqueStyles: string[]
  completedAchievements: string[]
  currentStreak: number
  longestStreak: number
  lastPlayed: string | null
  totalTimeSpent: number
  rareEventsFound: string[]
  secretCombosFound: string[]
}
```

---

### 5. 随机事件系统 (src/config/randomEvents.ts)

**稀有度等级**:
| 稀有度 | 概率 | 效果 |
|--------|------|------|
| Common | 30% | 普通特效 |
| Uncommon | 15% | 杂志/风格加成 |
| Rare | 8% | 秘密组合 |
| Epic | 3% | 彩蛋 |
| Legendary | 1% | 传说级 |

**事件类型**:
- Style Bonus - 风格加成
- Magazine Bonus - 杂志加成
- Secret Combination - 秘密组合
- Easter Egg - 彩蛋效果
- Special Caption - 特殊标题

---

### 6. 叙事性系统 (src/config/narratives.ts)

**时代档案卡包含**:
- 时代标题 (如"爵士时代的黎明")
- 文化偶像 (Coco Chanel、Audrey Hepburn 等)
- 标志性事件 (历史大事件)
- 时尚名言 (来自时尚大师)
- 音乐氛围 (年代背景音乐风格)
- 电影参考 (经典影片)
- 趣闻 (历史冷知识)
- 美学描述 (时尚风格细节)
- 封面文案 (可用于生成的杂志标题)

---

## 💾 数据存储

| localStorage Key | 说明 |
|------------------|------|
| `covershift_api_key` | 图像模型 API Key |
| `covershift_history` | 历史生成记录 |
| `covershift_player_stats` | 玩家统计和成就进度 |

---

## 🎨 UI 组件体系

### 布局层次
```
App (主容器)
├── Top Bar (API Key, Stats)
├── BrandMark (品牌标志)
├── Main Content (状态驱动)
│   ├── Idle → Upload Prompt
│   ├── Image Uploaded → Selectors
│   ├── Generating → Progress + Gallery
│   └── Results Shown → Gallery + Actions
├── Footer
└── Modals (API Key, Archive, Passport, Achievements)
```

### 视图模式
- **Scattered** - 散落式布局 (桌面默认)
- **Gallery** - 网格布局 (可选)
- **Mobile** - 单列流式布局

---

## 🔧 开发命令

```bash
# 开发模式 (Web)
npm run dev

# 开发模式 (Mac 原生应用)
npm run tauri:dev

# 类型检查
npm run lint

# 构建生产版本 (Web)
npm run build

# 构建生产版本 (Mac 应用)
npm run tauri:build
```

---

## 📝 配置要点

### 年代配置 (eras.ts)
- 11 个年代: 1920s, 1930s, 1940s, 1950s, 1960s, 1970s, 1980s, 1990s, 2000s, 2010s, 2020s, 2050s, 2100s
- 每个年代包含: nameCn, prompt, color, icon

### 杂志配置 (magazines.ts)
- 9 种杂志: vogue, bazaar, elle, vanity-fair, gq, time, rolling-stone, national-geographic, interview, i-d-magazine
- 每种杂志包含: nameCn, nameEn, prompt, logo, color

### 创意风格 (creativeStyles.ts)
- 18 种风格 + "none" (原时代风格)
- 包括: oil-painting, watercolor, sketch, ink, cyberpunk, vaporwave, retro, film-noir, pastel, neon, vintage-polaroid, manga, art-nouveau, art-deco, pop-art, surrealist, minimalist, maximalist

---

## 🚀 下一步计划

### 待实现功能
1. 成就面板 UI - 查看所有成就进度
2. 统计面板优化 - 更详细的玩家数据展示
3. 应用图标设计 - macOS 应用图标
4. 系统托盘集成 - 菜单栏快捷操作
5. 自动更新配置 - Tauri 自动更新功能
6. 社交分享 - 生成分享图片/链接

---

## 📚 相关文档

- [README.md](../../README.md) - 项目主页
- [CHANGELOG.md](../../CHANGELOG.md) - 版本变更记录
- [features-v2.md](../features-v2.md) - v2.0 功能详细说明
