# AI 对话流式输出优化技术报告

## 1. 背景

本次优化针对首页和右侧 AI 助手在对话过程中出现的“AI 回复重复输出两次”问题。用户提供的参考文件 `C:\Users\idr\Downloads\index.html` 展示了一套独立聊天页实现，其中对流式 `delta`、最终 `done.reply`、会话刷新和后台事件去重都有单独处理。结合当前项目的 `frontend/src/services/chatApi.ts`、`HomePage.tsx` 和 `AssistantPanelContext.tsx` 分析后，确认问题主要来自前端对流式事件语义的处理不够稳健。

本次变更已按 OpenSpec 流程新增：

```text
openspec/frontend/changes/optimize-ai-chat-stream/
```

对应提交：

```text
3f2b366 fix(frontend): optimize ai chat streaming output
```

## 2. 问题现象

用户在 AI 对话中发送消息后，前端会逐步显示 AI 回复。但在某些后端返回模式下，最终界面可能出现同一段 AI 回复重复一遍，表现类似：

```text
这是第一段回复内容。这是第一段回复内容。
```

该问题可能出现在：

- 首页居中 AI 对话区域。
- 非首页右侧 AI 助手面板。

## 3. 根因分析

### 3.1 delta 与 done.reply 混用风险

智能体接口文档约定 `/api/chat/stream` 返回 `application/x-ndjson`，常见事件包括：

- `delta`：流式文本片段。
- `reasoning`：推理过程片段。
- `done`：本轮结束，`done.reply` 为最终回复。
- `error`：流式中断或业务失败。

旧逻辑在服务层持续累加 `delta.content`，并在 `done.reply` 与已累加内容不完全相同时替换为 `done.reply`。这个方向接近正确，但首页 UI 层最终没有使用 `chatApi.sendMessage()` 返回的 `result.reply`，仍保留自己累加的 `replyText`。因此服务层即便已经校准最终文本，首页仍可能显示 UI 层错误累加后的内容。

### 3.2 后端 delta 语义可能不一致

理想情况下，`delta.content` 是纯增量，例如：

```text
你
好
呀
```

但部分运行时或中间层可能返回累计快照，例如：

```text
你
你好
你好呀
```

旧逻辑直接拼接所有 `delta.content`，会得到：

```text
你你好你好呀
```

这类错误在视觉上也会被用户感知为“重复输出”。

### 3.3 UI 渲染直接跟随网络 chunk

旧逻辑每收到一个网络 chunk 就立即更新 React 状态。这样会带来两个问题：

- 网络 chunk 频率不稳定，显示节奏忽快忽慢。
- 完成、失败或组件卸载时没有统一 flush 机制，存在尾部文本残留到下一轮的风险。

## 4. 实现方案

### 4.1 服务层统一归一化流式文本

修改文件：

```text
frontend/src/services/chatApi.ts
```

新增 `StreamAccumulator`，集中维护当前 assistant 草稿：

```ts
interface StreamAccumulator {
  text: string;
  lastSequence: number | null;
}
```

新增 `normalizeStreamDelta()`，负责把后端事件规整为“真正新增的文本”：

- 如果 `sequence` 回退或重复，忽略该事件。
- 如果 `content` 以当前全文开头，判定为累计快照，只追加后缀。
- 如果当前全文已经以 `content` 结尾，判定为重复 delta，忽略。
- 其他情况按纯增量追加。

处理示例：

| 后端 delta | 前端实际追加 |
|---|---|
| `你` | `你` |
| `你好` | `好` |
| `你好呀` | `呀` |

最终显示：

```text
你好呀
```

### 4.2 done.reply 作为最终权威文本

`done.reply` 是接口定义中的最终回复。本次实现将其作为最终权威文本：

```ts
function resolveFinalReply(streamText: string, finalReply: string) {
  return finalReply || streamText;
}
```

这样可以避免两类问题：

- 已流式输出的草稿如果因 delta 语义异常产生重复，最终会被 `done.reply` 校准。
- `done.reply` 不会被当作新的 delta 再追加一次。

### 4.3 增加 error 事件处理

旧类型只覆盖 `delta`、`reasoning`、`done`。本次新增：

```ts
export interface ChatStreamError {
  type: "error";
  ok?: false;
  error?: string;
  message?: string;
}
```

当流中出现 `error` 时，服务层直接抛出业务错误，由 UI 层展示失败消息，避免把错误文本混入正常 assistant 回复。

### 4.4 新增打字机缓冲 Hook

新增文件：

```text
frontend/src/hooks/useTypewriterStream.ts
```

该 Hook 提供三个方法：

- `enqueue(text)`：将规范化后的 delta 放入缓冲区。
- `flush()`：立即输出剩余缓冲，通常在 done/error/finally 时调用。
- `reset()`：新一轮开始前清理旧缓冲。

核心目标：

- 让 UI 以稳定节奏显示文字。
- 网络 chunk 不再直接决定显示节奏。
- 完成或失败时不丢尾字。
- 新一轮对话不会继承上一轮残留文本。

### 4.5 首页对话接入最终回复校准

修改文件：

```text
frontend/src/pages/HomePage.tsx
```

旧逻辑：

- UI 自己维护 `replyText += delta`。
- `chatApi.sendMessage()` 返回后，不使用 `result.reply`。

新逻辑：

- 新一轮开始时 `typewriter.reset()`。
- 每个规范 delta 进入 `typewriter.enqueue(delta)`。
- 收到最终结果后先 `typewriter.flush()`。
- 使用 `result.reply` 更新最终 assistant 消息。

这样首页显示链路变为：

```text
后端事件 -> chatApi 归一化 -> 打字机缓冲 -> UI 草稿 -> done.reply 最终校准
```

### 4.6 右侧 AI 助手接入同一机制

修改文件：

```text
frontend/src/layouts/AssistantPanelContext.tsx
```

右侧助手之前也直接把 `delta` 追加到最后一条 assistant 消息：

```ts
text: last.text + delta
```

本次改为复用 `useTypewriterStream()`，并在最终态使用 `result.reply` 校准，避免首页和右侧助手出现两套不一致的流式行为。

## 5. 关键文件清单

| 文件 | 作用 |
|---|---|
| `frontend/src/services/chatApi.ts` | 统一解析 `/api/chat/stream`，归一化 delta，处理 done/error |
| `frontend/src/hooks/useTypewriterStream.ts` | 提供可 reset/flush 的打字机缓冲 |
| `frontend/src/pages/HomePage.tsx` | 首页 AI 对话接入打字机和最终回复校准 |
| `frontend/src/layouts/AssistantPanelContext.tsx` | 右侧 AI 助手接入同一流式展示机制 |
| `openspec/frontend/changes/optimize-ai-chat-stream/` | 本次 OpenSpec 变更说明、设计和验收记录 |

## 6. 验证结果

已执行：

```bash
cd frontend
pnpm run typecheck
```

结果：

```text
通过
```

已复查：

- `delta` 只向 UI 派发规范化后的新增文本。
- `done.reply` 作为最终权威文本校准。
- 首页和右侧助手均在新一轮开始前 reset，在完成或失败时 flush。
- 本次 commit 未包含已有的 `frontend/AGENTS.md` 用户侧修改。

未验证：

- 未启动 Electron 或浏览器连接真实 AI 后端进行端到端流式视觉验证。
- 未验证后端后台事件流 `/api/events` 与主动对话流同时存在时的会话刷新行为。

## 7. 后续建议

1. 使用真实智能体后端联调以下场景：
   - 正常增量 delta。
   - 累计快照式 delta。
   - 重复 sequence 或 sequence 回退。
   - 流中 `error`。
   - `done.reply` 与流式草稿不一致。

2. 后续引入测试框架后，建议为 `normalizeStreamDelta()` 补充单元测试。

3. 如果后端能稳定保证 `delta` 永远是纯增量，也建议保留当前防御逻辑，因为它可以兼容代理层、重连和运行时差异。

4. 后续接入编辑、重新生成、候选版本切换时，应复用当前流式归一化与打字机缓冲，不再在页面组件里直接拼接文本。
