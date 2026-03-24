## Why

A Hong Kong-focused real estate investment calculator is needed to help investors evaluate rental property deals. The tool should be simple, browser-based, and deployable as a GitHub Pages static site. It computes Internal Rate of Return (IRR), Net Present Value (NPV), and year-by-year cash flows based on Hong Kong-specific inputs including the 15% Property Tax regime.

## What Changes

- New static website hosted on GitHub Pages
- Single `index.html` file with embedded HTML, CSS, and JavaScript (no build step, no dependencies)
- Calculator with 12 inputs and 3 outputs
- Clean, financial aesthetic prioritizing readability of numbers
- Mobile-responsive layout

### Inputs

| # | Field | Default |
|---|-------|---------|
| 1 | Property Price (HKD) | — |
| 2 | Size (sq ft) | — |
| 3 | Rent/sqft (HKD/mo) | — |
| 4 | Mortgage Rate (%) | — |
| 5 | Mortgage Period (years) | — |
| 6 | Down Payment (%) | — |
| 7 | Holding Period (years) | — |
| 8 | Months w/ Renters | — |
| 9 | Property Appreciation Rate (%) | — |
| 10 | Rent Appreciation Rate (%) | — |
| 11 | Discount Rate (%) | — |
| 12 | Property Tax Rate (%) | **15%** |

### Outputs

- **IRR** — Internal Rate of Return (binary search, 100 iterations, tolerance 0.001)
- **NPV** — Net Present Value (discount rate from input 11)
- **Cash Flow / Year** — Full year-by-year table from year 1 to holding period

### Hardcoded Assumptions

- Selling costs: 7% of sale price
- Property Tax: Net Rent × 15% (Net Rent = Gross Rent × 80%, accounting for 20% repairs allowance)
- No property taxes beyond input 12, no insurance, no maintenance, no HOA

## Capabilities

### New Capabilities

- `real-estate-calculator`: Investment property analyzer computing IRR, NPV, and year-by-year cash flows for a rental property held over a specified period. Uses standard amortization formula for mortgage payments, binary search for IRR, and compound appreciation for terminal value.

- `hkd-currency`: Hong Kong Dollar currency formatting for inputs and outputs. Numbers displayed with thousands separators and appropriate precision.

## Impact

- **New files**: `index.html`, `README.md`
- **No existing code affected**
- **No external dependencies** (vanilla JS, no npm, no CDN libraries)
- **GitHub Pages deployment** via `gh-pages` branch or `/docs` folder
