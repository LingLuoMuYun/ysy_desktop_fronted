import { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";

// --- 对话共享状态类型 ---
export type AssistMode = "readonly" | "assist" | "confirm";
export type ModelOption = "deepseek" | "qwen" | "openai";

interface DialogState {
  assistMode: AssistMode;
  modelOption: ModelOption;
  selectedProject: string;
  setAssistMode: (mode: AssistMode) => void;
  setModelOption: (model: ModelOption) => void;
  setSelectedProject: (project: string) => void;
}

// --- 面板 UI 状态 ---
interface AssistantPanelContextValue extends DialogState {
  assistantOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  toggleAssistant: () => void;
}

const AssistantPanelContext = createContext<AssistantPanelContextValue>({
  assistantOpen: true,
  sidebarCollapsed: false,
  toggleSidebar: () => undefined,
  toggleAssistant: () => undefined,
  assistMode: "assist",
  modelOption: "deepseek",
  selectedProject: "none",
  setAssistMode: () => undefined,
  setModelOption: () => undefined,
  setSelectedProject: () => undefined,
});

export function AssistantPanelProvider({
  children,
  assistantOpen,
  sidebarCollapsed,
  toggleSidebar,
  toggleAssistant,
}: {
  children: ReactNode;
  assistantOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  toggleAssistant: () => void;
}) {
  // 对话共享状态 —— 由 Provider 托管，跨页面保持
  const [assistMode, setAssistMode] = useState<AssistMode>("assist");
  const [modelOption, setModelOption] = useState<ModelOption>("deepseek");
  const [selectedProject, setSelectedProject] = useState("none");

  const value = useMemo<AssistantPanelContextValue>(
    () => ({
      assistantOpen,
      sidebarCollapsed,
      toggleSidebar,
      toggleAssistant,
      assistMode,
      modelOption,
      selectedProject,
      setAssistMode,
      setModelOption,
      setSelectedProject,
    }),
    [assistantOpen, sidebarCollapsed, toggleSidebar, toggleAssistant, assistMode, modelOption, selectedProject],
  );

  return <AssistantPanelContext.Provider value={value}>{children}</AssistantPanelContext.Provider>;
}

export function useAssistantPanel() {
  return useContext(AssistantPanelContext);
}
