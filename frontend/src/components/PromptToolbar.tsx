import { useState } from "react";
import {
  CheckCircle,
  ChevronDown,
  Cpu,
  Eye,
  FilePenLine,
  Globe,
  Lightbulb,
  Paperclip,
  Plus,
  Zap,
} from "lucide-react";
import type { AssistMode, ModelOption } from "../layouts/AssistantPanelContext";
import { useAssistantPanel } from "../layouts/AssistantPanelContext";
import { PortalDropdown } from "./PortalDropdown";
import type { ReactNode } from "react";

// --- 选项配置 ---
const ASSIST_OPTIONS: { key: AssistMode; label: string; desc: string; icon: typeof Eye }[] = [
  { key: "readonly", label: "只读建议", desc: "AI 只能分析与解释", icon: Eye },
  { key: "assist", label: "辅助填写", desc: "AI 可生成方案", icon: FilePenLine },
  { key: "confirm", label: "确认后执行", desc: "高风险操作仍需确认", icon: CheckCircle },
];

const MODEL_OPTIONS: { key: ModelOption; label: string; icon: typeof Cpu }[] = [
  { key: "deepseek", label: "DeepSeek V4", icon: Cpu },
  { key: "qwen", label: "本地 Qwen", icon: Cpu },
  { key: "openai", label: "OpenAI 兼容", icon: Globe },
];

const PLUS_OPTIONS: { key: string; label: string; icon: typeof Paperclip }[] = [
  { key: "upload", label: "上传附件", icon: Paperclip },
  { key: "plan", label: "Plan 模式", icon: Lightbulb },
  { key: "skills", label: "Skills", icon: Zap },
];

const PROJECT_OPTIONS = [
  { key: "none", label: "不关联" },
  { key: "defect", label: "工业缺陷检测" },
  { key: "support", label: "客服问答 SFT" },
  { key: "embedding", label: "本地 Embedding 评估" },
];

// --- Props ---
interface PromptToolbarProps {
  sendButton?: ReactNode;
  className?: string;
  plusClassName?: string;
  assistClassName?: string;
  modelClassName?: string;
}

// --- 工具栏 ---
export function PromptToolbar({
  sendButton,
  className,
  plusClassName,
  assistClassName,
  modelClassName,
}: PromptToolbarProps) {
  const { assistMode, setAssistMode, modelOption, setModelOption } = useAssistantPanel();
  const [openMenu, setOpenMenu] = useState<"plus" | "assist" | "model" | null>(null);

  const activeAssist = ASSIST_OPTIONS.find((o) => o.key === assistMode)!;
  const activeModel = MODEL_OPTIONS.find((o) => o.key === modelOption)!;

  return (
    <div className={className || "prompt-tools"}>
      {/* +号 */}
      <PortalDropdown
        open={openMenu === "plus"}
        onClose={() => setOpenMenu(null)}
        align="left"
        menuClassName="prompt-dropdown"
        trigger={
          <button
            className={`round-button${openMenu === "plus" ? " round-button--active" : ""}${plusClassName ? ` ${plusClassName}` : ""}`}
            type="button"
            title="更多选项"
            onClick={() => setOpenMenu(openMenu === "plus" ? null : "plus")}
          >
            <Plus size={20} />
          </button>
        }
      >
        {PLUS_OPTIONS.map((opt) => (
          <button
            className="prompt-dropdown__item"
            type="button"
            key={opt.key}
            onClick={() => setOpenMenu(null)}
          >
            <opt.icon size={15} className="prompt-dropdown__item-icon" />
            <span>{opt.label}</span>
          </button>
        ))}
      </PortalDropdown>

      {/* 辅助填写 */}
      <PortalDropdown
        open={openMenu === "assist"}
        onClose={() => setOpenMenu(null)}
        align="left"
        menuClassName="prompt-dropdown prompt-dropdown--assist"
        trigger={
          <button
            className={`prompt-select${openMenu === "assist" ? " prompt-select--open" : ""}${assistClassName ? ` ${assistClassName}` : ""}`}
            type="button"
            onClick={() => setOpenMenu(openMenu === "assist" ? null : "assist")}
          >
            {activeAssist.label}
            <ChevronDown size={14} />
          </button>
        }
      >
        {ASSIST_OPTIONS.map((opt) => (
          <button
            className={`prompt-dropdown__item${opt.key === assistMode ? " prompt-dropdown__item--active" : ""}`}
            type="button"
            key={opt.key}
            onClick={() => {
              setAssistMode(opt.key);
              setOpenMenu(null);
            }}
          >
            <opt.icon size={15} className="prompt-dropdown__item-icon" />
            <div className="prompt-dropdown__item-text">
              <span className="prompt-dropdown__item-label">{opt.label}</span>
              <span className="prompt-dropdown__item-desc">{opt.desc}</span>
            </div>
            {opt.key === assistMode && <span className="prompt-dropdown__check" />}
          </button>
        ))}
      </PortalDropdown>

      {/* 模型选择 */}
      <PortalDropdown
        open={openMenu === "model"}
        onClose={() => setOpenMenu(null)}
        align="right"
        menuClassName="prompt-dropdown prompt-dropdown--model"
        trigger={
          <button
            className={`prompt-select prompt-select--model${openMenu === "model" ? " prompt-select--open" : ""}${modelClassName ? ` ${modelClassName}` : ""}`}
            type="button"
            onClick={() => setOpenMenu(openMenu === "model" ? null : "model")}
          >
            {activeModel.label}
            <ChevronDown size={14} />
          </button>
        }
      >
        {MODEL_OPTIONS.map((opt) => (
          <button
            className={`prompt-dropdown__item${opt.key === modelOption ? " prompt-dropdown__item--active" : ""}`}
            type="button"
            key={opt.key}
            onClick={() => {
              setModelOption(opt.key);
              setOpenMenu(null);
            }}
          >
            <opt.icon size={15} className="prompt-dropdown__item-icon" />
            <span>{opt.label}</span>
            {opt.key === modelOption && <span className="prompt-dropdown__check" />}
          </button>
        ))}
      </PortalDropdown>

      {sendButton}
    </div>
  );
}

// --- 项目选择器 ---
export function ProjectSelect({ className }: { className?: string }) {
  const { selectedProject, setSelectedProject } = useAssistantPanel();
  const [open, setOpen] = useState(false);

  return (
    <div className={className || "prompt-project"}>
      项目：
      <PortalDropdown
        open={open}
        onClose={() => setOpen(false)}
        align="left"
        menuClassName="prompt-dropdown prompt-dropdown--project"
        trigger={
          <button
            type="button"
            className={`prompt-project__select${open ? " prompt-select--open" : ""}`}
            onClick={() => setOpen((v) => !v)}
          >
            {PROJECT_OPTIONS.find((p) => p.key === selectedProject)?.label ?? "不关联"}
            <ChevronDown size={13} />
          </button>
        }
      >
        {PROJECT_OPTIONS.map((proj) => (
          <button
            className={`prompt-dropdown__item${proj.key === selectedProject ? " prompt-dropdown__item--active" : ""}`}
            type="button"
            key={proj.key}
            onClick={() => {
              setSelectedProject(proj.key);
              setOpen(false);
            }}
          >
            <span>{proj.label}</span>
            {proj.key === selectedProject && <span className="prompt-dropdown__check" />}
          </button>
        ))}
      </PortalDropdown>
    </div>
  );
}
