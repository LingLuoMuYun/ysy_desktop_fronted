import { contextBridge } from "electron";
contextBridge.exposeInMainWorld("ysyDesktop", {
    platform: process.platform,
});
