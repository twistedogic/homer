## Context

A single-page static website calculates real estate investment metrics for Hong Kong properties. The site targets individual investors evaluating rental property deals. Constraints: no build step, no external JS dependencies, GitHub Pages compatible, accessible on mobile.

## Goals / Non-Goals

**Goals:**
- Calculate IRR using binary search, NPV using discount rate, and year-by-year cash flows
- Clean, numbers-forward UI optimized for reading financial figures
- All 12 inputs validated before calculation
- Mobile-responsive two-column layout (inputs | results)
- HKD currency formatting throughout

**Non-Goals:**
- No backend, no persistence, no user accounts
- No charts or visualizations beyond a text table
- No support for currencies other than HKD (hardcoded)
- No historical data, no API calls
- No server-side rendering or SSR

## Decisions

### Single `index.html` with embedded CSS and JS

**Decision:** One file contains all HTML, `<style>`, and `<script>` blocks.

**Rationale:** Zero build complexity. Commit and push to GitHub Pages. No npm, no bundler, no CI pipeline beyond `git push`.

**Alternative considered:** Separate `style.css` and `app.js` files. Rejected — more files to manage, same runtime behavior, introduces path dependency.

---

### Vanilla JavaScript (no frameworks)

**Decision:** Pure JS with no external libraries.

**Rationale:** No CDN dependencies to fail, no version lock-in, no bundle overhead. The math is simple enough that reactive frameworks add no value.

**Alternative considered:** Vue or React via CDN. Rejected — adds complexity for no gain; the form is static and the output is deterministic.

---

### CSS Grid two-column layout, flexbox stacking on mobile

**Decision:** Desktop: inputs left, results right. Mobile (<768px): single column, inputs above results.

**Rationale:** CSS Grid handles the two-column split cleanly. Flexbox `flex-wrap` handles the mobile stack. No JavaScript for layout.

---

### Binary search for IRR

**Decision:** Binary search with bounds [0, 2.0], 100 max iterations, tolerance 0.001.

**Rationale:** Standard approach for IRR when analytical solution (Newton-Raphson) requires derivative computation. Binary search is predictable, stable, and sufficient for this use case.

**Formula:**
```
NPV(r) = -DownPayment + Σ[ CF_t / (1+r)^t ] + TV / (1+r)^n
Find r where NPV(r) = 0
```

---

### Standard mortgage amortization formula

**Decision:** Use the standard amortization formula for monthly payment:

```
M = P_principal × [r_m × (1+r_m)^N] / [(1+r_m)^N - 1]
where:
  P_principal = Price × (1 - DownPayment/100)
  r_m = MortgageRate / 100 / 12
  N = MortgagePeriod × 12
```

---

### Property Tax: Net Rent × Rate (with 20% repairs allowance)

**Decision:** Annual property tax = Gross Annual Rent × 0.80 × (PropertyTaxRate/100).

**Rationale:** Matches Hong Kong Property Tax's 20% statutory allowance for repairs and outgoings. The 15% default is Hong Kong's standard Property Tax rate.

**Example:**
```
Gross Annual Rent = Size × Rent_sqft × Months_w_Renters
Net Rent = Gross Annual Rent × 0.80
Property Tax = Net Rent × 15%
```

---

### Terminal Value calculation at end of holding period

**Decision:** At year = holding period, sale proceeds = TV added to that year's cash flow.

```
Property_Sale = Price × (1 + ApprecRate/100)^holding_period
Remain_Balance = P_principal × [(1+r_m)^N - (1+r_m)^(12×holding_period)] / [(1+r_m)^N - 1]
Selling_Costs = Property_Sale × 0.07
TV = Property_Sale - Remain_Balance - Selling_Costs
```

---

### Input validation: inline errors + disabled button

**Decision:** Calculate button stays disabled until all 12 fields pass validation. Invalid fields show red border and error message below.

**Rationale:** Prevents calculation on invalid data. Inline errors are visible without popup/alert interruption.

---

### HKD currency formatting: thousands separator, no cents

**Decision:** Display as `HKD 1,234,567` (no decimal places for large numbers).

**Rationale:** Standard Hong Kong property pricing uses whole numbers. HKD cents (hoen) are irrelevant for property-level calculations.

---

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| IRR binary search may not converge for unusual cash flows | Max 100 iterations with tolerance check; fallback to "--" display |
| Large year-by-year table (e.g., 30 rows) may overflow mobile | Scrollable table container with fixed header |
| User enters invalid combos (e.g., holding period > mortgage period) | Validation rule: holding period ≤ mortgage period |
| IRR display format ambiguity (e.g., 12.4% vs 0.124) | Always display as percentage with % symbol: "12.4%" |

---

## Open Questions

- **Stamp duty**: Hong Kong purchase stamp duty (BSD, SSD, AVD) is significant for investors. Not included in current scope. Should it be?
- **Management fees / maintenance**: Often 0.5–1% of rent. Not included. Acknowledge in disclaimer only.
- **Initial cash outflow at year 0**: Down payment + legal fees + agent fees. Currently only down payment modeled. Legal/agent fees not included.
