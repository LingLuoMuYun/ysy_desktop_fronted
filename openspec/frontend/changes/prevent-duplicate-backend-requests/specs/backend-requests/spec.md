# Backend Requests Spec Delta

## ADDED Requirements

### Requirement: 前端不得在单轮聊天未完成前重复发送

首页和右侧 AI 助手必须在一轮聊天请求未完成前阻止同入口重复提交。

#### Scenario: 首页快速重复发送

- **Given** 用户在首页输入一条消息
- **When** 用户快速双击发送按钮或连续按 Enter
- **Then** 前端只应进入一次发送流程
- **And** 只应向聊天后端提交一轮 `/api/chat/stream`

#### Scenario: 右侧助手快速重复发送

- **Given** 用户在右侧助手输入一条消息
- **When** 用户快速双击发送按钮或连续按 Enter
- **Then** 前端只应进入一次发送流程

### Requirement: 异常恢复不得制造请求风暴

前端服务层在后端返回 5xx 或网络异常时不得通过大量自动分页、循环重试或未取消流式请求放大后端压力。

#### Scenario: 环境列表失败

- **Given** 环境列表接口返回 500
- **When** 前端加载设置页环境列表
- **Then** 前端应展示失败提示
- **And** 不应继续发起大量分页恢复请求
