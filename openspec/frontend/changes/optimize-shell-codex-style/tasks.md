# Tasks

- [x] 创建前端 OpenSpec Change，说明样式优化范围和验收标准。
- [x] 调整顶部工具栏与按钮视觉样式。
- [x] 调整左侧导航标签页、品牌入口与选中态样式。
- [x] 强化首页 AI 对话工作区与左侧菜单、顶部功能栏、历史栏、右侧资源栏之间的分界线。
- [x] 将 Windows 窗口控制区从原生 overlay 切换为应用内按钮，并接入受控 IPC。
- [x] 运行前端静态验证并记录结果。

## 验收记录

- `pnpm run typecheck`：通过。
- `pnpm run build`：通过；沙箱内因 Vite/esbuild 子进程 `spawn EPERM` 失败，按权限流程在沙箱外重跑通过。构建输出保留 Vite 默认 chunk size warning。
- 窗口控制区调整后复跑 `pnpm run typecheck` 和 `pnpm run build`：均通过。
- 切换为应用内自定义窗口控制按钮后复跑 `pnpm run typecheck` 和 `pnpm run build`：均通过；构建仍需在沙箱外运行，输出保留 Vite 默认 chunk size warning。
- 窗口控制按钮改为与其他顶部栏图标按钮一致后复跑 `pnpm run typecheck` 和 `pnpm run build`：均通过；构建仍需在沙箱外运行，输出保留 Vite 默认 chunk size warning。
- 2026-07-15：按用户要求仅优化样式，未修改内容和布局；左侧菜单、顶部功能按钮、首页 AI 对话页视觉状态已补充更清晰的背景、边框、阴影、hover / active / focus 质感。`frontend-design` 技能未能安装：openai/skills curated 列表未找到该技能，本机 skills 目录也未找到同名技能。
- 2026-07-15：本次样式优化后复跑 `pnpm run typecheck`：通过。
- 未启动开发服务器做浏览器截图验证：项目 `dev` 脚本使用 `--host 0.0.0.0`，未在用户确认前暴露本地服务端口。
- 2026-07-15：按用户要求继续优化首页 homepage 边界；左侧菜单、顶部功能栏、首页 AI 对话工作区、对话历史栏和右侧资源栏补充常态可见分界线，未修改功能逻辑。
- 2026-07-15：本次首页边界优化后复跑 `pnpm run typecheck`：通过。
- 2026-07-15：按用户反馈调整边界层级；左侧栏和顶部栏保持一体化，不显示互相切割的边界，仅强化主内容区与导航/顶部外壳之间的分界。
- 2026-07-15：左侧栏/顶部栏一体化调整后复跑 `pnpm run typecheck`：通过。
- 2026-07-15：按参考图一调整 homepage 视觉；左侧栏和顶部栏统一为同一外壳底色，主对话/页面内容区改为纯白圆角面板，面板自身边框承担外壳与内容区分界。
- 2026-07-15：参考图一视觉调整后复跑 `pnpm run typecheck`：通过。
- 2026-07-15：按反馈消除主内容面板左上角尖锐交点；侧栏分界线从圆角下方开始，主面板左上圆角增大。
- 2026-07-15：消除尖锐角后复跑 `pnpm run typecheck`：通过。
