## 1. Icons

- [x] 1.1 Create `icon-192.png` — 192×192 hex-grid, transparent background, accent color `#6c63ff`
- [x] 1.2 Create `icon-512.png` — 512×512 same design
- [x] 1.3 Create `icon-192-maskable.png` — 192×192 with padded safe zone (content within inner 80%)
- [x] 1.4 Create `icon-512-maskable.png` — 512×512 maskable variant

## 2. Manifest and Meta

- [x] 2.1 Create `manifest.json` at repo root with name, short_name, display, start_url, theme_color, background_color, and all four icon entries
- [x] 2.2 Add `<link rel="manifest" href="/manifest.json">` to `index.html` `<head>`
- [x] 2.3 Add `<meta name="theme-color" content="#1a1a2e">` to `index.html` `<head>`

## 3. Service Worker

- [x] 3.1 Create `sw.js` at repo root with stale-while-revalidate fetch handler and install cache-priming for `index.html`
- [x] 3.2 Add service worker registration script to `index.html` with graceful fallback for unsupported browsers

## 4. Header

- [x] 4.1 Update `<h1>` in header from "Real Estate Investment Calculator" to "Homer"
- [x] 4.2 Remove `<span class="currency-label">HKD</span>` from header
- [x] 4.3 Add `+ Add to Home Screen` button element to header (hidden by default)
- [x] 4.4 Update `_config.yml` title to "Homer"

## 5. Install Logic

- [x] 5.1 Add `beforeinstallprompt` listener — capture event, show install button
- [x] 5.2 Add install button click handler for Android: call `deferredPrompt.prompt()`, hide button on acceptance
- [x] 5.3 Add iOS detection logic (user agent check + `navigator.standalone`)
- [x] 5.4 Add install button click handler for iOS: show instructions modal
- [x] 5.5 Hide install button when running in standalone mode (`display-mode: standalone` or `navigator.standalone`)

## 6. iOS Install Modal

- [x] 6.1 Add iOS install modal HTML to `index.html` (hidden by default) with Share icon reference and step instructions
- [x] 6.2 Add modal open/close logic (open on iOS button click, close on backdrop click or close button)
- [x] 6.3 Style modal using existing CSS variables (`--bg`, `--accent`) to match dark theme
