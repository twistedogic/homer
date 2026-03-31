## Context

Homer is a single-page investment calculator deployed to GitHub Pages. All application code — JavaScript and CSS — currently lives inline in `index.html`. There are no build tools, no package manager, and no test infrastructure. The GitHub Actions workflow deploys by uploading the repository root as-is.

This design covers the introduction of Vite, TypeScript, and Vitest while keeping the deployed output functionally identical.

## Goals / Non-Goals

**Goals:**
- Extract ~620 lines of inline JS into TypeScript modules (`src/*.ts`)
- Extract all inline CSS into source CSS files (`src/styles/*.css`)
- Configure Vite to build a deployable `dist/` matching current behaviour
- Configure Vitest for unit testing pure-logic modules
- Update GitHub Actions to build and deploy `dist/`

**Non-Goals:**
- Changing any calculations, UI, or user-visible behaviour
- Strict TypeScript from day one
- CSS modules, PostCSS, or preprocessors (plain CSS only)
- Workbox or a full precache manifest
- Adding a framework

## Decisions

### Decision: Vite with `index.html` as entry point

**Choice:** Use Vite's native HTML entry point convention — `index.html` at the project root references `<script type="module" src="/src/main.ts">` and Vite inlines/bundles from there.

**Rationale:** No custom rollup config needed. Vite processes the HTML, injects the hashed bundle, and outputs a complete `dist/index.html`. CSS imported in TypeScript modules is also extracted automatically.

**Alternatives considered:**
- Library mode (no HTML processing): Would require manually managing the HTML template.

---

### Decision: `base: '/homer/'` in vite.config.ts

**Choice:** Set `base: '/homer/'` to match the GitHub Pages deployment path.

**Rationale:** GitHub Pages serves this repo at `https://user.github.io/homer/`. Without the base, all asset paths in `dist/` are relative to `/` and 404 on deployment.

---

### Decision: TypeScript with `strict: false` initially

**Choice:** Enable TypeScript but start with `strict: false` (or `noImplicitAny: false`). Types added incrementally.

**Rationale:** The existing JS is loosely typed — objects passed by shape, DOM elements typed as `any`. Forcing strict on day one delays getting tests running without adding safety in the short term. The value of this migration is testability; types are a secondary benefit.

---

### Decision: Module structure follows existing section boundaries

**Choice:** Each logical section in the current script block becomes one `.ts` file:

| File | Responsibility |
|------|---------------|
| `src/main.ts` | Entry point — imports modules, calls init functions |
| `src/tabs.ts` | Tab switching logic |
| `src/shared-state.ts` | Shared input state between Calculator and Optimize tabs |
| `src/formatting.ts` | `formatCurrency`, `formatPercent`, `parseNumber` |
| `src/calculator.ts` | All NPV/IRR/mortgage math |
| `src/pareto-solver.ts` | Grid enumeration and Pareto frontier extraction |
| `src/pareto-table.ts` | Table render, sort, row expansion |
| `src/pwa.ts` | Service worker registration and install prompt |

**Rationale:** Minimal diff from current structure. Section comments already define the boundaries. Reviewers familiar with `index.html` can navigate `src/` intuitively.

---

### Decision: CSS extracted by Vite (import in main.ts)

**Choice:** CSS files imported in `main.ts` (e.g., `import './styles/main.css'`). Vite bundles and extracts them to `dist/assets/index.[hash].css`, injected automatically into `dist/index.html`.

**Rationale:** No separate CSS build step needed. Vite handles extraction and cache-busting. Plain CSS only — no preprocessor.

CSS file split:

| File | Content |
|------|---------|
| `src/styles/base.css` | Reset, variables, typography, layout |
| `src/styles/calculator.css` | Calculator form and results |
| `src/styles/tabs.css` | Tab nav styling |
| `src/styles/pareto-table.css` | Pareto table, sort indicators, row expansion |
| `src/styles/pwa.css` | Install button and iOS modal |

---

### Decision: Service worker caches `index.html` only

**Choice:** Simplify `sw.js` PRECACHE to `['/homer/', '/homer/index.html']`. Hashed JS/CSS assets are not precached.

**Rationale:** After Vite, the JS bundle filename includes a content hash (`assets/index.abc123.js`). Precaching it from `sw.js` requires knowing the hash at build time — a Workbox concern. The stale-while-revalidate fetch handler already caches assets on first request. Offline support for the app shell (HTML) is maintained; JS/CSS are handled by HTTP cache on repeated visits.

---

### Decision: GitHub Actions workflow builds before deploying

**Choice:** Add Node.js setup, `npm ci`, and `npm run build` steps before the upload step. Upload `dist/` instead of the repo root.

**Rationale:** The repo no longer contains a deployable artifact directly. Build must happen in CI. The existing `actions/upload-pages-artifact` step accepts a `path:` parameter — change it from `.` to `./dist`.

---

### Decision: Vitest for unit testing

**Choice:** Vitest with `jsdom` environment for DOM tests if needed. Pure logic tests (calculator, pareto-solver, formatting) run without DOM.

**Rationale:** Vitest shares Vite config — zero additional configuration. Same import syntax as source files. Jest-compatible API so tests are portable.

Test targets:
- `src/formatting.ts` — pure functions, trivial to test
- `src/calculator.ts` — `calculateMortgagePayment`, `calculateNPV`, `calculateIRR`, `calculateRemainingBalance` — high value
- `src/pareto-solver.ts` — `evaluateCombination`, `extractParetoFrontier`

DOM-touching modules (`tabs`, `pareto-table`, `pwa`) deferred from initial test coverage.

## Risks / Trade-offs

**[Risk]** Service worker serves stale `index.html` that references old JS bundle hash on deploy  
**→ Mitigation:** The stale-while-revalidate handler updates the cache after serving. On second load after deploy, the new `index.html` (with updated script hash) is served. Acceptable for a personal tool. If needed, increment `CACHE_NAME` in `sw.js` on each deploy via CI.

**[Risk]** `base: '/homer/'` hardcoded in `vite.config.ts` — breaks local dev if served from `/`  
**→ Mitigation:** `vite dev` serves from `localhost` with the `/homer/` prefix applied, so relative asset paths work. The base path is a known constraint of GH Pages deployment.

**[Risk]** TypeScript compilation errors in existing JS patterns (e.g., implicit any, DOM nullability)  
**→ Mitigation:** `strict: false` and `skipLibCheck: true` in `tsconfig.json` allows the migration to succeed without fixing every type issue upfront.

## Migration Plan

1. Add `package.json`, `vite.config.ts`, `tsconfig.json`
2. Create `src/` modules by copying JS sections from `index.html`
3. Create `src/styles/` by copying CSS from `index.html`
4. Strip `<script>` and `<style>` blocks from `index.html`; add `<script type="module" src="/src/main.ts">`
5. Verify `npm run dev` produces identical UI locally
6. Update `sw.js` PRECACHE
7. Update GitHub Actions workflow
8. Verify CI build and GH Pages deployment

Rollback: `index.html` can be restored from git. No database or infrastructure changes.
