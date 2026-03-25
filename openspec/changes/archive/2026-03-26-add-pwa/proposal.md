# Add PWA Support

## Summary

Make Homer a Progressive Web App focused on installability. Users can add Homer to their home screen on mobile devices for a native-app-like experience.

## Motivation

Homer is a calculator that users return to repeatedly. Installing it on the home screen makes it feel like a real app — always accessible, no browser chrome, loads instantly.

## Goals

- [ ] PWA manifest with app metadata and icons
- [ ] Service worker with stale-while-revalidate caching
- [ ] Custom "Add to Home Screen" button in header
- [ ] iOS install instructions modal
- [ ] Hex-grid icon in two sizes (192×192, 512×512)
- [ ] Dark-themed splash screen
- [ ] Remove currency selector from header

## Design

### App Identity
- **Name**: Homer
- **Short name**: Homer
- **Theme color**: `#1a1a2e` (dark navy)
- **Background color**: `#1a1a2e` (dark navy, for splash)
- **Display**: `standalone`

### Icon
Hexagonal grid arrangement, filled with `--accent` color (`#1a1a2e`), transparent background. Abstract geometric pattern suggesting a calculation hive.

```
╭─╮ ╭─╮
╭┴─┴┴─┴╮
│ ∗  ∗ │
╰┬─┬┬─┬╯
 ╰─╯ ╰─╯
```

Two required sizes:
- `icon-192.png` — 192×192 (displays at 48×48 on Android)
- `icon-512.png` — 512×512 (used for splash generation)

Both must have maskable variant for Chrome's safe zone.

### Header
```
┌──────────────────────────────────────────────────────┐
│  Homer  [  + Add to Home Screen  ]                  │
└──────────────────────────────────────────────────────┘
```

Currency selector (`HKD ▼`) removed.

### Install UX

| Platform | Behavior |
|----------|----------|
| Android Chrome | Button click → `beforeinstallprompt.prompt()` → native install dialog |
| iOS Safari | Button click → modal with step-by-step: "Tap Share → Add to Home Screen" |
| Desktop | Button hidden |

After successful install, button disappears (`navigator.standalone` or `display-mode: standalone`).

### Service Worker Strategy

**Stale-while-revalidate**:
1. Return cached HTML immediately (fast load)
2. Fetch from network in background
3. Update cache for next visit

Rationale: User opens calculator, gets instant response. New versions propagate automatically without interrupting workflow.

## Deliverables

| File | Purpose |
|------|---------|
| `manifest.json` | PWA metadata, icons, display mode |
| `sw.js` | Service worker with SWR strategy |
| `icon-192.png` / `icon-192-maskable.png` | App icon (small) |
| `icon-512.png` / `icon-512-maskable.png` | App icon (large, for splash) |
| `index.html` changes | Manifest link, theme-color meta, A2HS button, install logic |

## Non-Goals

- Offline-first functionality (app works offline incidentally; no sync features)
- Push notifications
- Background processing
- Native app wrappers (Capacitor, etc.)

## Open Questions

None — all decisions finalized in exploration.
