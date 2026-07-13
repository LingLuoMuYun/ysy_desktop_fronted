# 验收记录

## 验收项

- [x] 已确认问题根因：运行模型接口返回 `{ ok: true }`，旧前端 adapter 只接受 `{ success: true, data }`。
- [x] 已修复运行模型接口 adapter，切换成功后按返回的 `modelConfigId` 或请求 ID 更新当前模型。
- [x] 已补充模型选择器失败提示，失败时不清空当前模型。
- [x] `.\node_modules\.bin\tsc.cmd -b` 通过。

## 未验证

- 未连接真实智能体后端执行浏览器/Electron 端到端切换验证。
- `pnpm run typecheck` 未完成：pnpm 在非 TTY 下尝试清理/重建 `node_modules`，被 `[ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY]` 中止；已改用本地 `tsc -b` 验证。
