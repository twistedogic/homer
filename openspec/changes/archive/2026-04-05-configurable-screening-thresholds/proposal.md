# Configurable Screening Thresholds

## Problem

The screening metrics thresholds are hard-coded in `calculator.ts`. They're set to generic values (e.g., 3.5% gross yield) that don't reflect Hong Kong's specific market conditions. Conservative investors have no way to adjust for margin of safety.

## Solution

Make thresholds configurable with preset profiles:

| Profile | Philosophy | Gross Yield | Net Yield | Cap Rate | Cash-on-Cash | IRR |
|---------|------------|-------------|-----------|----------|--------------|-----|
| **Conservative** (default) | Top quartile HK market, margin of safety | 4.0 / 3.0 | 2.5 / 2.0 | 4.5 / 3.5 | 10.0 / 6.0 | 10.0 / 7.0 |
| **Moderate** | Balanced, realistic HK market | 3.5 / 2.5 | 2.0 / 1.5 | 4.0 / 3.0 | 8.0 / 4.0 | 8.0 / 5.0 |
| **Aggressive** | More deals pass, higher risk accepted | 3.0 / 2.0 | 1.5 / 1.0 | 3.0 / 2.0 | 6.0 / 3.0 | 6.0 / 4.0 |
| **Custom** | User-defined values | — | — | — | — | — |

Values shown as `pass / marginal`.

## Scope

### Must
- [ ] Screening tab: preset dropdown + threshold inputs
- [ ] Conservative as default preset
- [ ] Custom mode: empty inputs with Conservative as placeholder
- [ ] Live update: results recalculate as thresholds change
- [ ] Input validation: pass ≥ marginal, all values > 0
- [ ] Persistence: localStorage `homer-thresholds-v1`
- [ ] Reset button: restore Conservative, clear custom
- [ ] CLI: `--preset` and `--t-*` options
- [ ] Update `skills/homer-cli/SKILL.md` with new options

### Non-goals
- Optimize tab threshold filtering (out of scope)
- Multiple preset profiles per user (single active config)
- Export/import threshold configurations

## Implementation Notes

### Data Model
```typescript
interface ThresholdConfig {
  preset: 'conservative' | 'moderate' | 'aggressive' | 'custom';
  custom?: Thresholds;  // only when custom has values
}
```

### Key Files
- `src/threshold-config.ts` — presets, config, load/save (new)
- `src/calculator.ts` — accept thresholds param (modify)
- `src/screening-ui.ts` — preset selector, threshold inputs (modify)
- `packages/cli/src/index.ts` — CLI threshold options (modify)
- `skills/homer-cli/SKILL.md` — document new CLI options

### Validation Rules
1. Pass threshold ≥ Marginal threshold (per metric)
2. All values > 0
3. Invalid → red border, error message, results frozen

### Persistence
```typescript
// localStorage key: 'homer-thresholds-v1'
// On corrupted/incomplete data: reset to Conservative
```

## Files to Change
```
src/threshold-config.ts        (new)
src/calculator.ts             (modify)
src/screening-ui.ts           (modify)
src/calculator-ui.ts          (modify, needs thresholds param)
src/main.ts                   (modify, init thresholds)
src/__tests__/calculator.test.ts  (add threshold tests)
packages/cli/src/index.ts     (modify)
packages/cli/src/defaults.ts (modify, export thresholds)
skills/homer-cli/SKILL.md     (modify)
```