---
name: homer-cli
description: Use when analyzing Hong Kong real estate investments from the CLI — calculating IRR, NPV, screening metrics, and cash flow projections for a property.
---

# Homer CLI

HK real estate investment calculator. Outputs screening metrics (gross yield, net yield, cap rate, cash-on-cash, IRR), NPV, and year-by-year cash flows.

## Usage

```bash
npx github:twistedogic/homer [options]
```

No install required. Runs directly from GitHub via npx.

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `--price <M HKD>` | Purchase price in millions HKD | `3.5` |
| `--size <sqft>` | Property size in sq ft | `200` |
| `--rent-sqft <HKD/mo>` | Monthly rent per sq ft | `40` |
| `--management-fee <HKD/sqft/mo>` | Monthly management fee per sq ft | `5` |
| `--mortgage-rate <%>` | Annual mortgage rate | `3.5` |
| `--mortgage-period <years>` | Loan term | `30` |
| `--down-payment <M HKD>` | Down payment in millions HKD | `0.7` |
| `--holding-period <years>` | Investment horizon | `10` |
| `--months-renters <0-12>` | Months per year with tenants | `11` |
| `--apprec-rate <%>` | Annual property appreciation | `3` |
| `--rent-apprec-rate <%>` | Annual rent appreciation | `2` |
| `--discount-rate <%>` | NPV discount rate | `7` |
| `--property-tax-rate <%>` | HK property tax rate | `15` |
| `--capex <HKD/sqft/10yr>` | Capital expenditure budget | `300` |
| `--json` | Output as JSON instead of markdown | `false` |

## Examples

```bash
# Quick check with defaults
npx github:twistedogic/homer

# Specific property: HK$6M, 300 sqft, HK$50/sqft rent
npx github:twistedogic/homer --price 6 --size 300 --rent-sqft 50

# Higher down payment, longer hold
npx github:twistedogic/homer --price 8 --down-payment 2 --holding-period 15

# JSON output for scripting
npx github:twistedogic/homer --price 5 --size 400 --json
```

## Output

Markdown output (default) includes:

1. **Screening Metrics table** — gross yield, net yield, cap rate, cash-on-cash, IRR each marked PASS / MARGINAL / FAIL with overall score
2. **Cash Flows table** — net cash flow per year
3. **Summary** — total P/L, NPV, IRR

## Screening Thresholds

| Metric | Pass | Marginal |
|--------|------|----------|
| Gross Yield | ≥ 3.5% | ≥ 2.5% |
| Net Yield | ≥ 2.0% | ≥ 1.5% |
| Cap Rate | ≥ 4.0% | ≥ 3.0% |
| Cash-on-Cash | ≥ 8.0% | ≥ 4.0% |
| IRR | ≥ 8.0% | ≥ 5.0% |

Overall: **PASS** = all 5 pass · **MARGINAL** = 3+ pass · **FAIL** = fewer than 3 pass
