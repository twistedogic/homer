import { parseNumber } from './formatting';
import { calculate, CalcValues } from './calculator';
import type { ScreeningMetrics, MetricScore } from './calculator';
import { syncSharedInput, SHARED_KEYS, SharedPanel } from './shared-state';

const screenInputs = {
  price: document.getElementById('scr-price') as HTMLInputElement,
  size: document.getElementById('scr-size') as HTMLInputElement,
  rentSqft: document.getElementById('scr-rentSqft') as HTMLInputElement,
  managementFee: document.getElementById('scr-managementFee') as HTMLInputElement,
  mortgageRate: document.getElementById('scr-mortgageRate') as HTMLInputElement,
  mortgagePeriod: document.getElementById('scr-mortgagePeriod') as HTMLInputElement,
  downPayment: document.getElementById('scr-downPayment') as HTMLInputElement,
  holdingPeriod: document.getElementById('scr-holdingPeriod') as HTMLInputElement,
  monthsRenters: document.getElementById('scr-monthsRenters') as HTMLInputElement,
  apprecRate: document.getElementById('scr-apprecRate') as HTMLInputElement,
  rentApprecRate: document.getElementById('scr-rentApprecRate') as HTMLInputElement,
  discountRate: document.getElementById('scr-discountRate') as HTMLInputElement,
  propertyTaxRate: document.getElementById('scr-propertyTaxRate') as HTMLInputElement,
  capex: document.getElementById('scr-capex') as HTMLInputElement,
};

function parseInputs(): { valid: boolean; values: CalcValues } {
  const vals: CalcValues = {
    price: parseNumber(screenInputs.price.value),
    size: parseNumber(screenInputs.size.value),
    rentSqft: parseNumber(screenInputs.rentSqft.value),
    managementFee: parseNumber(screenInputs.managementFee.value),
    mortgageRate: parseNumber(screenInputs.mortgageRate.value),
    mortgagePeriod: parseNumber(screenInputs.mortgagePeriod.value),
    downPayment: parseNumber(screenInputs.downPayment.value),
    holdingPeriod: parseNumber(screenInputs.holdingPeriod.value),
    monthsRenters: parseNumber(screenInputs.monthsRenters.value),
    apprecRate: parseNumber(screenInputs.apprecRate.value),
    rentApprecRate: parseNumber(screenInputs.rentApprecRate.value),
    discountRate: parseNumber(screenInputs.discountRate.value),
    propertyTaxRate: parseNumber(screenInputs.propertyTaxRate.value),
    capex: parseNumber(screenInputs.capex.value),
  };

  const valid =
    vals.price > 0 &&
    vals.size > 0 &&
    vals.rentSqft > 0 &&
    vals.managementFee >= 0 &&
    vals.mortgageRate > 0 && vals.mortgageRate <= 30 &&
    vals.mortgagePeriod > 0 && vals.mortgagePeriod <= 50 &&
    vals.downPayment > 0 && vals.downPayment < vals.price &&
    vals.holdingPeriod > 0 && vals.holdingPeriod <= 50 &&
    vals.monthsRenters >= 0 && vals.monthsRenters <= 12 &&
    vals.apprecRate >= 0 && vals.apprecRate <= 20 &&
    vals.rentApprecRate >= 0 && vals.rentApprecRate <= 20 &&
    vals.discountRate > 0 && vals.discountRate <= 30 &&
    vals.propertyTaxRate > 0 && vals.propertyTaxRate <= 30 &&
    vals.capex >= 0 &&
    Object.values(vals).every(v => !isNaN(v));

  return { valid, values: vals };
}

function badgeClass(score: MetricScore): string {
  if (score.pass) return 'scr-badge scr-badge--pass';
  if (score.marginal) return 'scr-badge scr-badge--marginal';
  return 'scr-badge scr-badge--fail';
}

function badgeLabel(score: MetricScore): string {
  if (score.pass) return 'PASS';
  if (score.marginal) return 'MARGINAL';
  return 'FAIL';
}

function pct(n: number): string {
  return n.toFixed(2) + '%';
}

function renderScreening(container: HTMLElement, metrics: ScreeningMetrics, irr: number): void {
  const { score } = metrics;
  const irrPct = isNaN(irr) ? 0 : irr * 100;

  const overallClass =
    score.overall === 'pass' ? 'scr-overall scr-overall--pass' :
    score.overall === 'marginal' ? 'scr-overall scr-overall--marginal' :
    'scr-overall scr-overall--fail';

  const overallLabel =
    score.overall === 'pass' ? 'PASS' :
    score.overall === 'marginal' ? 'MARGINAL' : 'FAIL';

  const rows: Array<{ label: string; value: string; target: string; score: MetricScore }> = [
    { label: 'Gross Yield', value: pct(metrics.grossYield), target: `≥ ${score.grossYield.threshold}%`, score: score.grossYield },
    { label: 'Net Yield', value: pct(metrics.netYield), target: `≥ ${score.netYield.threshold}%`, score: score.netYield },
    { label: 'Cap Rate', value: pct(metrics.capRate), target: `≥ ${score.capRate.threshold}%`, score: score.capRate },
    { label: 'Cash-on-Cash', value: pct(metrics.cashOnCash), target: `≥ ${score.cashOnCash.threshold}%`, score: score.cashOnCash },
    { label: 'IRR', value: isNaN(irr) ? '—' : pct(irrPct), target: `≥ ${score.irr.threshold}%`, score: score.irr },
  ];

  container.innerHTML = `
    <div class="${overallClass}">
      <span class="scr-overall__label">Overall Score</span>
      <span class="scr-overall__value">${score.passCount} / ${score.totalChecks}</span>
      <span class="scr-overall__badge">${overallLabel}</span>
    </div>
    <div class="scr-table">
      <div class="scr-table__header">
        <span>Metric</span>
        <span>Value</span>
        <span>Target</span>
        <span>Status</span>
      </div>
      ${rows.map(r => `
        <div class="scr-table__row">
          <span class="scr-table__metric">${r.label}</span>
          <span class="scr-table__value">${r.value}</span>
          <span class="scr-table__target">${r.target}</span>
          <span class="${badgeClass(r.score)}">${badgeLabel(r.score)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function updateScreening(): void {
  const container = document.getElementById('screening-results')!;
  const { valid, values } = parseInputs();

  if (!valid) {
    container.innerHTML = '<div class="placeholder-results">Enter valid inputs to see screening results</div>';
    return;
  }

  const result = calculate(values);
  renderScreening(container, result.screening, result.irr);
}

export function initScreening(): void {
  for (const [key, input] of Object.entries(screenInputs)) {
    input.addEventListener('input', () => {
      if ((SHARED_KEYS as readonly string[]).includes(key)) {
        syncSharedInput(key as typeof SHARED_KEYS[number], 'scr' as SharedPanel);
      }
      updateScreening();
    });
  }

  updateScreening();
}
