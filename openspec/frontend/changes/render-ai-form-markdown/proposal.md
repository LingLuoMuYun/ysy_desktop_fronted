# 优化 AI 对话表单 Markdown 渲染

## 背景

AI 对话目前通过 `MarkdownRenderer` 渲染回复。AI 生成表单草稿或动作建议时，结构化内容常以 JSON 代码块展示，用户看到的是代码而不是可读的表单预览。

`frontend/docs/AI对话与智能体接口替换详解.md` 要求 AI 动作建议结构化协议未稳定前，前端不得把自由文本解析为可执行动作；因此本次只做只读表单预览，不提交、不写入业务表单、不调用接口。

## 目标

- 识别 `json`、`form`、`schema` 代码块中的表单结构并渲染为只读表单预览。
- 支持 `fields` 数组、`form.fields` 和动作建议 `payload` 的基础预览。
- 首页和右侧 AI 助手复用同一 Markdown 渲染能力。
- 普通代码块保持原代码高亮展示。

## 非目标

- 不启用真实 AI 结构化动作执行。
- 不从自由文本中推断业务动作。
- 不提交表单、不调用业务接口、不修改本地状态。
- 不新增 YAML 解析依赖。

## 影响范围

- `frontend/src/components/MarkdownRenderer.tsx`
- `frontend/src/styles/globals.css`

## 风险等级

低风险。该变更仅影响前端展示层，将可识别结构渲染为只读表单预览，不执行本机动作，不修改 API、IPC 或数据模型。

## 验收标准

- `json` / `form` / `schema` 代码块包含 `fields` 时展示为只读表单。
- 动作建议 JSON 包含 `payload` 时展示为只读表单草稿。
- 普通代码块仍展示为代码块。
- TypeScript 检查通过。
