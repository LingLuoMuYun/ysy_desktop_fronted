import { contextBridge, ipcRenderer, webUtils } from "electron";
contextBridge.exposeInMainWorld("ysyDesktop", {
    platform: process.platform,
    selectAttachments() {
        return ipcRenderer.invoke("file:select-attachments");
    },
    getFilePath(file) {
        return webUtils.getPathForFile(file);
    },
    selectDirectory(title) {
        return ipcRenderer.invoke("file:select-directory", title);
    },
    selectFile(title) {
        return ipcRenderer.invoke("file:select-file", title);
    },
    openFile(filePath) {
        return ipcRenderer.invoke("file:open-path", filePath);
    },
    minimizeWindow() {
        return ipcRenderer.invoke("window:minimize");
    },
    toggleMaximizeWindow() {
        return ipcRenderer.invoke("window:toggle-maximize");
    },
    isWindowMaximized() {
        return ipcRenderer.invoke("window:is-maximized");
    },
    onWindowMaximizeStateChange(callback) {
        const listener = (_event, isMaximized) => {
            callback(isMaximized);
        };
        ipcRenderer.on("window:maximized-change", listener);
        return () => {
            ipcRenderer.removeListener("window:maximized-change", listener);
        };
    },
    closeWindow() {
        return ipcRenderer.invoke("window:close");
    },
    requestEnvironment(request) {
        return ipcRenderer.invoke("environment:request", request);
    },
});
