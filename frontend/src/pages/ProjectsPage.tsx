import { FormEvent, useEffect, useMemo, useState } from "react";
import { ChevronDown, FolderKanban, Plus, Search, X } from "lucide-react";
import { PortalDropdown } from "../components/PortalDropdown";
import { ScrollArea } from "../components/ScrollArea";
import { StatusBadge } from "../components/StatusBadge";
import { Toast } from "../components/Toast";
import { projectsApi, type ProjectDetail, type ProjectEnvironmentOption, type ProjectSpecs } from "../services/projectsApi";
import type { ProjectSummary } from "../types/domain";
import "./ProjectsPage.css";

const projectIconVariants = ["blue", "slate", "violet", "green", "blue", "violet", "slate"] as const;
const PAGE_SIZE = 5;

const FALLBACK_SPECS: ProjectSpecs = {
  projectTypes: ["图像分类", "目标检测", "语义分割", "自定义深度学习", "LLM 微调", "Embedding 微调", "Rerank 微调", "自定义项目"],
  statusOptions: [
    { value: "pending_config", label: "待配置" },
    { value: "preparing", label: "准备中" },
    { value: "trainable", label: "可训练" },
    { value: "running", label: "运行中" },
    { value: "risk", label: "存在风险" },
    { value: "unavailable", label: "不可用" },
    { value: "archived", label: "已归档" },
  ],
  workspaceOptions: [],
  compatibleEnvironments: [],
};

interface ProjectListState {
  items: ProjectSummary[];
  page: number;
  total: number;
  totalPages: number;
}

interface ProjectFormValues {
  name: string;
  type: string;
  description: string;
  workspace: string;
  environmentId: string;
}

export function ProjectsPage() {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("全部");
  const [selectedStatus, setSelectedStatus] = useState<string>("全部");
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [specs, setSpecs] = useState<ProjectSpecs>(FALLBACK_SPECS);
  const [listState, setListState] = useState<ProjectListState>({ items: [], page: 1, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProjectSummary | null>(null);
  const [detailTarget, setDetailTarget] = useState<ProjectSummary | null>(null);
  const [projectDetail, setProjectDetail] = useState<ProjectDetail | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "danger" } | null>(null);

  const typeOptions = useMemo(() => ["全部", ...specs.projectTypes], [specs.projectTypes]);
  const statusOptions = useMemo(() => [{ value: "", label: "全部" }, ...specs.statusOptions], [specs.statusOptions]);
  const selectedStatusLabel = statusOptions.find((option) => option.value === selectedStatus)?.label || "全部";

  const loadProjects = async () => {
    setIsLoading(true);
    setListError(null);
    try {
      const result = await projectsApi.list({
        keyword,
        type: selectedType === "全部" ? undefined : selectedType,
        status: selectedStatus === "全部" ? undefined : selectedStatus,
        page: currentPage,
        pageSize: PAGE_SIZE,
      });
      setListState({
        items: result.items,
        page: result.page,
        total: result.total,
        totalPages: result.totalPages,
      });
    } catch (error) {
      setListError(error instanceof Error ? error.message : "项目列表加载失败");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    projectsApi.specs()
      .then((nextSpecs) => {
        if (!ignore) setSpecs(nextSpecs);
      })
      .catch((error) => {
        if (!ignore) {
          setToast({ message: error instanceof Error ? error.message : "项目规格加载失败，已使用本地选项", tone: "danger" });
        }
      });
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    void loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, selectedType, selectedStatus, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, selectedType, selectedStatus]);

  const handleOpenDetail = async (project: ProjectSummary) => {
    setDetailTarget(project);
    setProjectDetail(null);
    setDetailError(null);
    setIsDetailLoading(true);
    try {
      const detail = await projectsApi.detail(project.id);
      setProjectDetail(detail);
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : "项目详情加载失败");
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteTarget) return;
    try {
      await projectsApi.delete(deleteTarget.id);
      setToast({ message: `已删除项目：${deleteTarget.name}`, tone: "success" });
      setDeleteTarget(null);
      await loadProjects();
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : "项目删除失败", tone: "danger" });
    }
  };

  return (
    <section className="workbench-page project-page">
      {toast && <Toast message={toast.message} tone={toast.tone} onClose={() => setToast(null)} />}

      <div className="project-page__toolbar">
        <div className="project-page__filters">
          <PortalDropdown
            open={openFilter === "type"}
            onClose={() => setOpenFilter(null)}
            align="left"
            menuClassName="prompt-dropdown project-filter-dropdown"
            trigger={
              <button
                className={`project-filter${openFilter === "type" ? " project-filter--open" : ""}`}
                type="button"
                onClick={() => setOpenFilter(openFilter === "type" ? null : "type")}
              >
                <span>项目类型</span>
                <strong>{selectedType}</strong>
                <ChevronDown size={15} />
              </button>
            }
          >
            {typeOptions.map((type) => (
              <button
                key={type}
                className={`prompt-dropdown__item${type === selectedType ? " prompt-dropdown__item--active" : ""}`}
                type="button"
                onClick={() => { setSelectedType(type); setOpenFilter(null); }}
              >
                <span className="prompt-dropdown__item-label">{type}</span>
                {type === selectedType && <span className="prompt-dropdown__check" />}
              </button>
            ))}
          </PortalDropdown>

          <PortalDropdown
            open={openFilter === "status"}
            onClose={() => setOpenFilter(null)}
            align="left"
            menuClassName="prompt-dropdown project-filter-dropdown"
            trigger={
              <button
                className={`project-filter${openFilter === "status" ? " project-filter--open" : ""}`}
                type="button"
                onClick={() => setOpenFilter(openFilter === "status" ? null : "status")}
              >
                <span>状态</span>
                <strong>{selectedStatusLabel}</strong>
                <ChevronDown size={15} />
              </button>
            }
          >
            {statusOptions.map((status) => {
              const isActiveStatus = status.value === selectedStatus || (!status.value && selectedStatus === "全部");
              return (
              <button
                key={status.value || "all"}
                className={`prompt-dropdown__item${isActiveStatus ? " prompt-dropdown__item--active" : ""}`}
                type="button"
                onClick={() => { setSelectedStatus(status.value || "全部"); setOpenFilter(null); }}
              >
                <span className="prompt-dropdown__item-label">{status.label}</span>
                {isActiveStatus && <span className="prompt-dropdown__check" />}
              </button>
            ); })}
          </PortalDropdown>
        </div>

        <button className="primary-button" type="button" onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} />
          创建项目
        </button>
      </div>

      <label className="project-search">
        <Search size={18} />
        <input
          aria-label="搜索项目名称或路径"
          placeholder="搜索名称 / 路径..."
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </label>

      <div className="project-list-shell">
        <ScrollArea className="project-grid">
          {isLoading ? (
            <ProjectState title="正在加载项目" desc="正在从后端读取项目列表。" />
          ) : listError ? (
            <ProjectState title="项目列表加载失败" desc={listError} actionLabel="重试" onAction={loadProjects} />
          ) : listState.items.length === 0 ? (
            <ProjectState title="暂无项目" desc="当前筛选条件下没有项目，可调整筛选或创建新项目。" />
          ) : (
            listState.items.map((project, index) => (
              <article className="project-card" key={project.id}>
                <div
                  className={`project-card__icon project-card__icon--${projectIconVariants[index % projectIconVariants.length]}`}
                  aria-hidden="true"
                >
                  <FolderKanban size={20} strokeWidth={1.9} />
                </div>

                <div className="project-card__body">
                  <div className="project-card__heading">
                    <h2>{project.name}</h2>
                    <StatusBadge label={project.status} tone={project.tone} />
                    <div className="project-card__actions project-card__actions--visible">
                      <button className="project-card__action-btn project-card__action-btn--primary" type="button" onClick={() => handleOpenDetail(project)}>
                        查看详情
                      </button>
                      <button className="project-card__action-btn" type="button" title="项目编辑接口待后端确认">
                        编辑
                      </button>
                      <button className="project-card__action-btn project-card__action-btn--danger" type="button" onClick={() => setDeleteTarget(project)}>
                        删除
                      </button>
                    </div>
                  </div>
                  <p>{project.description}</p>
                  <div className="project-card__path path-line">路径：{project.path}</div>
                  <div className="project-card__meta">
                    <span>训练任务：{project.trainingTasks}</span>
                    <span>部署任务：{project.deploymentTasks}</span>
                    <span>数据集：{project.datasetCount}</span>
                    <span>模型：{project.modelCount ?? 0}</span>
                    <time>{project.updatedAt}</time>
                  </div>
                </div>
              </article>
            ))
          )}
        </ScrollArea>

        <footer className="project-page__pagination">
          <span>第 {listState.total === 0 ? 0 : listState.page} 页 / 共 {listState.totalPages} 页，共 {listState.total} 个项目</span>
          <div className="project-page__pagination-nav">
            <button type="button" disabled={currentPage <= 1 || isLoading} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
              上一页
            </button>
            {Array.from({ length: listState.totalPages }, (_, i) => (
              <button
                key={i + 1}
                type="button"
                className={i + 1 === currentPage ? "is-current" : ""}
                disabled={isLoading}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button type="button" disabled={currentPage >= listState.totalPages || isLoading} onClick={() => setCurrentPage((p) => p + 1)}>
              下一页
            </button>
          </div>
        </footer>
      </div>

      {isCreateOpen && (
        <ProjectCreateDialog
          specs={specs}
          onClose={() => setIsCreateOpen(false)}
          onCreated={async (projectName) => {
            setToast({ message: `已创建项目：${projectName}`, tone: "success" });
            setIsCreateOpen(false);
            await loadProjects();
          }}
        />
      )}

      {deleteTarget && (
        <ProjectDeleteDialog
          project={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteProject}
        />
      )}

      {detailTarget && (
        <ProjectDetailDialog
          project={projectDetail}
          fallback={detailTarget}
          isLoading={isDetailLoading}
          error={detailError}
          onClose={() => {
            setDetailTarget(null);
            setProjectDetail(null);
            setDetailError(null);
          }}
          onRetry={() => handleOpenDetail(detailTarget)}
        />
      )}
    </section>
  );
}

function ProjectState({ title, desc, actionLabel, onAction }: { title: string; desc: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="project-state">
      <strong>{title}</strong>
      <span>{desc}</span>
      {actionLabel && onAction && (
        <button className="project-card__action-btn project-card__action-btn--primary" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function ProjectCreateDialog({ specs, onClose, onCreated }: {
  specs: ProjectSpecs;
  onClose: () => void;
  onCreated: (projectName: string) => Promise<void>;
}) {
  const [values, setValues] = useState<ProjectFormValues>({
    name: "",
    type: specs.projectTypes[0] || "",
    description: "",
    workspace: specs.workspaceOptions[0] || "",
    environmentId: specs.compatibleEnvironments[0]?.id || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const selectedEnvironment = specs.compatibleEnvironments.find((environment) => environment.id === values.environmentId);

  const updateValue = (key: keyof ProjectFormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!values.name.trim() || !values.type || !values.workspace.trim()) {
      setError("请填写项目名称、项目类型和项目保存位置。");
      return;
    }
    setIsSubmitting(true);
    try {
      const validation = await projectsApi.validateWorkspace(values.workspace.trim());
      if (!validation.ok || !validation.exists || !validation.allowed) {
        setError("项目保存位置未通过后端路径校验。");
        return;
      }
      setShowConfirm(true);
    } catch (validateError) {
      setError(validateError instanceof Error ? validateError.message : "项目保存位置校验失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await projectsApi.create({
        name: values.name.trim(),
        type: values.type,
        description: values.description.trim(),
        workspace: values.workspace.trim(),
        environmentId: values.environmentId || undefined,
      });
      await onCreated(values.name.trim());
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "项目创建失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="env-create-overlay">
        <div className="env-create-dialog env-create-dialog--confirm project-dialog" role="dialog" aria-modal="true" aria-labelledby="project-create-confirm-title">
          <header className="env-create-dialog__header">
            <h2 id="project-create-confirm-title">确认创建项目</h2>
            <button className="env-create-dialog__close" disabled={isSubmitting} onClick={() => setShowConfirm(false)} title="返回" type="button">
              <X size={16} />
            </button>
          </header>
          <ScrollArea className="env-create-dialog__body env-create-confirm-body">
            <p className="confirm-dialog__desc">创建项目会新增产品内项目记录，确认后提交后端创建接口。</p>
            <dl className="confirm-dialog__info">
              <ConfirmRow label="项目名称" value={values.name} />
              <ConfirmRow label="项目类型" value={values.type} />
              <ConfirmRow label="保存位置" value={values.workspace} />
              <ConfirmRow label="默认环境" value={selectedEnvironment?.name || "未选择"} />
            </dl>
            <p className="confirm-dialog__risk">
              <strong>中风险操作：</strong>本次请求会传入 `confirmed=true`，不提交代码入口、依赖文件或初始数据集绑定。
            </p>
            {error && <p className="project-dialog__error">{error}</p>}
          </ScrollArea>
          <footer className="env-create-dialog__footer">
            <div className="env-create-dialog__actions">
              <button className="settings-action-button" disabled={isSubmitting} onClick={() => setShowConfirm(false)} type="button">
                返回修改
              </button>
              <button className="settings-action-button settings-action-button--primary" disabled={isSubmitting} onClick={handleConfirm} type="button">
                {isSubmitting ? "提交中..." : "确认创建项目"}
              </button>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="env-create-overlay">
      <form className="env-create-dialog project-dialog" role="dialog" aria-modal="true" aria-labelledby="project-create-title" onSubmit={handleSubmit}>
        <header className="env-create-dialog__header">
          <h2 id="project-create-title">创建项目</h2>
          <button className="env-create-dialog__close" onClick={onClose} title="关闭" type="button">
            <X size={16} />
          </button>
        </header>
        <div className="env-create-dialog__body project-dialog__body">
          <ProjectTextField label="项目名称" value={values.name} onChange={(value) => updateValue("name", value)} required />
          <ProjectSelectField label="项目类型" value={values.type} options={specs.projectTypes} onChange={(value) => updateValue("type", value)} />
          <ProjectTextField label="项目保存位置" value={values.workspace} onChange={(value) => updateValue("workspace", value)} required />
          <ProjectSelectField
            label="默认运行环境"
            value={values.environmentId}
            options={specs.compatibleEnvironments}
            onChange={(value) => updateValue("environmentId", value)}
            optionalLabel="不绑定默认环境"
          />
          <label className="project-dialog__field">
            <span>项目描述</span>
            <textarea value={values.description} onChange={(event) => updateValue("description", event.target.value)} rows={4} />
          </label>
          {error && <p className="project-dialog__error">{error}</p>}
        </div>
        <footer className="env-create-dialog__footer">
          <div className="env-create-dialog__actions">
            <button className="settings-action-button" disabled={isSubmitting} onClick={onClose} type="button">
              取消
            </button>
            <button className="settings-action-button settings-action-button--primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? "校验中..." : "下一步"}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}

function ProjectDeleteDialog({ project, onCancel, onConfirm }: {
  project: ProjectSummary;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog confirm-dialog--environment" role="dialog" aria-modal="true" aria-labelledby="project-delete-title">
        <div className="confirm-dialog__header confirm-dialog__header--plain">
          <h2 id="project-delete-title">确认删除项目</h2>
          <button className="confirm-dialog__close" onClick={onCancel} title="关闭" type="button">
            <X size={16} />
          </button>
        </div>
        <div className="confirm-dialog__content">
          <p className="confirm-dialog__desc">删除项目登记并解除关联，默认不删除本地文件。</p>
          <dl className="confirm-dialog__info">
            <ConfirmRow label="影响对象" value={project.name} />
            <ConfirmRow label="本地文件" value="不删除，deleteLocalFiles=false" />
            <ConfirmRow label="是否可撤销" value="需由后端数据恢复能力决定" />
          </dl>
          <p className="confirm-dialog__risk confirm-dialog__risk--danger">
            <strong>高风险操作：</strong>确认后请求 `DELETE /api/projects/项目ID` 并传 `confirmed=true`。
          </p>
        </div>
        <div className="confirm-dialog__actions confirm-dialog__actions--footer">
          <button className="settings-action-button" onClick={onCancel} type="button">取消</button>
          <button className="settings-action-button settings-action-button--danger" onClick={onConfirm} type="button">确认删除</button>
        </div>
      </div>
    </div>
  );
}

function ProjectDetailDialog({ project, fallback, isLoading, error, onClose, onRetry }: {
  project: ProjectDetail | null;
  fallback: ProjectSummary;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onRetry: () => void;
}) {
  const displayProject = project || fallback;
  return (
    <div className="env-create-overlay">
      <div className="env-create-dialog project-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="project-detail-title">
        <header className="env-create-dialog__header">
          <h2 id="project-detail-title">项目详情</h2>
          <button className="env-create-dialog__close" onClick={onClose} title="关闭" type="button">
            <X size={16} />
          </button>
        </header>
        <ScrollArea className="env-create-dialog__body project-detail-dialog__body">
          {isLoading ? (
            <ProjectState title="正在加载详情" desc="正在请求项目基础信息。" />
          ) : error ? (
            <ProjectState title="详情加载失败" desc={error} actionLabel="重试" onAction={onRetry} />
          ) : (
            <>
              <div className="project-detail-dialog__summary">
                <h3>{displayProject.name}</h3>
                <StatusBadge label={displayProject.status} tone={displayProject.tone} />
                <p>{displayProject.description}</p>
              </div>
              <dl className="confirm-dialog__info">
                <ConfirmRow label="项目类型" value={project?.type || displayProject.type || "-"} />
                <ConfirmRow label="工作区" value={displayProject.path} />
                <ConfirmRow label="默认环境" value={project?.environmentName || displayProject.environmentName || "未绑定"} />
                <ConfirmRow label="数据集数量" value={displayProject.datasetCount} />
                <ConfirmRow label="任务数量" value={String(displayProject.trainingTasks + displayProject.deploymentTasks)} />
                <ConfirmRow label="模型数量" value={String(displayProject.modelCount ?? 0)} />
                <ConfirmRow label="更新时间" value={displayProject.updatedAt} />
              </dl>
              <div className="project-detail-tabs">
                <ProjectDetailEmptyTab title="关联数据集" />
                <ProjectDetailEmptyTab title="任务记录" />
                <ProjectDetailEmptyTab title="模型资产" />
              </div>
            </>
          )}
        </ScrollArea>
        <footer className="env-create-dialog__footer">
          <div className="env-create-dialog__actions">
            <button className="settings-action-button settings-action-button--primary" onClick={onClose} type="button">关闭</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function ProjectDetailEmptyTab({ title }: { title: string }) {
  return (
    <section className="project-detail-tabs__item">
      <strong>{title}</strong>
      <span>本阶段保留空态，列表将复用对应模块接口。</span>
    </section>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="confirm-dialog__row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function ProjectTextField({ label, value, required, onChange }: {
  label: string;
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="project-dialog__field">
      <span>{label}{required ? " *" : ""}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function ProjectSelectField({ label, value, options, optionalLabel, onChange }: {
  label: string;
  value: string;
  options: string[] | ProjectEnvironmentOption[];
  optionalLabel?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="project-dialog__field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {optionalLabel && <option value="">{optionalLabel}</option>}
        {options.map((option) => {
          const valueKey = typeof option === "string" ? option : option.id;
          const labelText = typeof option === "string" ? option : `${option.name}${option.statusText ? ` / ${option.statusText}` : ""}`;
          return <option key={valueKey} value={valueKey}>{labelText}</option>;
        })}
      </select>
    </label>
  );
}
