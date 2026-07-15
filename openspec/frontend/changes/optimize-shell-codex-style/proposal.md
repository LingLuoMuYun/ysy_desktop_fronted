# 优化主界面工具栏与左侧标签页样式

## 背景

当前主界面顶部工具栏和左侧导航偏传统管理后台风格。用户要求参考 Codex 界面，提升工具栏与左侧标签页的轻量感、层次和选中态辨识度。

## 目标

- 优化统一顶部栏的背景、边界、按钮和模块标题样式。
- 优化左侧导航的背景、品牌入口、标签页间距、悬浮态和选中态。
- 强化首页 AI 对话工作区与左侧选择菜单、顶部功能栏、历史栏和右侧资源栏之间的视觉分界，主内容区采用纯白圆角面板。
- 将 Windows 自定义标题栏右上角窗口控制从 Electron 原生 overlay 切换为应用内按钮，并与顶部栏其他图标按钮使用一致样式。
- 保持现有布局结构、路由、按钮行为和响应式收起逻辑不变。

## 非目标

- 不新增一级模块。
- 不调整业务接口、AI 助手行为或本机高风险动作。
- 不修改窗口控制、对话历史栏、右侧上下文栏的功能逻辑。

## 影响模块

- 前端全局布局样式：`frontend/src/styles/globals.css`
- Windows 标题栏拖拽与窗口控制区样式：`frontend/src/styles/windowControls.css`
- 窗口控制 IPC 暴露：`frontend/electron/preload/index.ts`、`frontend/electron/preload/index.js`、`frontend/electron/preload/index.cjs`、`frontend/src/types/ysyDesktop.d.ts`
- Electron 窗口标题栏 overlay 配置：`frontend/electron/main/index.ts`、`frontend/electron/main/index.js`
- 顶部栏新增 Windows 窗口控制按钮，左侧导航的现有组件结构保持不变。

## 验收标准

- 顶部栏呈现更接近 Codex 的浅色磨砂、紧凑按钮和弱分割线风格。
- 左侧导航呈现窄栏、圆角标签、左侧选中指示和更清晰的 hover / active 状态。
- 首页 AI 对话区域与左侧菜单、顶部功能栏、对话历史栏、右侧资源栏之间存在常态可见的清晰边界；左侧栏和顶部栏保持同色一体，不互相显示分割线。
- Windows 右上角最小化、最大化/还原、关闭按钮由应用内按钮承载，不单独形成控制区，视觉上与顶部栏其他图标按钮保持一致。
- 1280px、1120px、960px 以下现有响应式规则仍可工作。
- TypeScript 类型检查通过或记录未通过原因。
