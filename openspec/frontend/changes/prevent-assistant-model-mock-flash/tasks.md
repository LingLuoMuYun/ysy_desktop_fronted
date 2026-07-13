# Tasks: prevent-assistant-model-mock-flash

## 已完成任务

- [x] 阅读根级 AGENTS、前端 AGENTS、前端 Global Spec、Frontend Module Spec、PRD、开发规范和设置页相关代码。
- [x] 定位设置页 AI 助手模型列表闪现 mock 数据的原因。
- [x] 将 AI 助手模型列表和详情初始状态改为空结构。
- [x] 将组件类型从 mock 数据推导改为领域类型。

## 验证记录

- [x] `pnpm run typecheck`

## 待确认

- [ ] 真实后端接口失败时是否需要保留上一次成功缓存，当前实现不展示 mock fallback。
