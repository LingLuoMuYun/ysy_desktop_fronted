# frontend

React + Electron 桌面端代码目录。

## 职责

- Electron 主进程、预加载脚本和窗口生命周期。
- React 渲染进程页面、状态管理和组件。
- 调用后端受控 API，不直接执行本机高风险动作。
- 承载首页、项目、任务、数据、模型、设置和 AI 助手界面。

## 初始化前要求

- 先确认 Electron 构建、打包、自动更新和本机文件选择能力边界。
- 新增前端功能必须关联 `openspec/frontend/changes/<change-id>/`。

## 必读顺序

前端工作前按顺序读取（路径不存在时记录"未找到/待确认"，不要擅自补造）：

1. `README.md`
2. `docs/prd/V1.0 PRD.md`
3. `docs/development/openspec-workflow.md`
4. `docs/development/ai-coding-rules.md`
5. `openspec/frontend/global/global.spec.md`
6. `openspec/frontend/modules/frontend.spec.md`
7. 当前任务对应的 `openspec/frontend/changes/<change-id>/`
8. `frontend/README.md`
9. `frontend/AGENTS.md`
10. 用户本轮提供的接口文档、设计说明或验收记录
11. 相关前端代码和测试

## 源码结构

```text
frontend/
  src/
    app/                      # App 入口、路由配置
      App.tsx
      router.tsx
    layouts/                  # 布局组件
      AppShell.tsx            # 全局外壳（三栏 Grid、顶部栏、右侧栏宽度状态）
      Sidebar.tsx             # 左侧导航栏
      WindowTitleBar.tsx      # 统一顶部工具栏（首页资源入口 / 菜单页模块名）
      AssistantPanel.tsx      # 右侧 AI 助手面板（项目、任务、数据、模型、设置）
      LocalResourcePopover.tsx # 首页右侧本机资源概览面板
      AssistantPanelContext.tsx  # 助手面板状态上下文
    pages/                    # 页面组件
      HomePage.tsx            # 首页（居中 AI 输入 + 右侧资源概览入口）
      ProjectsPage.tsx        # 项目列表
      TasksPage.tsx           # 训练/部署任务列表
      DataPage.tsx            # 数据集列表
      ModelsPage.tsx          # 模型资产列表
      SettingsPage.tsx        # 环境/AI 助手/个人信息设置（含环境和模型详情页）
    components/               # 通用组件
      SidebarToggle.tsx       # 侧边栏收起/展开按钮（所有页面共享）
      StatusBadge.tsx         # 状态标签（支持 neutral/success/warning/danger/info 色调）
      Toolbar.tsx             # 工具栏
      EmptyState.tsx          # 空态占位
      ConfirmPlaceholder.tsx  # 高风险操作确认占位
      PromptToolbar.tsx       # AI 助手提示词工具栏
      PortalDropdown.tsx      # 门户下拉菜单
    features/                 # 业务 Feature（按领域划分子目录，当前为空壳）
      home/                   # 首页 feature（空）
      projects/               # 项目 feature（空）
      tasks/                  # 任务 feature（空）
      data/                   # 数据 feature（空）
      models/                 # 模型 feature（空）
      settings/               # 设置 feature（空，待从 SettingsPage 拆分）
    hooks/                    # 共享 Hooks（规划中）
    services/                 # API / IPC 服务层（规划中）
    stores/                   # 全局状态 Store（规划中）
    types/                    # TypeScript 类型定义
      domain.ts               # 核心领域类型（ProjectSummary, TaskSummary, RuntimeEnvironmentDetail,
                              #   AssistantModelDetail, EnvironmentCheckItem 等）
    mocks/                    # Mock 原型数据
      prototypeData.ts        # 环境列表/详情、模型列表/详情、项目等 mock 数据
    styles/                   # 全局样式与 CSS Token
      globals.css             # 全局样式（页面布局、设置详情页、组件样式）
      tokens.css              # 设计 Token（颜色、间距、字体等 CSS 自定义属性）
    main.tsx                  # 渲染入口
  electron/
    main/                     # Electron 主进程
      index.ts
      index.js
    preload/                  # 预加载脚本（规划中）
  scripts/
    run-electron-dev.cjs      # Electron 开发启动脚本
  index.html                  # HTML 入口
  vite.config.ts              # Vite 配置
  tsconfig.json               # TypeScript 配置
  package.json                # 前端依赖与脚本
```

## 前端 OpenSpec 入口

- 前端相关 OpenSpec 固定从 `openspec/frontend/` 读取。
- 前端全局规则：`openspec/frontend/global/global.spec.md`
- 前端模块规则：`openspec/frontend/modules/frontend.spec.md`
- 前端需求变更：`openspec/frontend/changes/<change-id>/`

## 当前 Change

### 页面框架

```text
openspec/frontend/changes/frontend-page-framework/
```

已实现六个一级页面的静态框架、mock 数据和视觉结构。

当前页面框架使用统一三栏布局：

- 左侧导航栏负责六个一级模块切换，可通过顶部栏按钮收起/展开。
- 中部工作区展示当前页面内容；项目、任务、数据、模型、设置页的重复页面标题已移到顶部栏，只保留页面操作区和业务内容。
- 右侧上下文栏由 `AppShell` 统一承载：首页显示本机资源概览，其他模块显示 AI 助手。
- 右侧上下文栏宽度可拖拽调整，当前范围为 `320px` 到 `460px`。
- 统一顶部栏在首页展示历史对话、新对话、打开位置和资源概览入口；在其他模块展示当前模块名和 AI 助手开关。

### 设置页面增强

```text
openspec/frontend/changes/improve-settings-page/
```

已实现设置页面增强功能：

- **环境详情页**：点击环境卡片切换到整页详情，展示基础信息（Python/CUDA/框架版本）、逐项检测结果（通过/未通过 + 详情）、使用建议。详情页隐藏顶部 Tab 和操作按钮，通过 X 按钮返回列表。
- **模型详情页**：点击 AI 助手模型卡片切换到整页详情，展示链接信息（API Base URL、模型标识、脱敏 API Key、连接状态指示灯）、生成参数（上下文长度、Temperature、超时、重试次数、默认模型标记）。
- **详情页样式**：模型图标渐变色（蓝/暖/深色系）、等宽字体展示技术值、API Key 脱敏背景、连接状态圆点指示器、布尔值 Pill 标签、信息区块白底卡片。
- **搜索过滤**：环境和模型列表均支持按名称/用途或厂商实时过滤，无匹配时展示空态提示。
- **操作按钮布局**：创建环境/添加模型、检测全部按钮移至顶部栏右侧。
- **类型定义**：新增 `RuntimeEnvironmentDetail`、`AssistantModelDetail`、`EnvironmentCheckItem` 类型，支持详情页数据。
- **QLoRA 环境状态**：修正为绿色"可用"标签。

### 响应式布局

```text
openspec/changes/improve-desktop-responsive-layout/
```

已实现：桌面视口断点、侧边栏收起/展开（含动画过渡）、统一顶部栏、可拉伸右侧上下文栏、内容区滚动隔离。

## 常用命令

```bash
pnpm install               # 安装依赖
pnpm run electron:dev      # 启动 Vite + Electron 桌面窗口
pnpm run dev               # 仅启动 Vite 开发服务器
pnpm run typecheck         # TypeScript 类型检查
pnpm run build             # 生产构建
pnpm run preview           # 预览生产构建
pnpm run electron:preview  # 构建后用 Electron 打开生产产物
```

| 命令 | 说明 | 端口 |
|------|------|------|
| `pnpm run electron:dev` | 启动 Vite 并打开 Electron 桌面窗口 | 5174 |
| `pnpm run dev` | Vite 开发服务器（HMR） | 5174 |
| `pnpm run build` | TypeScript 编译 + Vite 打包 | - |
| `pnpm run electron:preview` | 构建后用 Electron 打开生产产物 | - |
| `pnpm run preview` | 预览生产构建 | 4174 |
| `pnpm run typecheck` | TypeScript 类型检查 | - |

## Electron 桌面启动

开发桌面端时优先使用：

```bash
pnpm run electron:dev
```

该命令会启动 Vite 开发服务器，等待 `http://localhost:5174/` 可访问后拉起 Electron 窗口。

构建后用 Electron 预览生产产物：

```bash
pnpm run electron:preview
```

## 桌面壳约定

- Windows/macOS 使用系统原生标题栏。
- 不实现自绘最小化、最大化、关闭按钮。
- 初始最小窗口尺寸为 `1100x720`。
- 外部链接交给系统浏览器打开。
- `contextIsolation: true`，`nodeIntegration: false`，`sandbox: true`。

## Electron 下载问题

如果 Electron 下载缓慢或安装不完整，使用镜像重建：

```bash
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ pnpm rebuild electron
```

更多细节见 [Electron Setup](docs/electron-setup.md)。

## 安全规则

- preload 只通过 `contextBridge` 暴露最小 API，不暴露整个 `ipcRenderer`。
- 渲染进程不得直接访问 Node.js API、文件系统或子进程。
- IPC 通道使用 `namespace:action` 格式，如 `project:list`、`file:open-dialog`。
- 本地文件操作必须路径规范化和范围校验，防止路径穿越。
- 删除文件、覆盖配置、安装依赖、启动长任务等高风险动作必须用户确认。
- 禁止明文存储或输出 token、密码、API Key、secret 和敏感路径。
- 禁止直接使用 `dangerouslySetInnerHTML`；确需使用必须审批并 sanitize。
