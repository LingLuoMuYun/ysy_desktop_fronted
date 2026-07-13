# Acceptance: prevent-assistant-model-mock-flash

## 验收结果

- [x] 静态检查确认 `SettingsPage` 不再从 `prototypeData` 初始化 AI 助手模型列表。
- [x] 静态检查确认加载中仍展示“正在加载 AI 助手模型...”。
- [x] 静态检查确认空列表仍展示“暂无模型配置，请添加模型。”。
- [x] `pnpm run typecheck` 通过。

## 未验证项

- [ ] 页面交互和真实接口加载效果待联调确认。
