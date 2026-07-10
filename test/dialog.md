# Enter explore mode

> Enter explore mode. Think deeply. Visualize freely. Follow the conversation wherever it goes.
>
> **IMPORTANT: Explore mode is for thinking, not implementing.** You may read files, search code, and investigate the codebase, but you must NEVER write code or implement features. If the user asks you to implement something, remind them to exit explore mode first and create a change proposal. You MAY create OpenSpec artifacts (proposals, designs, specs) if the user asks—that's capturing thinking, not implementing.
>
> **This is a stance, not a workflow.** There are no fixed steps, no required sequence, no mandatory outputs. You're a thinking partner helping the user explore.
>
> **Store selection:** If the user names a store (a store is a standalone OpenSpec repo registered on this machine) or the work lives in one, run `openspec store list --json` to discover registered store ids, then pass `--store <id>` on the commands that read or write specs and changes (`new change`, `status`, `instructions`, `list`, `show`, `validate`, `archive`, `doctor`, `context`). Other commands do not take the flag. Hints printed by commands already carry the flag; keep it on follow-ups. Without a store, commands act on the nearest local `openspec/` root.
>
> **Input**: The argument after `/opsx:explore` is whatever the user wants to think about. Could be:
> - A vague idea: "real-time collaboration"
> - A specific problem: "the auth system is getting unwieldy"
> - A change name: "add-dark-mode" (to explore in context of that change)
> - A comparison: "postgres vs sqlite for this"
> - Nothing (just enter explore mode)
>
> ---
>
> ## The Stance
>
> - **Curious, not prescriptive** - Ask questions that emerge naturally, don't follow a script
> - **Open threads, not interrogations** - Surface multiple interesting directions and let the user follow what resonates. Don't funnel them through a single path of questions.
> - **Visual** - Use ASCII diagrams liberally when they'd help clarify thinking
> - **Adaptive** - Follow interesting threads, pivot when new information emerges
> - **Patient** - Don't rush to conclusions, let the shape of the problem emerge
> - **Grounded** - Explore the actual codebase when relevant, don't just theorize
>
> ---
>
> ## What You Might Do
>
> Depending on what the user brings, you might:
>
> **Explore the problem space**
> - Ask clarifying questions that emerge from what they said
> - Challenge assumptions
> - Reframe the problem
> - Find analogies
>
> **Investigate the codebase**
> - Map existing architecture relevant to the discussion
> - Find integration points
> - Identify patterns already in use
> - Surface hidden complexity
>
> **Compare options**
> - Brainstorm multiple approaches
> - Build comparison tables
> - Sketch tradeoffs
> - Recommend a path (if asked)
>
> **Visualize**
> ```
> ┌─────────────────────────────────────────┐
> │     Use ASCII diagrams liberally        │
> ├─────────────────────────────────────────┤
> │                                         │
> │      ┌────────┐         ┌────────┐      │
> │      │ State  │────────▶│ State  │      │
> │      │   A    │         │   B    │      │
> │      └────────┘         └────────┘      │
> │                                         │
> │   System diagrams, state machines,      │
> │   data flows, architecture sketches,    │
> │   dependency graphs, comparison tables  │
> │                                         │
> └─────────────────────────────────────────┘
> ```
>
> **Surface risks and unknowns**
> - Identify what could go wrong
> - Find gaps in understanding
> - Suggest spikes or investigations
>
> ---
>
> ## OpenSpec Awareness
>
> You have full context of the OpenSpec system. Use it naturally, don't force it.
>
> ### Check for context
>
> At the start, quickly check what exists:
> ```bash
> openspec list --json
> ```
>
> This tells you:
> - If there are active changes
> - Their names, schemas, and status
> - What the user might be working on
>
> If the user mentioned a specific change name, read its artifacts for context.
>
> ### When no change exists
>
> Think freely. When insights crystallize, you might offer:
>
> - "This feels solid enough to start a change. Want me to create a proposal?"
> - Or keep exploring - no pressure to formalize
>
> ### When a change exists
>
> If the user mentions a change or you detect one is relevant:
>
> 1. **Resolve and read existing artifacts for context**
>    - Run `openspec status --change "<name>" --json`.
>    - Use `changeRoot`, `artifactPaths`, and `actionContext` from the status JSON.
>    - Read existing files from `artifactPaths.<artifact>.existingOutputPaths`.
>
> 2. **Reference them naturally in conversation**
>    - "Your design mentions using Redis, but we just realized SQLite fits better..."
>    - "The proposal scopes this to premium users, but we're now thinking everyone..."
>
> 3. **Offer to capture when decisions are made**
>
>     | Insight Type               | Where to Capture               |
>     |----------------------------|--------------------------------|
>     | New requirement discovered | `specs/<capability>/spec.md` |
>     | Requirement changed        | `specs/<capability>/spec.md` |
>     | Design decision made       | `design.md`                  |
>     | Scope changed              | `proposal.md`                |
>     | New work identified        | `tasks.md`                   |
>     | Assumption invalidated     | Relevant artifact              |
>
>    Example offers:
>    - "That's a design decision. Capture it in design.md?"
>    - "This is a new requirement. Add it to specs?"
>    - "This changes scope. Update the proposal?"
>
> 4. **The user decides** - Offer and move on. Don't pressure. Don't auto-capture.
>
> ---
>
> ## What You Don't Have To Do
>
> - Follow a script
> - Ask the same questions every time
> - Produce a specific artifact
> - Reach a conclusion
> - Stay on topic if a tangent is valuable
> - Be brief (this is thinking time)
>
> ---
>
> ## Ending Discovery
>
> There's no required ending. Discovery might:
>
> - **Flow into a proposal**: "Ready to start? I can create a change proposal."
> - **Result in artifact updates**: "Updated design.md with these decisions"
> - **Just provide clarity**: User has what they need, moves on
> - **Continue later**: "We can pick this up anytime"
>
> When things crystallize, you might offer a summary - but it's optional. Sometimes the thinking IS the value.
>
> ---
>
> ## Guardrails
>
> - **Don't implement** - Never write code or implement features. Creating OpenSpec artifacts is fine, writing application code is not.
> - **Don't fake understanding** - If something is unclear, dig deeper
> - **Don't rush** - Discovery is thinking time, not task time
> - **Don't force structure** - Let patterns emerge naturally
> - **Don't auto-capture** - Offer to save insights, don't just do it
> - **Do visualize** - A good diagram is worth many paragraphs
> - **Do explore the codebase** - Ground discussions in reality
> - **Do question assumptions** - Including the user's and your own
> 如果我需要在windows系统使用安装包的时候，对环境所需要的文件/包进行下载需要怎么做

<details><summary>1 previous message</summary>

> 我会按 explore mode 来处理：只做梳理和调查，不改代码不实现。先快速看一下当前 OpenSpec 上下文，再把 Windows 安装包下载依赖这件事拆开想清楚。
</details>

可以，这个问题的核心其实是：**Windows 安装包本身不要临时“猜”环境，而是提前定义一套可验证、可恢复、可离线兜底的依赖获取流程。**

我会把它拆成三种模式：

```text
┌──────────────────────────────┐
│ Windows 安装包启动             │
└──────────────┬───────────────┘
               │
               ▼
        检测本机环境
               │
   ┌───────────┼───────────┐
   ▼           ▼           ▼
已满足      缺少依赖      网络不可用
   │           │           │
   ▼           ▼           ▼
继续安装   下载/安装依赖   使用内置包或提示离线包
```

**常见做法有三类：**

1. **安装包内置依赖**

   把运行所需的文件、runtime、模型、二进制包、配置模板等都打进安装包里。

   优点：最稳，离线可用，用户体验好。
   缺点：安装包会变大，依赖更新需要重新发包。

   适合：核心运行环境、必须存在的 DLL、Node/Python runtime、固定版本工具链、小型资源包。

2. **安装时在线下载依赖**

   安装包里只放主程序和下载器，首次安装时从你的服务器、对象存储、GitHub Release、CDN 等位置下载所需文件。

   优点：安装包小，依赖可以独立更新。
   缺点：依赖网络，容易被代理、防火墙、杀毒软件、公司内网策略影响。

   适合：大文件、可选组件、模型文件、示例数据、插件包。

3. **混合模式**

   核心依赖内置，大体积或可选依赖在线下载；如果下载失败，允许用户之后重试，或者手动导入离线包。

   这是我最推荐的方向。

```text
安装包
├─ 主程序
├─ 核心 runtime / 必需 DLL
├─ dependency-manifest.json
├─ downloader.exe / 内置下载逻辑
└─ 可选：离线依赖包目录

远程仓库 / CDN
├─ packages/
│  ├─ python-runtime-3.11.zip
│  ├─ node-runtime-xx.zip
│  ├─ model-v1.bin
│  └─ toolchain-v2.zip
└─ manifest.json
```

比较稳的设计是准备一个 **依赖清单 manifest**，里面记录：

```json
{
  "packages": [
    {
      "name": "python-runtime",
      "version": "3.11.9",
      "url": "https://example.com/packages/python-runtime-3.11.9.zip",
      "sha256": "...",
      "required": true,
      "installPath": "runtime/python"
    }
  ]
}
```

安装流程应该是：

```text
1. 读取依赖清单
2. 检查本地是否已有对应版本
3. 没有则下载
4. 校验 sha256
5. 解压到应用私有目录
6. 写入安装状态
7. 失败时支持重试 / 回滚 / 继续安装后补下载
```

**关键建议：**

- 不建议依赖用户系统里已有的 Python、Node、VC++、Git 等，除非你明确把它们作为前置条件。
- 能私有化就私有化，比如放到：
  `C:\Users\<user>\AppData\Local\YourApp\runtime\`
  或：
  `C:\Program Files\YourApp\runtime\`
- 下载文件必须做 hash 校验，至少 SHA-256。
- 下载地址最好可配置，方便国内网络、企业内网、镜像源切换。
- 安装日志要详细，不然 Windows 环境问题会很难排查。
- 大文件最好支持断点续传或失败重试。
- 如果面向企业用户，可以提供一个“离线完整安装包”。

我会倾向于这样的策略：

```text
核心运行能力：打进安装包
大体积资源：在线下载
企业/弱网场景：提供离线包
依赖版本：manifest 锁定
安全性：hash 校验 + 签名
恢复能力：失败可重试，不污染系统环境
```

如果你说的“环境所需要的文件/包”是这个项目里的具体依赖，比如 Python 包、Node 包、模型文件、浏览器驱动、数据库文件之类，我们可以继续往下拆：哪些该内置，哪些该在线下载，哪些应该让用户手动配置。

> 安装时在线下载依赖，分别分析如何实现

<details><summary>2 previous messages</summary>

> 我先把它当成一个安装器设计问题来拆：同样是“安装时在线下载”，在 Windows 上实现方式会随安装包技术栈差很多。为了不空想，我顺手看一下这个仓库大概用的打包体系，然后再分别分析路径。
>
> 看起来仓库里没有明显的 NSIS/Inno/WiX 配置文件，像是还没把 Windows 安装器方案固定下来。那我们可以先把可选实现路径铺开，后面再按你选的安装器落到 proposal。
</details>

你这个项目目前是 **Electron + electron-builder + Windows NSIS 安装包**，所以“安装时在线下载依赖”可以分几条路线。它们差别很大：有的是**真正安装阶段下载**，有的是**安装后首次启动下载**，还有的是**一个外层 Bootstrapper 先下载再启动安装器**。

我先按实现方式分别拆。

**方案一：NSIS 安装阶段下载**

这是最贴近你说的“安装时下载”。

当前 `frontend/package.json` 里 Windows target 是：

```json
"win": {
  "target": [
    { "target": "nsis", "arch": ["x64"] },
    { "target": "portable", "arch": ["x64"] }
  ]
}
```

可以通过 electron-builder 的 NSIS 自定义脚本，在安装器流程中插入下载逻辑。

流程大概是：

```text
用户运行 Setup.exe
        │
        ▼
NSIS 安装器启动
        │
        ▼
显示安装路径 / 许可 / 选项
        │
        ▼
下载依赖包
        │
        ▼
校验 hash
        │
        ▼
解压到安装目录或用户数据目录
        │
        ▼
继续安装主程序
```

适合下载：

- 后端 runtime 压缩包
- Python/Node 独立运行环境
- CLI 工具
- 模型文件
- 数据包
- 浏览器驱动
- 本地服务二进制

典型目录：

```text
C:\Users\<user>\AppData\Local\Programs\桌面智算\
├─ 桌面智算.exe
├─ resources\
└─ runtime\
   ├─ python\
   ├─ node\
   ├─ backend\
   └─ tools\
```

优点：

- 用户感觉是“一次安装完成”
- 主程序首次启动时环境已经准备好
- 可以失败即中断安装，状态比较明确

缺点：

- NSIS 脚本能力有限，复杂下载、断点续传、代理、重试、进度体验都比较难做得漂亮
- 如果网络差，安装器体验会很脆
- 国内网络、企业代理、防火墙可能让安装失败
- 调试比 Electron 主进程麻烦

我会把它用于：**小到中等体积、必须安装成功才能运行的依赖**。

比如：

```text
runtime-backend.zip      80 MB
python-runtime.zip       120 MB
tools.zip                30 MB
```

但如果依赖几百 MB 甚至几个 GB，这个方案就开始危险了。

**方案二：安装后首次启动下载**

严格说这不是“安装时”，但产品体验上经常更稳。安装包只安装桌面壳，第一次打开应用后，由 Electron 主进程负责下载依赖。

流程：

```text
用户运行 Setup.exe
        │
        ▼
安装主程序
        │
        ▼
首次启动桌面智算
        │
        ▼
环境检查页面
        │
        ▼
下载依赖 / 显示进度 / 支持重试
        │
        ▼
启动本地 runtime
```

结构可以是：

```text
Electron 主进程
    │
    ├─ 检查 runtime 是否存在
    ├─ 读取 dependency-manifest.json
    ├─ 下载缺失依赖
    ├─ sha256 校验
    ├─ 解压
    ├─ 写入 installed-state.json
    └─ 启动后端服务
```

用户看到的界面：

```text
┌────────────────────────────────────┐
│ 正在准备运行环境                    │
├────────────────────────────────────┤
│ Python Runtime      已完成          │
│ 后端服务包          下载中 42%      │
│ 模型工具链          等待中          │
│                                    │
│ [重试] [选择离线包] [查看日志]      │
└────────────────────────────────────┘
```

优点：

- 可以做很好的 UI、进度条、错误提示、重试、代理配置
- Electron/Node 下载文件、校验、解压更自然
- 失败不会导致 Windows 安装器卡死
- 后续依赖更新也能复用同一套机制

缺点：

- 严格来说用户“安装完成”后还不能立即使用
- 如果首启下载失败，需要设计降级状态
- 安全性要做好，不能随便下载执行文件

我更推荐这个作为主方案，尤其是你们这个产品看起来有“runtime / 模型 / 本地服务”的概念。

**方案三：Bootstrapper 外层下载器**

这个模式是：不直接给用户完整安装器，而是给一个很小的 `YSYSetup.exe`。它先联网下载依赖和真正安装包，再执行安装。

流程：

```text
用户运行小安装器 YSYSetup.exe
        │
        ▼
检查系统架构 / 网络 / 权限
        │
        ▼
下载真正安装包
        │
        ▼
下载依赖包
        │
        ▼
校验签名和 hash
        │
        ▼
启动 electron-builder 生成的 NSIS 安装器
```

类似很多大型软件的在线安装器。

目录关系：

```text
YSYSetup.exe                  # 小下载器
remote/
├─ app/
│  └─ 桌面智算-Setup-0.1.0.exe
├─ deps/
│  ├─ backend-runtime.zip
│  ├─ python-runtime.zip
│  └─ tools.zip
└─ manifest.json
```

优点：

- 初始安装器很小
- 可以在安装 Electron app 之前就做依赖判断
- 适合多版本、多渠道、灰度发布
- 可以根据系统下载不同依赖，比如 x64、arm64、CUDA、CPU-only

缺点：

- 需要单独开发维护一个 Windows bootstrapper
- 签名、杀毒误报、下载权限、UAC 都要认真处理
- 比 NSIS 和 Electron 首启都更复杂

适合：

- 商业正式分发
- 依赖很大
- 需要 CDN、灰度、渠道包
- 需要按机器环境动态选择包

**方案四：安装器只下载 manifest，依赖由应用懒加载**

这个更细一点：安装时不下载全部依赖，只下载或内置一个依赖清单。用户进入具体功能时，再下载对应依赖。

比如：

```text
基础应用安装完成
        │
        ├─ AI 对话：需要 backend runtime
        ├─ 本地模型：需要 model runner
        ├─ 数据分析：需要 python env
        └─ 文档处理：需要 office tools
```

依赖关系：

```text
功能 A ──▶ package-runtime-core
功能 B ──▶ package-model-runner
功能 C ──▶ package-python-tools
```

优点：

- 首次安装最快
- 用户不用为没用到的功能下载大文件
- 后续功能模块化更清晰

缺点：

- 每个功能入口都要处理“依赖未安装”
- 体验可能被多次下载打断
- 依赖版本兼容管理更复杂

适合：

- 功能模块很多
- 有些依赖很大
- 用户场景差异明显

**核心机制**

不管选哪种实现，都建议有一个统一的依赖清单：

```json
{
  "schemaVersion": 1,
  "appVersion": "0.1.0",
  "packages": [
    {
      "id": "backend-runtime",
      "version": "0.1.0",
      "platform": "win32",
      "arch": "x64",
      "required": true,
      "url": "https://cdn.example.com/ysy/backend-runtime-0.1.0-win-x64.zip",
      "sha256": "xxxx",
      "size": 125829120,
      "installDir": "runtime/backend"
    }
  ]
}
```

然后本地保存状态：

```json
{
  "installed": {
    "backend-runtime": {
      "version": "0.1.0",
      "sha256": "xxxx",
      "path": "runtime/backend",
      "installedAt": "2026-07-10T10:00:00Z"
    }
  }
}
```

这样安装、首启、更新都能复用同一套判断：

```text
读取 manifest
    │
    ▼
比对本地 installed-state
    │
    ├─ 版本一致 + hash 正确：跳过
    ├─ 缺失：下载
    ├─ 版本过旧：更新
    └─ hash 不一致：删除后重下
```

**我对你这个项目的倾向**

结合现在仓库情况，我会建议：

```text
短期：方案二，安装后首次启动下载
中期：方案二 + 离线包导入
长期：方案三，小型 bootstrapper + CDN manifest
```

更具体一点：

| 依赖类型 | 推荐方式 |
|---|---|
| Electron 主程序 | electron-builder NSIS 正常打包 |
| 小型必需配置 | 内置到安装包 |
| 后端 runtime | 首次启动下载 |
| Python/Node 独立环境 | 首次启动下载或离线包 |
| 大模型/大数据包 | 懒加载下载 |
| 企业内网部署 | 离线完整包 |
| 依赖版本信息 | manifest 管理 |
| 安全校验 | sha256 + HTTPS + 签名 |

我不太建议一开始就把所有下载逻辑塞进 NSIS。它看起来“安装时完成”很漂亮，但后面一旦遇到代理、断点续传、重试、下载源切换、离线导入，NSIS 会变得很难维护。

比较顺的架构是：

```text
NSIS 安装器
    │
    └─ 安装 Electron 桌面壳
              │
              ▼
       Electron 环境管理器
              │
              ├─ 检测依赖
              ├─ 下载依赖
              ├─ 校验依赖
              ├─ 解压依赖
              ├─ 修复依赖
              └─ 启动 runtime
```

这件事已经可以形成一个 OpenSpec change 了。范围可以叫类似 `add-windows-runtime-dependency-download`，先定义 Windows 安装后的依赖下载、校验、恢复、离线兜底体验。

> 如果要求从服务器上下载资源，有没有完整流程

有，完整流程可以设计成一条 **“资源发布链路 + 客户端下载链路 + 失败恢复链路”**。重点不是简单 `download(url)`，而是要保证：**版本可控、下载可验、失败可恢复、资源可回滚、用户可理解**。

**整体流程**

```text
开发/构建侧
    │
    ▼
生成资源包
    │
    ▼
计算 hash / size / version
    │
    ▼
上传到服务器或 CDN
    │
    ▼
生成 manifest.json
    │
    ▼
客户端读取 manifest
    │
    ▼
判断本地缺什么
    │
    ▼
下载资源到临时目录
    │
    ▼
校验完整性
    │
    ▼
解压/安装到目标目录
    │
    ▼
写入本地安装状态
```

**服务端准备**

服务器上建议不要只放一个 zip，而是放一个资源清单：

```text
https://server.com/ysy/
├─ manifests/
│  ├─ latest.json
│  └─ 0.1.0.json
└─ packages/
   ├─ backend-runtime-0.1.0-win-x64.zip
   ├─ python-runtime-3.11.9-win-x64.zip
   └─ tools-0.1.0-win-x64.zip
```

`manifest.json` 示例：

```json
{
  "schemaVersion": 1,
  "appVersion": "0.1.0",
  "packages": [
    {
      "id": "backend-runtime",
      "version": "0.1.0",
      "platform": "win32",
      "arch": "x64",
      "required": true,
      "url": "https://server.com/ysy/packages/backend-runtime-0.1.0-win-x64.zip",
      "sha256": "abc123...",
      "size": 104857600,
      "installDir": "runtime/backend"
    }
  ]
}
```

**客户端下载流程**

```text
1. 启动安装器或首次启动应用
2. 请求 manifest.json
3. 检查系统信息：Windows 版本、x64/arm64、磁盘空间
4. 检查本地 installed-state.json
5. 找出缺失或版本不一致的资源
6. 下载到临时目录
7. 校验文件大小和 sha256
8. 解压到临时安装目录
9. 原子替换到正式目录
10. 写入 installed-state.json
11. 启动应用 runtime
```

本地目录可以这样放：

```text
C:\Users\<用户>\AppData\Local\桌面智算\
├─ runtime\
│  ├─ backend\
│  ├─ python\
│  └─ tools\
├─ downloads\
│  └─ temp\
├─ state\
│  └─ installed-state.json
└─ logs\
   └─ install-runtime.log
```

本地状态文件：

```json
{
  "packages": {
    "backend-runtime": {
      "version": "0.1.0",
      "sha256": "abc123...",
      "installedAt": "2026-07-10T12:00:00Z",
      "path": "runtime/backend"
    }
  }
}
```

**失败恢复**

一定要设计失败状态：

```text
下载失败
    ├─ 自动重试 3 次
    ├─ 允许用户手动重试
    ├─ 允许切换下载源
    └─ 提供离线包导入

校验失败
    ├─ 删除临时文件
    ├─ 重新下载
    └─ 记录安全错误

解压失败
    ├─ 清理临时目录
    ├─ 保留旧版本
    └─ 提示磁盘空间/权限问题

安装失败
    ├─ 不覆盖旧版本
    ├─ 回滚到上一版本
    └─ 写入日志
```

**关键安全点**

- 必须使用 HTTPS。
- 每个资源包必须有 `sha256`。
- 可执行文件、安装器、runtime 包最好做代码签名。
- 不要直接下载后覆盖正在运行的文件。
- 不要信任客户端传来的下载路径。
- manifest 最好也签名，防止资源清单被篡改。

**推荐执行策略**

对你这个 Electron 项目，我建议流程是：

```text
NSIS 安装器
    │
    └─ 安装主程序
          │
          ▼
    Electron 首次启动
          │
          ▼
    RuntimeSetup 页面
          │
          ▼
    下载 manifest
          │
          ▼
    下载依赖资源
          │
          ▼
    校验 / 解压 / 写状态
          │
          ▼
    启动本地服务
```

这样比把复杂下载逻辑塞进 NSIS 更容易做进度条、错误提示、重试、日志、代理配置和离线包导入。

一句话版完整流程：

```text
服务端发布 manifest + package
客户端读取 manifest
客户端比对本地状态
客户端下载缺失资源
客户端校验 hash
客户端解压到临时目录
客户端原子替换
客户端写状态文件
客户端启动 runtime
失败时重试、回滚或导入离线包
```

> 这是后端提供的接口，你觉得要如何处理，让win安装的时候进行下载
>
> User context
>
> Images:
> - `~/Library/Application Support/LarkShell/sdk_storage/ddc829556c31c0c05683dbc5de3f521f/resources/images/img_v3_0213f_6e0526c5-89dc-41bb-8d3d-34dbca4f3fdg.jpg`

结论：**不要让 Windows 安装器直接依赖“后端接口”来下载这个 zip**，除非这个接口是公网/内网服务器上的稳定下载地址。安装阶段本地后端通常还没启动，所以安装器无法调用本机后端 API。

你现在这个资源是：

```text
backend/resources/frameworks/llama.cpp/llama-b9936-bin-win-cpu-x64.zip
```

后端期望解压到用户 Conda 环境：

```text
<conda环境路径>/frameworks/llama.cpp/
```

里面包含：

```text
llama-cli.exe
llama-server.exe
```

这件事更适合按下面方式处理。

**推荐流程**

```text
Windows 安装器
    │
    └─ 安装 Electron 主程序
          │
          ▼
    首次启动应用
          │
          ▼
    检测 Conda / 目标环境
          │
          ▼
    请求后端或远程 manifest
          │
          ▼
    下载 llama.cpp zip
          │
          ▼
    校验 sha256
          │
          ▼
    解压到 <conda环境路径>/frameworks/llama.cpp
          │
          ▼
    调用后端确认环境可用
```

也就是说，**下载动作放在首次启动或创建系统环境时做**，不是放在 NSIS 安装器里做。

原因很明确：

| 问题 | 安装阶段下载 | 首次启动下载 |
|---|---:|---:|
| 能否知道 Conda 环境路径 | 差 | 好 |
| 能否显示下载进度 | 一般 | 好 |
| 能否处理失败重试 | 差 | 好 |
| 能否切换镜像源 | 麻烦 | 好 |
| 能否调用后端逻辑 | 通常不行 | 可以 |
| 是否适合解压到用户环境 | 不适合 | 适合 |

**你们后端接口应该提供什么**

后端不要只告诉前端“zip 在哪里”。最好提供一个资源清单接口，例如：

```http
GET /api/runtime/resources/frameworks
```

返回：

```json
{
  "resources": [
    {
      "id": "llama.cpp",
      "version": "b9936",
      "platform": "win32",
      "arch": "x64",
      "variant": "cpu",
      "fileName": "llama-b9936-bin-win-cpu-x64.zip",
      "downloadUrl": "https://your-server.com/resources/frameworks/llama.cpp/llama-b9936-bin-win-cpu-x64.zip",
      "sha256": "xxxx",
      "size": 123456789,
      "extractTo": "frameworks/llama.cpp",
      "requiredFiles": [
        "llama-cli.exe",
        "llama-server.exe"
      ]
    }
  ]
}
```

前端/Electron 主进程拿到后执行：

```text
1. 检查 <conda环境路径>/frameworks/llama.cpp/llama-cli.exe 是否存在
2. 如果不存在，下载 zip
3. 下载到临时目录
4. 校验 sha256
5. 解压到临时目录
6. 检查 requiredFiles
7. 移动到 <conda环境路径>/frameworks/llama.cpp
8. 通知后端环境创建完成
```

**下载地址要注意**

如果现在 zip 只是放在项目里的：

```text
backend/resources/frameworks/llama.cpp/...
```

那它不是“服务器资源”，只是源码仓库里的文件。Windows 安装器下载不到它，除非你做其中一种处理：

1. **打包进安装包**
   - zip 随 Electron app 一起发布。
   - 安装或首次启动时从本地 `resources` 目录复制并解压。
   - 优点：不依赖网络。
   - 缺点：安装包变大。

2. **上传到服务器/CDN**
   - 例如：
     ```text
     https://download.your-domain.com/ysy/frameworks/llama-b9936-bin-win-cpu-x64.zip
     ```
   - 后端接口只返回这个 URL 和 hash。
   - 优点：安装包小，可独立更新。
   - 缺点：依赖网络。

3. **后端提供文件下载接口**
   - 例如：
     ```http
     GET /api/download/frameworks/llama.cpp/win-cpu-x64
     ```
   - 但这个接口必须运行在远程服务器上。
   - 如果是本机后端，安装时不能用，因为本机后端还没安装好。

**不建议的做法**

不要在 NSIS 里写死：

```text
下载 llama-b9936-bin-win-cpu-x64.zip
解压到 D:/Miniconda3/envs/ysy-xxx/...
```

因为：

- 用户不一定装在 `D:/Miniconda3`
- Conda 环境可能还不存在
- 没法可靠处理代理、失败重试、权限问题
- 后续换版本很难维护

**更稳的产品设计**

把这个资源归类为“运行环境组件”，而不是“安装包组件”。

```text
安装包负责：
- 安装桌面应用
- 提供环境管理入口

后端/环境管理器负责：
- 创建 Conda 环境
- 下载 llama.cpp
- 解压 llama.cpp
- 校验 llama-cli.exe / llama-server.exe
- 记录安装状态
```

本地状态可以记录成：

```json
{
  "frameworks": {
    "llama.cpp": {
      "version": "b9936",
      "variant": "win-cpu-x64",
      "path": "D:/Miniconda3/envs/ysy-llm-inference-llm-llm/frameworks/llama.cpp",
      "installed": true,
      "sha256": "xxxx"
    }
  }
}
```

**最终建议**

你这个场景我建议采用：

```text
Electron 首次启动 / 创建环境时下载
+
后端提供资源 manifest
+
资源文件放服务器或 CDN
+
下载后解压到 Conda env/frameworks/llama.cpp
```

安装器只负责安装主程序，不负责直接下载和解压这个 llama.cpp zip。这样后续新增 CUDA 版、GPU 版、不同架构、不同框架时，不需要重新设计安装器。

> 这个接口是公网/内网服务器上的稳定下载地址

那就可以做“安装时下载”，但建议分清两层：**安装器负责把资源下载到本机缓存目录**，**应用/后端负责在创建 Conda 环境时解压到正确位置**。不要在安装器阶段直接解压到 Conda 环境，除非安装器已经能可靠拿到环境路径。

推荐完整流程：

```text
NSIS 安装器
    │
    ├─ 安装 Electron 主程序
    │
    ├─ 从公网/内网稳定地址下载 llama.cpp zip
    │
    ├─ 校验 sha256
    │
    └─ 保存到本机资源缓存目录
          │
          ▼
首次启动 / 创建系统环境
          │
          ├─ 后端检测缓存目录是否已有 zip
          ├─ 校验 sha256
          ├─ 创建 Conda 环境
          ├─ 解压到 <conda环境路径>/frameworks/llama.cpp
          └─ 检查 llama-cli.exe / llama-server.exe
```

资源缓存目录建议：

```text
%LOCALAPPDATA%\桌面智算\packages\frameworks\llama.cpp\
└─ llama-b9936-bin-win-cpu-x64.zip
```

或者如果是按机器安装：

```text
%PROGRAMDATA%\桌面智算\packages\frameworks\llama.cpp\
└─ llama-b9936-bin-win-cpu-x64.zip
```

不要直接放到安装目录，原因是应用升级/卸载时容易被清掉，也可能遇到权限问题。

安装器里需要配置的信息：

```json
{
  "id": "llama.cpp",
  "version": "b9936",
  "platform": "win32",
  "arch": "x64",
  "variant": "cpu",
  "url": "https://your-server.com/resources/frameworks/llama.cpp/llama-b9936-bin-win-cpu-x64.zip",
  "sha256": "xxxx",
  "size": 123456789,
  "cachePath": "%LOCALAPPDATA%/桌面智算/packages/frameworks/llama.cpp/llama-b9936-bin-win-cpu-x64.zip",
  "extractTo": "<conda_env>/frameworks/llama.cpp",
  "requiredFiles": [
    "llama-cli.exe",
    "llama-server.exe"
  ]
}
```

**安装器阶段做这些：**

```text
1. 检查缓存目录是否已有同版本 zip
2. 如果已有，计算 sha256
3. hash 正确则跳过下载
4. hash 错误则删除后重新下载
5. 下载到 .part 临时文件
6. 下载完成后校验 sha256
7. 校验通过后 rename 成正式 zip
8. 写入 package-state.json
```

状态文件：

```json
{
  "packages": {
    "llama.cpp": {
      "version": "b9936",
      "variant": "win-cpu-x64",
      "file": "llama-b9936-bin-win-cpu-x64.zip",
      "sha256": "xxxx",
      "downloaded": true
    }
  }
}
```

**应用/后端阶段做这些：**

```text
1. 创建 Conda 环境
2. 找到 package-state.json
3. 找到 llama.cpp zip
4. 再次校验 sha256
5. 解压到 <conda环境路径>/frameworks/llama.cpp
6. 检查 requiredFiles
7. 记录 framework installed 状态
```

这样拆分的原因是：

| 职责 | 放在安装器 | 放在应用/后端 |
|---|---:|---:|
| 下载固定 zip | 适合 | 也适合 |
| 校验 hash | 适合 | 必须再做 |
| 判断 Conda 环境路径 | 不适合 | 适合 |
| 解压到 Conda env | 不推荐 | 推荐 |
| 失败重试 UI | 一般 | 更好 |
| 后续修复/重装 | 差 | 好 |

如果你坚持“安装时就下载并解压到 Conda 环境”，前提是安装器必须先做：

```text
1. 检测 Miniconda/Anaconda 是否存在
2. 确认目标 env 已存在，或安装器创建 env
3. 确认目标 env 路径
4. 下载 zip
5. 解压到 env/frameworks/llama.cpp
6. 检查 exe
```

但这个方案复杂很多，而且和后端“用户创建系统环境”的流程冲突。既然你截图里写的是“用户创建系统环境时，后端会把它解压到用户的 Conda 环境目录里”，那安装器只下载并缓存是更合理的。

最终建议：

```text
Win 安装时：
下载 zip 到 %LOCALAPPDATA%\桌面智算\packages\...

创建环境时：
后端优先使用本地缓存 zip
缓存不存在或 hash 不对，再从服务器下载
解压到 <conda环境路径>/frameworks/llama.cpp
```

这能同时满足“安装时下载资源”和“后端按 Conda 环境解压”的要求。

> 现在先不下载了，直接把环境包放在文件中，采用免安装的形式，直接带着该环境。这样的话该怎么处理

可以。这个方案本质是：**不在安装时下载，也不依赖用户本机 Conda，而是把运行环境作为应用资源一起随包发布**。这更像“便携式 runtime”。

推荐处理方式如下。

**目标形态**

```text
桌面智算/
├─ 桌面智算.exe
├─ resources/
│  ├─ app.asar
│  └─ runtime/
│     ├─ env/
│     │  ├─ python.exe
│     │  ├─ python311.dll
│     │  ├─ Library/
│     │  ├─ Lib/
│     │  ├─ Scripts/
│     │  └─ frameworks/
│     │     └─ llama.cpp/
│     │        ├─ llama-cli.exe
│     │        └─ llama-server.exe
│     └─ runtime-manifest.json
└─ data/
```

也就是把原本要解压到：

```text
D:/Miniconda3/envs/ysy-llm-inference-llm-llm/frameworks/llama.cpp
```

改成随应用携带：

```text
<应用目录>/resources/runtime/env/frameworks/llama.cpp
```

或者用户可写目录：

```text
%LOCALAPPDATA%/桌面智算/runtime/env/frameworks/llama.cpp
```

**关键选择**

有两个可行方案：

| 方案 | 做法 | 推荐度 |
|---|---|---:|
| A. 完整环境随安装包/免安装包携带 | 把 Conda env 打包进应用目录 | 高 |
| B. 首次启动从内置 zip 解压到用户目录 | zip 随应用发布，首次启动解压 | 更高 |

我更推荐 **B**。

原因：Electron 安装目录可能不可写，尤其是 `Program Files`；而 Conda/Python 环境运行时可能会写缓存、生成文件、修复路径。把环境解压到用户目录更稳。

```text
安装包/免安装包内置：
resources/packages/ysy-runtime-env-win-x64.zip

首次启动：
解压到 %LOCALAPPDATA%/桌面智算/runtime/env
```

这样虽然不是“在线下载”，但仍然保留了“环境准备”流程。

**推荐完整流程**

```text
应用启动
    │
    ▼
检查 %LOCALAPPDATA%/桌面智算/runtime/env 是否存在
    │
    ├─ 存在：校验 manifest / 必需文件
    │
    └─ 不存在：从内置 zip 解压
              │
              ▼
       校验 python.exe / llama-server.exe
              │
              ▼
       写入 runtime-state.json
              │
              ▼
       启动后端 runtime
```

内置包结构：

```text
resources/
└─ packages/
   ├─ ysy-runtime-env-win-x64.zip
   └─ runtime-manifest.json
```

`runtime-manifest.json`：

```json
{
  "id": "ysy-runtime-env",
  "version": "0.1.0",
  "platform": "win32",
  "arch": "x64",
  "sha256": "xxxx",
  "extractTo": "%LOCALAPPDATA%/桌面智算/runtime/env",
  "requiredFiles": [
    "python.exe",
    "frameworks/llama.cpp/llama-cli.exe",
    "frameworks/llama.cpp/llama-server.exe"
  ]
}
```

**环境包怎么制作**

如果现在后端依赖 Conda 环境，建议用 `conda-pack` 打包，而不是直接复制 env 目录。

制作侧：

```bash
conda activate ysy-llm-inference-llm-llm
conda pack -n ysy-llm-inference-llm-llm -o ysy-runtime-env-win-x64.zip
```

首次解压后，在 Windows 上通常需要执行一次：

```text
conda-unpack.exe
```

或者对应的 unpack 脚本，用来修复 Conda 环境里的路径引用。

这是重点：**Conda 环境不能简单复制后随便移动**。很多包里面会记录绝对路径。用 `conda-pack` 可以缓解这个问题，但首次解压后仍要修复。

**后端需要调整的点**

原逻辑可能是：

```text
<conda环境路径>/frameworks/llama.cpp
```

现在建议抽象成：

```text
<runtimeRoot>/frameworks/llama.cpp
```

运行时配置由前端/Electron 或启动器传给后端：

```json
{
  "runtimeRoot": "C:/Users/<user>/AppData/Local/桌面智算/runtime/env",
  "frameworkRoot": "C:/Users/<user>/AppData/Local/桌面智算/runtime/env/frameworks/llama.cpp",
  "llamaServer": "C:/Users/<user>/AppData/Local/桌面智算/runtime/env/frameworks/llama.cpp/llama-server.exe"
}
```

不要在后端写死 Conda 路径。

**免安装发布包结构**

如果你说的是完全免安装，比如用户解压即可运行，可以这样：

```text
桌面智算-portable-win-x64/
├─ 桌面智算.exe
├─ resources/
├─ runtime/
│  └─ env/
│     ├─ python.exe
│     └─ frameworks/
│        └─ llama.cpp/
│           ├─ llama-cli.exe
│           └─ llama-server.exe
└─ start.bat
```

但这个方案有一个风险：如果用户把目录放到中文路径、空格路径、权限受限目录，某些环境包可能出问题。所以仍建议启动时检测路径和权限。

**最终建议**

采用这个设计：

```text
发布包内置 ysy-runtime-env-win-x64.zip
首次启动解压到 %LOCALAPPDATA%/桌面智算/runtime/env
后端从 runtimeRoot 读取环境
llama.cpp 放在 runtime/env/frameworks/llama.cpp
不再依赖用户本机 Conda
```

这样比“直接把 env 目录塞进安装目录”更稳，也方便后续升级：只要比较 `runtime-manifest.json` 的版本，不一致就重新解压新的内置环境包。

> 再进行一些优化，虽然是免安装，一起打包在安装程序中，但是我们在安装过程中还要体现这一点，这九个选择项都要有，但是目前只开放大模型推理的LLM，并进行默认勾选，其他安装包先禁止安装。
>
> User context
>
> Images:
> - `/var/folders/4c/5jg9fb3x72x1fl5sxz1vtclr0000gn/T/codex-clipboard-cfd6d5a7-792a-48ca-bb39-119d2575de61.png`

可以，这里建议把它定义成 **“安装时组件选择页”**，但当前阶段只是展示能力矩阵，不真正安装全部组件。

重点规则：

```text
9 个选择项都展示
只有“大模型推理 / LLM”开放
“大模型推理 / LLM”默认勾选
其他 8 项禁用、不可勾选
环境包随安装程序内置，不在线下载
安装时只释放 LLM 推理环境包
```

**安装页结构**

建议按你截图的三组展示：

```text
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 深度学习      │ │ 大模型训练    │ │ 大模型推理    │
│              │ │              │ │              │
│ ☐ 目标检测    │ │ ☐ LLM        │ │ ☑ LLM        │
│ ☐ 图像分类    │ │ ☐ Embedding  │ │ ☐ Embedding  │
│ ☐ 语义检测    │ │ ☐ Rerank     │ │ ☐ Rerank     │
└──────────────┘ └──────────────┘ └──────────────┘
   disabled        disabled        LLM enabled
```

当前状态矩阵：

| 模块 | 子项 | 展示 | 默认 | 可选 | 实际安装 |
|---|---|---:|---:|---:|---:|
| 深度学习 | 目标检测 | 是 | 否 | 否 | 否 |
| 深度学习 | 图像分类 | 是 | 否 | 否 | 否 |
| 深度学习 | 语义检测 | 是 | 否 | 否 | 否 |
| 大模型训练 | LLM | 是 | 否 | 否 | 否 |
| 大模型训练 | Embedding | 是 | 否 | 否 | 否 |
| 大模型训练 | Rerank | 是 | 否 | 否 | 否 |
| 大模型推理 | LLM | 是 | 是 | 是 | 是 |
| 大模型推理 | Embedding | 是 | 否 | 否 | 否 |
| 大模型推理 | Rerank | 是 | 否 | 否 | 否 |

**打包结构建议**

既然不下载，资源直接进安装包：

```text
frontend/
└─ installer-resources/
   └─ packages/
      └─ inference-llm-win-x64.zip
```

打包后进入 Electron 安装包资源目录：

```text
resources/
└─ packages/
   └─ inference-llm-win-x64.zip
```

安装时释放到用户目录：

```text
%LOCALAPPDATA%\桌面智算\runtime\packages\
└─ inference-llm-win-x64.zip
```

首次启动或安装阶段再解压到：

```text
%LOCALAPPDATA%\桌面智算\runtime\envs\inference-llm\
```

不建议解压到 `Program Files`，权限和后续更新都会麻烦。

**安装过程应该体现什么**

安装器页面文案不要说“下载环境”，而应该说：

```text
选择要安装的能力组件
当前版本仅开放：大模型推理 - LLM
其他能力将在后续版本开放
```

但 UI 上不要做成说明文堆满页面。更实用的是：

- 禁用项置灰
- 鼠标悬停提示：`暂未开放`
- 默认选中 `大模型推理 / LLM`
- 不允许取消最后一个必需组件，或者允许取消但提示应用将无法运行推理能力

**实现路径**

因为你们用的是 `electron-builder + nsis`，有两种实现级别。

**方案 A：NSIS 标准组件页**

优点：简单，符合 Windows 安装器习惯。
缺点：很难做成你截图这种三列卡片布局。

适合做成：

```text
[ ] 深度学习 - 目标检测    disabled
[ ] 深度学习 - 图像分类    disabled
[ ] 深度学习 - 语义检测    disabled
[ ] 大模型训练 - LLM       disabled
[ ] 大模型训练 - Embedding disabled
[ ] 大模型训练 - Rerank    disabled
[x] 大模型推理 - LLM       enabled
[ ] 大模型推理 - Embedding disabled
[ ] 大模型推理 - Rerank    disabled
```

**方案 B：NSIS 自定义页面**

优点：可以做成接近截图的三列卡片。
缺点：NSIS UI 开发成本更高，需要自定义安装脚本。

如果产品要求安装过程视觉上必须接近截图，用这个方案。

**关键职责拆分**

```text
NSIS 安装器
    ├─ 展示 9 个组件选择项
    ├─ 只允许选择 大模型推理/LLM
    ├─ 将内置 zip 复制到 runtime packages
    └─ 写入 component-state.json

Electron / 后端
    ├─ 读取 component-state.json
    ├─ 检查 inference-llm 包是否存在
    ├─ 解压环境
    ├─ 校验 llama-cli.exe / llama-server.exe
    └─ 启动推理 runtime
```

状态文件建议：

```json
{
  "components": {
    "deep-learning.object-detection": "disabled",
    "deep-learning.image-classification": "disabled",
    "deep-learning.semantic-detection": "disabled",
    "training.llm": "disabled",
    "training.embedding": "disabled",
    "training.rerank": "disabled",
    "inference.llm": "installed",
    "inference.embedding": "disabled",
    "inference.rerank": "disabled"
  }
}
```

最终建议：

```text
保留 NSIS 安装流程
增加“能力组件选择页”
九个选项全部展示
仅 inference.llm 可用并默认勾选
内置 inference-llm-win-x64.zip
安装时复制到用户 runtime 目录
首次启动/后端启动时完成解压和校验
```

如果要进入实现，需要先退出 explore mode，然后建一个 OpenSpec change，例如 `add-windows-component-installer-options`。

> **NSIS 自定义页面**
> 优点：可以做成接近截图的三列卡片。
> 缺点：NSIS UI 开发成本更高，需要自定义安装脚本。
>
> 自定义安装脚本，用户需要安装吗，还是我们开发人员在文件中进行安装

不需要用户安装“自定义安装脚本”。

NSIS 自定义脚本是**开发/打包阶段**用的，最终会被 `electron-builder` 编译进 Windows 安装程序里。用户拿到的仍然只是一个正常的安装包，例如：

```text
桌面智算 Setup 0.1.0.exe
```

用户双击它，不需要知道 NSIS 脚本存在，也不需要额外安装任何东西。

流程是：

```text
开发人员
    │
    ├─ 在项目里新增 NSIS 自定义脚本
    │
    ├─ 配置 electron-builder 使用该脚本
    │
    └─ 执行 pnpm run electron:package:win
              │
              ▼
        生成 Setup.exe
              │
              ▼
用户双击 Setup.exe 安装
```

项目里大概会放这些文件：

```text
frontend/
├─ package.json
├─ build/
│  └─ installer.nsh          # NSIS 自定义脚本
└─ installer-resources/
   └─ packages/
      └─ inference-llm-win-x64.zip
```

`package.json` 里配置：

```json
{
  "build": {
    "nsis": {
      "include": "build/installer.nsh"
    }
  }
}
```

安装包生成时，`electron-builder` 会把 `installer.nsh` 合并进 NSIS 安装流程。

用户侧看到的是：

```text
1. 欢迎页
2. 选择安装目录
3. 能力组件选择页
   - 深度学习：目标检测 / 图像分类 / 语义检测，禁用
   - 大模型训练：LLM / Embedding / Rerank，禁用
   - 大模型推理：LLM 默认勾选，可用
4. 安装进度
5. 完成
```

资源包也类似。用户不需要手动放文件，开发人员在打包前把环境包放进项目的资源目录，打包命令会把它带进安装程序。

```text
开发人员准备：
frontend/installer-resources/packages/inference-llm-win-x64.zip

打包后：
Setup.exe 内部包含这个 zip

用户安装时：
Setup.exe 自动释放这个 zip 到本机目录
```

所以职责划分是：

| 事项 | 谁处理 |
|---|---|
| 写 NSIS 自定义页面脚本 | 开发人员 |
| 把环境 zip 放进项目 | 开发人员/构建流程 |
| 执行打包命令 | 开发人员/CI |
| 安装 NSIS 脚本 | 不需要用户处理 |
| 用户安装应用 | 用户只运行 Setup.exe |
| 选择组件 | 用户只看到安装器 UI |

如果用 `electron-builder`，开发机/CI 需要安装依赖：

```bash
pnpm install
pnpm run electron:package:win
```

一般不需要你单独安装 NSIS，`electron-builder` 会处理相关打包工具。用户机器更不需要。

> 那就采用自定义页面的方案。
> 再讲一下实现流程以及哪些地方还有问题

可以。采用 **NSIS 自定义页面** 后，整体实现可以按“安装器 UI 展示 + 内置环境包释放 + 应用启动校验”三段做。

**目标流程**

```text
开发阶段
    │
    ├─ 准备 LLM 推理环境包
    ├─ 放入安装包资源目录
    ├─ 编写 NSIS 自定义页面脚本
    ├─ 配置 electron-builder 引入脚本
    └─ 打包生成 Windows Setup.exe

用户安装阶段
    │
    ├─ 打开 Setup.exe
    ├─ 显示自定义组件选择页
    ├─ 9 个选项全部展示
    ├─ 仅“大模型推理 / LLM”默认勾选并可用
    ├─ 其他 8 个选项置灰禁用
    ├─ 复制内置 LLM 环境包到本地 runtime 目录
    └─ 写入组件安装状态

首次启动阶段
    │
    ├─ Electron / 后端读取组件状态
    ├─ 检查 LLM 环境包是否存在
    ├─ 解压或加载免安装环境
    ├─ 校验 llama-cli.exe / llama-server.exe
    └─ 启动推理能力
```

**项目文件建议**

```text
frontend/
├─ package.json
├─ build/
│  ├─ installer.nsh                 # NSIS 自定义逻辑
│  └─ component-page.nsh            # 可选：组件页拆分
├─ installer-resources/
│  ├─ component-manifest.json
│  └─ packages/
│     └─ inference-llm-win-x64.zip
└─ electron/
   └─ main/
      └─ index.ts
```

`package.json` 里需要让 `electron-builder` 带上脚本和资源：

```json
{
  "build": {
    "extraResources": [
      {
        "from": "installer-resources",
        "to": "installer-resources"
      }
    ],
    "nsis": {
      "include": "build/installer.nsh"
    }
  }
}
```

**安装器自定义页面做什么**

页面只负责展示和记录选择，不负责复杂环境逻辑。

```text
页面展示：
- 深度学习
  - 目标检测：禁用
  - 图像分类：禁用
  - 语义检测：禁用

- 大模型训练
  - LLM：禁用
  - Embedding：禁用
  - Rerank：禁用

- 大模型推理
  - LLM：默认勾选，可用
  - Embedding：禁用
  - Rerank：禁用
```

安装时写一个状态文件，例如：

```json
{
  "components": {
    "deep-learning.object-detection": "disabled",
    "deep-learning.image-classification": "disabled",
    "deep-learning.semantic-detection": "disabled",
    "training.llm": "disabled",
    "training.embedding": "disabled",
    "training.rerank": "disabled",
    "inference.llm": "installed",
    "inference.embedding": "disabled",
    "inference.rerank": "disabled"
  }
}
```

建议写入：

```text
%LOCALAPPDATA%\桌面智算\runtime\component-state.json
```

LLM 环境包建议复制到：

```text
%LOCALAPPDATA%\桌面智算\runtime\packages\inference-llm-win-x64.zip
```

**仍然存在的问题**

1. **NSIS 自定义 UI 能力有限**

   做出接近截图的“三列卡片”可以，但不会像 Web UI 那样灵活。NSIS 原生控件对间距、圆角、卡片样式、hover 提示支持有限。

   如果要求高度还原截图，成本会明显上升。务实方案是：三列分组 + checkbox + 禁用态，视觉接近即可。

2. **禁用项是否可点击**

   NSIS 可以禁用 checkbox，但禁用项的说明、tooltip、灰色状态需要额外处理。建议先不做复杂 hover，只做禁用态和页面底部说明。

3. **安装包体积会变大**

   环境包内置后，`Setup.exe` 会明显变大。需要确认：

   ```text
   inference-llm-win-x64.zip 大小是多少
   最终 Setup.exe 是否可接受
   是否需要分卷或压缩优化
   ```

4. **环境包是 zip 还是已解压目录**

   两种做法：

   ```text
   A. 安装包内置 zip，安装时复制，首次启动解压
   B. 安装包内置解压后的目录，安装时直接释放
   ```

   我建议 A。原因是安装过程更快、文件数量少、状态更容易校验。

5. **免安装环境是否真的可移动**

   如果这个环境来自 Conda，直接打包整个 env 可能有绝对路径问题。需要确认是否用 `conda-pack` 生成，并在首次解压后执行修复逻辑。

   这是核心风险之一。

6. **安装阶段还是首次启动阶段解压**

   建议安装阶段只复制 zip，不解压。首次启动时由 Electron/后端解压和校验。

   原因：解压耗时、失败恢复、日志展示都更适合在应用内做。

7. **卸载时是否删除环境包**

   要决定卸载策略：

   ```text
   只卸载应用，保留 runtime 环境
   或
   卸载时删除 %LOCALAPPDATA%\桌面智算\runtime
   ```

   默认建议：卸载主程序时询问是否删除运行环境和数据。不要默认删除用户数据。

8. **升级时如何处理旧环境**

   需要版本号机制：

   ```json
   {
     "inference.llm": {
       "version": "0.1.0",
       "package": "inference-llm-win-x64.zip",
       "sha256": "..."
     }
   }
   ```

   升级安装时比较版本，不一致再替换包或重新解压。

9. **安装页面选择和实际能力要一致**

   既然 UI 显示 9 个能力，后端也应该有对应的 capability key。否则后续开放其他组件时会混乱。

   建议现在就固定 key：

   ```text
   deep-learning.object-detection
   deep-learning.image-classification
   deep-learning.semantic-detection
   training.llm
   training.embedding
   training.rerank
   inference.llm
   inference.embedding
   inference.rerank
   ```

**推荐落地顺序**

```text
1. 固定组件 key 和状态文件格式
2. 准备 inference-llm-win-x64.zip
3. 配置 extraResources 把 zip 带进安装包
4. 编写 NSIS 自定义组件页
5. 安装时复制 zip 到 %LOCALAPPDATA%
6. 首次启动读取 component-state.json
7. 校验并解压 LLM 环境
8. 后端从 runtimeRoot 启动 llama-server.exe
9. 补充升级、卸载、失败恢复策略
```

当前还在 explore mode，我不会直接改代码。要开始实现的话，建议先创建一个 OpenSpec change，例如：

```text
add-windows-custom-component-installer
```

这个 change 应该覆盖：NSIS 自定义页面、组件状态文件、内置 LLM 环境包释放、首次启动校验与解压、升级/卸载策略。
