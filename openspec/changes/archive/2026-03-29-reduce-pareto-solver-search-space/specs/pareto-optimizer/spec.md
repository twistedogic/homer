## ADDED Requirements

### Requirement: Solver search space covers realistic Hong Kong property investment parameters

The Pareto solver SHALL evaluate combinations of down payment %, holding period, and mortgage period drawn from realistic Hong Kong property investment parameters.

#### Scenario: Solver evaluates down payment range
- **WHEN** the Pareto solver runs
- **THEN** it evaluates down payment % values of `[30, 40, 50, 60, 70]`

#### Scenario: Solver evaluates holding period range
- **WHEN** the Pareto solver runs
- **THEN** it evaluates holding period values of `[5, 10, 15, 20]` years

#### Scenario: Solver evaluates mortgage period range
- **WHEN** the Pareto solver runs
- **THEN** it evaluates mortgage period values of `[5, 10, 15, 20, 25, 30]` years

#### Scenario: Solver computes total combinations
- **WHEN** the Pareto solver runs
- **THEN** it evaluates at most 120 combinations (5 × 4 × 6)
