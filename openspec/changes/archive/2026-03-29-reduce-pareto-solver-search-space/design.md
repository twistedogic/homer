## Context

The Pareto solver in `index.html` iterates over three decision variables to evaluate investment scenarios. Each combination is evaluated for NPV, IRR, and Profit/Loss, then non-dominated solutions are extracted as the Pareto frontier.

**Current state:**
- `DP_VALUES`: `[50, 55, 60, 65, 70, 75, 80, 85, 90, 95]` (10 values)
- `HP_VALUES`: `[1–50]` (50 values)
- `MP_VALUES`: `[5–30]` (26 values)
- Total: 13,000 combinations

This change has already been applied to `index.html`. The OpenSpec change is being created to document the decision.

## Goals / Non-Goals

**Goals:**
- Reduce solver search space to more realistic investment parameters
- Improve performance by reducing evaluated combinations

**Non-Goals:**
- Modifying the Pareto algorithm itself (domination logic, objectives)
- Changing form inputs or shared parameters

## Decisions

**Decision: Narrow ranges to realistic Hong Kong property investment scenarios**

| Variable | Old Range | New Range | Rationale |
|---|---|---|---|
| Down Payment % | 50–95 (step 5) | 30, 40, 50, 60, 70 | HK mortgage cap at 70% LTV; lower down payments more realistic |
| Holding Period (years) | 1–50 | 5, 10, 15, 20 | Short-term flipping vs. long-term holding; 5-year increments |
| Mortgage Period (years) | 5–30 (every year) | 5, 10, 15, 20, 25, 30 | Standard HK mortgage terms |

**Alternatives considered:**
- *Keep fine-grained ranges with user-configurable bounds*: Adds UI complexity; default narrow range is sufficient for initial use
- *Dynamic range based on inputs*: Over-engineering for current needs

## Risks / Trade-offs

- **[Risk]** Users may want to explore extreme scenarios (e.g., 80-year hold, 90% down payment) → **Mitigation**: These edge cases are unlikely to be optimal; narrow range captures realistic investment decisions
- **[Trade-off]** Reduced search granularity means some near-optimal solutions may be missed — acceptable given the 5-step resolution is still clinically useful
