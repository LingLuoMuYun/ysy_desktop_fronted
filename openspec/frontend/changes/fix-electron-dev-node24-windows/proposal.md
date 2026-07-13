# Proposal: fix-electron-dev-node24-windows

## 背景

Windows 上使用 Node.js v24.18.0 运行 `pnpm run electron:dev` 时，开发启动脚本通过 `spawn()` 直接执行 `node_modules/.bin/vite.cmd` 会触发 `EINVAL`。测试显示同类 `.CMD/.cmd` 批处理文件在该 Node 版本下也会失败，而直接执行 `node.exe <vite.js>` 或通过 shell 包装可以正常启动。

## 目标

- 修复 Windows + Node.js v24 下 `pnpm run electron:dev` 无法启动 Vite 的问题。
- 开发脚本避免直接 `spawn()` `.cmd` / `.bat` 文件。
- 保持 macOS / Linux 启动方式兼容。
- 在前端 README 中记录该 Windows 兼容性处理，便于后续排障。

## 非目标

- 不调整运行时 Electron 主进程业务逻辑。
- 不更换包管理器或强制降级 Node.js。
- 不新增依赖。
- 不处理生产打包命令中的潜在平台差异。

## 影响范围

- `frontend/scripts/run-electron-dev.cjs`
- `frontend/README.md`
- 本 Change 记录

## 用户流程

1. 用户在 Windows 上安装依赖。
2. 用户执行 `pnpm run electron:dev`。
3. 脚本使用当前 Node 可执行文件启动 Vite JS 入口，等待开发服务器就绪。
4. 脚本再启动 Electron 桌面窗口。

## 风险

- Vite 包结构若未来改变，脚本中的 JS 入口路径需要同步调整。
- Electron GUI 启动验证依赖本机图形环境，自动化验证只能覆盖命令启动阶段。

## 验收标准

- Windows 下脚本不再直接 `spawn()` `.cmd` / `.bat`。
- `pnpm run typecheck` 通过。
- `pnpm run build` 通过。
- `pnpm run electron:dev` 至少能启动 Vite 开发服务器并进入 Electron 启动流程。
