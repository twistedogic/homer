## Context

The existing financial calculator runs as a browser-based PWA (`src/calculator.ts`). It computes IRR, NPV, and cash flows from a `CalcValues` input model with 14 parameters. LLM agents need programmatic access to these calculations via CLI.

**Current state:**
- `src/calculator.ts` — pure functions (`calculate`, `calculateNPV`, `calculateIRR`) with no browser dependencies
- `src/formatting.ts` — `formatCurrency` and `formatPercent` utilities
- `index.html` — defines default values for all 14 inputs

**Constraints:**
- Must use `bunx` for portability (no local Bun required)
- Must use `commander` for CLI flag parsing
- No subcommands — single entry point
- Flags only, no config files

## Goals / Non-Goals

**Goals:**
- Portable CLI callable via `bunx homer-cli` without installation
- Mirror the web calculator's `CalcValues` input model exactly (14 fields)
- Output markdown tables by default, JSON on `--json` flag
- Include cash flow table in output alongside summary metrics
- Reuse existing `calculator.ts` functions without duplication

**Non-Goals:**
- Subcommands for individual metrics (IRR-only, NPV-only, etc.)
- Config file support
- Changes to existing calculator logic or defaults
- Integration with the web app's build pipeline

## Decisions

### 1. Package location: `packages/cli/`

A standalone package at `packages/cli/` with its own `package.json` and `tsconfig.json`. This keeps the CLI separate from the web app while allowing import of shared source files.

**Alternative:** `src/cli.ts` in the root. Rejected — mixing CLI entry point with web app source adds complexity to the build and deploy.

### 2. Entry point structure

```
packages/cli/
├── package.json          # name: "homer-cli", bin: "./bin/homer-cli.js"
├── tsconfig.json
├── bin/
│   └── homer-cli.js     # #!/usr/bin/env bun shebang
└── src/
    ├── index.ts          # commander setup, flag definitions, output
    ├── defaults.ts       # CalcValues defaults from index.html
    └── format.ts         # markdown and JSON output formatters
```

**Why `bin/homer-cli.js`:** Bun's `bunx` looks for the `bin` field in `package.json`. The JS file uses a shebang (`#!/usr/bin/env bun`) so it runs directly with Bun's runtime when invoked.

### 3. Flag naming: kebab-case → camelCase mapping

The `CalcValues` interface uses camelCase. Commander flags are kebab-case. A manual mapping is explicit and unambiguous:

| CLI Flag (kebab) | CalcValues (camel) | Default | Unit |
|---|---|---|---|
| `--price` | `price` | 3.5 | M HKD |
| `--size` | `size` | 2000 | sq ft |
| `--rent-sqft` | `rentSqft` | 40 | HKD/sqft/mo |
| `--management-fee` | `managementFee` | 5 | HKD/sqft/mo |
| `--mortgage-rate` | `mortgageRate` | 3.5 | % |
| `--mortgage-period` | `mortgagePeriod` | 30 | years |
| `--down-payment` | `downPayment` | 0.7 | M HKD |
| `--holding-period` | `holdingPeriod` | 10 | years |
| `--months-renters` | `monthsRenters` | 11 | months |
| `--apprec-rate` | `apprecRate` | 3 | % |
| `--rent-apprec-rate` | `rentApprecRate` | 2 | % |
| `--discount-rate` | `discountRate` | 7 | % |
| `--property-tax-rate` | `propertyTaxRate` | 15 | % |
| `--capex` | `capex` | 300 | HKD/sqft/10yr |

All flags are optional. Defaults are applied when flags are omitted.

### 4. Output: Markdown tables (default), JSON (`--json`)

**Markdown output (default):**
```markdown
## Cash Flows

| Year | Cash Flow (HKD) |
|------|-----------------|
|    1 |         78,000  |
|    2 |         81,600  |

## Summary

| Metric       | Value         |
|--------------|---------------|
| Total P/L    | HK$1,200,000  |
| NPV          | HK$850,000    |
| IRR          | 8.4%          |
```

**JSON output (`--json`):**
```json
{
  "cashFlows": [78000, 81600, ...],
  "totalPL": 1200000,
  "npv": 850000,
  "irr": 0.084
}
```

### 5. Code reuse: direct import from `src/`

`packages/cli/src/index.ts` imports directly from `../../src/calculator.ts` and `../../src/formatting.ts`. The CLI calls `calculate(vals)` and formats the result — no copying of business logic.

**TypeScript path resolution:** The root `tsconfig.json` is kept for the web app. The CLI has its own `tsconfig.json` that compiles against itself. No shared tsconfig needed.

### 6. Total P/L calculation

`Total P/L = sum(cashFlows) + terminalValue`

This is the sum of all annual cash flows plus the terminal sale value. It represents total return including the final property sale, with no discounting.

## Risks / Trade-offs

- [Risk] Version skew if `calculator.ts` changes defaults but CLI isn't updated → **Mitigation**: Defaults are defined in `packages/cli/src/defaults.ts` as explicit constants. If root defaults change, CLI should be updated to match.
- [Risk] CLI and web app diverging on calculation logic → **Mitigation**: CLI imports the same functions as the web app. No duplication of business logic.
- [Risk] `commander` adds a dependency → **Mitigation**: Minimal API surface (14 flags + `--json`). Hand-rolling was considered but commander provides `--help`, validation, and type coercion for free.
