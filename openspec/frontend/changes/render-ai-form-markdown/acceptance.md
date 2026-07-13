# 验收记录

## 验收项

- `json` / `form` / `schema` 代码块包含 `fields` 时展示为只读表单。
- 动作建议 JSON 包含 `payload` 时展示为只读表单草稿。
- 普通代码块仍展示为代码块。
- TypeScript 检查通过。

## 结果

- 已在 `MarkdownRenderer` 中增加结构化代码块识别：`json` / `form` / `schema` 代码块包含 `fields`、`form.fields` 或动作建议 `payload` 时，渲染为只读表单预览。
- 普通代码块仍回退到原 `pre/code` 渲染。
- 已补充 `.ai-form-preview` 样式。
- `node_modules\.bin\tsc.cmd -b` 通过。

## 未验证

- 未启动 Vite / Electron 做真实 AI 对话视觉验证。
