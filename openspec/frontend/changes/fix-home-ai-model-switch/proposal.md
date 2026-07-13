# 修复首页 AI 对话模型切换

## 背景

首页 AI 对话输入区已有模型选择入口，但用户切换模型后无法生效。现有实现中，模型选择器调用 `POST /api/runtime/model`，而运行模型接口按智能体接口文档返回 `{ ok: true, ... }`；前端复用了只接受 `{ success: true, data }` 的通用请求封装，导致后端切换成功也被前端判定为失败。

## 目标

- 修复运行模型切换接口响应适配，兼容智能体后端 `{ ok: true }` 响应。
- 首页与右侧 AI 助手共用同一运行模型状态，切换成功后更新当前模型。
- 切换失败时在模型下拉中展示可读错误，保留上一次可用模型。
- 在 `frontend/docs/` 记录本次问题原因、修复方案和验证结果。

## 非目标

- 不新增 AI 模型配置接口。
- 不修改后端运行模型接口契约。
- 不实现 `GET /api/runtime/model` 运行态查询。
- 不调整聊天会话持久化、停止生成、候选版本等能力。

## 影响范围

- `frontend/src/services/chatApi.ts`
- `frontend/src/components/PromptToolbar.tsx`
- `frontend/src/layouts/AssistantPanel.tsx`
- `frontend/docs/首页AI对话模型切换修复说明.md`

## 风险等级

低风险。该变更只影响前端 AI 对话模型切换与错误展示，不执行本机高风险动作，不传递 API Key、endpoint 或 provider 内部配置。

## 验收标准

- 模型选择器切换时只向 `/api/runtime/model` 发送 `modelConfigId`。
- 后端返回 `{ ok: true, modelConfigId: "..." }` 时前端判定成功，并更新当前模型显示。
- 后端返回 `{ ok: false, error: "..." }`、统一响应失败或 HTTP 失败时，前端展示失败原因并保留原当前模型。
- `pnpm run typecheck` 通过。
