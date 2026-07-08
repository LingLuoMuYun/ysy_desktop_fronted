# Acceptance: simplify-global-agents

## 验收环境

- 日期：2026-07-07
- 分支：当前工作区
- 操作系统：macOS

## 验收用例

- [x] 根目录 `AGENTS.md` 只保留全局协作规则，不再包含前端、后端、智能体详细实现要求。
- [x] 根目录 `AGENTS.md` 明确模块级 AGENTS 读取顺序。
- [x] `frontend/AGENTS.md` 整合根 `AGENTS.md` 中与前端相关的全局协作规则。
- [x] `frontend/AGENTS.md` 承载 React + Electron 前端规则，并吸收适合本项目的 Bulletproof React 工程实践。
- [x] `frontend/AGENTS.md` 行文已压缩为项目注意点、执行边界、架构、安全和验证要求。
- [x] `frontend/README.md` 和 `frontend/AGENTS.md` 明确前端 OpenSpec 从 `openspec/frontend/` 读取。
- [x] 本次不新增 `backend/AGENTS.md` 和 `agent/AGENTS.md`，后端与 AI 助手规则留给对应负责人维护。
- [x] 当前生效文档不再把 `apps/*` 作为主模块路径。
- [x] OpenSpec Module Spec 指向 `frontend/`、`backend/`、`agent/`。
- [x] 未确认前端工具链只标记为待确认，不作为默认技术事实。

## 测试结果

```text
test -f frontend/AGENTS.md and OpenSpec paths: passed.
test -d openspec/frontend and test -f openspec/frontend/modules/frontend.spec.md: passed.
test ! -f backend/AGENTS.md and test ! -f agent/AGENTS.md: passed.
rg apps/* in README.md, frontend/README.md, docs/development, docs/architecture, openspec/frontend/modules, frontend/AGENTS.md: no matches.
rg legacy PRD and stale project-state wording in current docs: no stale matches.
rg docs/specs in current docs: only "no longer used" notes remain.
wc -l frontend/AGENTS.md: 191 lines.
frontend/AGENTS.md keeps project notes, required reading, priority, collaboration boundary, OpenSpec flow, architecture, security, validation, and response rules.
git diff --check: passed.
```

## 遗留问题

- Vite、Tailwind、Radix、ShadCN、Storybook、Plop、Sentry、Husky、React Hook Form、Zod、`@/` 绝对导入等前端工具链仍待负责人确认。
