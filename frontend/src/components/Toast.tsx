import { CheckCircle2, Copy, X, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ToastTone = "success" | "danger";

interface ToastProps {
  message: string;
  tone: ToastTone;
  onClose: () => void;
  /** 自动消失毫秒数，默认 5000 */
  duration?: number;
}

/**
 * 浮动通知横幅。悬浮时点击可复制报错信息，方便人员定位和反馈问题。
 * 5 秒后自动消失；鼠标移入时暂停倒计时，移出后恢复。
 */
export function Toast({ message, tone, onClose, duration = 5000 }: ToastProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expiresAtRef = useRef(Date.now() + duration);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const resumeTimer = () => {
    clearTimer();
    const remaining = Math.max(0, expiresAtRef.current - Date.now());
    if (remaining <= 0) {
      onClose();
      return;
    }
    timerRef.current = setTimeout(onClose, remaining);
  };

  // 组件挂载时启动倒计时
  useEffect(() => {
    resumeTimer();
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseEnter = () => {
    clearTimer();
  };

  const handleMouseLeave = () => {
    resumeTimer();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API 不可用时静默失败
    }
  };

  const icon = tone === "success" ? <CheckCircle2 size={15} /> : <XCircle size={15} />;
  const copyLabel = copied ? "已复制!" : "点击复制错误信息";

  return (
    <div
      className={`settings-toast${tone === "success" ? " settings-toast--success" : ""}${copied ? " toast--copied" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="settings-toast__copy-area"
        onClick={handleCopy}
        type="button"
        title={copyLabel}
        aria-label={copyLabel}
      >
        <div className="settings-toast__content">
          {icon}
          <span>{message}</span>
        </div>
        <span className="settings-toast__copy-hint">
          {copied ? (
            <>
              <CheckCircle2 size={12} />
              已复制
            </>
          ) : (
            <>
              <Copy size={12} />
              点击复制
            </>
          )}
        </span>
      </button>
      <button
        className="settings-toast__close"
        onClick={onClose}
        type="button"
        title="关闭"
      >
        <X size={14} />
      </button>
    </div>
  );
}
