# Configurable Screening Thresholds — Design

## Overview

Add a configurable threshold system for the screening metrics with preset profiles. Users can select a preset or define custom thresholds. Changes apply immediately with live result updates.

---

## Preset Profiles

| Profile | Gross Yield | Net Yield | Cap Rate | Cash-on-Cash | IRR |
|---------|-------------|-----------|----------|--------------|-----|
| **Conservative** (default) | 4.0 / 3.0 | 2.5 / 2.0 | 4.5 / 3.5 | 10.0 / 6.0 | 10.0 / 7.0 |
| **Moderate** | 3.5 / 2.5 | 2.0 / 1.5 | 4.0 / 3.0 | 8.0 / 4.0 | 8.0 / 5.0 |
| **Aggressive** | 3.0 / 2.0 | 1.5 / 1.0 | 3.0 / 2.0 | 6.0 / 3.0 | 6.0 / 4.0 |

Values shown as `pass / marginal`.

---

## Data Model

### TypeScript Types

```typescript
export interface MetricThreshold {
  pass: number;
  marginal: number;
}

export interface Thresholds {
  grossYield: MetricThreshold;
  netYield: MetricThreshold;
  capRate: MetricThreshold;
  cashOnCash: MetricThreshold;
  irr: MetricThreshold;
}

export type PresetName = 'conservative' | 'moderate' | 'aggressive';

export interface ThresholdConfig {
  preset: PresetName | 'custom';
  custom?: Partial<Thresholds>;
}
```

### Storage Schema

```typescript
// localStorage key: 'homer-thresholds-v1'
interface StoredConfig {
  version: 1;
  preset: PresetName | 'custom';
  custom?: Thresholds;
}
```

---

## Module: `threshold-config.ts` (new)

```typescript
import { Thresholds, MetricThreshold, PresetName } from './types';

export const PRESETS: Record<PresetName, Thresholds> = {
  conservative: {
    grossYield:  { pass: 4.0, marginal: 3.0 },
    netYield:    { pass: 2.5, marginal: 2.0 },
    capRate:     { pass: 4.5, marginal: 3.5 },
    cashOnCash:  { pass: 10.0, marginal: 6.0 },
    irr:         { pass: 10.0, marginal: 7.0 },
  },
  moderate: {
    grossYield:  { pass: 3.5, marginal: 2.5 },
    netYield:    { pass: 2.0, marginal: 1.5 },
    capRate:     { pass: 4.0, marginal: 3.0 },
    cashOnCash:  { pass: 8.0, marginal: 4.0 },
    irr:         { pass: 8.0, marginal: 5.0 },
  },
  aggressive: {
    grossYield:  { pass: 3.0, marginal: 2.0 },
    netYield:    { pass: 1.5, marginal: 1.0 },
    capRate:     { pass: 3.0, marginal: 2.0 },
    cashOnCash:  { pass: 6.0, marginal: 3.0 },
    irr:         { pass: 6.0, marginal: 4.0 },
  },
};

export function getThresholds(config: ThresholdConfig): Thresholds {
  if (config.preset === 'custom' && config.custom) {
    return { ...PRESETS.conservative, ...config.custom };
  }
  return PRESETS[config.preset];
}

export function loadConfig(): ThresholdConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.version === 1 && validateConfig(parsed)) {
        return parsed;
      }
    }
  } catch { /* fall through */ }
  return { preset: 'conservative' };
}

export function saveConfig(config: ThresholdConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    version: 1,
    ...config,
  }));
}

export function validateThresholds(t: Partial<Thresholds>): ValidationResult {
  // Returns { valid: true } or { valid: false, errors: string[] }
}

export function resetConfig(): ThresholdConfig {
  return { preset: 'conservative' };
}
```

---

## Calculator Changes

### `calculator.ts`

```typescript
// Add import
import { Thresholds, PRESETS, getThresholds } from './threshold-config';

// Modify calculateScreening to accept optional thresholds parameter
export function calculateScreening(
  annualRent: number,
  annualCosts: number,
  annualMortgage: number,
  purchasePrice: number,
  downPayment: number,
  irr: number,
  thresholds?: Thresholds,
): ScreeningMetrics {
  const t = thresholds || PRESETS.conservative;
  // ... use t.pass, t.marginal instead of hard-coded values
}

// Modify calculate to accept optional thresholds
export function calculate(
  vals: CalcValues,
  thresholds?: Thresholds,
): CalcResult {
  // ... pass thresholds to calculateScreening
}
```

---

## UI Changes

### Screening Tab

```
┌─────────────────────────────────────────────────────────────────────┐
│  Investment Criteria                           [Conservative ▼]     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ ▼ Conservative (Yield-Focused)                                │ │
│  │   "Only top quartile HK properties pass"                     │ │
│  │                                                               │ │
│  │   Gross Yield   4.0% / 3.0%                                  │ │
│  │   Net Yield     2.5% / 2.0%                                  │ │
│  │   Cap Rate      4.5% / 3.5%                                  │ │
│  │   Cash-on-Cash  10.0% / 6.0%                                  │ │
│  │   IRR           10.0% / 7.0%                                  │ │
│  │                                                               │ │
│  │   [Edit Custom Values...]                                    │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  (When Custom selected)                                              │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  Metric       │  Pass      │  Marginal   │                    │ │
│  │  ─────────────────────────────────────────────────────────── │ │
│  │  Gross Yield  │  [____] %  │  [____] %   │  ← placeholder: 4.0│
│  │  Net Yield    │  [____] %  │  [____] %   │    / 3.0 (Consv)   │
│  │  Cap Rate     │  [____] %  │  [____] %   │                    │
│  │  Cash-on-Cash │  [____] %  │  [____] %   │                    │
│  │  IRR          │  [____] %  │  [____] %   │                    │
│  │                                                               │ │
│  │  [Reset to Conservative]                                      │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Screening Results                                           │   │
│  │  ... (live updates as thresholds change)                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Validation UI

- Invalid input: red border, error text below input
- Error message: "Pass must be ≥ Marginal" (per metric)
- When invalid: results frozen, show "Invalid thresholds" message

### State Flow

```
User selects preset
  → load preset values
  → save to localStorage
  → update threshold inputs (readonly mode)
  → results recalculate

User selects "Custom"
  → clear custom values
  → show empty inputs
  → placeholder text shows Conservative values

User edits threshold input
  → validate (pass ≥ marginal, value > 0)
  → if invalid: show error, freeze results
  → if valid: auto-save to localStorage
  → preset = 'custom'
  → results recalculate

User clicks "Reset"
  → load Conservative preset
  → clear custom values
  → update UI
  → save to localStorage
```

---

## CLI Changes

### `packages/cli/src/index.ts`

```typescript
program
  .option('--preset <name>', 'Threshold preset: conservative|moderate|aggressive|custom')
  .option('--t-gross-yield-pass <number>')
  .option('--t-gross-yield-marginal <number>')
  // ... all 10 threshold options
```

### CLI Behavior

| Input | Result |
|-------|--------|
| No threshold flags | Use conservative defaults |
| `--preset moderate` | Use moderate values |
| `--preset custom` | Use conservative as base |
| `--t-gross-yield-pass 5.0` | Override pass value (on top of preset) |

### Usage Example

```bash
# Conservative (default)
homer-cli --price 3.5

# Moderate preset
homer-cli --price 3.5 --preset moderate

# Custom overrides
homer-cli --price 3.5 --preset custom --t-gross-yield-pass 5.0 --t-irr-pass 12.0
```

### Output Updates

CLI output already shows screening results. No structural change needed — just respect the configured thresholds.

---

## `skills/homer-cli/SKILL.md` Updates

```markdown
## Screening Thresholds

By default, thresholds use the **Conservative** preset:

| Metric | Pass | Marginal |
|--------|------|----------|
| Gross Yield | ≥ 4.0% | ≥ 3.0% |
| Net Yield | ≥ 2.5% | ≥ 2.0% |
| Cap Rate | ≥ 4.5% | ≥ 3.5% |
| Cash-on-Cash | ≥ 10.0% | ≥ 6.0% |
| IRR | ≥ 10.0% | ≥ 7.0% |

Use `--preset` to change profiles:

```bash
# Use Moderate thresholds (3.5% gross yield pass)
homer-cli --price 6 --preset moderate

# Use Aggressive thresholds (3.0% gross yield pass)
homer-cli --price 6 --preset aggressive
```

Override individual thresholds with `--t-*` flags:

```bash
# Custom gross yield threshold
homer-cli --price 6 --t-gross-yield-pass 5.0 --t-gross-yield-marginal 4.0

# Custom IRR threshold
homer-cli --price 6 --t-irr-pass 12.0
```

Available threshold flags:
- `--t-gross-yield-pass`, `--t-gross-yield-marginal`
- `--t-net-yield-pass`, `--t-net-yield-marginal`
- `--t-cap-rate-pass`, `--t-cap-rate-marginal`
- `--t-cash-on-cash-pass`, `--t-cash-on-cash-marginal`
- `--t-irr-pass`, `--t-irr-marginal`
```

---

## Testing

### Unit Tests

1. `calculateScreening` with different threshold presets
2. Validation: pass < marginal → error
3. Validation: value ≤ 0 → error
4. `getThresholds` with custom values merged correctly

### Integration Tests

1. Page load with no storage → conservative defaults
2. Select preset → values update, saved
3. Select custom → inputs blank
4. Enter valid values → auto-save, live update
5. Enter invalid → error shown, results frozen
6. Reset → conservative restored
7. CLI with --preset → correct values
8. CLI with --t-* overrides → correct values

---

## Files Summary

| File | Action |
|------|--------|
| `src/threshold-config.ts` | New |
| `src/types.ts` | New (shared types) |
| `src/calculator.ts` | Modify |
| `src/screening-ui.ts` | Modify |
| `src/main.ts` | Modify (init threshold config) |
| `src/__tests__/calculator.test.ts` | Add threshold tests |
| `packages/cli/src/index.ts` | Modify |
| `packages/cli/src/defaults.ts` | Modify |
| `skills/homer-cli/SKILL.md` | Modify |