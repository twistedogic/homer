import type { CalcResult } from "../../../src/calculator";

export function formatMarkdown(result: CalcResult): string {
  const lines: string[] = [];

  lines.push("## Cash Flows\n");
  lines.push("| Year | Cash Flow (HKD) |");
  lines.push("|------|-----------------|");
  for (let i = 0; i < result.cashFlows.length; i++) {
    const cf = result.cashFlows[i];
    const formatted = cf.toLocaleString("en-HK", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    lines.push(`| ${i + 1} | ${formatted} |`);
  }

  lines.push("");
  lines.push("## Summary\n");
  lines.push("| Metric       | Value         |");
  lines.push("|--------------|---------------|");

  const totalPL = result.cashFlows.reduce((s, c) => s + c, 0) + result.terminalValue;

  lines.push(`| Total P/L    | ${formatCurrency(totalPL)} |`);
  lines.push(`| NPV          | ${formatCurrency(result.npv)} |`);
  lines.push(`| IRR          | ${formatPercent(result.irr)} |`);

  return lines.join("\n") + "\n";
}

export function formatJSON(result: CalcResult): string {
  const totalPL = result.cashFlows.reduce((s, c) => s + c, 0) + result.terminalValue;

  return JSON.stringify({
    cashFlows: result.cashFlows,
    totalPL,
    npv: result.npv,
    irr: result.irr,
  }, null, 2);
}

function formatCurrency(num: number): string {
  const absNum = Math.abs(num);
  const formatted = absNum.toLocaleString("en-HK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return (num < 0 ? "-" : "") + "HK$" + formatted;
}

function formatPercent(decimal: number): string {
  if (Number.isNaN(decimal)) return "N/A";
  return (decimal * 100).toFixed(1) + "%";
}
