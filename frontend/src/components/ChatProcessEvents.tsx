import { ChevronDown, Wrench } from "lucide-react";
import type { ChatProcessEvent, ChatProcessReasoningEvent, ChatProcessToolEvent } from "../services/chatApi";

interface ChatProcessEventsProps {
  events?: ChatProcessEvent[];
}

function getToolStatusText(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "running") return "运行中";
  if (normalized === "succeeded" || normalized === "success" || normalized === "completed") return "已完成";
  if (normalized === "failed" || normalized === "error") return "失败";
  return status;
}

function isReasoningEvent(event: ChatProcessEvent): event is ChatProcessReasoningEvent {
  return event.type === "reasoning";
}

function isToolEvent(event: ChatProcessEvent): event is ChatProcessToolEvent {
  return event.type === "tool";
}

export function ChatProcessEvents({ events = [] }: ChatProcessEventsProps) {
  const visibleEvents = events.filter((event) => {
    if (event.type === "tool") return true;
    return Boolean(event.content.trim() || event.done);
  });
  if (visibleEvents.length === 0) return null;

  const reasoningText = visibleEvents
    .filter(isReasoningEvent)
    .filter((event) => event.content.trim())
    .map((event) => event.content.trim().replace(/\s+/g, " "))
    .join(" ");
  const toolEvents = visibleEvents.filter(isToolEvent);
  const toolCount = toolEvents.length;
  const titleParts = [
    reasoningText ? "思考过程" : "",
    toolCount > 0 ? `${toolCount} 次工具调用` : "",
  ].filter(Boolean);

  return (
    <details className="chat-process">
      <summary className="chat-process__summary">
        <ChevronDown size={13} />
        <span>{titleParts.length > 0 ? titleParts.join(" · ") : "处理过程"}</span>
      </summary>
      <div className="chat-process__body">
        {reasoningText ? (
          <div className="chat-process__item chat-process__item--reasoning">
            <span className="chat-process__label">思考过程</span>
            <span className="chat-process__text">{reasoningText}</span>
          </div>
        ) : null}
        {toolEvents.map((event, index) => {
          return (
            <div className="chat-process__item chat-process__item--tool" key={`tool-${event.call_id}-${event.sequence ?? index}`}>
              <span className="chat-process__label">
                <Wrench size={12} />
                {event.name}
              </span>
              <span className="chat-process__text">
                {getToolStatusText(event.status)}
                {event.summary ? ` · ${event.summary}` : ""}
                {event.duration_ms != null ? ` · ${event.duration_ms}ms` : ""}
              </span>
              {event.detail ? <span className="chat-process__detail">{event.detail}</span> : null}
            </div>
          );
        })}
      </div>
    </details>
  );
}
