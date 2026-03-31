## Context

Homer is a single-page property investment calculator currently hosted at GitHub Pages. It computes NPV and IRR for a user-specified set of inputs (property price, down payment, mortgage terms, etc.). The calculator is implemented entirely in `index.html` with vanilla JavaScript — no build step, no external dependencies beyond fonts.

The PWA layer (service worker, manifest, install prompt) was added recently and is working.

## Goals / Non-Goals

**Goals:**
- Add an Optimize tab that shows Pareto-optimal investment configurations
- Enumerate the full decision space: 13,000 combinations (10 DP% × 50 HP × 26 MP)
- Extract and display the Pareto frontier across three objectives: NPV, IRR, and P/L
- Table is sortable by any column; click to expand full cash flow details
- Inputs for property attributes (price, rent, rates) are shared with Calculator tab
- Minimum 50% down payment (investment property LTV constraint)

**Non-Goals:**
- 3D visualization
- MiniZinc integration (grid search suffices for 13K combos)
- User-configurable decision variable bounds
- Multi-objective optimization beyond Pareto enumeration
- Server-side computation

## Decisions

### Decision: Grid Search over Optimization

**Choice:** Brute-force enumerate all 13,000 decision combinations and filter to Pareto frontier.

**Rationale:** 13,000 combinations × 3 objectives = trivial computation (~200ms in JS). No need for constraint solver overhead. MiniZinc.js adds ~5MB payload for no benefit in this scope.

**Alternatives considered:**
- MiniZinc.js: Overkill, large payload, IRR objective awkward (root-finding not directly optimizable)
- Newton's method for IRR: Converges faster but less robust for irregular cash flows

### Decision: 10%, 55%, 60%... 95% Down Payment Steps

**Choice:** 5% increment from 50% to 95% (10 values), with 50% minimum.

**Rationale:** Investment property LTV cap of 50% (minimum down payment). 95% maximum reflects the practical upper bound. 5% steps give sufficient granularity while keeping table manageable.

### Decision: 50 iterations, 0.001 tolerance for IRR binary search

**Choice:** Binary search for IRR with max 50 iterations and tolerance 0.001.

**Rationale:** Most cash flow patterns converge within 20 iterations. 50 provides safety margin. 0.001 (0.1%) is sufficient precision for display. Non-convergent solutions show as "—".

### Decision: New Tab (not modal, not inline)

**Choice:** Optimize is a separate tab alongside Calculator.

**Rationale:** Calculator and Optimize serve different purposes — specific calculation vs. exploration. Modal would obscure the comparison; inline would clutter the layout. Tab switching is clear and discoverable.

### Decision: Linked Property Inputs

**Choice:** Property inputs (price, size, rent, rates) are shared between tabs. Decision variables (DP%, HP, MP) are independent per tab.

**Rationale:** User sets property parameters once, then can use both tools. Decision variables differ in intent — Calculator uses fixed values, Optimize explores ranges.

### Decision: Vanilla HTML Table, Not D3

**Choice:** Use vanilla HTML table with CSS sorting instead of D3.js visualization.

**Rationale:** Table shows exact numbers, sortable, mobile-friendly, no additional dependency. Pareto frontier is a set of discrete points — table is appropriate representation. D3 overhead (~200KB) unjustified for sortable table.

### Decision: IRR Non-Convergence Shown as "—"

**Choice:** Binary search failure displays "—" instead of filtering or error message.

**Rationale:** Transparent about solver limitations. User can infer that these configurations have extreme/unusual cash flow patterns. Does not hide information.

## Risks / Trade-offs

**[Risk]** 13,000 combos × 3 objectives computation time on slow devices  
**→ Mitigation:** ~200ms target; computations run synchronously (not blocking UI since table renders after). If profiling shows issues, reduce holding period steps.

**[Risk]** IRR binary search fails for certain cash flow patterns (e.g., all-negative cash flows)  
**→ Mitigation:** Display "—" for non-convergent solutions. Most practical configurations converge.

**[Risk]** Table with ~100 rows may be overwhelming  
**→ Mitigation:** Pareto filter reduces 13,000 → ~100. Future enhancement: allow user to filter by minimum IRR or NPV threshold.

**[Risk]** Input linking may cause confusion when tab state diverges  
**→ Mitigation:** Only property inputs are linked. Clear visual separation between shared inputs and tab-specific decision views.

## Open Questions

- Should the table be paginated (e.g., 20 rows per page) or scrollable?
- Should there be a "lock" feature to fix one decision variable and only vary the others?
- Future: MiniZinc for custom constraints (e.g., "NPV must exceed 1M") — deferred to later change
