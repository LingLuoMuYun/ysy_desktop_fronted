# Proposal: auto-fill-model-provider-base-url

## 背景

设置页 AI 助手模型添加和编辑弹窗需要用户手动填写 Provider 与 API Base URL。常见模型厂商的默认 API Base URL 可由前端根据 Provider 自动带入，减少配置错误。

右侧 AI 助手和输入工具栏的模型选择菜单目前主要展示模型名称和厂商，文案需要与 Provider 概念保持一致。

## 目标

1. 添加模型和编辑模型时，用户输入已知 Provider 后自动填入对应 API Base URL。
2. Provider 仍保持用户可自由输入，不限制为固定枚举。
3. `custom` Provider 不自动提供默认 API Base URL。
4. 优化 AI 模型选择菜单的触发文案和下拉项描述，展示模型、Provider 和上下文长度。

## 非目标

- 不修改后端 AI 模型配置接口。
- 不新增 API Key 校验逻辑。
- 不改变模型连接测试、默认模型和运行时切换行为。
- 不把 Provider 改成强制选择框。

## 影响范围

- `frontend/src/pages/SettingsPage.tsx`
- `frontend/src/layouts/AssistantPanel.tsx`
- `frontend/src/components/PromptToolbar.tsx`

## 验收标准

- 添加模型弹窗输入 `deepseek` 时，API Base URL 自动填入 `https://api.deepseek.com`。
- 添加模型弹窗输入 `custom` 时，API Base URL 为空。
- 编辑模型弹窗修改 Provider 时，同步更新已知 Provider 的默认 API Base URL。
- 未知 Provider 不覆盖用户已填写的 API Base URL。
- AI 模型选择菜单展示“模型：...”触发文案，下拉项展示 Provider 和上下文长度。
- `pnpm run typecheck` 通过。
