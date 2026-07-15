export {};

declare global {
  interface Window {
    ysyDesktop?: {
      platform: string;
      selectAttachments?: () => Promise<Array<{ name: string; path: string; kind?: "file" | "directory" }>>;
      getFilePath?: (file: File) => string;
      selectDirectory?: (title?: string) => Promise<string | null>;
      selectFile?: (title?: string) => Promise<string | null>;
      openFile?: (filePath: string) => Promise<void>;
      minimizeWindow?: () => Promise<void>;
      toggleMaximizeWindow?: () => Promise<void>;
      isWindowMaximized?: () => Promise<boolean>;
      onWindowMaximizeStateChange?: (callback: (isMaximized: boolean) => void) => () => void;
      closeWindow?: () => Promise<void>;
      requestEnvironment?: (request: unknown) => Promise<{ status: number; data: unknown }>;
    };
  }
}
