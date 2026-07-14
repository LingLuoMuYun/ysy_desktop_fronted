# 验收记录

## 2026-07-14

- 已将用户提供的 9 个厂商图标复制到 `frontend/src/assets/vendor-icons/`。
- 已新增 `ModelVendorAvatar`，按模型厂商展示对应图片头像。
- 已适配模型管理列表卡片、模型详情摘要、模型编辑摘要。
- 已设置未匹配厂商兜底为原有 Bot 渐变头像。
- 验证：在 `frontend/` 执行 `pnpm run typecheck`，通过。

未验证：未启动 Electron 窗口做视觉截图确认。
