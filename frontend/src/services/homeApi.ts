const DEFAULT_API_BASE = "http://10.0.78.12:8000";
const API_BASE = import.meta.env.VITE_HOME_API_BASE_URL
  || import.meta.env.VITE_ENVIRONMENTS_API_BASE_URL
  || DEFAULT_API_BASE;
const API_BASE_CANDIDATES = import.meta.env.DEV && API_BASE !== ""
  ? [API_BASE, ""]
  : [API_BASE];

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error: {
    code?: string;
    message?: string;
    suggestion?: string;
  } | null;
  requestId?: string;
}

export interface HomeWorkbench {
  currentProject?: {
    id: string;
    name: string;
  } | null;
  resources?: HomeResourceSummary | null;
  recentActions?: RecentAction[];
}

interface HomeResourceSummary {
  cpu?: string;
  gpu?: string;
  memory?: string;
  diskAvailable?: string;
  networkDown?: string;
  networkUp?: string;
}

export interface SystemResources {
  checkedAt: string;
  cpu: ResourceUsage;
  gpu: ResourceUsage & {
    deviceName?: string;
  };
  memory: ResourceUsage & {
    usedBytes?: number;
    totalBytes?: number;
  };
  disk: {
    selectedDiskId?: string;
    availableBytes?: number;
    totalBytes?: number;
    usedPercent?: number;
    disks: DiskResource[];
    status?: string;
    reason?: string;
  };
  processCleanup?: {
    releasableMemoryBytes?: number;
    candidateProcessCount?: number;
    estimated?: boolean;
    status?: string;
    reason?: string;
  };
  network: {
    downloadBytesPerSecond?: number;
    uploadBytesPerSecond?: number;
    sampleWindowMs?: number;
    status?: string;
    reason?: string;
  };
}

export interface ResourceUsage {
  usagePercent?: number;
  status?: string;
  source?: string;
  reason?: string;
}

export interface DiskResource {
  id: string;
  label?: string;
  availableBytes?: number;
  totalBytes?: number;
  usedPercent?: number;
}

export interface RecentAction {
  id: string;
  name: string;
  time: string;
  tone?: "success" | "warning" | "danger" | "info" | "neutral" | string;
  resourceType?: string;
  resourceId?: string;
}

export interface ProcessListResult {
  checkedAt: string;
  selectionToken: string;
  expiresAt: string;
  releasableMemoryBytes: number;
  candidateProcessCount: number;
  items: ProcessCandidate[];
}

export interface ProcessCandidate {
  pid: number;
  name: string;
  displayName?: string;
  cpuPercent?: number;
  memoryBytes?: number;
  owner?: string;
  commandLinePreview?: string;
  identityHash?: string;
  startedAt?: string;
  terminable: boolean;
  protectedReason?: string | null;
}

export interface CacheCleanupResult {
  cleanupId: string;
  cleanedBytes: number;
  cleanedFileCount: number;
  skipped?: Array<{
    pathRef: string;
    reason: string;
  }>;
  finishedAt: string;
}

export interface ProcessTerminateResult {
  operationId: string;
  results: Array<{
    pid: number;
    name: string;
    status: string;
    signal?: string;
    errorCode?: string | null;
    errorMessage?: string | null;
    protectedReason?: string | null;
  }>;
  finishedAt: string;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response | null = null;
  let lastNetworkError: unknown = null;

  for (const baseUrl of API_BASE_CANDIDATES) {
    try {
      response = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers: {
          ...(init?.body ? { "Content-Type": "application/json" } : {}),
          ...init?.headers,
        },
      });
      break;
    } catch (error) {
      lastNetworkError = error;
    }
  }

  if (!response) {
    throw new Error(
      `${getErrorMessage(lastNetworkError, "无法连接后端服务")}。请确认后端服务已启动，且 ${DEFAULT_API_BASE} 可访问。`,
    );
  }

  const envelope = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!response.ok || !envelope?.success) {
    throw new Error(
      envelope?.error?.message
      || envelope?.error?.suggestion
      || `请求失败：HTTP ${response.status}`,
    );
  }

  return envelope.data;
}

function toQuery(params: Record<string, string | number | boolean | null | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function createHomeIdempotencyKey(scope: string) {
  if (globalThis.crypto?.randomUUID) {
    return `home-${scope}-${globalThis.crypto.randomUUID()}`;
  }
  return `home-${scope}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const homeApi = {
  loadWorkbench(input: { currentProjectId?: string; includeResources?: boolean; recentLimit?: number } = {}) {
    return request<HomeWorkbench>(`/api/home/workbench${toQuery(input)}`);
  },

  loadResources(input: { diskId?: string; includeProcessCleanupEstimate?: boolean } = {}) {
    return request<SystemResources>(`/api/system/resources${toQuery(input)}`);
  },

  loadRecentActions(input: { limit?: number; projectId?: string } = {}) {
    return request<{ items: RecentAction[] }>(`/api/activity/recent${toQuery(input)}`);
  },

  cleanupCache(idempotencyKey = createHomeIdempotencyKey("cache-cleanup")) {
    return request<CacheCleanupResult>("/api/system/cache/cleanup", {
      method: "POST",
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({ confirmed: true }),
    });
  },

  loadProcesses(input: { sortBy?: "memoryBytes" | "cpuPercent"; limit?: number; includeProtected?: boolean } = {}) {
    return request<ProcessListResult>(`/api/system/processes${toQuery(input)}`);
  },

  terminateProcesses(input: { selectionToken: string; pids: number[]; reason?: string; idempotencyKey?: string }) {
    return request<ProcessTerminateResult>("/api/system/processes/terminate", {
      method: "POST",
      headers: {
        "Idempotency-Key": input.idempotencyKey || createHomeIdempotencyKey("process-terminate"),
      },
      body: JSON.stringify({
        confirmed: true,
        selectionToken: input.selectionToken,
        pids: input.pids,
        reason: input.reason || "manual cleanup",
      }),
    });
  },

  openLocalTool(input: { tool: string; projectId?: string; path?: string }) {
    return request<{ opened: boolean; tool: string; path?: string }>("/api/local-tools/open", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
};
