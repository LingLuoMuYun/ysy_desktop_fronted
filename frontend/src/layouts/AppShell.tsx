import type { CSSProperties, ReactElement, ReactNode } from "react";
import { cloneElement, isValidElement, useCallback, useEffect, useState } from "react";
import type { RouteKey } from "../app/router";
import { AssistantPanel } from "./AssistantPanel";
import { AssistantPanelProvider } from "./AssistantPanelContext";
import { LocalResourcePopover } from "./LocalResourcePopover";
import { Sidebar } from "./Sidebar";
import { WindowTitleBar } from "./WindowTitleBar";

interface AppShellProps {
  activeRoute: RouteKey;
  children: ReactNode;
  onRouteChange: (routeKey: RouteKey) => void;
}

const DEFAULT_RIGHT_PANEL_WIDTH = 354;
const MIN_RIGHT_PANEL_WIDTH = 320;
const MAX_RIGHT_PANEL_WIDTH = 460;
const ROUTE_LABELS: Record<RouteKey, string> = {
  home: "首页",
  projects: "项目",
  tasks: "任务",
  data: "数据",
  models: "模型",
  settings: "设置",
};

export function AppShell({ activeRoute, children, onRouteChange }: AppShellProps) {
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [resourceOverviewOpen, setResourceOverviewOpen] = useState(false);
  const [homeConversationTitle, setHomeConversationTitle] = useState("");
  const [rightPanelWidth, setRightPanelWidth] = useState(DEFAULT_RIGHT_PANEL_WIDTH);
  const isHome = activeRoute === "home";
  const moduleLabel = isHome ? homeConversationTitle || ROUTE_LABELS.home : ROUTE_LABELS[activeRoute];
  const showAssistant = activeRoute !== "home" && assistantOpen;
  const showRightPanel = isHome ? resourceOverviewOpen : showAssistant;
  const showGridAssistant = showAssistant;
  const shellStyle = {
    "--assistant-width": `${rightPanelWidth}px`,
  } as CSSProperties;

  useEffect(() => {
    if (!isHome) {
      setResourceOverviewOpen(false);
      setHomeConversationTitle("");
    }
  }, [isHome]);

  const handleRightPanelResize = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    const startX = event.clientX;
    const startWidth = rightPanelWidth;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);

    function handlePointerMove(moveEvent: PointerEvent) {
      const nextWidth = startWidth - (moveEvent.clientX - startX);
      setRightPanelWidth(Math.min(MAX_RIGHT_PANEL_WIDTH, Math.max(MIN_RIGHT_PANEL_WIDTH, nextWidth)));
    }

    function handlePointerUp() {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });
  }, [rightPanelWidth]);

  return (
    <div className="desktop-stage">
      <div
        className={`app-window app-window--${activeRoute}${
          showRightPanel ? "" : " app-window--assistant-closed"
        }${sidebarCollapsed ? " app-window--menu-collapsed" : ""}`}
        style={shellStyle}
      >
        <Sidebar
          activeRoute={activeRoute}
          onRouteChange={onRouteChange}
        />
        <AssistantPanelProvider
          assistantOpen={showAssistant}
          sidebarCollapsed={sidebarCollapsed}
          toggleSidebar={() => setSidebarCollapsed((isCollapsed) => !isCollapsed)}
          toggleAssistant={() => setAssistantOpen((isOpen) => !isOpen)}
        >
          <WindowTitleBar
            assistantOpen={assistantOpen}
            moduleLabel={moduleLabel}
            resourceOverviewOpen={resourceOverviewOpen}
            showResourceControls={isHome}
            onToggleAssistant={() => setAssistantOpen((isOpen) => !isOpen)}
            onToggleResourceOverview={() => setResourceOverviewOpen((isOpen) => !isOpen)}
          />
          <div className="app-surface">
            <main className={`workspace workspace--${activeRoute}`}>
              {isHome && isValidElement(children)
                ? cloneElement(children as ReactElement<{ onConversationTitleChange?: (title: string) => void }>, {
                    onConversationTitleChange: setHomeConversationTitle,
                  })
                : children}
            </main>
          </div>
          {showRightPanel ? (
            <button
              className="right-panel-resizer"
              type="button"
              aria-label="调整右侧栏宽度"
              onPointerDown={handleRightPanelResize}
            />
          ) : null}
          {isHome ? (
            <LocalResourcePopover open={resourceOverviewOpen} />
          ) : null}
          {showGridAssistant ? <AssistantPanel activeRoute={activeRoute} /> : null}
        </AssistantPanelProvider>
      </div>
    </div>
  );
}
