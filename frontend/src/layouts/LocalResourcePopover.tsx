import { useCallback, useEffect, useMemo, useState } from "react";
import { HardDrive, Loader2, Rocket, Trash2 } from "lucide-react";
import { homeApi, type DiskResource, type ProcessListResult, type RecentAction, type SystemResources } from "../services/homeApi";

interface LocalResourcePopoverProps {
  open: boolean;
}

function getUsageColor(percent: number): string {
  if (percent > 85) return "var(--red)";
  if (percent > 60) return "#f59f00";
  return "var(--green)";
}

function formatPercent(value?: number) {
  return Number.isFinite(value) ? Math.round(value as number) : 0;
}

function formatBytes(bytes?: number, fractionDigits = 1) {
  if (!Number.isFinite(bytes) || !bytes || bytes <= 0) return "0 GB";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const digits = value >= 100 || unitIndex === 0 ? 0 : fractionDigits;
  return `${value.toFixed(digits)} ${units[unitIndex]}`;
}

function formatSpeed(bytesPerSecond?: number) {
  if (!Number.isFinite(bytesPerSecond) || !bytesPerSecond || bytesPerSecond <= 0) return "0 KB/s";
  return `${formatBytes(bytesPerSecond, 1)}/s`;
}

function getDiskUsedBytes(drive: DiskResource) {
  if (!drive.totalBytes) return 0;
  return Math.max(0, drive.totalBytes - (drive.availableBytes || 0));
}

function getDiskUsedPercent(drive: DiskResource) {
  if (Number.isFinite(drive.usedPercent)) return Math.round(drive.usedPercent as number);
  if (!drive.totalBytes) return 0;
  return Math.round((getDiskUsedBytes(drive) / drive.totalBytes) * 100);
}

export function LocalResourcePopover({ open }: LocalResourcePopoverProps) {
  const [activeDriveIndex, setActiveDriveIndex] = useState(0);
  const [resources, setResources] = useState<SystemResources | null>(null);
  const [recentActions, setRecentActions] = useState<RecentAction[]>([]);
  const [processList, setProcessList] = useState<ProcessListResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<"cache" | "processes" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const drives = useMemo(() => resources?.disk.disks || [], [resources]);
  const activeDrive = drives[activeDriveIndex];
  const usagePercent = activeDrive ? getDiskUsedPercent(activeDrive) : 0;
  const barColor = getUsageColor(usagePercent);

  const loadPanelData = useCallback(async (options: { silent?: boolean } = {}) => {
    if (!options.silent) {
      setLoading(true);
    }
    setError(null);
    const [resourceResult, recentResult] = await Promise.allSettled([
      homeApi.loadResources({
          diskId: activeDrive?.id,
          includeProcessCleanupEstimate: true,
        }),
      homeApi.loadRecentActions({ limit: 20 }),
    ]);

    if (resourceResult.status === "fulfilled") {
      setResources(resourceResult.value);
    } else {
      setError(resourceResult.reason instanceof Error ? resourceResult.reason.message : "首页资源接口加载失败");
    }

    if (recentResult.status === "fulfilled") {
      setRecentActions(recentResult.value.items || []);
    } else {
      setRecentActions([]);
      if (!options.silent) {
        setNotice("最近操作接口暂未开放，已仅展示资源概览。");
      }
    }

    if (!options.silent) {
      setLoading(false);
    }
  }, [activeDrive?.id]);

  useEffect(() => {
    if (!open) return;
    void loadPanelData();
    const timer = window.setInterval(() => {
      void loadPanelData({ silent: true });
    }, 15_000);
    return () => window.clearInterval(timer);
  }, [loadPanelData, open]);

  useEffect(() => {
    if (activeDriveIndex > 0 && activeDriveIndex >= drives.length) {
      setActiveDriveIndex(0);
    }
  }, [activeDriveIndex, drives.length]);

  const metrics = [
    { id: "cpu", label: "CPU占用", value: formatPercent(resources?.cpu.usagePercent), unit: "%" },
    { id: "gpu", label: "GPU占用", value: formatPercent(resources?.gpu.usagePercent), unit: "%" },
    { id: "memory", label: "内存占用", value: formatPercent(resources?.memory.usagePercent), unit: "%" },
  ];

  const handleCleanupCache = async () => {
    const confirmed = window.confirm("加速缓存清理会清理后端内置的受控缓存目录。确认执行？");
    if (!confirmed) return;
    setActionLoading("cache");
    setNotice(null);
    setError(null);
    try {
      const result = await homeApi.cleanupCache();
      setNotice(`已清理 ${formatBytes(result.cleanedBytes)}，跳过 ${result.skipped?.length || 0} 项。`);
      await loadPanelData({ silent: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "缓存清理失败");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLoadProcesses = async () => {
    setActionLoading("processes");
    setNotice(null);
    setError(null);
    try {
      const result = await homeApi.loadProcesses({
        sortBy: "memoryBytes",
        limit: 50,
        includeProtected: false,
      });
      setProcessList(result);
      if (result.candidateProcessCount === 0) {
        setNotice("当前没有可清理进程。");
      } else {
        setNotice(`发现 ${result.candidateProcessCount} 个可清理进程，预计可释放 ${formatBytes(result.releasableMemoryBytes)}。终止进程需要补充勾选确认弹窗后执行。`);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "可清理进程加载失败");
    } finally {
      setActionLoading(null);
    }
  };

  if (!open) return null;

  return (
    <aside className="local-resource-panel" aria-label="本机资源概览">
      <section className="local-resource-card local-resource-card--overview">
        <div className="local-resource-card__header">
          <h2>资源概览</h2>
          <button
            className="local-resource-action"
            type="button"
            onClick={() => void handleCleanupCache()}
            disabled={actionLoading !== null}
          >
            {actionLoading === "cache" ? <Loader2 size={13} className="local-resource-spin" /> : <Rocket size={13} />}
            {actionLoading === "cache" ? "处理中" : "加速"}
          </button>
        </div>

        {loading && !resources ? (
          <div className="local-resource-message">正在加载资源概览...</div>
        ) : null}
        {error ? <div className="local-resource-message local-resource-message--danger">{error}</div> : null}
        {notice ? <div className="local-resource-message">{notice}</div> : null}

        <div className="local-resource-metrics" aria-label="资源占用">
          {metrics.map((metric) => (
            <div className="local-resource-metric" key={metric.id}>
              <span>{metric.label}</span>
              <strong>
                {metric.value}
                <small>{metric.unit}</small>
              </strong>
            </div>
          ))}
        </div>

        <div className="local-resource-section-title">
          <h3>磁盘空间</h3>
          <button
            className="local-resource-action"
            type="button"
            onClick={() => void handleLoadProcesses()}
            disabled={actionLoading !== null}
          >
            {actionLoading === "processes" ? <Loader2 size={13} className="local-resource-spin" /> : <Trash2 size={13} />}
            {actionLoading === "processes" ? "加载中" : "清理"}
          </button>
        </div>

        {/* 磁盘 Tab 切换栏 */}
        <div className="local-resource-drive-tabs" aria-label="磁盘分区">
          {drives.map((drive, index) => (
            <button
              type="button"
              key={drive.id}
              className={index === activeDriveIndex ? "active" : ""}
              onClick={() => setActiveDriveIndex(index)}
            >
              {drive.label || `${drive.id}盘`}
            </button>
          ))}
        </div>

        {/* 当前磁盘详情 */}
        {activeDrive ? <div className="local-resource-drive-detail">
          <div className="local-resource-drive-detail__header">
            <HardDrive size={16} className="local-resource-drive-detail__icon" />
            <div className="local-resource-drive-detail__info">
              <span className="local-resource-drive-detail__name">{activeDrive.label || `${activeDrive.id}盘`}</span>
              <span className="local-resource-drive-detail__label">{activeDrive.id}</span>
            </div>
            <div className="local-resource-drive-detail__stats">
              <span className="local-resource-drive-detail__used">
                {formatBytes(getDiskUsedBytes(activeDrive), 0)}
              </span>
              <span className="local-resource-drive-detail__divider">/</span>
              <span className="local-resource-drive-detail__total">
                {formatBytes(activeDrive.totalBytes, 0)}
              </span>
            </div>
          </div>

          {/* 进度条 */}
          <div className="local-resource-drive-bar">
            <div
              className="local-resource-drive-bar__fill"
              style={{ width: `${usagePercent}%`, background: barColor }}
            />
          </div>

          <div className="local-resource-drive-detail__footer">
            <span>
              已用 <strong style={{ color: barColor }}>{usagePercent}%</strong>
            </span>
            <span>
              剩余 <strong>{formatBytes(activeDrive.availableBytes, 1)}</strong>
            </span>
          </div>
        </div> : <div className="local-resource-message">暂无磁盘数据</div>}

        {/* 可用空间 & 可释放空间 */}
        <div className="local-resource-disk">
          <div className="local-resource-disk__available">
            <span>可用空间</span>
            <strong>
              {formatBytes(activeDrive?.availableBytes, 1)}
              <small>/{formatBytes(activeDrive?.totalBytes, 0)}</small>
            </strong>
          </div>
          <div className="local-resource-disk__release">
            <span>可释放空间</span>
            <strong>
              {formatBytes(resources?.processCleanup?.releasableMemoryBytes, 1)}
              <small>{resources?.processCleanup?.estimated ? " 估算" : ""}</small>
            </strong>
          </div>
        </div>

        {processList ? (
          <div className="local-resource-message">
            候选进程 {processList.items.length} / {processList.candidateProcessCount}，选择令牌有效至 {processList.expiresAt}
          </div>
        ) : null}

        <div className="local-resource-section-title local-resource-section-title--plain">
          <h3>实时网速</h3>
        </div>

        <div className="local-resource-network">
          <div>↓ 下载 {formatSpeed(resources?.network.downloadBytesPerSecond)}</div>
          <div>↑ 上传 {formatSpeed(resources?.network.uploadBytesPerSecond)}</div>
        </div>
      </section>

      <section className="local-resource-card local-resource-card--recent">
        <h2>最近操作</h2>
        <div className="local-resource-recent-list">
          {recentActions.length === 0 ? (
            <div className="local-resource-message">暂无最近操作</div>
          ) : recentActions.map((operation) => (
            <button className="local-resource-recent-item" type="button" key={operation.id}>
              <span>{operation.name}</span>
              <time>{operation.time}</time>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}
