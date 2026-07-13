# 任务清单

- [x] 审查聊天、模型、环境服务层和关键页面调用点。
- [x] 创建 OpenSpec Change。
- [x] 修复聊天编辑占位函数双请求问题。
- [x] 为首页和右侧助手发送入口增加同步 in-flight 锁。
- [x] 移除环境列表 500 恢复分页请求风暴。
- [x] 运行 TypeScript 类型检查。
- [x] 更新验收记录。
- [x] 提交 git commit。

## 验收记录

- 2026-07-13：执行 `pnpm run typecheck`，通过。
- 2026-07-13：复查聊天服务层，`editLatestMessage()` 不再创建未消费的流式请求。
- 2026-07-13：复查首页与右侧助手发送入口，均增加 `sendInFlightRef` 同步锁，阻止 React state 生效前的重复提交窗口。
- 2026-07-13：复查环境服务层，移除环境列表 500 后最多 200 次分页恢复请求，保留列表请求 in-flight 合并。
- 2026-07-13：提交并推送到 `LingLuoMuYun/ysy_desktop_frontend`。
