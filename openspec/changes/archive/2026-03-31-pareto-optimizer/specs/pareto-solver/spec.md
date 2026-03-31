## ADDED Requirements

### Requirement: Grid enumeration of decision space

The solver SHALL enumerate all combinations of:
- Down payment: 50%, 55%, 60%, 65%, 70%, 75%, 80%, 85%, 90%, 95% (10 values)
- Holding period: 1 to 50 years inclusive (50 values)
- Mortgage period: 5 to 30 years inclusive (26 values)

Total combinations: 10 × 50 × 26 = 13,000

#### Scenario: Enumeration coverage
- **WHEN** the solver runs with default inputs
- **THEN** it SHALL evaluate exactly 13,000 decision combinations

### Requirement: Objective calculation per combination

For each decision combination, the solver SHALL calculate:
- NPV: Net Present Value using the discount rate
- IRR: Internal Rate of Return via binary search
- P/L: Total Profit/Loss (sum of annual cash flows + terminal value - initial investment)

The solver SHALL use the same calculation logic as the existing Calculator.

#### Scenario: NPV calculation matches Calculator
- **WHEN** solving for DP=50%, HP=10, MP=20 with specific property inputs
- **THEN** the NPV SHALL match the Calculator's NPV for the same inputs

### Requirement: IRR binary search with tolerance

The IRR solver SHALL use binary search with:
- Lower bound: 0
- Upper bound: 2.0 (200%)
- Max iterations: 50
- Convergence tolerance: 0.001

If convergence is not achieved within 50 iterations, the IRR for that combination SHALL be marked as undefined.

#### Scenario: Convergent cash flows
- **WHEN** IRR exists and is within bounds
- **THEN** solver SHALL return IRR within 0.001 of the true value

#### Scenario: Non-convergent cash flows
- **WHEN** IRR does not converge within 50 iterations
- **THEN** the IRR SHALL be marked as undefined (not a number)

### Requirement: Pareto frontier extraction

The solver SHALL filter the 13,000 results to the Pareto-optimal set where:
- Solution A dominates Solution B if: NPV_A ≥ NPV_B AND IRR_A ≥ IRR_B AND P/L_A ≥ P/L_B
- At least one inequality is strict (> not ≥)
- The Pareto set SHALL contain only nondominated solutions

#### Scenario: Pareto extraction removes dominated solutions
- **WHEN** solution A has higher NPV, higher IRR, and higher P/L than solution B
- **THEN** solution B SHALL NOT appear in the Pareto frontier

### Requirement: Solver performance

- **WHEN** the solver runs with default inputs
- **THEN** it SHALL complete within 500ms on a modern device (2020+ smartphone)
