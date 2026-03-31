import { describe, it, expect } from 'vitest';
import {
  calculateMortgagePayment,
  calculateRemainingBalance,
  calculateNPV,
  calculateIRR,
  calculatePropertyTax,
  calculateTerminalValue,
} from '../calculator';

describe('calculateMortgagePayment', () => {
  it('calculates monthly payment for standard mortgage', () => {
    const principal = 2_800_000;
    const payment = calculateMortgagePayment(principal, 3.5, 30);
    expect(payment).toBeCloseTo(12573, 0);
  });

  it('handles 0% interest rate (simple division)', () => {
    const payment = calculateMortgagePayment(1_200_000, 0, 10);
    expect(payment).toBeCloseTo(10000, 0);
  });

  it('returns higher payment for shorter term', () => {
    const p15 = calculateMortgagePayment(1_000_000, 3.5, 15);
    const p30 = calculateMortgagePayment(1_000_000, 3.5, 30);
    expect(p15).toBeGreaterThan(p30);
  });
});

describe('calculateRemainingBalance', () => {
  it('returns 0 at end of mortgage term', () => {
    const balance = calculateRemainingBalance(1_000_000, 3.5, 10, 120);
    expect(balance).toBeCloseTo(0, 0);
  });

  it('returns close to principal at start', () => {
    const balance = calculateRemainingBalance(1_000_000, 3.5, 30, 1);
    expect(balance).toBeCloseTo(998_426, -2);
  });

  it('handles 0% rate', () => {
    const balance = calculateRemainingBalance(1_200_000, 0, 10, 60);
    expect(balance).toBeCloseTo(600_000, 0);
  });
});

describe('calculatePropertyTax', () => {
  it('applies 80% net rent rule and tax rate', () => {
    const tax = calculatePropertyTax(100_000, 15);
    expect(tax).toBeCloseTo(12_000, 0);
  });

  it('returns 0 for 0% tax rate', () => {
    expect(calculatePropertyTax(100_000, 0)).toBe(0);
  });
});

describe('calculateNPV', () => {
  it('returns negative NPV when discount rate is very high', () => {
    const cashFlows = [10_000, 10_000, 10_000];
    const npv = calculateNPV(cashFlows, 50, 100_000, 50_000, 3);
    expect(npv).toBeLessThan(0);
  });

  it('returns positive NPV when cash flows are large', () => {
    const cashFlows = [50_000, 50_000, 50_000];
    const npv = calculateNPV(cashFlows, 5, 50_000, 100_000, 3);
    expect(npv).toBeGreaterThan(0);
  });

  it('includes terminal value in final year', () => {
    const cashFlows = [0];
    const npvWithTerminal = calculateNPV(cashFlows, 10, 100, 1000, 1);
    const npvWithout = calculateNPV(cashFlows, 10, 100, 0, 1);
    expect(npvWithTerminal).toBeGreaterThan(npvWithout);
  });
});

describe('calculateIRR', () => {
  it('returns a reasonable IRR for a profitable investment', () => {
    const cashFlows = [10_000, 10_000, 10_000, 10_000, 10_000];
    const irr = calculateIRR(cashFlows, 50_000, 80_000, 5);
    expect(irr).toBeGreaterThan(0);
    expect(irr).toBeLessThan(1);
  });

  it('returns NaN when cash flows cannot converge', () => {
    const cashFlows = [-100_000, -100_000];
    const irr = calculateIRR(cashFlows, 1_000, -500_000, 2);
    expect(irr).toBeNaN();
  });
});
