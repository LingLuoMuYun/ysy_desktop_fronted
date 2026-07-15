# Acceptance

- [x] 已将 `frontend/docs/后端接口文档.md` 替换为用户提供的新版后端接口文档。
- [x] 已将 `frontend/docs/前端接口替换文档v2.md` 首页接口清单同步为新版 1.1-1.7。
- [x] 已移除首页替换清单中的旧版清理预览和旧版清理执行接口。
- [x] 已补充新版缓存清理与进程清理的确认、幂等键和选择 token 约束。

## 验证记录

- 2026-07-15：用用户提供的 `C:\Users\idr\Downloads\后端接口文档 (1).md` 替换仓库内 `frontend/docs/后端接口文档.md`。
- 2026-07-15：检查 `frontend/docs/后端接口文档.md`，确认首页章节包含新版 1.1-1.7：`/api/home/workbench`、`/api/system/resources`、`/api/activity/recent`、`/api/system/cache/cleanup`、`/api/system/processes`、`/api/system/processes/terminate`、`/api/local-tools/open`。
- 2026-07-15：检查 `frontend/docs/前端接口替换文档v2.md`，确认首页后续 API 替换点和接口索引已同步为新版 1.1-1.7。
- 2026-07-15：检查旧接口字符串；`frontend/docs/前端接口替换文档v2.md` 不再将 `POST /api/system/cleanup/preview` 和 `POST /api/system/cleanup` 列为首页替换接口。新版后端文档中仅在“已删除接口”说明处保留旧接口名。
- 2026-07-15：未修改功能代码，未验证真实后端接口。
