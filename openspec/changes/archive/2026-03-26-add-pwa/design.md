## Context

Homer is a single-file static app (`index.html`) deployed on GitHub Pages with no build tooling, no `package.json`, and no external dependencies. All CSS and JS are inline. The current header shows "Real Estate Investment Calculator" with a static `HKD` currency label.

PWA support needs to be added without introducing a build step or breaking the zero-dependency, zero-tooling deployment model.

## Goals / Non-Goals

**Goals:**
- Make Homer installable on Android and iOS home screens
- Fast repeat loads via stale-while-revalidate caching
- Custom install button with platform-aware behavior (native prompt on Android, instructions modal on iOS, hidden on desktop)
- Rename app to "Homer" with a hex-grid icon

**Non-Goals:**
- Offline-first functionality (no sync, no background fetch)
- Push notifications
- Native app wrappers
- Any build tooling or bundler

## Decisions

### 1. Service worker registration: inline script in `index.html`

Since there is no build step, the service worker (`sw.js`) must be a static file at the repo root, and registration must be a small inline `<script>` block in `index.html`.

**Alternative considered**: A separate `app.js` file. Rejected — adding a file for one registration call creates unnecessary complexity in a single-file project.

### 2. Caching strategy: stale-while-revalidate for all requests

The SW will cache the main `index.html` and any other fetched resources. On each load it returns the cached version immediately, then updates the cache from the network in the background.

**Alternative considered**: Cache-first (never update without a reload). Rejected — would silently block updates for users who never close the tab.

**Alternative considered**: Network-first. Rejected — defeats the purpose of instant load for a frequently-used tool.

### 3. Install UX: single `+ Add to Home Screen` button in header

One button handles all platforms:
- **Android Chrome**: listens for `beforeinstallprompt`, calls `.prompt()` on click
- **iOS Safari**: opens a modal with Share → "Add to Home Screen" steps
- **Already installed / desktop**: button hidden via CSS `display: none`

Detection logic:
- Running installed: `window.navigator.standalone === true` (iOS) or `window.matchMedia('(display-mode: standalone)').matches` (Android/desktop)
- iOS detection: `navigator.userAgent` includes `iPhone|iPad|iPod` and `!window.MSStream`

**Alternative considered**: Browser-native install UI only. Rejected — iOS Safari has no `beforeinstallprompt`; a custom button is the only path for iOS.

### 4. Icons: SVG-generated PNGs, two sizes + maskable variants

Four PNG files committed to the repo root:
- `icon-192.png` — standard, 192×192
- `icon-192-maskable.png` — maskable (safe zone padded to ~80%), 192×192
- `icon-512.png` — standard, 512×512
- `icon-512-maskable.png` — maskable, 512×512

Design: hex-grid arrangement, `#6c63ff` (accent) on transparent background.

**Alternative considered**: Single SVG icon in manifest. Rejected — browser support for SVG PWA icons is inconsistent; PNGs are required for reliable Android/iOS behavior.

### 5. `manifest.json` at repo root

A static `manifest.json` file at the root, linked from `index.html` via `<link rel="manifest">`.

Key fields:
```json
{
  "name": "Homer",
  "short_name": "Homer",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a2e",
  "theme_color": "#1a1a2e"
}
```

### 6. Header rename: "Homer" replaces title; currency label removed

The `<h1>` content changes from "Real Estate Investment Calculator" to "Homer". The static `<span class="currency-label">HKD</span>` is removed. A `+ Add to Home Screen` button is added.

`_config.yml` title is updated to match.

## Risks / Trade-offs

- **Icon PNGs must be manually created** — there is no build step to generate them from SVG. They will need to be committed as binary files. → Use a script or online tool to produce the PNGs once, then commit.
- **Service worker scope** — GitHub Pages serves from `/homer/` path when the repo is not a user/org page. `start_url` and SW scope may need to be `/homer/` not `/`. → Verify deployment URL and adjust manifest `start_url` and `scope` accordingly.
- **iOS install modal is custom UI** — must be styled to match the dark theme and tested on Safari. → Keep modal simple; use existing CSS variables.
- **SW update latency** — stale-while-revalidate means users see old version once before the update takes effect. Acceptable for a calculator. → No mitigation needed.
