# Acceptance: share-home-assistant-conversation

## 2026-07-13

- 已将 `AppShell` 托管的当前会话消息、历史会话列表、当前会话 ID、新建会话和选择会话动作注入 `AssistantPanelProvider`。
- 已将右侧 `AssistantPanel` 的消息展示、发送、新建对话和历史按钮接入共享会话状态。
- 已在侧栏内新增历史会话列表样式，选择历史会话后切换到同一份当前会话。
- 已运行 `pnpm run typecheck`，TypeScript 检查通过。

## 未验证

- 未启动 Vite / Electron 做跨页面真实点击和视觉验证。
- 未连接真实 AI 后端验证流式回复内容；本次只验证前端状态连通和类型检查。
