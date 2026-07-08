## Why

The desktop UI needs a clear responsive layout contract before Electron integration and broad page-by-page adjustments begin. Without agreed size boundaries and layout behavior, pages may be tuned inconsistently in the browser and then regress when placed inside the Electron shell.

## What Changes

- Define desktop-first responsive behavior for the React frontend and Electron shell.
- Separate user-owned product decisions from engineering decisions that can be implemented directly.
- Establish minimum window sizing, main app shell behavior, page overflow rules, modal sizing, and high-risk layout areas.
- Add a staged implementation path: browser tuning first, Electron validation second.
- Preserve the product requirement that the app feels like a dense local workstation tool rather than a marketing page or mobile-first website.

## Capabilities

### New Capabilities
- `desktop-responsive-layout`: Defines responsive layout expectations for the desktop app shell, workspace pages, panels, modals, and Electron window constraints.

### Modified Capabilities
- None.

## Impact

- Affected areas:
  - Existing frontend module expectations in `openspec/frontend/modules/frontend.spec.md`.
  - React app shell and global layout containers.
  - Sidebar, unified top bar, resizable right context panel, and page content regions.
  - Dense pages such as projects, tasks, data, models, settings, tables, logs, forms, and detail views.
  - Electron `BrowserWindow` sizing and shell-specific visual validation.
- No backend API changes are expected.
- No data model changes are expected.
- No dependency changes are expected unless the implementation discovers a missing layout utility already used elsewhere in the project.
