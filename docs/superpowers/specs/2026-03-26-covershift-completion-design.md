# CoverShift 跃像 - 项目完成化设计文档

**创建日期**: 2026-03-26  
**版本**: v1.0.0  
**状态**: 已批准  

---

## 1. 项目概述

### 1.1 产品愿景

CoverShift（跃像）是一款多元宇宙形象创作平台，让用户看到自己在不同时空、不同宇宙、不同艺术风格中的无限可能。

**Slogan**: 重新定义你，做人生的封面

### 1.2 当前状态 (v0.1.0)

**已完成功能 (Phase 1)**:
- ✅ 历史年代选择（1920s - 2100s）
- ✅ 杂志风格选择（9 种杂志）
- ✅ 创意风格叠加（19 种创意选项）
- ✅ 批量生成组合（风格 × 杂志 × 年代）
- ✅ 历史记录保存/加载
- ✅ API Key 配置
- ✅ Mac 原生风格界面

**待完成功能**:
- ⬜ Phase 2: 多元宇宙（平行世界、虚构宇宙）
- ⬜ Phase 3: 角色变身（超级英雄、电影角色）
- ⬜ Phase 4: 艺术风格（油画、水墨、像素艺术）

---

## 2. 技术架构

### 2.1 架构原则

1. **配置驱动开发**: 所有新功能通过配置文件添加，无需修改核心代码
2. **模块化增量发布**: 每个 Sprint 结束都有可交付成果
3. **统一数据模型**: 所有转换选项使用统一的 Option 接口
4. **渐进式增强**: 保持现有功能稳定，逐步扩展新能力

### 2.2 项目结构

```
CoverShift/
├── src/
│   ├── config/                    # 配置中心（核心扩展点）
│   │   ├── eras.ts               # Phase 1: 年代配置
│   │   ├── magazines.ts          # Phase 1: 杂志配置
│   │   ├── creativeStyles.ts     # Phase 1: 创意风格
│   │   ├── universes.ts          # Phase 2: 多元宇宙配置 [新增]
│   │   ├── roles.ts              # Phase 3: 角色模板配置 [新增]
│   │   ├── artStyles.ts          # Phase 4: 艺术风格配置 [新增]
│   │   └── index.ts              # 统一导出
│   │
│   ├── components/
│   │   ├── universe/             # Phase 2: 宇宙选择器 [新增]
│   │   ├── role/                 # Phase 3: 角色选择器 [新增]
│   │   ├── art/                  # Phase 4: 艺术风格选择器 [新增]
│   │   └── shared/               # 共享组件 [优化]
│   │
│   ├── services/
│   │   ├── promptBuilder.ts      # 扩展：支持新配置类型
│   │   ├── generationService.ts  # 优化：并发和缓存
│   │   └── imageModelService.ts  # 保持不变
│   │
│   └── types/
│       └── index.ts              # 统一类型定义
│
├── components/                    # 现有组件层（保持不变）
├── docs/superpowers/specs/        # 设计文档
└── package.json
```

### 2.3 统一数据模型

```typescript
// 所有 Phase 使用统一的 TransformOption 接口
interface TransformOption {
  id: string;
  name: string;
  description: string;
  previewImage?: string;
  promptModifier: (basePrompt: string) => string;
  category: 'era' | 'universe' | 'role' | 'artStyle';
  eraRange?: [number, number];  // 可选：适用的年代范围
  tags?: string[];              // 用于搜索和分类
  priority?: number;            // 排序优先级
}
```

### 2.4 Prompt 构建流程

```
用户选择 → 基础照片 + 年代 + 宇宙/角色/风格
    ↓
PromptBuilder 组合（按优先级）
    ├─ 基础描述（人物特征）
    ├─ 年代修饰（1920s-2100s）
    ├─ 宇宙修饰（Cyberpunk 等）
    ├─ 角色修饰（超级英雄等）
    └─ 风格修饰（油画、水墨等）
    ↓
发送到图像模型 API
    ↓
结果展示在 MagazineCover 组件
```

---

## 3. 功能规格

### 3.1 Phase 2: 多元宇宙（Sprint 3-4）

| ID | 宇宙名称 | 描述 | Prompt 关键词示例 |
|----|----------|------|------------------|
| U001 | Cyberpunk | 霓虹灯、高科技低生活 | cyberpunk, neon lights, futuristic city, high tech |
| U002 | Steampunk | 蒸汽机械、维多利亚风 | steampunk, brass gears, Victorian era, steam power |
| U003 | 赛博奈良 | 日本传统 + 赛博朋克 | cyberpunk Nara, neon torii gate, traditional meets technology |
| U004 | 复古未来 | 50 年代想象的未来 | retrofuturism, 1950s sci-fi, atomic age, space age |
| U005 | 魔法世界 | 奇幻魔法宇宙 | magical world, fantasy, wizards, mystical energy |
| U006 | 星际殖民 | 太空歌剧风格 | space opera, colony ship, alien planets, sci-fi |

**UI 组件**:
- `UniverseSelector.tsx` - 宇宙选择器（支持多选）
- `UniversePreview.tsx` - 宇宙预览卡片
- `UniverseMixer.tsx` - 宇宙混合编辑器

**验收标准**:
- [ ] 至少 6 个宇宙选项可用
- [ ] 支持与其他 Phase 功能自由组合
- [ ] Prompt 构建正确率 > 95%
- [ ] UI 响应时间 < 100ms

---

### 3.2 Phase 3: 角色变身（Sprint 5-6）

| ID | 角色类型 | 示例 | Prompt 关键词示例 |
|----|----------|------|------------------|
| R001 | 超级英雄 | 钢铁侠、超人、蝙蝠侠 | as Iron Man, superhero suit, cinematic lighting, epic pose |
| R002 | 电影角色 | 经典电影形象 | as James Bond, classic cinema style, film noir |
| R003 | 职业身份 | 宇航员、医生、艺术家 | as astronaut, professional portrait, studio lighting |
| R004 | 幻想生物 | 精灵、吸血鬼、天使 | as elf, fantasy creature, ethereal glow |
| R005 | 历史人物 | 著名历史人物风格 | in style of Napoleon, historical portrait, classical painting |
| R006 | 动漫角色 | 日式动漫风格 | anime character, manga style, cel shading |

**UI 组件**:
- `RoleSelector.tsx` - 角色选择器（分类浏览）
- `RoleTemplate.tsx` - 角色模板预览
- `RoleCustomizer.tsx` - 角色自定义编辑器

**验收标准**:
- [ ] 至少 6 类角色模板可用
- [ ] 支持自定义角色描述
- [ ] 角色与宇宙组合效果自然
- [ ] 提供角色使用指南

---

### 3.3 Phase 4: 艺术风格（Sprint 7-8）

| ID | 风格名称 | 描述 | Prompt 关键词示例 |
|----|----------|------|------------------|
| A001 | 油画 | 文艺复兴油画风格 | oil painting, Renaissance style, canvas texture, brush strokes |
| A002 | 水墨画 | 中国传统水墨 | Chinese ink wash painting, sumi-e style, watercolor, minimalist |
| A003 | 像素艺术 | 8-bit/16-bit 像素风 | pixel art, 8-bit style, retro game, low resolution |
| A004 | 电影海报 | 好莱坞大片海报风 | movie poster, cinematic, dramatic lighting, blockbuster style |
| A005 | 素描 | 铅笔素描风格 | pencil sketch, charcoal drawing, monochrome, hand drawn |
| A006 | 波普艺术 | 安迪沃霍尔风格 | pop art, Andy Warhol style, vibrant colors, screen print |
| A007 | 浮世绘 | 日本传统浮世绘 | ukiyo-e, Japanese woodblock print, traditional art |
| A008 | 赛博插画 | 现代数字插画 | digital illustration, cyberpunk art, concept art style |

**UI 组件**:
- `ArtStyleSelector.tsx` - 艺术风格选择器
- `StyleIntensity.tsx` - 风格强度调节器
- `StyleGallery.tsx` - 风格作品画廊

**验收标准**:
- [ ] 至少 8 种艺术风格可用
- [ ] 支持风格强度调节（0-100%）
- [ ] 提供风格预览图
- [ ] 输出质量达到专业水准

---

## 4. 实施计划

### 4.1 Sprint 时间表

| Sprint | 周期 | 主要任务 | 交付物 |
|--------|------|----------|--------|
| **Sprint 1-2** | Week 1-2 | Phase 1 完善 | 性能优化报告、Bug 修复清单、UX 改进 |
| **Sprint 3-4** | Week 3-4 | Phase 2 多元宇宙 | UniverseSelector、6+ 宇宙配置、集成测试 |
| **Sprint 5-6** | Week 5-6 | Phase 3 角色变身 | RoleSelector、6+ 角色模板、使用指南 |
| **Sprint 7-8** | Week 7-8 | Phase 4 艺术风格 | ArtStyleSelector、8+ 风格、风格画廊 |
| **Sprint 9-10** | Week 9-10 | 整合发布 | 完整测试、文档、v1.0.0 发布 |

### 4.2 Git 提交策略

**分支管理**:
- `main`: 生产环境（稳定版本）
- `develop`: 开发分支（集成分支）
- `feature/phase-X`: 功能分支（按 Phase 划分）

**提交规范**:
```bash
# 功能开发
git commit -m "feat(phase2): 添加 Cyberpunk 宇宙配置"

# Bug 修复
git commit -m "fix(prompt): 修复风格叠加顺序问题"

# 文档更新
git commit -m "docs(readme): 更新快速开始指南"

# 阶段性成果
git commit -m "release: Phase 2 多元宇宙功能完成 (v0.2.0)"
```

**里程碑标签**:
- `v0.1.0`: 当前状态（Phase 1 完成）
- `v0.2.0`: Phase 2 完成（多元宇宙）
- `v0.3.0`: Phase 3 完成（角色变身）
- `v0.4.0`: Phase 4 完成（艺术风格）
- `v1.0.0`: 正式版发布

### 4.3 进度提示机制

**每个 Sprint 结束时自动提示**:
1. 创建 GitHub Release（包含 changelog）
2. 发送进度通知（通过 IM/邮件）
3. 更新项目看板
4. 演示视频/截图分享

**提示内容模板**:
```
🎉 CoverShift 项目进展汇报

✅ 已完成：Sprint X-Y - [阶段名称]
📦 交付物：[具体功能列表]
🔗 Release: https://github.com/lrosa72/CoverShift/releases/tag/vX.X.X
📊 完成度：XX%
📅 下一阶段：[下阶段名称]，预计完成时间
```

---

## 5. 质量保证

### 5.1 测试策略

**单元测试** (Vitest):
- PromptBuilder 测试：确保组合逻辑正确
- 配置验证测试：确保所有选项有效
- 工具函数测试：覆盖边界情况

**集成测试**:
- UI 组件交互测试
- API 调用模拟测试
- 端到端生成流程测试

**覆盖率目标**:
- 语句覆盖率：> 80%
- 分支覆盖率：> 75%
- 函数覆盖率：> 85%

### 5.2 性能指标

| 指标 | 目标值 | 测量方法 |
|------|--------|----------|
| 首屏加载时间 | < 2s | Lighthouse |
| 交互响应时间 | < 100ms | Performance API |
| 图片加载时间 | < 1s | Network tab |
| 生成任务队列延迟 | < 500ms | Custom metrics |

### 5.3 代码质量

**TypeScript 严格模式**:
- 无 `any` 类型
- 所有函数有返回类型注解
- 严格 null 检查

**ESLint 规则**:
- 遵循 React最佳实践
- 无警告错误
- 代码格式统一

---

## 6. 文档要求

### 6.1 需要更新的文档

- [ ] `README.md` - 更新功能列表和截图
- [ ] `README_en.md` - 英文版同步更新
- [ ] `PRODUCT.md` - 更新产品矩阵和路线图
- [ ] `CHANGELOG.md` - 每个版本的详细变更

### 6.2 需要新增的文档

- [ ] `docs/UNIVERSE_GUIDE.md` - 多元宇宙使用指南
- [ ] `docs/ROLE_GUIDE.md` - 角色变身使用指南
- [ ] `docs/ART_STYLE_GUIDE.md` - 艺术风格使用指南
- [ ] `docs/API_REFERENCE.md` - 配置 API 参考
- [ ] `docs/CONTRIBUTING.md` - 贡献指南

### 6.3 文档质量标准

- 包含代码示例
- 包含截图/GIF演示
- 中英文双语
- Markdown 格式规范

---

## 7. 风险管理

### 7.1 技术风险

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| API 限流 | 中 | 高 | 实现请求队列、指数退避重试 |
| 配置冲突 | 低 | 中 | 智能冲突检测、默认回退策略 |
| 性能下降 | 中 | 中 | 代码分割、懒加载、预加载优化 |

### 7.2 进度风险

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| 需求变更 | 中 | 高 | 敏捷开发、每 2 周 review |
| 人员时间不足 | 高 | 高 | 优先级调整、分阶段发布 |
| 技术难点阻塞 | 中 | 中 | 提前技术预研、备选方案 |

---

## 8. 成功标准

### 8.1 功能完成标准

- [ ] Phase 2-4 所有配置项可用
- [ ] Prompt 构建器支持所有组合（1000+ 组合）
- [ ] UI 界面支持新功能选择
- [ ] 历史记录保存新类型
- [ ] 支持批量生成（100+ 图片）

### 8.2 质量完成标准

- [ ] 所有 TypeScript 类型正确（无编译错误）
- [ ] 单元测试覆盖率 > 80%
- [ ] 无控制台报错
- [ ] Lighthouse 评分 > 90
- [ ] 性能指标全部达标

### 8.3 文档完成标准

- [ ] README 完整更新
- [ ] 所有功能有使用指南
- [ ] API 文档完整
- [ ] Changelog 持续更新
- [ ] 提供示例配置文件

### 8.4 用户体验标准

- [ ] 新手引导完整
- [ ] 错误提示友好
- [ ] 支持撤销/重做
- [ ] 提供快捷操作
- [ ] 响应式设计（移动端适配）

---

## 9. 附录

### 9.1 配置示例

```typescript
// src/config/universes.ts
import { TransformOption } from '../types';

export const universes: TransformOption[] = [
  {
    id: 'cyberpunk',
    name: '赛博朋克',
    description: '霓虹灯闪烁的未来都市',
    category: 'universe',
    promptModifier: (base) => `${base}, cyberpunk city, neon lights, high tech`,
    tags: ['科幻', '未来', '都市'],
    priority: 1
  },
  // ... 更多宇宙
];
```

### 9.2 Prompt 组合示例

```
输入：用户上传照片 + 1980s + Cyberpunk + 超级英雄 + 油画风格

输出 Prompt:
"A person in 1980s fashion, 
cyberpunk city background with neon lights, 
wearing superhero costume like Iron Man, 
oil painting style, Renaissance technique, 
cinematic lighting, highly detailed"
```

### 9.3 相关文件

- [PRODUCT.md](../../PRODUCT.md) - 产品定义
- [README.md](../../README.md) - 项目说明
- [CHANGELOG.md](../../CHANGELOG.md) - 版本历史

---

**文档审批**:
- [x] 设计审查通过
- [ ] 开发完成
- [ ] 测试通过
- [ ] 正式发布

**最后更新**: 2026-03-26
