# Tasks: auto-fill-model-provider-base-url

## 已完成任务

- [x] 阅读前端 Global Spec、Frontend Module Spec、PRD、设置页相关 Change 和现有代码。
- [x] 新增 Provider 到默认 API Base URL 的前端映射。
- [x] 添加模型弹窗改为用户填写 Provider，并提供 datalist 候选。
- [x] 添加模型弹窗在 Provider 命中已知值时自动填入 API Base URL，`custom` 清空默认值。
- [x] 编辑模型弹窗复用同一 Provider 自动填充逻辑。
- [x] 优化右侧 AI 助手模型选择菜单文案。
- [x] 优化输入工具栏模型选择菜单文案。
- [x] 优化右侧 AI 助手和输入工具栏模型选择菜单样式，限制宽高、稳定长文本布局并突出当前选中项。
- [x] 模型选择列表使用 `useMemo` 缓存可选模型计算，减少输入区重渲染时的重复过滤。
- [x] Provider 候选 datalist 改为弹窗级渲染，避免字段组件重复生成候选节点。

## 验证记录

- [x] `pnpm run typecheck`
- [x] `pnpm run build`（沙箱内 esbuild spawn EPERM；已获准在沙箱外重跑，通过，Vite 提示 chunk > 500 kB）

## 待确认

- [ ] 是否需要把 Provider 默认 URL 映射下沉到共享契约或后端配置。
