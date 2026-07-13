# 首页 AI 对话模型切换修复说明

## 问题现象

首页 AI 对话输入区可以打开模型下拉，也能点击模型项，但切换后不会生效，用户侧表现为模型选择功能不可用。

## 根因

`POST /api/runtime/model` 属于智能体运行时接口，接口文档约定返回：

```json
{
  "ok": true,
  "modelConfigId": "..."
}
```

旧实现复用了设置页模型配置接口的统一响应解析，只接受：

```json
{
  "success": true,
  "data": {}
}
```

因此，即使后端运行模型切换成功，前端仍会把响应判定为失败。首页工具栏捕获失败后只写入 `console.warn`，没有展示错误，导致用户看到“切换无效”。

## 修复内容

- `frontend/src/services/chatApi.ts`
  - 为运行模型切换新增专用响应适配。
  - 兼容智能体接口 `{ ok: true }` 和统一响应 `{ success: true, data }`。
  - 失败时读取 `{ error }` 或 HTTP 状态，返回可读错误。

- `frontend/src/components/PromptToolbar.tsx`
  - 首页与聊天输入区模型选择失败时，在下拉框内展示错误。
  - 切换失败时保留上一次当前模型。

- `frontend/src/layouts/AssistantPanel.tsx`
  - 右侧 AI 助手模型选择失败时展示错误。
  - 不再静默吞掉切换失败。

## 验收口径

- 前端切换模型时只提交 `modelConfigId`，不传 API Key、endpoint 或 provider 内部配置。
- 后端返回 `{ ok: true, modelConfigId }` 时，当前模型显示更新。
- 后端返回 `{ ok: false, error }` 或 HTTP 失败时，下拉框展示失败原因，并保留原模型。
- 本次未新增 `GET /api/runtime/model`，首次进入仍按默认模型或模型列表首项推断运行态。

## 验证记录

- 已通过：`.\node_modules\.bin\tsc.cmd -b`。
- 未完成：`pnpm run typecheck`，pnpm 在非 TTY 下尝试清理/重建 `node_modules` 并中止。
- 未验证：未连接真实智能体后端做 Electron 端到端切换。
