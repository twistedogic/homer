## 1. Package Setup

- [x] 1.1 Create `packages/cli/` directory structure (`src/`, `bin/`, `test/`)
- [x] 1.2 Create `packages/cli/package.json` with `name: "homer-cli"`, `bin: "./bin/homer-cli.js"`, and `commander` dependency
- [x] 1.3 Create `packages/cli/tsconfig.json` (target ES2022, module NodeNext)
- [x] 1.4 Create `packages/cli/bin/homer-cli.js` with `#!/usr/bin/env bun` shebang

## 2. Defaults Module

- [x] 2.1 Create `packages/cli/src/defaults.ts` exporting `CALC_VALUES_DEFAULTS` with all 14 default values matching the web calculator

## 3. Formatting Module

- [x] 3.1 Create `packages/cli/src/format.ts` with `formatMarkdown(result)` returning cash flow table and summary table as markdown string
- [x] 3.2 Create `formatJSON(result)` returning the JSON object with `cashFlows`, `totalPL`, `npv`, `irr`

## 4. CLI Entry Point

- [x] 4.1 Create `packages/cli/src/index.ts` using commander to define all 14 kebab-case flags with descriptions and defaults
- [x] 4.2 Map parsed flags to `CalcValues` camelCase fields
- [x] 4.3 Call `calculate(vals)` from `../../../src/calculator.ts`
- [x] 4.4 Output markdown by default, JSON when `--json` flag is set
- [x] 4.5 Handle errors gracefully (invalid input, NaN results) and exit with non-zero code

## 5. Tests

- [x] 5.1 Test CLI with all defaults produces valid markdown output
- [x] 5.2 Test `--price` and `--size` partial overrides
- [x] 5.3 Test `--json` flag produces valid JSON with correct keys
- [x] 5.4 Test `--help` displays all 14 flags with defaults
- [x] 5.5 Verify Total P/L = sum(cashFlows) + terminalValue

## 6. Verification

- [x] 6.1 Run `bun run packages/cli` and confirm markdown table output
- [x] 6.2 Run `bun run packages/cli --json` and confirm JSON output
- [x] 6.3 Compare CLI results against web calculator with same inputs
