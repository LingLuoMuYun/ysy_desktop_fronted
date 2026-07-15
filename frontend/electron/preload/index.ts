import { contextBridge, ipcRenderer, webUtils } from "electron";

contextBridge.exposeInMainWorld("ysyDesktop", {
  platform: process.platform,
  selectAttachments() {
    return ipcRenderer.invoke("file:select-attachments") as Promise<
      Array<{ name: string; path: string; kind?: "file" | "directory" }>
    >;
  },
  getFilePath(file: File) {
    return webUtils.getPathForFile(file);
  },
  selectDirectory(title?: string) {
    return ipcRenderer.invoke("file:select-directory", title) as Promise<string | null>;
  },
  selectFile(title?: string) {
    return ipcRenderer.invoke("file:select-file", title) as Promise<string | null>;
  },
  openFile(filePath: string) {
    return ipcRenderer.invoke("file:open-path", filePath) as Promise<void>;
  },
  minimizeWindow() {
    return ipcRenderer.invoke("window:minimize") as Promise<void>;
  },
  toggleMaximizeWindow() {
    return ipcRenderer.invoke("window:toggle-maximize") as Promise<void>;
  },
  isWindowMaximized() {
    return ipcRenderer.invoke("window:is-maximized") as Promise<boolean>;
  },
  onWindowMaximizeStateChange(callback: (isMaximized: boolean) => void) {
    const listener = (_event: Electron.IpcRendererEvent, isMaximized: boolean) => {
      callback(isMaximized);
    };
    ipcRenderer.on("window:maximized-change", listener);
    return () => {
      ipcRenderer.removeListener("window:maximized-change", listener);
    };
  },
  closeWindow() {
    return ipcRenderer.invoke("window:close") as Promise<void>;
  },
  requestEnvironment(request: unknown) {
    return ipcRenderer.invoke("environment:request", request) as Promise<{ status: number; data: unknown }>;
  },
});
