# Proposal: improve-settings-page

## 背景

设置页面在 `frontend-page-framework` 中已搭建静态框架，包含三个 Tab（环境 / AI 助手 / 个人信息）和 mock 数据。当前页面缺乏以下能力：

- 环境和 AI 助手模型只有列表视图，无详情查看能力
- QLoRA 环境状态标签色调错误（应为绿色"可用"，实际为黄色"需修复"）
- 操作按钮（创建环境/添加模型、检测全部）位于 Tab 栏左侧，布局不够合理
- 缺少搜索过滤功能
- 缺少空态展示
- 模型详情字段（API Base URL、API Key、连接状态、生成参数）无法查看

后续联调补充：设置页运行环境 Tab 已从 mock 列表升级为对接环境业务后端。环境业务后端默认 `http://10.0.1.5:8000`，AI / chat runtime 默认 `http://10.0.1.5:8765`，前端通过独立 service 和 Vite proxy 区分两类 API。

## 目标

在保持 SettingsPage 现有架构（单文件 Page 组件）的前提下，增强以下功能：

1. 环境详情页：点击卡片整页切换至详情，展示基础信息、逐项检测结果、使用建议
2. 模型详情页：同理，展示链接信息、生成参数、连接状态
3. 详情页隐藏顶部 Tab 栏和操作按钮
4. 操作按钮移至顶部栏右侧
5. 列表页支持搜索过滤和空态展示
6. 优化详情页元素样式（等宽字体、状态指示灯、脱敏 API Key、布尔 Pill、信息卡片）

## 非目标

- 不实施 Page → Feature → Hook → Component 架构拆分（留待后续 Change）
- 本 Change 初始范围不接入真实后端 API 或 Electron IPC；后续联调已补充运行环境列表、创建、导入和删除 API。
- 当前运行后端若未暴露环境检测 API，前端只保留入口并提示不可用。
- 不修改全局布局（AppShell / Sidebar / WindowTitleBar）
- 环境创建和删除已按后端高风险契约接入确认；环境检测在后端接口暴露前保持占位提示。

## 影响范围

- 修改：`frontend/src/pages/SettingsPage.tsx`（列表→详情切换、搜索、样式）
- 修改：`frontend/src/types/domain.ts`（新增 RuntimeEnvironmentDetail、AssistantModelDetail、EnvironmentCheckItem）
- 修改：`frontend/src/mocks/prototypeData.ts`（新增详情 mock 数据、修正 QLoRA tone）
- 修改：`frontend/src/styles/globals.css`（新增 ~150 行详情页样式）
- 后续联调新增：`frontend/src/services/environmentsApi.ts`（运行环境列表、创建、导入、删除）
- 后续联调修改：`frontend/vite.config.ts`（`/api/environments` 和 `/api/health` 代理到 `8000`，其他 `/api` 代理到 `8765`）
- 新增：`openspec/frontend/changes/improve-settings-page/`（本 Change）

## 用户流程

### 环境详情
1. 用户进入设置 > 环境 Tab，看到环境卡片列表
2. 用户可按名称/用途搜索过滤环境
3. 点击环境卡片 → 整页切换至环境详情页
4. 详情页展示：头部（返回按钮 + 图标 + 名称 + 用途标签 + 状态 + 操作按钮）、基础信息、检测结果列表、使用建议
5. 点击 X 按钮返回列表

### 运行环境后端联调
1. 用户进入设置 > 环境 Tab，前端调用 `GET /api/environments` 获取环境卡片列表。
2. 用户点击创建环境，系统环境仅提供“大模型推理 / LLM”；提交时带 `confirmed=true` 和 `Idempotency-Key`。
3. 系统环境提交 `mode=system`、`category=llm_inference`、`taskType=llm`，环境名称和保存路径由后端生成。
4. 自定义环境提交 `mode=custom`、`name`、`purpose`、`python`、`packageManager`、`savePath`、`dependencyFilePath`、`packages=[]`。
5. 创建成功后前端展示后台任务已提交，并把返回的环境摘要加入列表。
6. 删除环境时前端提交 `confirmed=true`、`deleteLocalFiles` 和必要的 `deleteLocalFilesConfirmed`；本地删除选项由 `canDeleteLocalFiles` 控制。

### 模型详情
1. 用户切换到 AI 助手 Tab，看到模型卡片列表
2. 用户可按名称/厂商搜索过滤模型
3. 点击模型卡片 → 整页切换至模型详情页
4. 详情页展示：链接信息（API Base URL、模型标识、脱敏 API Key、连接状态指示灯）、生成参数（上下文长度、Temperature、超时、重试、默认模型）
5. 点击 X 按钮返回列表

## 风险

- SettingsPage.tsx 持续膨胀（当前 ~673 行），后续需拆分为 Feature 组件
- 详情页 mock 数据与列表数据通过 id 关联，需保持一致
- CSS 新增选择器需避免与现有样式冲突

## 验收标准

- TypeScript 类型检查通过 (`pnpm run typecheck`)
- Vite 构建通过 (`pnpm run build`)
- 环境列表搜索过滤正常，无匹配时展示空态
- 模型列表搜索过滤正常，无匹配时展示空态
- 环境详情页整页展示，隐藏 Tab 栏和操作按钮
- 模型详情页整页展示，隐藏 Tab 栏和操作按钮
- QLoRA 环境状态显示绿色"可用"
- 操作按钮位于顶部栏右侧
- 详情页元素样式正确（等宽字体、状态指示灯、API Key 脱敏、布尔 Pill）
