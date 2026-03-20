# CoverShift 跃像

> **重新定义你，做人生的封面**

![CoverShift](https://img.shields.io/badge/CoverShift-v0.1.0-yellow?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-Apache%202.0-green?style=for-the-badge)

## 🎯 产品简介

CoverShift（跃像）是一款创新的 AI 形象创作平台，让你在多元宇宙中探索无限可能的自己。

- **时间旅行**：穿越历史年代，感受不同时代的时尚魅力
- **多元宇宙**：探索平行世界、虚构宇宙中的自己
- **角色变身**：成为超级英雄、电影角色或幻想生物
- **风格变换**：尝试油画、素描、水墨等艺术风格

## ✨ 核心功能

### 🔮 多元宇宙穿越
- [ ] 历史年代选择（1920s - 2100s）
- [ ] 平行宇宙世界（Cyberpunk、Steampunk、魔法世界等）
- [ ] 虚构世界（指环王、哈利波特等）
- [ ] 艺术风格变换

### 🎭 角色扮演系统
- [ ] 超级英雄变身
- [ ] 电影角色形象
- [ ] 职业身份转换
- [ ] 幻想生物形象

### 🎨 创意工具
- [ ] 多图批量生成
- [ ] 风格混合叠加
- [ ] 自定义提示词
- [ ] 历史记录保存

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/lrosa72/CoverShift.git
cd CoverShift
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置 API Key
项目使用 Google Gemini API，你需要：
1. 访问 [Google AI Studio](https://aistudio.google.com/apikey)
2. 创建 API Key
3. 首次使用时在界面中配置（或创建 `.env` 文件）

### 4. 启动开发服务器
```bash
npm run dev
```

### 5. 构建生产版本
```bash
npm run build
npm run preview
```

## 📁 项目结构

```
CoverShift/
├── App.tsx              # 主应用组件
├── components/          # React 组件
│   ├── ApiKeyModal.tsx  # API Key 配置弹窗
│   ├── Footer.tsx       # 页脚
│   ├── HistoryPanel.tsx # 历史记录面板
│   └── ...
├── services/            # API 服务
│   └── geminiService.ts # Gemini API 封装
├── lib/                 # 工具函数
│   ├── faceUtils.ts     # 人脸工具
│   └── albumUtils.ts    # 相册生成
├── src/
│   └── config/          # 配置文件
│       ├── eras.ts      # 年代配置
│       ├── magazines.ts # 杂志风格
│       └── creativeStyles.ts # 创意风格
└── public/             # 静态资源
```

## 🛠 技术栈

| 技术 | 用途 |
|------|------|
| React 19 | 前端框架 |
| TypeScript | 类型安全 |
| Vite | 构建工具 |
| TailwindCSS | 样式框架 |
| Framer Motion | 动画效果 |
| Google Gemini | AI 图像生成 |

## 📝 版本历史

### [0.1.0] - 2026-03-20
- 项目初始化
- 品牌重塑：Past Forward → CoverShift 跃像
- 新 slogan：重新定义你，做人生的封面

## 📄 License

Apache 2.0 License

## 👤 作者

Created by Chris
