## Why

Shared inputs (price, size, rent, rates, etc.) exist in both the Calculator and Optimize tabs but editing one tab does not update the other. Users who tweak values in Calculator and switch to Optimize see stale figures, forcing manual re-entry.

## What Changes

- Wiring `syncSharedInput(key, 'calc')` for each shared input in the Calculator tab's `input` event listener
- Optimize tab continues to call `runParetoSolver()` on tab switch — no change needed

## Capabilities

### New Capabilities
- `cross-tab-input-sync`: Shared inputs stay in sync across Calculator and Optimize tabs in real time (on every keystroke)

### Modified Capabilities
<!-- No existing spec-level behavior is changing -->

## Non-goals

- Syncing Calculator-only inputs (`mortgagePeriod`, `downPayment`, `holdingPeriod`) — these do not exist in the Optimize form
- Persisting values to localStorage or URL params
- Live re-running the Optimize solver while typing in Calculator

## Impact

- `src/calculator-ui.ts`: add `syncSharedInput` calls inside existing input listeners
- `src/shared-state.ts`: no changes needed
- `src/tabs.ts`: no changes needed
