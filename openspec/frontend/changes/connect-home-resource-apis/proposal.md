# Connect Home Resource APIs

## 背景

首页右侧本机资源概览和最近操作仍使用前端 mock 数据。用户已确认以后端新版接口文档为准，需要按新版首页接口对接资源概览、最近操作和清理相关入口。

## 目标

- 新增首页 API 服务层，覆盖新版首页接口 1.1-1.7。
- 右侧本机资源概览接入 `GET /api/system/resources`。
- 右侧最近操作接入 `GET /api/activity/recent`。
- “加速”按钮接入 `POST /api/system/cache/cleanup`，保留用户确认和幂等键。
- “清理”按钮接入 `GET /api/system/processes`，展示候选进程摘要和选择令牌状态。

## 非目标

- 不自动终止进程。
- 不实现完整进程勾选弹窗。
- 不改顶部本地工具按钮行为。
- 不改后端接口文档。

## 影响范围

- `frontend/src/services/homeApi.ts`
- `frontend/src/layouts/LocalResourcePopover.tsx`
- `frontend/src/styles/globals.css`

## 风险

- 缓存清理是高风险动作，前端必须确认后调用，并带 `Idempotency-Key`。
- 进程终止需要用户选择具体 PID 后再确认，本轮不在 UI 自动调用 `terminateProcesses`。

## 验收标准

- 首页资源概览打开后从后端加载 CPU、GPU、内存、磁盘、网络和可释放空间估算。
- 最近操作从后端加载并支持空态。
- 资源接口失败时只影响右侧资源栏，不阻塞首页 AI 输入。
- 加速缓存清理调用新版接口并显示处理结果或错误。
- 清理按钮调用新版进程列表接口，不自动终止进程。
