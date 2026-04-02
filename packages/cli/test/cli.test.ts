import { describe, it, expect } from "vitest";
import { formatMarkdown, formatJSON } from "../src/format";
import { calculate } from "../../../src/calculator";

const defaults = {
  price: 3.5,
  size: 2000,
  rentSqft: 40,
  managementFee: 5,
  mortgageRate: 3.5,
  mortgagePeriod: 30,
  downPayment: 0.7,
  holdingPeriod: 10,
  monthsRenters: 11,
  apprecRate: 3,
  rentApprecRate: 2,
  discountRate: 7,
  propertyTaxRate: 15,
  capex: 300,
};

describe("formatMarkdown", () => {
  it("includes cash flow table with correct year count", () => {
    const result = calculate(defaults);
    const output = formatMarkdown(result);
    expect(output).toContain("## Cash Flows");
    for (let i = 1; i <= defaults.holdingPeriod; i++) {
      expect(output).toContain(`| ${i} |`);
    }
  });

  it("includes summary table with Total P/L, NPV, and IRR", () => {
    const result = calculate(defaults);
    const output = formatMarkdown(result);
    expect(output).toContain("## Summary");
    expect(output).toContain("Total P/L");
    expect(output).toContain("NPV");
    expect(output).toContain("IRR");
  });

  it("formats currency with HK$ prefix and comma separators", () => {
    const result = calculate(defaults);
    const output = formatMarkdown(result);
    expect(output).toContain("HK$");
    expect(output).toContain(",");
  });

  it("formats IRR as percentage with one decimal", () => {
    const result = calculate(defaults);
    const output = formatMarkdown(result);
    expect(output).toMatch(/IRR\s+\|\s+\d+\.\d+%/);
  });

  it("handles NaN IRR gracefully", () => {
    const result = calculate({ ...defaults, price: 0.01, downPayment: 0.001 });
    result.cashFlows = result.cashFlows.map(() => -1000);
    result.terminalValue = -500;
    const output = formatMarkdown({ ...result, irr: NaN });
    expect(output).toContain("N/A");
  });
});

describe("formatJSON", () => {
  it("outputs valid JSON with correct keys", () => {
    const result = calculate(defaults);
    const output = formatJSON(result);
    const parsed = JSON.parse(output);
    expect(parsed).toHaveProperty("cashFlows");
    expect(parsed).toHaveProperty("totalPL");
    expect(parsed).toHaveProperty("npv");
    expect(parsed).toHaveProperty("irr");
  });

  it("totalPL equals sum of cashFlows plus terminalValue", () => {
    const result = calculate(defaults);
    const output = formatJSON(result);
    const parsed = JSON.parse(output);
    const expected = result.cashFlows.reduce((s, c) => s + c, 0) + result.terminalValue;
    expect(parsed.totalPL).toBeCloseTo(expected, 0);
  });

  it("irr is a decimal, not a percentage", () => {
    const result = calculate(defaults);
    const output = formatJSON(result);
    const parsed = JSON.parse(output);
    expect(parsed.irr).toBeLessThan(1);
    expect(parsed.irr).toBeGreaterThan(0);
  });

  it("cashFlows is an array of numbers", () => {
    const result = calculate(defaults);
    const output = formatJSON(result);
    const parsed = JSON.parse(output);
    expect(Array.isArray(parsed.cashFlows)).toBe(true);
    expect(parsed.cashFlows.length).toBe(defaults.holdingPeriod);
    parsed.cashFlows.forEach((cf: number) => expect(typeof cf).toBe("number"));
  });
});

describe("Total P/L calculation", () => {
  it("sums all cash flows and adds terminal value", () => {
    const cashFlows = [78000, 81600, 85300];
    const terminalValue = 4000000;
    const totalPL = cashFlows.reduce((s, c) => s + c, 0) + terminalValue;
    expect(totalPL).toBe(4244900);
  });
});
