import { parseNumber } from './formatting';
import { calculate, CalcValues } from './calculator';
import type { ScreeningMetrics, MetricScore } from './calculator';
import { syncSharedInput, SHARED_KEYS, SharedPanel } from './shared-state';
import { loadConfig, saveConfig, resetConfig, getThresholds, validateThresholds, PRESETS } from './threshold-config';
import type { ThresholdConfig, PresetName, Thresholds, ValidationResult } from './types';

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

// Global threshold state
let thresholdConfig: ThresholdConfig = loadConfig();
let thresholdValidation: ValidationResult = { valid: true };

// DOM elements for threshold UI
const thresholdPresetSelect = document.getElementById('threshold-preset') as HTMLSelectElement;
const thresholdInputsContainer = document.getElementById('threshold-inputs')!;
const thresholdResetBtn = document.getElementById('threshold-reset') as HTMLButtonElement;
const thresholdErrorContainer = document.getElementById('threshold-errors')!;

const PRESET_OPTIONS: Array<{ value: PresetName | 'custom'; label: string }> = [
  { value: 'conservative', label: 'Conservative (Yield-Focused)' },
  { value: 'moderate', label: 'Moderate (Balanced)' },
  { value: 'aggressive', label: 'Aggressive (More Deals Pass)' },
  { value: 'custom', label: 'Custom Values' },
];

const METRIC_KEYS: Array<{ key: keyof Thresholds; label: string }> = [
  { key: 'grossYield', label: 'Gross Yield' },
  { key: 'netYield', label: 'Net Yield' },
  { key: 'capRate', label: 'Cap Rate' },
  { key: 'cashOnCash', label: 'Cash-on-Cash' },
  { key: 'irr', label: 'IRR' },
];

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

function renderScreening(container: HTMLElement, metrics: ScreeningMetrics, irr: number, invalid: boolean): void {
  if (invalid) {
    container.innerHTML = '<div class="placeholder-results">Invalid thresholds. Please fix the errors above.</div>';
    return;
  }

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

function getActiveThresholds(): Thresholds {
  return getThresholds(thresholdConfig);
}

function buildThresholdCustom(): Partial<Thresholds> {
  const custom: Partial<Thresholds> = {};
  for (const { key } of METRIC_KEYS) {
    const passInput = document.getElementById(`threshold-${key}-pass`) as HTMLInputElement;
    const marginalInput = document.getElementById(`threshold-${key}-marginal`) as HTMLInputElement;
    if (passInput && marginalInput) {
      const pass = parseFloat(passInput.value);
      const marginal = parseFloat(marginalInput.value);
      if (!isNaN(pass) && !isNaN(marginal)) {
        custom[key] = { pass, marginal };
      }
    }
  }
  return custom;
}

function updateThresholdConfig(): void {
  const preset = thresholdPresetSelect.value as PresetName | 'custom';
  
  if (preset === 'custom') {
    const custom = buildThresholdCustom();
    thresholdConfig = { preset: 'custom', custom };
  } else {
    thresholdConfig = { preset };
  }
  
  // Validate
  if (preset === 'custom') {
    thresholdValidation = validateThresholds(thresholdConfig.custom || {});
  } else {
    thresholdValidation = { valid: true };
  }
  
  // Show/hide error
  if (!thresholdValidation.valid) {
    thresholdErrorContainer.innerHTML = thresholdValidation.errors!.map(e => 
      `<div class="threshold-error">${e}</div>`
    ).join('');
    thresholdErrorContainer.style.display = 'block';
  } else {
    thresholdErrorContainer.innerHTML = '';
    thresholdErrorContainer.style.display = 'none';
  }
  
  // Save to localStorage
  saveConfig(thresholdConfig);
  
  // Update input states
  updateThresholdInputStates();
  
  // Update results
  updateScreening();
}

function updateThresholdInputStates(): void {
  const isCustom = thresholdPresetSelect.value === 'custom';
  const isReadonly = !isCustom;
  
  for (const { key } of METRIC_KEYS) {
    const passInput = document.getElementById(`threshold-${key}-pass`) as HTMLInputElement;
    const marginalInput = document.getElementById(`threshold-${key}-marginal`) as HTMLInputElement;
    
    if (passInput) {
      passInput.readOnly = isReadonly;
      passInput.disabled = isReadonly;
    }
    if (marginalInput) {
      marginalInput.readOnly = isReadonly;
      marginalInput.disabled = isReadonly;
    }
  }
}

function updateThresholdInputsFromConfig(): void {
  const thresholds = getActiveThresholds();
  
  // Update select
  thresholdPresetSelect.value = thresholdConfig.preset;
  
  // Update inputs
  for (const { key } of METRIC_KEYS) {
    const passInput = document.getElementById(`threshold-${key}-pass`) as HTMLInputElement;
    const marginalInput = document.getElementById(`threshold-${key}-marginal`) as HTMLInputElement;
    
    if (passInput && thresholds[key]) {
      passInput.value = thresholds[key].pass.toFixed(1);
    }
    if (marginalInput && thresholds[key]) {
      marginalInput.value = thresholds[key].marginal.toFixed(1);
    }
  }
  
  updateThresholdInputStates();
}

function renderThresholdInputs(): void {
  const thresholds = getActiveThresholds();
  const isCustom = thresholdConfig.preset === 'custom';
  
  let html = '';
  
  for (const { key, label } of METRIC_KEYS) {
    const t = thresholds[key];
    html += `
      <div class="threshold-row">
        <span class="threshold-label">${label}</span>
        <div class="threshold-inputs">
          <div class="threshold-input-group">
            <label>Pass</label>
            <input type="number" id="threshold-${key}-pass" step="0.1" value="${t.pass.toFixed(1)}" ${isCustom ? '' : 'readonly disabled'}>
            <span class="threshold-unit">%</span>
          </div>
          <span class="threshold-separator">/</span>
          <div class="threshold-input-group">
            <label>Marginal</label>
            <input type="number" id="threshold-${key}-marginal" step="0.1" value="${t.marginal.toFixed(1)}" ${isCustom ? '' : 'readonly disabled'}>
            <span class="threshold-unit">%</span>
          </div>
        </div>
      </div>
    `;
  }
  
  thresholdInputsContainer.innerHTML = html;
  
  // Add event listeners for custom mode
  if (isCustom) {
    for (const { key } of METRIC_KEYS) {
      const passInput = document.getElementById(`threshold-${key}-pass`) as HTMLInputElement;
      const marginalInput = document.getElementById(`threshold-${key}-marginal`) as HTMLInputElement;
      
      passInput.addEventListener('input', updateThresholdConfig);
      marginalInput.addEventListener('input', updateThresholdConfig);
    }
  }
}

function handlePresetChange(): void {
  const preset = thresholdPresetSelect.value as PresetName | 'custom';
  
  if (preset === 'custom') {
    // Clear inputs for custom, but show conservative as placeholder
    const conservative = PRESETS.conservative;
    for (const { key } of METRIC_KEYS) {
      const passInput = document.getElementById(`threshold-${key}-pass`) as HTMLInputElement;
      const marginalInput = document.getElementById(`threshold-${key}-marginal`) as HTMLInputElement;
      passInput.value = '';
      passInput.placeholder = conservative[key].pass.toFixed(1);
      marginalInput.value = '';
      marginalInput.placeholder = conservative[key].marginal.toFixed(1);
    }
  }
  
  updateThresholdConfig();
}

function handleReset(): void {
  thresholdConfig = resetConfig();
  thresholdValidation = { valid: true };
  thresholdErrorContainer.innerHTML = '';
  thresholdErrorContainer.style.display = 'none';
  saveConfig(thresholdConfig);
  updateThresholdInputsFromConfig();
  renderThresholdInputs();
  updateScreening();
}

function initThresholdUI(): void {
  // Build preset dropdown
  let optionsHtml = '';
  for (const opt of PRESET_OPTIONS) {
    optionsHtml += `<option value="${opt.value}">${opt.label}</option>`;
  }
  thresholdPresetSelect.innerHTML = optionsHtml;
  
  // Render threshold inputs
  renderThresholdInputs();
  
  // Update from saved config
  updateThresholdInputsFromConfig();
  
  // Add event listeners
  thresholdPresetSelect.addEventListener('change', handlePresetChange);
  thresholdResetBtn.addEventListener('click', handleReset);
}

function updateScreening(): void {
  const container = document.getElementById('screening-results')!;
  const { valid, values } = parseInputs();

  if (!valid) {
    container.innerHTML = '<div class="placeholder-results">Enter valid inputs to see screening results</div>';
    return;
  }

  if (!thresholdValidation.valid) {
    container.innerHTML = '<div class="placeholder-results">Invalid thresholds. Please fix the errors above.</div>';
    return;
  }

  const result = calculate(values, thresholdConfig);
  renderScreening(container, result.screening, result.irr, false);
}

export function initScreening(): void {
  // Initialize threshold UI first
  initThresholdUI();
  
  // Property input listeners
  for (const [key, input] of Object.entries(screenInputs)) {
    input.addEventListener('input', () => {
      if ((SHARED_KEYS as readonly string[]).includes(key)) {
        syncSharedInput(key as typeof SHARED_KEYS[number], 'scr' as SharedPanel);
      }
      updateScreening();
    });
  }

  // Initial update
  updateScreening();
}