# Acceptance: match-attachment-file-types

## 2026-07-13

- 已将 Electron 附件选择器从仅文件扩展为文件/文件夹多选，并返回 `kind` 标记。
- 已扩展首页附件类型匹配：文件夹、Markdown、代码/脚本、数据、文档、图片、压缩包、模型文件等类型会显示对应短标签。
- 已补充不同附件类型的图标色调；未识别扩展名继续显示默认 `FILE`。
- 已运行 `pnpm run typecheck`，TypeScript 检查通过。

## 未验证

- 未启动 Vite / Electron 做真实选择文件夹和视觉截图复验。
