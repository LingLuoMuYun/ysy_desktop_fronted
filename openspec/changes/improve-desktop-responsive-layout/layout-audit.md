## Layout Audit

### Located Implementation Areas

- App shell: `frontend/src/layouts/AppShell.tsx`
- Sidebar: `frontend/src/layouts/Sidebar.tsx`
- Home toolbar: `frontend/src/layouts/WindowTitleBar.tsx`
- Assistant panel: `frontend/src/layouts/AssistantPanel.tsx`
- Home page: `frontend/src/pages/HomePage.tsx`
- Global layout styles: `frontend/src/styles/globals.css`
- Layout tokens: `frontend/src/styles/tokens.css`
- Electron window config: `frontend/electron/main/index.ts`

### Highest-Risk Issues Found

- The previous home title bar rendered custom minimize, maximize, and close buttons, which conflicted with the native Windows/macOS title bar decision.
- Electron minimum size was `1040px` by `680px`, below the approved initial `1100px` by `720px` contract.
- App shell dimensions were hard-coded in several places instead of using shared layout tokens.
- The assistant panel occupied fixed width without a compact desktop collapse rule aligned to the new contract.
- Table-like cards and asset rows used a two-column layout that could starve content when the assistant panel was visible or the viewport was compact.
- Home content used large fixed vertical spacing that could feel cramped at the minimum supported height.

### Low-Risk Safeguards Applied

- Shared layout tokens now define shell widths, assistant width, top toolbar height, workspace spacing, and supported minimum dimensions.
- Root and app shell now use bounded desktop dimensions and stable viewport height.
- Compact desktop hides the assistant panel and reduces sidebar width.
- Near-minimum width switches sidebar navigation to icon-only.
- Existing table/list cards stack actions below content at compact desktop widths.
- Home page spacing now uses bounded responsive values and scrolls inside the page region.
