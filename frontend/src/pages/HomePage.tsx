import { useCallback, useRef, useState } from "react";
import { ArrowUp, RefreshCw } from "lucide-react";
import { PromptToolbar, ProjectSelect } from "../components/PromptToolbar";
import { suggestionSets, type SuggestionItem } from "../mocks/prototypeData";

const CATEGORY_COLORS: Record<SuggestionItem["category"], string> = {
  数据: "#1f9d66",
  训练: "#3377ff",
  环境: "#b7791f",
  模型: "#8b5cf6",
  推理: "#e85d5d",
};

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
}

interface HomePageProps {
  onConversationTitleChange?: (title: string) => void;
}

function getCurrentTimeLabel() {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

function createAssistantReply(input: string) {
  if (input.length <= 8) {
    return "我先看了你的输入和当前上下文。建议从项目绑定、数据路径和运行环境三处开始确认，通常能最快定位问题。";
  }

  return "我已经收到你的需求。接下来可以先确认关联项目、输入数据和运行环境，再拆成可执行步骤；如果你愿意，我可以继续帮你整理成任务计划。";
}

export function HomePage({ onConversationTitleChange }: HomePageProps = {}) {
  const [inputValue, setInputValue] = useState("");
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentSuggestions = suggestionSets[currentSetIndex];
  const isChatting = messages.length > 0;

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const time = getCurrentTimeLabel();
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
      time,
    };
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      text: createAssistantReply(trimmed),
      time,
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    onConversationTitleChange?.(trimmed.slice(0, 18));
    setInputValue("");
    textareaRef.current?.focus();
  }, [inputValue, onConversationTitleChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleSuggestionClick = useCallback((text: string) => {
    setInputValue(text);
    textareaRef.current?.focus();
  }, []);

  const handleRefreshSuggestions = useCallback(() => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentSetIndex((prev) => (prev + 1) % suggestionSets.length);
      setIsFading(false);
    }, 200);
  }, []);

  const sendButton = (
    <button
      className={`send-button${inputValue.trim() ? " send-button--active" : ""}`}
      type="button"
      title="发送"
      onClick={handleSend}
      disabled={!inputValue.trim()}
    >
      <ArrowUp size={18} />
    </button>
  );

  return (
    <section className={`home-page${isChatting ? " home-page--chat" : ""}`}>
      {!isChatting ? (
        <div className="home-center">
          <h1>今天想让这台机器帮你做什么？</h1>

          {/* 对话框 */}
          <div className="prompt-box">
            <textarea
              ref={textareaRef}
              className="prompt-input"
              placeholder="随心输入，描述你想做的事情..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />

            <PromptToolbar sendButton={sendButton} />

            <ProjectSelect />
          </div>

          {/* 推荐词盒子 */}
          <div className={`suggestion-list${isFading ? " suggestion-list--fading" : ""}`}>
            {currentSuggestions.map((item) => (
              <button
                className="suggestion-bubble"
                key={item.id}
                type="button"
                onClick={() => handleSuggestionClick(item.text)}
                title={`点击填入：${item.text}`}
              >
                <span
                  className="suggestion-category"
                  style={{ color: CATEGORY_COLORS[item.category] }}
                >
                  {item.category}
                </span>
                <span className="suggestion-text">{item.text}</span>
              </button>
            ))}
            <button
              className="suggestion-refresh"
              type="button"
              onClick={handleRefreshSuggestions}
              title="换一批推荐"
            >
              <RefreshCw size={14} />
              换一批
            </button>
          </div>
        </div>
      ) : (
        <div className="home-chat">
          <div className="home-chat__messages" aria-live="polite">
            {messages.map((message) => (
              <article
                className={`chat-message chat-message--${message.role}`}
                key={message.id}
              >
                <div className="chat-message__bubble">{message.text}</div>
                <time>{message.time}</time>
              </article>
            ))}
          </div>

          <div className="chat-composer">
            <div className="prompt-box prompt-box--chat">
              <textarea
                ref={textareaRef}
                className="prompt-input prompt-input--chat"
                placeholder="随心输入"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <PromptToolbar sendButton={sendButton} className="prompt-tools prompt-tools--chat" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
