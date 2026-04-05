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

### Property Inputs

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

### Screening Thresholds

| Flag | Description | Default |
|------|-------------|---------|
| `--preset <name>` | Threshold preset (conservative/moderate/aggressive) | `conservative` |
| `--t-gross-yield-pass <%>` | Override gross yield pass threshold | — |
| `--t-gross-yield-marginal <%>` | Override gross yield marginal threshold | — |
| `--t-net-yield-pass <%>` | Override net yield pass threshold | — |
| `--t-net-yield-marginal <%>` | Override net yield marginal threshold | — |
| `--t-cap-rate-pass <%>` | Override cap rate pass threshold | — |
| `--t-cap-rate-marginal <%>` | Override cap rate marginal threshold | — |
| `--t-cash-on-cash-pass <%>` | Override cash-on-cash pass threshold | — |
| `--t-cash-on-cash-marginal <%>` | Override cash-on-cash marginal threshold | — |
| `--t-irr-pass <%>` | Override IRR pass threshold | — |
| `--t-irr-marginal <%>` | Override IRR marginal threshold | — |

## Preset Profiles

By default, thresholds use the **Conservative** preset (margin of safety for HK market):

| Metric | Conservative | Moderate | Aggressive |
|--------|--------------|----------|------------|
| Gross Yield | 4.0% / 3.0% | 3.5% / 2.5% | 3.0% / 2.0% |
| Net Yield | 2.5% / 2.0% | 2.0% / 1.5% | 1.5% / 1.0% |
| Cap Rate | 4.5% / 3.5% | 4.0% / 3.0% | 3.0% / 2.0% |
| Cash-on-Cash | 10.0% / 6.0% | 8.0% / 4.0% | 6.0% / 3.0% |
| IRR | 10.0% / 7.0% | 8.0% / 5.0% | 6.0% / 4.0% |

Values shown as `pass / marginal`.

## Examples

```bash
# Quick check with defaults (conservative thresholds)
npx github:twistedogic/homer

# Use Moderate preset (realistic HK market)
npx github:twistedogic/homer --preset moderate

# Use Aggressive thresholds (more deals pass)
npx github:twistedogic/homer --preset aggressive

# Specific property with moderate thresholds
npx github:twistedogic/homer --price 6 --size 300 --rent-sqft 50 --preset moderate

# Custom threshold override
npx github:twistedogic/homer --price 6 --t-gross-yield-pass 5.0 --t-irr-pass 12.0

# Full custom thresholds
npx github:twistedogic/homer --preset conservative \
  --t-gross-yield-pass 5.0 --t-gross-yield-marginal 4.0 \
  --t-net-yield-pass 3.0 --t-net-yield-marginal 2.5

# JSON output for scripting
npx github:twistedogic/homer --price 5 --size 400 --json

# Higher down payment, longer hold
npx github:twistedogic/homer --price 8 --down-payment 2 --holding-period 15
```

## Output

Markdown output (default) includes:

1. **Screening Metrics table** — gross yield, net yield, cap rate, cash-on-cash, IRR each marked PASS / MARGINAL / FAIL with overall score (respects selected preset)
2. **Cash Flows table** — net cash flow per year
3. **Summary** — total P/L, NPV, IRR

## Overall Scoring

- **PASS** = all 5 metrics pass
- **MARGINAL** = 3+ metrics pass
- **FAIL** = fewer than 3 metrics pass