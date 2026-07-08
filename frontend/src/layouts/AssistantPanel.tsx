import { Bot, History, MessageSquarePlus, RefreshCw, SendHorizontal, Tag } from "lucide-react";
import { useState } from "react";
import type { RouteKey } from "../app/router";
import { PromptToolbar, ProjectSelect } from "../components/PromptToolbar";

interface AssistantPanelProps {
  activeRoute: RouteKey;
}

const assistantPrompts = [
  [
    "帮我检查当前项目的数据是否满足训练要求",
    "为什么今天 GPU 占用突然升高？",
    "把最近一次训练失败原因整理成修复计划",
  ],
  [
    "检查当前 CUDA 环境是否配置正确",
    "帮我配置 QLoRA 微调参数",
    "生成环境检查报告",
  ],
];

export function AssistantPanel({ activeRoute }: AssistantPanelProps) {
  const [promptSetIndex, setPromptSetIndex] = useState(0);
  const [draft, setDraft] = useState("");

  if (activeRoute === "home") {
    return null;
  }

  const prompts = assistantPrompts[promptSetIndex];

  const sendButton = (
    <button className="send-button" disabled={!draft.trim()} type="button" title="发送">
      <SendHorizontal size={17} />
    </button>
  );

  return (
    <aside className="assistant-panel" aria-label="AI 助手">
      <div className="assistant-header">
        <strong>新的对话</strong>
        <div className="assistant-header__tools">
          <button type="button" title="标注功能">
            <Tag size={14} />
          </button>
          <button type="button" title="历史对话">
            <History size={14} />
          </button>
          <button type="button" title="新建对话">
            <MessageSquarePlus size={14} />
          </button>
        </div>
      </div>
      <div className="assistant-empty">
        <span className="assistant-empty__icon" aria-hidden="true">
          <Bot size={17} />
        </span>
        <span>开始新的聊天</span>
      </div>
      <div className="assistant-suggestions">
        {prompts.map((prompt) => (
          <button key={prompt} onClick={() => setDraft(prompt)} type="button">
            {prompt}
          </button>
        ))}
        <button
          className="assistant-refresh"
          onClick={() => setPromptSetIndex((index) => (index + 1) % assistantPrompts.length)}
          type="button"
        >
          <RefreshCw size={13} />
          换一批
        </button>
      </div>
      <div className="assistant-composer">
        <textarea
          aria-label="AI 助手输入"
          onChange={(event) => setDraft(event.target.value)}
          placeholder="随心输入"
          value={draft}
        />
        <PromptToolbar
          className="assistant-composer__tools"
          sendButton={sendButton}
        />
        <ProjectSelect className="assistant-project" />
      </div>
    </aside>
  );
}
