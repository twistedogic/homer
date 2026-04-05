# Configurable Screening Thresholds — Tasks

## Phase 1: Foundation

### 1.1 Create types and config module
- [x] Create `src/types.ts` with `MetricThreshold`, `Thresholds`, `PresetName`, `ThresholdConfig` types
- [x] Create `src/threshold-config.ts` with:
  - `PRESETS` constant
  - `getThresholds()` function
  - `loadConfig()` / `saveConfig()` for localStorage
  - `validateThresholds()` validation function
  - `resetConfig()` function
- [x] Write unit tests for `threshold-config.ts`
- [x] **2h**

### 1.2 Update calculator module
- [x] Add `thresholds` optional parameter to `calculateScreening()`
- [x] Add `thresholds` optional parameter to `calculate()`
- [x] Update `calculateScreening()` to use provided thresholds or default to conservative
- [x] Update `calculate()` to pass thresholds to `calculateScreening()`
- [x] Add unit tests for threshold parameter scenarios
- [x] **2h**

---

## Phase 2: CLI

### 2.1 Update CLI defaults
- [x] Export thresholds from `packages/cli/src/defaults.ts`
- [x] Add `getThresholdsFromFlags()` helper
- [x] **1h**

### 2.2 Update CLI index
- [x] Add `--preset` option with choices
- [x] Add all `--t-*` threshold options (10 total)
- [x] Parse threshold flags and merge with preset
- [x] Pass thresholds to `calculate()`
- [x] Update CLI tests
- [x] **2h**

---

## Phase 3: UI

### 3.1 Threshold inputs UI
- [x] Add preset dropdown to screening tab header
- [x] Create threshold inputs form (pass + marginal for each metric)
- [x] Show preset values in collapsed view
- [x] Expand to editable inputs when "Custom" selected
- [x] **2h**

### 3.2 Validation and state management
- [x] Implement validation: pass ≥ marginal, value > 0
- [x] Show error states (red border, error message)
- [x] Freeze results when thresholds invalid
- [x] Wire up preset selection → load values → save
- [x] Wire up custom editing → validate → auto-save → live update
- [x] **2h**

### 3.3 Reset functionality
- [x] Add "Reset to Conservative" button
- [x] Implement reset logic: clear custom, set preset to conservative
- [x] **1h**

### 3.4 Integration
- [x] Load thresholds on app init (in `main.ts`)
- [x] Pass thresholds to `calculate()` calls in screening-ui.ts
- [x] Pass thresholds to `calculate()` calls in calculator-ui.ts (for completeness)
- [x] **1h**

---

## Phase 4: Documentation

### 4.1 Update skill documentation
- [x] Update `skills/homer-cli/SKILL.md` with threshold options
- [x] Add examples for preset selection
- [x] Add examples for custom threshold overrides
- [x] **1h**

---

## Phase 5: Testing & Polish

### 5.1 Integration testing
- [x] Test: page load with no storage → conservative defaults
- [x] Test: select preset → values update, saved
- [x] Test: select custom → inputs blank, placeholder shows conservative
- [x] Test: enter valid custom values → auto-save, live update
- [x] Test: enter invalid (pass < marginal) → error, results frozen
- [x] Test: click reset → conservative restored
- [x] **1h**

### 5.2 Edge cases
- [x] Test: corrupted localStorage → reset to conservative
- [x] Test: CLI with --preset → correct values applied
- [x] Test: CLI with --t-* overrides → correct values applied
- [x] Test: CLI with --preset custom (no overrides) → conservative defaults
- [x] **1h**

---

## Estimated Total

| Phase | Time |
|-------|------|
| Foundation | 4h |
| CLI | 3h |
| UI | 8h |
| Documentation | 1h |
| Testing & Polish | 2h |
| **Total** | **18h** |

---

## Quick Commands

```bash
# Run tests
npm run test

# Build
npm run build

# Run CLI locally
cd packages/cli && npx ts-node src/index.ts --price 6 --preset moderate --json
```