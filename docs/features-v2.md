# CoverShift 跃像 v2.0 功能增强

## 📋 概述

本次更新为 CoverShift 添加了4大核心功能：

1. **叙事性系统** - 时代档案卡、文化背景、故事生成
2. **偶然随机性系统** - 惊喜元素、稀有风格、彩蛋
3. **游戏化系统** - 成就系统、探索进度、每日挑战
4. **Mac 原生应用** - Tauri 框架支持

---

## 🎭 1. 叙事性系统

### 文件结构

```
src/config/narratives.ts
components/EraArchiveCard.tsx
```

### 功能特性

#### 时代档案卡 (NarrativeCard)
每个年代都包含：
- **时代标题** - 如"爵士时代的黎明"、"好莱坞黄金时代"
- **文化偶像** - 该年代的代表人物（Coco Chanel、Audrey Hepburn等）
- **标志性事件** - 历史大事件
- **时尚名言** - 来自时尚大师的经典语录
- **音乐氛围** - 年代背景音乐风格
- **电影参考** - 经典影片
- **趣闻** - 有趣的历史冷知识
- **美学描述** - 详细的时尚风格描述
- **封面文案** - 可用于生成的杂志标题

#### 杂志叙事 (MagazineNarrative)
每种杂志包含：
- **创刊年份**
- **杂志哲学**
- **传奇主编**
- **标志性风格**
- **著名封面**

### 使用示例

```tsx
import { getNarrativeByDecade, getRandomCoverLine } from './src/config/narratives';

// 获取1920年代的叙事
const narrative = getNarrativeByDecade('1920s');
console.log(narrative?.headline); // "爵士时代的黎明"

// 获取随机封面文案
const coverLine = getRandomCoverLine('1980s');
```

---

## 🎲 2. 偶然随机性系统

### 文件结构

```
src/config/randomEvents.ts
```

### 功能特性

#### 随机事件 (RandomEvent)

| 稀有度 | 概率 | 效果 | 示例 |
|--------|------|------|------|
| Common | 30% | 普通特效 | Golden Hour Magic |
| Uncommon | 15% | 杂志/风格加成 | Vogue Italia Twist |
| Rare | 8% | 秘密组合 | Magazine Crossover |
| Epic | 3% | 彩蛋 | Andy Warhol Factory |
| Legendary | 1% | 传说级 | Time Portal |

#### 随机事件类型

1. **Style Bonus** - 风格加成，添加额外的视觉效果
2. **Magazine Bonus** - 杂志加成，特定杂志的特殊风格
3. **Secret Combination** - 秘密组合触发
4. **Easter Egg** - 彩蛋效果
5. **Special Caption** - 特殊标题

#### 秘密组合 (SecretCombination)

特定的年代+杂志+风格组合会触发隐藏奖励：

- **Hollywood Royalty** - 1930s+1940s+1950s + Vogue+Vanity Fair+Bazaar
- **Time Traveler** - 1970s+2050s + Interview+i-D + Vaporwave+Cyberpunk
- **Full Spectrum** - 1920s+1950s+1980s+2020s+2100s

#### 每日挑战 (DailyChallenge)

每天轮换的挑战任务，完成后获得徽章奖励。

### 使用示例

```tsx
import { rollRandomEvent, checkSecretCombination, getDailyChallenge } from './src/config/randomEvents';

// 触发随机事件
const event = rollRandomEvent();
if (event) {
  console.log(`触发了 ${event.nameCn}!`);
  console.log(`效果: ${event.effect?.bonusPrompt}`);
}

// 检查秘密组合
const combo = checkSecretCombination(
  ['1970s', '2050s'],
  ['interview', 'id-magazine'],
  ['vaporwave', 'cyberpunk']
);

// 获取今日挑战
const challenge = getDailyChallenge();
```

---

## 🏆 3. 游戏化系统

### 文件结构

```
src/config/achievements.ts
components/AchievementPopup.tsx
```

### 功能特性

#### 成就系统 (Achievement)

5大成就类别：

1. **生成类** - 基于总生成数量
   - First Cover (1张)
   - Rising Star (10张)
   - Cover Artist (100张)
   - Cover Legend (500张)

2. **探索类** - 基于尝试的多样性
   - Time Traveler (5个年代)
   - Century Explorer (1920s-2020s)
   - Future Visionary (2030s+)
   - Magazine Collector (全部9种杂志)
   - Style Adventurer (10种风格)
   - Style Master (全部18种风格)

3. **收藏类** - 基于收藏行为
   - First Favorite (1个收藏)
   - Curator (20个收藏)

4. **连续登录** - 基于使用频率
   - Weekend Warrior (3天)
   - CoverShift Addict (7天)
   - Loyal Creator (30天)

5. **秘密成就** - 隐藏内容
   - Lucky Finder (发现稀有事件)
   - Legendary Encounter (见证传说事件)
   - Combination Master (发现秘密组合)

#### 玩家统计 (PlayerStats)

```typescript
{
  totalGenerations: number;        // 总生成数
  uniqueDecades: string[];         // 尝试过的年代
  uniqueMagazines: string[];       // 尝试过的杂志
  uniqueStyles: string[];          // 尝试过的风格
  completedAchievements: string[]; // 已完成成就
  currentStreak: number;           // 当前连续天数
  longestStreak: number;           // 最长连续天数
  lastPlayed: string | null;       // 最后游玩日期
  totalTimeSpent: number;          // 总时长(秒)
  rareEventsFound: string[];       // 发现的稀有事件
  secretCombosFound: string[];     // 发现的秘密组合
}
```

#### 称号系统 (Title)

完成特定成就可获得专属称号：
- Cover Artist - 封面艺术家
- Cover Legend - 封面传奇
- Style Master - 风格大师
- Time Lord - 时间之主
- Fashion Icon - 时尚偶像
- Legendary Finder - 传说发现者
- Loyal Creator - 忠实创作者

### 使用示例

```tsx
import {
  loadPlayerStats,
  savePlayerStats,
  updatePlayerStatsOnGeneration,
  recordRareEvent
} from './src/config/achievements';

// 加载玩家数据
let stats = loadPlayerStats();

// 更新生成记录
const result = updatePlayerStatsOnGeneration(
  stats,
  ['1980s'],
  ['vogue'],
  ['cyberpunk']
);
stats = result.stats;

// 新解锁的成就
result.newAchievements.forEach(achievement => {
  console.log(`解锁成就: ${achievement.nameCn}`);
});

// 记录稀有事件
stats = recordRareEvent(stats, 'legendary-haute-couture');

// 保存
savePlayerStats(stats);
```

---

## 💻 4. Mac 原生应用 (Tauri)

### 文件结构

```
src-tauri/
├── Cargo.toml          # Rust 项目配置
├── tauri.conf.json     # Tauri 应用配置
├── icons/              # 应用图标
└── src/                # Rust 源代码
```

### 功能特性

#### 应用配置

- **应用名称**: CoverShift
- **窗口标题**: CoverShift 跃像
- **窗口尺寸**: 1200x900 (最小 900x700)
- **主题**: 深色模式
- **标题栏**: 透明效果 (macOS)
- **Bundle**: DMG 和 APP 格式
- **最低系统版本**: macOS 10.15+

### 开发命令

```bash
# 开发模式 (启动原生应用窗口)
npm run tauri:dev

# 构建生产版本
npm run tauri:build

# 仅运行 Tauri CLI
npm run tauri
```

### 构建产物

构建完成后，在 `src-tauri/target/release/bundle/` 目录下：

- `macos/CoverShift.app` - macOS 应用
- `macos/CoverShift.dmg` - 磁盘镜像安装包

---

## 🎯 集成指南

### 在 App.tsx 中使用

```tsx
import { useState, useEffect } from 'react';
import EraArchiveCard from './components/EraArchiveCard';
import AchievementPopup from './components/AchievementPopup';
import {
  loadPlayerStats,
  savePlayerStats,
  updatePlayerStatsOnGeneration,
  PlayerStats,
  Achievement
} from './src/config/achievements';
import {
  rollRandomEvent,
  RandomEvent
} from './src/config/randomEvents';

function App() {
  const [stats, setStats] = useState<PlayerStats>(() => loadPlayerStats());
  const [showArchive, setShowArchive] = useState(false);
  const [selectedDecade, setSelectedDecade] = useState('1980s');
  const [selectedMagazine, setSelectedMagazine] = useState('vogue');
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  // 生成时更新统计
  const handleGenerate = async () => {
    // 触发随机事件
    const event = rollRandomEvent();
    setCurrentEvent(event);

    // ... 生成逻辑 ...

    // 更新玩家统计
    const result = updatePlayerStatsOnGeneration(
      stats,
      selectedDecades,
      selectedMagazines,
      selectedCreativeStyles
    );
    setStats(result.stats);
    savePlayerStats(result.stats);

    // 显示新成就
    if (result.newAchievements.length > 0) {
      setNewAchievements(result.newAchievements);
    }
  };

  return (
    <>
      {/* 时代档案卡 */}
      {showArchive && (
        <EraArchiveCard
          decade={selectedDecade}
          magazineId={selectedMagazine}
          randomEvent={currentEvent}
          onClose={() => setShowArchive(false)}
        />
      )}

      {/* 成就弹窗 */}
      {newAchievements.map((achievement, index) => (
        <AchievementPopup
          key={achievement.id}
          achievement={achievement}
          onClose={() => setNewAchievements(prev =>
            prev.filter(a => a.id !== achievement.id)
          )}
        />
      ))}
    </>
  );
}
```

---

## 📊 数据存储

所有游戏化数据存储在浏览器的 `localStorage` 中：

| Key | 说明 |
|-----|------|
| `covershift_player_stats` | 玩家统计和成就进度 |
| `covershift_history` | 历史生成记录 (已存在) |

Tauri 应用使用相同的 localStorage 机制，数据会自动保存。

---

## 🚀 下一步

### 待实现功能

1. **集成到主界面** - 将成就系统、档案卡连接到 App.tsx
2. **成就面板** - 添加查看所有成就的 UI
3. **统计面板** - 显示玩家进度统计
4. **应用图标** - 设计并添加 macOS 应用图标
5. **系统托盘** - 添加菜单栏图标和快捷操作
6. **自动更新** - 配置 Tauri 的自动更新功能

---

## 📝 总结

本次更新为 CoverShift 带来了：

✅ **叙事性** - 每个年代都有丰富的文化背景和故事
✅ **偶然随机性** - 稀有事件、彩蛋、秘密组合增加惊喜感
✅ **游戏化** - 成就、进度、称号系统提升用户粘性
✅ **Mac 原生** - Tauri 框架支持，提供更好的用户体验

这些功能共同将 CoverShift 从一个"AI 图像生成工具"转变为一个"沉浸式探索体验"！
