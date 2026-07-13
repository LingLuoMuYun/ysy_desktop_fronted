# Proposal: simplify-global-agents

## 背景

根目录 `AGENTS.md` 之前同时承担全局协作协议和前端、后端、AI 助手实现细则，内容过重。后续各模块可分别维护模块级 `AGENTS.md`，因此根文件应只保留项目级规则。本次仅补充前端方向的模块级规则。

## 目标

- 将根目录 `AGENTS.md` 精简为全局 AI 协作协议。
- 明确模块级 AGENTS 读取顺序。
- 创建 `frontend/AGENTS.md`，整合根 `AGENTS.md` 中与前端工作相关的全局协作规则，并承载 React + Electron 实现规则。
- 明确前端 OpenSpec 入口为 `openspec/frontend/`，调取前端 spec 时必须到 `/Users/lingluo/Desktop/ysy_desktop-main/openspec/frontend/` 查找。
- 将当前模块主路径统一为 `frontend/`、`backend/`、`agent/`。
- 更新当前生效文档和 Module Spec 中仍指向 `apps/*` 的路径。
- 吸收 Bulletproof React 中适合本项目前端的工程实践，并保留 React + Electron、本地执行和 AI 动作边界。

## 非目标

- 不修改模块代码。
- 不创建 `backend/AGENTS.md` 或 `agent/AGENTS.md`；后端和 AI 助手模块规则由对应负责人后续维护。
- 不处理用户当前未提交的模块目录改动。
- 不直接引入或确认 Vite、Tailwind、Radix、ShadCN、Storybook、Plop、Sentry、Husky、React Hook Form、Zod 等未定技术选型。

## 影响范围

- 全局 AI 协作规则：`AGENTS.md`。
- 前端模块级 AI 协作规则：`frontend/AGENTS.md`，包含从根 `AGENTS.md` 合并来的前端相关全局规则。
- 前端 OpenSpec 读取规则：`openspec/frontend/global/`、`openspec/frontend/modules/`、`openspec/frontend/changes/`。
- 开发文档和架构文档：模块路径和职责描述。
- OpenSpec Module Spec：模块路径。
- OpenSpec Change：记录本次治理变更。

## 风险

- 模块级规则与根规则、Module Spec 发生冲突时，必须按优先级回退到 OpenSpec 和根协作规则，并记录为“待确认”。
- 前端工程实践只作为本地化约束写入，不能被误解为已确认具体工具链。
