# Acceptance: fix-electron-dev-node24-windows

## 验收环境

- 日期：2026-07-13
- 操作系统：Windows
- Node.js：v22.23.1
- pnpm：11.10.0
- 目标问题：Node.js v24.18.0 在 Windows 上直接 `spawn()` `.CMD/.cmd` 文件触发 `EINVAL`

## 验收记录

- [x] `frontend/scripts/run-electron-dev.cjs` 不再直接调用 `node_modules/.bin/vite.cmd`。
- [x] Windows 下通过 `process.execPath` 执行 `node_modules/vite/bin/vite.js`。
- [x] macOS / Linux 保留直接执行 Vite JS 入口的路径。
- [x] `frontend/README.md` 已记录 Node.js v24.18.0 / Windows `.cmd` 兼容性说明。
- [x] `node --check scripts/run-electron-dev.cjs` 通过。
- [x] `pnpm install` 通过。
- [x] `pnpm run typecheck` 通过。
- [x] `pnpm run build` 通过。
- [x] `pnpm run electron:dev` 成功启动 Vite 开发服务器并保持运行。

```text
pnpm run electron:dev:
  VITE v7.3.6 ready in 581 ms
  Local:   http://localhost:5174/
  Network: http://10.0.26.225:5174/
```

## 说明

`electron:dev` 验证完成后手动停止了 Vite / Electron 进程，因此最终 shell 会报手动终止产生的非零退出码；启动阶段未再出现 `.cmd` / `EINVAL` 问题。
