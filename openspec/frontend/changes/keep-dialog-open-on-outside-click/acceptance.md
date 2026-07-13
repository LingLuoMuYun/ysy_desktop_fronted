# Acceptance

## 验收记录

- 2026-07-13：运行 `pnpm run typecheck`，通过。
- 2026-07-13：静态检查设置页弹窗遮罩层，确认 `env-create-overlay`、`model-edit-overlay`、`confirm-overlay` 不再绑定点击关闭处理。

## 未验证

- 未启动 Electron 或浏览器进行手动点击验证。

## 待确认

- 是否需要把键盘 `Escape` 关闭也统一禁用。本次仅按需求处理鼠标点击弹窗外不退出。
