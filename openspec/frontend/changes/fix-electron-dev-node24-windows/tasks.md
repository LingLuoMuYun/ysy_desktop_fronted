# Tasks: fix-electron-dev-node24-windows

## 任务清单

- [x] 创建 OpenSpec Change。
- [x] 分析 Windows + Node.js v24 下 `.cmd` spawn 失败根因。
- [x] 修改 `frontend/scripts/run-electron-dev.cjs`，避免直接执行 `.cmd`。
- [x] 更新 `frontend/README.md` Windows 兼容性说明。
- [x] 运行 `pnpm run typecheck`。
- [x] 运行 `pnpm run build`。
- [x] 运行或抽样验证 `pnpm run electron:dev`。
- [x] 运行 `node --check scripts/run-electron-dev.cjs`。
- [x] 记录最终验证结果。
