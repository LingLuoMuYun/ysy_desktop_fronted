# Align Home API Docs To New Backend

## 背景

用户确认以后端新版接口文档为准，删除旧版口径。当前仓库内 `frontend/docs/后端接口文档.md` 和 `frontend/docs/前端接口替换文档v2.md` 的首页清理接口仍存在旧版 `cleanup/preview`、`cleanup` 描述，需要同步到新版后端接口文档。

## 目标

- 用用户提供的新版后端接口文档替换仓库内旧版后端接口文档。
- 将前端接口替换文档的首页章节同步到新版首页接口 1.1-1.7。
- 明确资源概览、最近操作、缓存清理、进程清理、本地工具打开的接口边界。

## 非目标

- 不实现首页接口代码接入。
- 不修改前端页面、样式或组件行为。
- 不验证真实后端接口可用性。
- 不修改 Global Spec 或 Module Spec。

## 影响范围

- `frontend/docs/后端接口文档.md`
- `frontend/docs/前端接口替换文档v2.md`

## 风险

- 新版首页清理接口涉及高风险动作，文档必须保留 `confirmed=true`、`Idempotency-Key` 和 `selectionToken` 约束，避免前端后续实现时绕过确认或自行构造 PID。

## 验收标准

- 仓库内后端接口文档已替换为新版。
- 前端接口替换文档首页接口清单不再引用旧版 `POST /api/system/cleanup/preview` 和 `POST /api/system/cleanup`。
- 首页接口索引数量与新版 1.1-1.7 一致。
