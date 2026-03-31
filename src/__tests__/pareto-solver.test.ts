import { describe, it, expect } from 'vitest';
import { evaluateCombination, extractParetoFrontier, ParetoRow } from '../pareto-solver';

const baseShared = {
  price: 3.5,
  size: 2000,
  rentSqft: 40,
  managementFee: 5,
  mortgageRate: 3.5,
  apprecRate: 3,
  rentApprecRate: 2,
  discountRate: 7,
  propertyTaxRate: 15,
  monthsRenters: 11,
};

describe('evaluateCombination', () => {
  it('returns a row with expected shape', () => {
    const row = evaluateCombination(50, 10, 30, baseShared);
    expect(row).toHaveProperty('dpPct', 50);
    expect(row).toHaveProperty('hp', 10);
    expect(row).toHaveProperty('mp', 30);
    expect(row).toHaveProperty('npv');
    expect(row).toHaveProperty('irr');
    expect(row).toHaveProperty('pl');
    expect(row.cashFlows).toHaveLength(10);
  });

  it('higher down payment reduces NPV (less leverage)', () => {
    const low = evaluateCombination(30, 10, 30, baseShared);
    const high = evaluateCombination(70, 10, 30, baseShared);
    expect(high.npv).toBeLessThan(low.npv);
  });

  it('longer holding period produces more cash flow entries', () => {
    const row20 = evaluateCombination(50, 20, 30, baseShared);
    const row5 = evaluateCombination(50, 5, 30, baseShared);
    expect(row20.cashFlows).toHaveLength(20);
    expect(row5.cashFlows).toHaveLength(5);
  });
});

describe('extractParetoFrontier', () => {
  it('returns all results when none dominate each other', () => {
    const results: ParetoRow[] = [
      { dpPct: 30, hp: 5, mp: 30, npv: 100, irr: 0.05, pl: 50, cashFlows: [] },
      { dpPct: 50, hp: 5, mp: 30, npv: 50, irr: 0.10, pl: 100, cashFlows: [] },
    ];
    const frontier = extractParetoFrontier(results);
    expect(frontier).toHaveLength(2);
  });

  it('removes dominated solutions', () => {
    const results: ParetoRow[] = [
      { dpPct: 30, hp: 5, mp: 30, npv: 100, irr: 0.10, pl: 200, cashFlows: [] },
      { dpPct: 50, hp: 5, mp: 30, npv: 50, irr: 0.05, pl: 100, cashFlows: [] },
    ];
    const frontier = extractParetoFrontier(results);
    expect(frontier).toHaveLength(1);
    expect(frontier[0].npv).toBe(100);
  });

  it('handles empty input', () => {
    expect(extractParetoFrontier([])).toHaveLength(0);
  });

  it('handles single result', () => {
    const results: ParetoRow[] = [
      { dpPct: 50, hp: 10, mp: 30, npv: 100, irr: 0.08, pl: 150, cashFlows: [] },
    ];
    expect(extractParetoFrontier(results)).toHaveLength(1);
  });
});
