# 设计说明

## 审查发现

### 聊天编辑占位函数双请求

`editLatestMessage()` 当前实现先调用 `sendMessageStream("__EDIT_LATEST__", conversationId)`，随后又调用 `sendMessage(newMessage, conversationId)`。第一条流式请求没有被读取、取消或返回给调用方，可能让后端持续保持生成任务。

处理方式：移除第一条流式请求。由于当前 UI 未接入编辑最新消息能力，保留函数导出但降级为普通发送，避免隐藏双请求风险。

### 聊天入口重复发送窗口

首页和右侧助手都使用 `isStreaming` state 判断是否可发送。React state 更新是异步的，用户双击按钮或回车连发时，第二次调用可能仍读取到旧的 `false` 值。

处理方式：为两个入口增加 `sendInFlightRef` 同步锁，进入发送逻辑时立即置位，`finally` 释放。

### 环境列表恢复逻辑请求风暴

`recoverEnvironmentList()` 会在列表接口返回 500 时，最多尝试 200 个分页请求，每次 `pageSize=1`。当后端已经异常时，这种恢复会显著放大后端压力。

处理方式：移除恢复逻辑。列表接口失败时直接抛错，由页面展示失败信息。已有 `environmentListRequests` in-flight 去重保留，用于合并并发列表请求。

## 接口变化

无接口变化。

## 验证

- 静态检查：`pnpm run typecheck`。
- 人工审查：检查聊天发送入口、聊天服务函数和环境列表服务层不再存在主动重复请求路径。
