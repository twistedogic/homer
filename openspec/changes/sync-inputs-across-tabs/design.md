## Context

The app has two tabs — Calculator and Optimize — that share a set of inputs (price, size, rent, rates, etc.). `shared-state.ts` already maintains a `sharedState` map and exposes `syncSharedInput(key, sourcePanel)` which mirrors the value to the other panel's DOM element. `pareto-table.ts` already calls this for the Optimize side. The Calculator side (`calculator-ui.ts`) never calls it, so edits there are invisible to Optimize.

## Goals / Non-Goals

**Goals:**
- Calculator inputs that are shared update the corresponding Optimize inputs on every `input` event
- No regressions to existing Optimize → Calculator sync

**Non-Goals:**
- Syncing Calculator-only fields (`mortgagePeriod`, `downPayment`, `holdingPeriod`)
- Auto-running Optimize while typing in Calculator (tab switch triggers the run, per existing behaviour)

## Decisions

**Use the existing `syncSharedInput` call path (not a new mechanism)**

The infrastructure is already correct. The only gap is that `calculator-ui.ts` doesn't call `syncSharedInput`. Adding that call reuses the proven path rather than introducing a second sync channel.

Alternative considered: switching to a publish/subscribe event bus. Unnecessary for two panels with already-identified shared keys.

**Sync on `input` (not `change` or `blur`)**

Matches the user's stated preference and is consistent with the live-validation behaviour already wired in `calculator-ui.ts`.

**Keep `SHARED_KEYS` as the canonical list**

`shared-state.ts` already exports `SHARED_KEYS`. The calculator's input listener loop can filter against this list to know which inputs need syncing, avoiding duplication.

## Risks / Trade-offs

- **Double-sync on load**: `initSharedState` reads initial values from the DOM; the new listeners only fire on user interaction, so no risk of spurious syncs at startup.
- **Opt-side DOM not ready**: `sharedInputs` is populated during `initSharedState()` which runs before `initCalculator()` — order is guaranteed in `main.ts`.
