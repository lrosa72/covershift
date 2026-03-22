# IdleForge Core - MVP 状态

> 「某年某月的某一天，就像一张破碎的脸……」
> —— 80年代民歌《恰似你的温柔》

## 项目定位

**IdleForge Core** 是一个**想法 → 执行 → 复盘**的最小闭环系统。

当前阶段：**P0 - 跑通闭环（1-2周）**

---

## 🟢 已实现 (Implemented)

### 核心基础设施
- ✅ FastAPI 后端框架
- ✅ 7个 API 路由模块
- ✅ Pydantic 数据模型（完整）
- ✅ 配置管理系统
- ✅ .env 模板

### Agent 系统
- ✅ 首席架构师提示词（奇观级设计）
- ✅ 熵值检测逻辑
- ✅ 五大维度访谈问题生成
- ✅ 编年史 Agent 框架

### 特色功能
- ✅ 时空留声机（4种音乐模式）
- ✅ Notion 集成客户端框架

---

## 🟡 开发中 (In Progress)

### P0 - 闭环 1.0
- 🔄 标准 JSON API 设计
- 🔄 想法 → 评估 → 访谈 → 任务自动流转
- 🔄 Timeline 视图
- 🔄 SQLite 持久化存储

---

## ⚪ 规划中 (Planned)

### P0 - 剩余工作
- ⏳ MVP 叙事收敛
- ⏳ 漏斗分析视图
- ⏳ 周复盘支持

### P1 (1-2月)
- ⏳ HITL 决策锚点产品化
- ⏳ 记忆复用系统
- ⏳ 质量评分硬门槛
- ⏳ 预算控制

### P2 (战略)
- ⏳ 多工单平台
- ⏳ 插件协议
- ⏳ 跨域共鸣引擎
- ⏳ 结果托管商业化

---

## 最小价值链路 (P0 目标)

```
提交想法
    ↓
熵值检测 + 自动进入评估
    ↓
五大维度访谈澄清
    ↓
访谈提交 → 自动推进状态 + 生成任务
    ↓
展示进度 / 结果
    ↓
Timeline 视图 + 可复盘
```

---

## API 设计 (P0 标准)

### POST /api/v1/ideas
**请求** (标准 JSON body):
```json
{
  "title": "自动 README 生成工具",
  "description": "用 AI 为代码库自动生成 README 文档",
  "submitted_by": "optional-user-id",
  "tags": ["documentation", "ai", "automation"],
  "priority": 7
}
```

**响应**:
```json
{
  "data": {
    "idea_id": "uuid",
    "title": "自动 README 生成工具",
    "status": "evaluating",
    "entropy_score": 0.45,
    "entropy_level": "medium"
  },
  "next_actions": [
    {
      "action": "view_interview_questions",
      "url": "/api/v1/interview/questions/{idea_id}",
      "method": "POST"
    },
    {
      "action": "view_entropy",
      "url": "/api/v1/interview/entropy/{idea_id}",
      "method": "POST"
    }
  ],
  "error": null
}
```

---

## 数据模型 (P0 最小集)

### Idea（想法）
- id, title, description
- status: submitted → evaluating → approved → in_progress → completed
- entropy_score, entropy_level
- interview_answers (JSON)
- created_at, updated_at

### Task（任务）
- id, idea_id, title, description
- status: pending → assigned → in_progress → completed
- task_type: researcher / developer / tester / etc.
- created_at, started_at, completed_at

### InterviewAnswer（访谈答案）
- id, idea_id, question_id, answer
- created_at

---

## 下一步行动

1. **立即**：更新 API 为标准 JSON 格式
2. **今天**：实现想法创建后的自动流转
3. **本周**：SQLite 持久化 + Timeline 视图
4. **下周**：漏斗分析 + 周复盘支持

---

*最后更新：2026-03-22*
*背景音乐：《恰似你的温柔》正在播放...* 🍊
