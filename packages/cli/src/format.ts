import type { CalcResult, ScreeningScore } from "../../../src/calculator";

export function formatMarkdown(result: CalcResult): string {
  const lines: string[] = [];

  lines.push("## Screening Metrics\n");
  lines.push("| Metric         | Value    | Target   | Status  |");
  lines.push("|----------------|----------|----------|---------|");

  const s = result.screening;
  const sc = s.score;

  lines.push(`| Gross Yield    | ${formatPct(s.grossYield)} | ≥ ${sc.grossYield.threshold}%   | ${scoreLabel(sc.grossYield)} |`);
  lines.push(`| Net Yield      | ${formatPct(s.netYield)} | ≥ ${sc.netYield.threshold}%   | ${scoreLabel(sc.netYield)} |`);
  lines.push(`| Cap Rate       | ${formatPct(s.capRate)} | ≥ ${sc.capRate.threshold}%   | ${scoreLabel(sc.capRate)} |`);
  lines.push(`| Cash-on-Cash   | ${formatPct(s.cashOnCash)} | ≥ ${sc.cashOnCash.threshold}%   | ${scoreLabel(sc.cashOnCash)} |`);
  lines.push(`| IRR            | ${formatPercent(result.irr)} | ≥ ${sc.irr.threshold}%   | ${scoreLabel(sc.irr)} |`);
  lines.push("");
  lines.push(`**Score: ${sc.passCount}/${sc.totalChecks} — ${overallLabel(sc.overall)}**`);

  lines.push("");
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
  const s = result.screening;

  return JSON.stringify({
    screening: {
      grossYield: s.grossYield,
      netYield: s.netYield,
      capRate: s.capRate,
      cashOnCash: s.cashOnCash,
      score: s.score,
    },
    cashFlows: result.cashFlows,
    totalPL,
    npv: result.npv,
    irr: result.irr,
  }, null, 2);
}

function scoreLabel(m: { pass: boolean; marginal: boolean }): string {
  if (m.pass) return "PASS";
  if (m.marginal) return "MARGINAL";
  return "FAIL";
}

function overallLabel(overall: ScreeningScore["overall"]): string {
  if (overall === "pass") return "PASS";
  if (overall === "marginal") return "MARGINAL";
  return "FAIL";
}

function formatPct(n: number): string {
  return n.toFixed(1) + "%";
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

