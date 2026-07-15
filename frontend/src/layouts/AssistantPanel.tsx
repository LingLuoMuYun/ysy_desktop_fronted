import { ArrowLeft, ArrowRight, Check, Copy, History, LoaderCircle, MessageSquarePlus, Pencil, RefreshCw, RotateCcw, SendHorizontal, Tag, Trash2, X } from "lucide-react";
import { getTimePeriod } from "../pages/HomePage";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { RouteKey } from "../app/router";
import {
  mapFilesToChatAttachments,
  MessageAttachmentList,
  SelectedAttachmentList,
  type ChatAttachment,
} from "../components/ChatAttachments";
import { ChatProcessEvents } from "../components/ChatProcessEvents";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { PromptToolbar, ProjectSelect } from "../components/PromptToolbar";
import { ScrollArea } from "../components/ScrollArea";
import { useAssistantPanel, type PanelMessage } from "./AssistantPanelContext";

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
  const [attachedFiles, setAttachedFiles] = useState<ChatAttachment[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const {
    messages,
    conversations,
    activeConversationId,
    activeConversationTitle,
    selectConversation,
    sendMessage,
    editLatestUserMessage,
    regenerateLatestAnswer,
    switchLatestCandidate,
    createConversation,
    renameConversation,
    deleteConversation,
    isStreaming,
    currentModel,
  } = useAssistantPanel();
  const [editingMessageId, setEditingMessageId] = useState("");
  const [editingValue, setEditingValue] = useState("");
  const [regeneratingAssistantMessageId, setRegeneratingAssistantMessageId] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [contextMenu, setContextMenu] = useState<{
    conversationId: string;
    x: number;
    y: number;
  } | null>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const [headerRenaming, setHeaderRenaming] = useState(false);
  const [headerRenameValue, setHeaderRenameValue] = useState("");
  const headerRenameInputRef = useRef<HTMLInputElement>(null);
  const [headerContextMenu, setHeaderContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [displayedGreeting, setDisplayedGreeting] = useState("");
  const [greetingComplete, setGreetingComplete] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 首页不渲染此面板（首页用 HomePage 自己的对话 UI）
  if (activeRoute === "home") {
    return null;
  }

  const prompts = assistantPrompts[promptSetIndex];
  const hasMessages = messages.length > 0;
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");
  const latestAssistantMessage = [...messages].reverse().find((message) => message.role === "assistant");
  const panelTitle = hasMessages && activeConversationTitle ? activeConversationTitle : "新的对话";

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 打字机效果：空状态时逐字显示问候语
  useEffect(() => {
    if (hasMessages) return;

    const period = getTimePeriod();
    const fullText = `${period}好\n今天需要我做些什么？`;
    setDisplayedGreeting("");
    setGreetingComplete(false);

    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedGreeting(fullText.slice(0, index + 1));
        index++;
      } else {
        setGreetingComplete(true);
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [hasMessages]);

  const handleSend = async () => {
    const trimmed = draft.trim();
    if (!trimmed || isStreaming) return;
    const attachments = attachedFiles;
    setDraft("");
    setAttachedFiles([]);
    setHistoryOpen(false);
    await sendMessage(trimmed, attachments);
    textareaRef.current?.focus();
  };

  const handleFilesSelected = useCallback((files: File[]) => {
    setAttachedFiles(mapFilesToChatAttachments(files));
    textareaRef.current?.focus();
  }, []);

  const handleAttachmentsSelected = useCallback((attachments: ChatAttachment[]) => {
    setAttachedFiles(attachments);
    textareaRef.current?.focus();
  }, []);

  const handleRemoveAttachment = useCallback((indexToRemove: number) => {
    setAttachedFiles((current) => current.filter((_attachment, index) => index !== indexToRemove));
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStartEditMessage = (message: (typeof messages)[number]) => {
    setEditingMessageId(message.id);
    setEditingValue(message.text);
  };

  const handleCancelEditMessage = () => {
    setEditingMessageId("");
    setEditingValue("");
  };

  const handleSubmitEditMessage = async () => {
    const trimmed = editingValue.trim();
    if (!trimmed || isStreaming || regeneratingAssistantMessageId) return;
    const targetAssistantMessageId = latestAssistantMessage?.id ?? "";
    setRegeneratingAssistantMessageId(targetAssistantMessageId);
    setEditingMessageId("");
    setEditingValue("");
    try {
      await editLatestUserMessage(trimmed);
    } finally {
      setRegeneratingAssistantMessageId("");
    }
  };

  const handleRegenerateLatestAnswer = async () => {
    if (isStreaming || regeneratingAssistantMessageId) return;
    const targetAssistantMessageId = latestAssistantMessage?.id ?? "";
    setRegeneratingAssistantMessageId(targetAssistantMessageId);
    try {
      await regenerateLatestAnswer();
    } finally {
      setRegeneratingAssistantMessageId("");
    }
  };

  const handleCopyMessage = (message: PanelMessage) => {
    void navigator.clipboard.writeText(message.text).then(() => {
      setCopiedMessageId(message.id);
      setTimeout(() => setCopiedMessageId(""), 2000);
    });
  };

  // 进入重命名模式时自动聚焦并全选
  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const handleStartRename = useCallback((conversationId: string, title: string) => {
    setRenamingId(conversationId);
    setRenameValue(title);
    setContextMenu(null);
  }, []);

  const handleSubmitRename = useCallback(() => {
    if (renamingId && renameValue.trim()) {
      renameConversation(renamingId, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue("");
  }, [renamingId, renameValue, renameConversation]);

  const handleCancelRename = useCallback(() => {
    setRenamingId(null);
    setRenameValue("");
  }, []);

  const handleRenameKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmitRename();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleCancelRename();
      }
    },
    [handleSubmitRename, handleCancelRename],
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, conversationId: string) => {
      e.preventDefault();
      setContextMenu({ conversationId, x: e.clientX, y: e.clientY });
    },
    [],
  );

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleCloseHeaderContextMenu = useCallback(() => {
    setHeaderContextMenu(null);
  }, []);

  // 面板标题重命名
  useEffect(() => {
    if (headerRenaming && headerRenameInputRef.current) {
      headerRenameInputRef.current.focus();
      headerRenameInputRef.current.select();
    }
  }, [headerRenaming]);

  const handleHeaderStartRename = useCallback(() => {
    setHeaderRenaming(true);
    setHeaderRenameValue(panelTitle);
    setHeaderContextMenu(null);
  }, [panelTitle]);

  const handleHeaderSubmitRename = useCallback(() => {
    if (headerRenameValue.trim() && activeConversationId) {
      renameConversation(activeConversationId, headerRenameValue.trim());
    }
    setHeaderRenaming(false);
    setHeaderRenameValue("");
  }, [headerRenameValue, activeConversationId, renameConversation]);

  const handleHeaderCancelRename = useCallback(() => {
    setHeaderRenaming(false);
    setHeaderRenameValue("");
  }, []);

  const handleHeaderRenameKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleHeaderSubmitRename();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleHeaderCancelRename();
      }
    },
    [handleHeaderSubmitRename, handleHeaderCancelRename],
  );

  const handleSwitchAdjacentCandidate = (message: (typeof messages)[number], direction: -1 | 1) => {
    if (!message.candidates) return;
    const activeIndex = message.candidates.findIndex((candidate) => candidate.active);
    if (activeIndex < 0) return;
    const nextCandidate = message.candidates[activeIndex + direction];
    if (!nextCandidate) return;
    void switchLatestCandidate(nextCandidate.id);
  };

  const sendButton = (
    <button
      className={`send-button${draft.trim() && !isStreaming ? " send-button--active" : ""}`}
      disabled={!draft.trim() || isStreaming}
      type="button"
      title="发送"
      onClick={handleSend}
    >
      <SendHorizontal size={17} />
    </button>
  );

  return (
    <aside className="assistant-panel" aria-label="AI 助手">
      <div className="assistant-header">
        <div className="assistant-header__title-row">
          {headerRenaming ? (
            <div className="assistant-header__rename">
              <input
                ref={headerRenameInputRef}
                className="assistant-header__rename-input"
                value={headerRenameValue}
                onChange={(e) => setHeaderRenameValue(e.target.value)}
                onKeyDown={handleHeaderRenameKeyDown}
                onBlur={handleHeaderSubmitRename}
                placeholder="输入新名称"
              />
              <button
                className="assistant-header__rename-confirm"
                type="button"
                title="确认"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleHeaderSubmitRename();
                }}
              >
                <Check size={13} />
              </button>
              <button
                className="assistant-header__rename-cancel"
                type="button"
                title="取消"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleHeaderCancelRename();
                }}
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            <strong
              title="双击或右键重命名"
              onDoubleClick={handleHeaderStartRename}
              onContextMenu={(e) => {
                e.preventDefault();
                setHeaderContextMenu({ x: e.clientX, y: e.clientY });
              }}
            >
              {panelTitle}
            </strong>
          )}
        </div>
        <div className="assistant-header__tools">
          <button
            type="button"
            title="标注（暂未实现）"
            aria-label="标注"
          >
            <Tag size={14} />
          </button>
          <button
            type="button"
            title="历史对话"
            aria-pressed={historyOpen}
            onClick={() => setHistoryOpen((open) => !open)}
          >
            <History size={14} />
          </button>
          <button
            type="button"
            title="新建对话"
            onClick={() => {
              setHistoryOpen(false);
              createConversation();
            }}
            disabled={isStreaming}
          >
            <MessageSquarePlus size={14} />
          </button>
        </div>
      </div>

      {historyOpen ? (
        <div className="assistant-history" aria-label="历史对话">
          <div className="assistant-history__title">历史对话</div>
          {conversations.length > 0 ? (
            <ScrollArea className="assistant-history__list" aria-label="AI 助手历史对话列表">
              {conversations.map((conversation) => (
                <div
                  className={`assistant-history__item${
                    conversation.id === activeConversationId ? " assistant-history__item--active" : ""
                  }${renamingId === conversation.id ? " assistant-history__item--renaming" : ""}`}
                  key={conversation.id}
                  onContextMenu={(e) => handleContextMenu(e, conversation.id)}
                >
                  {renamingId === conversation.id ? (
                    <div className="assistant-history__rename">
                      <input
                        ref={renameInputRef}
                        className="assistant-history__rename-input"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={handleRenameKeyDown}
                        onBlur={handleSubmitRename}
                        placeholder="输入新名称"
                      />
                      <button
                        className="assistant-history__rename-confirm"
                        type="button"
                        title="确认"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSubmitRename();
                        }}
                      >
                        <Check size={13} />
                      </button>
                      <button
                        className="assistant-history__rename-cancel"
                        type="button"
                        title="取消"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleCancelRename();
                        }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="assistant-history__item-main"
                      type="button"
                      onClick={() => {
                        selectConversation(conversation.id);
                        setHistoryOpen(false);
                      }}
                      onDoubleClick={() => handleStartRename(conversation.id, conversation.title)}
                      title="双击重命名"
                    >
                      <span>{conversation.title}</span>
                      <time>{conversation.updatedAt}</time>
                    </button>
                  )}
                </div>
              ))}
            </ScrollArea>
          ) : (
            <div className="assistant-history__empty">暂无历史对话</div>
          )}
        </div>
      ) : null}

      {hasMessages ? (
        <ScrollArea className="assistant-messages" aria-live="polite">
          {messages.map((msg) => (
            <article
              className={`chat-message chat-message--${msg.role}${
                msg.id === regeneratingAssistantMessageId ? " chat-message--regenerating" : ""
              }`}
              key={msg.id}
            >
              <div className="chat-message__bubble">
                <MessageAttachmentList attachments={msg.attachments} />
                {msg.role === "assistant" ? <ChatProcessEvents events={msg.processEvents} /> : null}
                {editingMessageId === msg.id ? (
                  <div className="chat-message__edit">
                    <textarea
                      aria-label="编辑消息"
                      onChange={(event) => setEditingValue(event.target.value)}
                      rows={3}
                      value={editingValue}
                    />
                    <div className="chat-message__edit-actions">
                      <button type="button" onClick={handleCancelEditMessage}>
                        取消
                      </button>
                      <button
                        className="chat-message__action-primary"
                        disabled={!editingValue.trim() || isStreaming}
                        type="button"
                        onClick={() => void handleSubmitEditMessage()}
                      >
                        <Check size={13} />
                        保存并重新生成
                      </button>
                    </div>
                  </div>
                ) : msg.id === regeneratingAssistantMessageId ? (
                  <div className="chat-message__regenerating" aria-live="polite" role="status">
                    <LoaderCircle size={18} />
                    <span>生成中</span>
                  </div>
                ) : msg.text ? (
                  <div className="chat-message__content-wrap">
                    <div className="chat-message__content">
                      <MarkdownRenderer
                        content={msg.text}
                        isStreaming={
                          isStreaming &&
                          msg.role === "assistant" &&
                          msg.id === messages[messages.length - 1]?.id
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="chat-message__streaming">
                    <span className="chat-message__streaming-dot" />
                    <span className="chat-message__streaming-dot" />
                    <span className="chat-message__streaming-dot" />
                  </div>
                )}
                {msg.role === "assistant" && msg.candidates && msg.candidates.length > 1 ? (
                  <div className="chat-message__candidate-switch" aria-label="回答候选版本">
                    <button
                      disabled={isStreaming || msg.candidates.findIndex((candidate) => candidate.active) <= 0}
                      type="button"
                      aria-label="上一个回答版本"
                      onClick={() => handleSwitchAdjacentCandidate(msg, -1)}
                    >
                      <ArrowLeft size={13} />
                    </button>
                    <span>
                      {(msg.candidates.findIndex((candidate) => candidate.active) + 1) || 1}/{msg.candidates.length}
                    </span>
                    <button
                      disabled={
                        isStreaming ||
                        msg.candidates.findIndex((candidate) => candidate.active) >= msg.candidates.length - 1
                      }
                      type="button"
                      aria-label="下一个回答版本"
                      onClick={() => handleSwitchAdjacentCandidate(msg, 1)}
                    >
                      <ArrowRight size={13} />
                    </button>
                  </div>
                ) : null}
              </div>
              <div className="chat-message__meta">
                <time>{msg.time}</time>
                <div className="chat-message__actions">
                  {msg.role === "user" && msg.id === latestUserMessage?.id ? (
                    <button
                      disabled={isStreaming}
                      type="button"
                      onClick={() => handleStartEditMessage(msg)}
                    >
                      <Pencil size={13} />
                      编辑
                    </button>
                  ) : null}
                  {msg.role === "assistant" ? (
                    <button
                      disabled={!msg.text || isStreaming}
                      type="button"
                      onClick={() => handleCopyMessage(msg)}
                    >
                      {copiedMessageId === msg.id ? (
                        <>
                          <Check size={13} />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          复制
                        </>
                      )}
                    </button>
                  ) : null}
                  {msg.role === "assistant" && msg.id === latestAssistantMessage?.id ? (
                    <button
                      disabled={isStreaming || Boolean(regeneratingAssistantMessageId)}
                      type="button"
                      onClick={() => void handleRegenerateLatestAnswer()}
                    >
                      <RotateCcw size={13} />
                      重新生成
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
      ) : (
        <>
          <div className="assistant-empty">
            {displayedGreeting.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 ? <br /> : null}
                {i === arr.length - 1 ? (
                  <span className={`typewriter-cursor${greetingComplete ? " typewriter-cursor--blink" : ""}`}>|</span>
                ) : null}
              </span>
            ))}
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
        </>
      )}

      <div className="assistant-composer">
        <SelectedAttachmentList
          attachments={attachedFiles}
          onRemove={handleRemoveAttachment}
          onAfterOpen={() => textareaRef.current?.focus()}
        />
        <textarea
          ref={textareaRef}
          aria-label="AI 助手输入"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isStreaming ? "AI 正在回复中..." : "随心输入"}
          value={draft}
          disabled={isStreaming}
        />
        <PromptToolbar
          className="assistant-composer__tools"
          sendButton={sendButton}
          onFilesSelected={handleFilesSelected}
          onAttachmentsSelected={handleAttachmentsSelected}
        />
        <ProjectSelect className="assistant-project" />
      </div>

      {/* 右键菜单 - 对话列表项 */}
      {contextMenu &&
        createPortal(
          <div
            className="context-menu-backdrop"
            onClick={handleCloseContextMenu}
            onContextMenu={(e) => {
              e.preventDefault();
              handleCloseContextMenu();
            }}
          >
            <div
              className="context-menu"
              style={{ left: contextMenu.x, top: contextMenu.y }}
              role="menu"
            >
              <button
                className="context-menu__item"
                type="button"
                role="menuitem"
                onClick={() => {
                  const conv = conversations.find((c) => c.id === contextMenu.conversationId);
                  if (conv) handleStartRename(conv.id, conv.title);
                }}
              >
                <Pencil size={13} />
                重命名
              </button>
              <button
                className="context-menu__item context-menu__item--danger"
                type="button"
                role="menuitem"
                onClick={() => {
                  deleteConversation(contextMenu.conversationId);
                  handleCloseContextMenu();
                }}
              >
                <Trash2 size={13} />
                删除
              </button>
            </div>
          </div>,
          document.body,
        )}

      {/* 右键菜单 - 面板标题 */}
      {headerContextMenu &&
        createPortal(
          <div
            className="context-menu-backdrop"
            onClick={handleCloseHeaderContextMenu}
            onContextMenu={(e) => {
              e.preventDefault();
              handleCloseHeaderContextMenu();
            }}
          >
            <div
              className="context-menu"
              style={{ left: headerContextMenu.x, top: headerContextMenu.y }}
              role="menu"
            >
              <button
                className="context-menu__item"
                type="button"
                role="menuitem"
                onClick={handleHeaderStartRename}
              >
                <Pencil size={13} />
                重命名
              </button>
            </div>
          </div>,
          document.body,
        )}
    </aside>
  );
}
