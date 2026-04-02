## ADDED Requirements

### Requirement: CLI must run via bunx

The CLI package SHALL be callable via `bunx` without requiring local installation. The package name SHALL be `homer-cli`.

### Requirement: All 14 CalcValues fields exposed as CLI flags

The CLI SHALL accept 14 flags, one per field in the `CalcValues` interface. Each flag SHALL use kebab-case naming. All flags SHALL be optional with default values matching the web calculator.

| Flag (kebab-case) | Default | Unit |
|---|---|---|
| `--price` | 3.5 | M HKD |
| `--size` | 2000 | sq ft |
| `--rent-sqft` | 40 | HKD/sqft/mo |
| `--management-fee` | 5 | HKD/sqft/mo |
| `--mortgage-rate` | 3.5 | % |
| `--mortgage-period` | 30 | years |
| `--down-payment` | 0.7 | M HKD |
| `--holding-period` | 10 | years |
| `--months-renters` | 11 | months |
| `--apprec-rate` | 3 | % |
| `--rent-apprec-rate` | 2 | % |
| `--discount-rate` | 7 | % |
| `--property-tax-rate` | 15 | % |
| `--capex` | 300 | HKD/sqft/10yr |

#### Scenario: All defaults

- **WHEN** user runs `bunx homer-cli` with no flags
- **THEN** CLI uses all 14 default values and produces valid output

#### Scenario: Partial override

- **WHEN** user runs `bunx homer-cli --price 5.0 --size 2500`
- **THEN** CLI uses `price=5.0`, `size=2500`, and defaults for the remaining 12 fields

### Requirement: Markdown table output by default

When run without `--json`, the CLI SHALL output markdown tables to stdout. Output SHALL include a cash flow table and a summary table.

The cash flow table SHALL have columns: `Year` and `Cash Flow (HKD)`, with one row per year of the holding period.

The summary table SHALL have columns: `Metric` and `Value`, with rows for `Total P/L`, `NPV`, and `IRR`. Currency values SHALL use `HK$` prefix and comma-separated thousands. IRR SHALL be formatted as percentage with one decimal place.

#### Scenario: Markdown output with default inputs

- **WHEN** user runs `bunx homer-cli --price 3.5 --size 2000 --holding-period 5`
- **THEN** output contains a markdown table with Year 1-5 rows and a summary table with Total P/L, NPV, and IRR rows

#### Scenario: Currency formatting

- **WHEN** NPV is calculated as 850000 HKD
- **THEN** the summary table displays `HK$850,000`

#### Scenario: IRR formatting

- **WHEN** IRR is calculated as 0.084
- **THEN** the summary table displays `8.4%`

### Requirement: JSON output mode

When `--json` flag is provided, the CLI SHALL output a single JSON object to stdout.

The JSON object SHALL contain:
- `cashFlows`: array of annual cash flow numbers (HKD)
- `totalPL`: total profit/loss as a number (HKD)
- `npv`: net present value as a number (HKD)
- `irr`: internal rate of return as a decimal (not percentage)

#### Scenario: JSON output

- **WHEN** user runs `bunx homer-cli --json --price 3.5 --size 2000`
- **THEN** output is valid JSON with keys `cashFlows`, `totalPL`, `npv`, `irr`
- **THEN** `irr` is a decimal (e.g., `0.084`), not a percentage string

### Requirement: Total P/L definition

Total P/L SHALL be calculated as `sum(cashFlows) + terminalValue`. It represents the aggregate of all annual net cash flows plus the net proceeds from the terminal property sale.

#### Scenario: Total P/L calculation

- **WHEN** cash flows are `[78000, 81600, 85300]` and terminal value is `4000000`
- **THEN** totalPL equals `4166900`

### Requirement: Help output

Running `bunx homer-cli --help` SHALL display usage information including all 14 flag names, their default values, and units.

#### Scenario: Help flag

- **WHEN** user runs `bunx homer-cli --help`
- **THEN** output includes descriptions and defaults for all 14 flags
