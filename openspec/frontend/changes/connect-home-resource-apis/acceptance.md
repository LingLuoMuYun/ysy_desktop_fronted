# Acceptance

- [x] `frontend/src/services/homeApi.ts` 已封装新版首页接口 1.1-1.7。
- [x] `LocalResourcePopover` 已移除 `localResourceOverview` mock 数据依赖，改为调用 `homeApi.loadResources` 和 `homeApi.loadRecentActions`。
- [x] “加速”按钮调用 `homeApi.cleanupCache`，请求携带 `confirmed=true` 和 `Idempotency-Key`。
- [x] “清理”按钮调用 `homeApi.loadProcesses`，仅展示候选进程摘要，不自动终止进程。
- [x] 已补充资源栏 loading、error、notice 和最近操作空态。
- [x] 已将首页业务接口默认后端改为 `http://10.0.78.12:8000`，并在 Vite proxy 中将 `/api/home`、`/api/system`、`/api/activity`、`/api/local-tools` 指向业务后端，避免落到 AI/chat 后端 `8765`。
- [x] 已将资源概览和最近操作拆分为独立加载；最近操作接口 404 不再阻断资源概览展示。

## 验证记录

- 2026-07-15：运行 `pnpm run typecheck`，首次发现新版磁盘 DTO 没有 `name` 字段，修正磁盘 Tab key 后重新运行通过。
- 2026-07-15：检查 `LocalResourcePopover` 与 `homeApi`，确认资源概览、最近操作、缓存清理、可清理进程列表均通过 `homeApi` 调用。
- 2026-07-15：根据 404 反馈，修正 `homeApi` 默认 base 和 Vite 代理目标后，再次运行 `pnpm run typecheck` 通过。
- 2026-07-15：只读探测 `http://10.0.78.12:8000/api/system/resources` 返回 200；`/api/activity/recent` 和 `/api/home/workbench` 返回 404；`/openapi.json` 中当前仅暴露 `/api/system/resources`、`/api/system/cache/cleanup`、`/api/system/processes`、`/api/system/processes/terminate` 等系统接口，未暴露最近操作和首页工作台接口。
- 2026-07-15：将 `LocalResourcePopover` 改为资源概览、最近操作分别处理；最近操作未开放时展示空态提示，资源概览继续显示。运行 `pnpm run typecheck` 通过。
- 2026-07-15：未启动前端服务，未连接真实后端人工验证。
