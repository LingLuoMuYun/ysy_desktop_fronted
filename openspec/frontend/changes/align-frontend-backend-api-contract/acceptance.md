# Acceptance

- [x] 已创建 OpenSpec Change，覆盖后端接口对齐目标。
- [x] 已根据用户确认收敛为项目模块优先。
- [x] 已记录全部以后端新版项目接口为准。
- [x] 已记录项目编辑保留但暂不处理。
- [x] 已记录项目列表分页规则：每页 5 个项目，底部展示当前页、总页数和总项目数。
- [x] 已记录项目工作区提交前必须调用路径校验接口。
- [x] 已记录项目编辑入口预留空按钮。
- [x] 已记录项目详情关联数据、任务、模型 Tab 保留空态。
- [x] 已明确当前阶段不接入项目外模块功能代码。
- [x] 完成项目模块剩余问题确认。
- [x] 根据确认结果完成项目模块代码接入。
- [x] 项目列表改为调用 `GET /api/projects`，筛选、搜索、分页提交后端参数。
- [x] 项目创建接入 `GET /api/projects/specs`、`POST /api/local-files/validate-path` 和 `POST /api/projects`。
- [x] 项目详情接入 `GET /api/projects/{projectId}`，关联数据、任务、模型区域保留空态。
- [x] 项目删除接入 `DELETE /api/projects/{projectId}`，请求体固定 `confirmed=true`、`deleteLocalFiles=false`。

## 验证记录

- 2026-07-15：读取 `docs/development/openspec-workflow.md`、`openspec/README.md`、`openspec/frontend/modules/backend.spec.md`。
- 2026-07-15：读取 `C:\Users\idr\Downloads\后端接口文档.md` 的章节目录，确认新版后端文档覆盖 0-10 章。
- 2026-07-15：本次只创建 OpenSpec 提问优化文档，未修改前端代码，未验证真实接口。
- 2026-07-15：根据用户确认，将当前执行范围收敛为项目模块；项目接口全部以后端新版为准；项目编辑保留但暂不处理。
- 2026-07-15：根据用户确认，项目列表采用分页展示，每页 5 个项目，底部展示当前页、总页数和总项目数。
- 2026-07-15：根据用户确认，项目工作区提交前必须调用路径校验接口，项目编辑入口预留空按钮，项目详情关联 Tab 保留空态。
- 2026-07-15：新增 `frontend/src/services/projectsApi.ts`，统一解析项目接口响应包裹并映射项目状态展示。
- 2026-07-15：项目页已替换 mock 列表，接入项目列表、规格、创建、详情、删除和路径校验接口；未接入任务、数据、模型列表接口。
- 2026-07-15：运行 `pnpm run typecheck` 通过；未启动开发服务器，未连接真实后端做浏览器或接口联调验证。
