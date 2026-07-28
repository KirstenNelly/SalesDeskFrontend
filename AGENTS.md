# AGENTS.md — SalesDesk POS Frontend

Guidance for GitHub Copilot (and any other coding agent) working in this repository.
Read this fully before generating or editing code. When any instruction here conflicts
with a general habit (e.g. "just use React"), **this file wins**.

## 1. What this project is

Frontend for the SalesDesk POS System: a multi-page web application (MPA) served as
static assets from a Spring Boot backend, also packaged as a PWA and wrapped in
Electron for Windows desktop. Two role-based interfaces: **Administrator** and
**Cashier**. Full requirements live in `docs/PRD.docx` (or wherever the PRD is stored)
— treat that as the source of truth for scope; this file is about *how* to build it.

## 2. Hard constraints — do not violate

- **No frontend frameworks or libraries for UI/state**: no React, Angular, Vue,
  jQuery, Svelte, etc. Plain **HTML5, CSS3, vanilla JavaScript (ES6+)** only.
- **No build tooling**: no Webpack, Vite, Babel, TypeScript compiler, bundlers, or npm
  UI packages. `<script type="module">` + native ES modules is fine. The only
  permitted third-party assets are: Google Fonts (DM Sans, DM Serif Display), Lucide
  Icons, and the ZXing barcode library — loaded as plain `<script>`/CDN or vendored
  files, never via a bundler.
- **Multi-page, not SPA**: every screen is its own `.html` file. Do not introduce a
  client-side router or convert this into a single-page app.
- **Files live under `src/main/resources/static/`** so Spring Boot can serve them
  directly. Never propose a separate Node/Express server for the frontend itself.
- If a task seems to require a framework or bundler to do "properly," stop and
  propose the vanilla-JS equivalent instead of silently adding a dependency.

## 3. Repository layout (create/maintain this structure)

```
src/main/resources/static/
  admin/                # Admin-only pages (dashboard.html, products.html, ...)
  cashier/              # Cashier-only pages (dashboard.html, pos.html, ...)
  auth/                 # login.html, (register.html if applicable)
  shared/
    css/                # design-tokens.css, base.css, components.css, layout.css
    js/
      layout.js         # renders sidebar/topbar/footer/profile, injects into page
      api.js            # fetch wrapper: base URL, JWT header, error handling, logout
      auth-guard.js      # login/token/role checks for protected pages
      notifications.js  # toast/modal notification service
      barcode.js         # ZXing camera scanning + scanner/manual input handling
      storage.js         # thin Local Storage accessor (keys centralized here)
    icons/              # Lucide icon assets/sprite
  manifest.webmanifest
  service-worker.js
  offline.html
electron/                # Electron main process + wrapper config (if present)
```

Keep this layout stable. New pages go under `admin/` or `cashier/`; new shared
behavior goes under `shared/js/`, never copy-pasted per page.

## 4. Page pattern (follow for every new page)

Each page HTML file should be minimal: a `<div id="layout-root">` placeholder plus
the page's unique markup, and should:

1. Load `shared/css/*.css` and `shared/js/*.js` as ES modules.
2. Call the **auth guard** first, before rendering page content, with the required
   role(s) for that page (e.g. `requireRole('ADMIN')` or `requireRole('CASHIER')`).
3. Call the **layout renderer** to inject sidebar/top nav/footer/profile.
4. Fetch its own data through `shared/js/api.js` — never `fetch()` directly in a
   page script; never hardcode API base URLs per page.
5. Use the shared notification service for all success/error feedback, not
   `alert()`/`console.log` in production paths.

When adding a new page, mirror the structure of the closest existing page rather
than inventing a new pattern.

## 5. API & auth conventions

- All backend calls go through `api.js`. It attaches
  `Authorization: Bearer <token>` from Local Storage, parses JSON, and normalizes
  errors into a consistent shape the notification service understands.
- On any `401` response, `api.js` triggers logout + redirect to `auth/login.html` —
  do not duplicate this logic in individual pages.
- JWT and user profile are stored under clearly named Local Storage keys defined in
  `storage.js` — don't read/write Local Storage keys ad hoc from page scripts.
- Role checks happen client-side for UX (redirect before rendering) but are never a
  substitute for server-side authorization — don't remove or weaken server checks
  when working on the frontend.

## 6. Styling conventions

- Colors, spacing, and typography are CSS custom properties in
  `shared/css/design-tokens.css` (e.g. `--color-navy`, `--color-teal`, `--color-gold`,
  `--font-heading`, `--font-body`). Use these variables — don't hardcode hex colors
  or font names in page-level CSS.
- Mobile-first responsive CSS using media queries; verify new UI at desktop, tablet,
  and mobile widths before considering a page done.
- Prefer flexbox/grid layouts; reuse existing component classes (cards, buttons,
  tables, forms) from `components.css` instead of writing new one-off styles.

## 7. Feature-specific notes

- **Barcode scanning**: support hardware scanner input (keyboard-wedge, listen for
  rapid keystrokes + Enter), camera scanning via ZXing, and manual entry — all three
  should feed the same "product found" handler. Search the locally cached product
  list first, then fall back to an API lookup.
- **Payments**: Cash (compute change), M-Pesa (STK Push then poll status with a
  visible loading state and a timeout/failure path), Credit (deposit + outstanding
  balance). Never mark a sale complete in the UI before the backend confirms it.
- **Receipts**: generate an 80mm-width printable receipt view and use
  `window.print()` (or an equivalent print window) — don't add a PDF-generation
  dependency for this.
- **PWA**: keep `manifest.webmanifest` and `service-worker.js` in sync with the page
  list; the app should prefer live data and only fall back to `offline.html`/cached
  data when the network is unavailable.
- **Electron**: the wrapper loads the hosted app as-is — don't fork logic between
  "web build" and "Electron build"; feature-detect (e.g. `window.electronAPI`) if
  Electron-only behavior (like native printing) is required.

## 8. Working style for the agent

- Before adding a new page or module, check for an existing shared utility that
  already does what you need (layout, api, auth-guard, notifications, storage,
  barcode) and reuse it rather than re-implementing.
- Keep functions small and files organized by responsibility; add brief comments
  explaining *why*, not line-by-line *what*.
- When a request is ambiguous, prefer the pattern already used elsewhere in the
  codebase over introducing a new one.
- Do not add analytics, ad, or telemetry scripts unless explicitly asked.
- Do not introduce a package manager lockfile churn (e.g. unnecessary `npm install`)
  since this project intentionally has no build step for the frontend itself.

## 9. Verification before considering a task done

- Open the changed/new page directly in a browser (served from Spring Boot or via a
  simple static server) and click through the flow.
- Check the browser console for errors/warnings.
- Resize the viewport to confirm desktop, tablet, and mobile layouts still work.
- For API-touching changes, confirm both the success path and at least one error
  path (network failure, 401, validation error) show a sensible message via the
  notification service.
- If backend endpoints aren't available locally, mock the fetch response at the
  `api.js` boundary only for manual testing — don't leave mock data in page code.
