import { parseNumber, formatCurrency, formatPercent } from './formatting';
import { calculate, calculatePropertyTax, CalcValues } from './calculator';
import { syncSharedInput, SHARED_KEYS } from './shared-state';

const calcInputs = {
  price: document.getElementById('price') as HTMLInputElement,
  size: document.getElementById('size') as HTMLInputElement,
  rentSqft: document.getElementById('rentSqft') as HTMLInputElement,
  managementFee: document.getElementById('managementFee') as HTMLInputElement,
  mortgageRate: document.getElementById('mortgageRate') as HTMLInputElement,
  mortgagePeriod: document.getElementById('mortgagePeriod') as HTMLInputElement,
  downPayment: document.getElementById('downPayment') as HTMLInputElement,
  holdingPeriod: document.getElementById('holdingPeriod') as HTMLInputElement,
  monthsRenters: document.getElementById('monthsRenters') as HTMLInputElement,
  apprecRate: document.getElementById('apprecRate') as HTMLInputElement,
  rentApprecRate: document.getElementById('rentApprecRate') as HTMLInputElement,
  discountRate: document.getElementById('discountRate') as HTMLInputElement,
  propertyTaxRate: document.getElementById('propertyTaxRate') as HTMLInputElement,
  capex: document.getElementById('capex') as HTMLInputElement,
};

function validateInputsCalc(): { valid: boolean; values: CalcValues } {
  const vals: CalcValues = {
    price: parseNumber(calcInputs.price.value),
    size: parseNumber(calcInputs.size.value),
    rentSqft: parseNumber(calcInputs.rentSqft.value),
    managementFee: parseNumber(calcInputs.managementFee.value),
    mortgageRate: parseNumber(calcInputs.mortgageRate.value),
    mortgagePeriod: parseNumber(calcInputs.mortgagePeriod.value),
    downPayment: parseNumber(calcInputs.downPayment.value),
    holdingPeriod: parseNumber(calcInputs.holdingPeriod.value),
    monthsRenters: parseNumber(calcInputs.monthsRenters.value),
    apprecRate: parseNumber(calcInputs.apprecRate.value),
    rentApprecRate: parseNumber(calcInputs.rentApprecRate.value),
    discountRate: parseNumber(calcInputs.discountRate.value),
    propertyTaxRate: parseNumber(calcInputs.propertyTaxRate.value),
    capex: parseNumber(calcInputs.capex.value),
  };

  const rules: Record<keyof CalcValues, { valid: boolean }> = {
    price: { valid: vals.price > 0 },
    size: { valid: vals.size > 0 },
    rentSqft: { valid: vals.rentSqft > 0 },
    managementFee: { valid: vals.managementFee >= 0 },
    mortgageRate: { valid: vals.mortgageRate > 0 && vals.mortgageRate <= 30 },
    mortgagePeriod: { valid: vals.mortgagePeriod > 0 && vals.mortgagePeriod <= 50 },
    downPayment: { valid: vals.downPayment > 0 && vals.downPayment <= vals.price },
    holdingPeriod: { valid: vals.holdingPeriod > 0 && vals.holdingPeriod <= 50 },
    monthsRenters: { valid: vals.monthsRenters >= 0 && vals.monthsRenters <= 12 },
    apprecRate: { valid: vals.apprecRate >= 0 && vals.apprecRate <= 20 },
    rentApprecRate: { valid: vals.rentApprecRate >= 0 && vals.rentApprecRate <= 20 },
    discountRate: { valid: vals.discountRate > 0 && vals.discountRate <= 30 },
    propertyTaxRate: { valid: vals.propertyTaxRate > 0 && vals.propertyTaxRate <= 30 },
    capex: { valid: vals.capex >= 0 },
  };

  let allValid = true;
  for (const [key, rule] of Object.entries(rules)) {
    const el = calcInputs[key as keyof typeof calcInputs];
    if (!rule.valid) {
      el.classList.add('invalid');
      allValid = false;
    } else {
      el.classList.remove('invalid');
    }
  }

  return { valid: allValid, values: vals };
}

function displayResults(result: ReturnType<typeof calculate>, vals: CalcValues): void {
  const resultsContainer = document.getElementById('results-container')!;
  const irrPercent = result.irr;
  const npvValue = result.npv;
  const totalCashFlows = result.cashFlows.reduce((sum, cf) => sum + cf, 0);
  const totalProfitLoss = totalCashFlows + result.terminalValue - result.initialInvestment;

  let html = `
    <div class="metrics">
      <div class="metric">
        <div class="metric-label">IRR</div>
        <div class="metric-value">${isNaN(result.irr) ? '—' : formatPercent(irrPercent)}</div>
      </div>
      <div class="metric">
        <div class="metric-label">NPV</div>
        <div class="metric-value ${npvValue < 0 ? 'negative' : ''}">${formatCurrency(npvValue)}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Property Value</div>
        <div class="metric-value">${formatCurrency(result.propertyEndValue)}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Total P/L</div>
        <div class="metric-value ${totalProfitLoss < 0 ? 'negative' : ''}">${formatCurrency(totalProfitLoss)}</div>
      </div>
    </div>
    <h2 style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 12px;">Cash Flow / Year</h2>
    <div class="cashflow-table-container">
      <table class="cashflow-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Annual Rent</th>
            <th>Property Tax</th>
            <th>Mortgage</th>
            <th>CAPEX</th>
            <th>Net CF</th>
          </tr>
        </thead>
        <tbody>
  `;

  for (let year = 1; year <= vals.holdingPeriod; year++) {
    const netRentPerSqft = vals.rentSqft - vals.managementFee;
    const annualRent = vals.size * netRentPerSqft * vals.monthsRenters * Math.pow(1 + vals.rentApprecRate / 100, year - 1);
    const propertyTax = calculatePropertyTax(annualRent, vals.propertyTaxRate);
    const annualCapex = vals.capex * vals.size / 10;
    const cf = result.cashFlows[year - 1];
    const isPositive = cf >= 0;

    html += `
      <tr>
        <td>${year}</td>
        <td>${formatCurrency(annualRent)}</td>
        <td>${formatCurrency(propertyTax)}</td>
        <td>${formatCurrency(year <= vals.mortgagePeriod ? result.annualMortgage : 0)}</td>
        <td>${formatCurrency(annualCapex)}</td>
        <td class="${isPositive ? 'positive' : 'negative'}">${isPositive ? '+' : ''}${formatCurrency(cf)}</td>
      </tr>
    `;
  }

  html += `
        </tbody>
      </table>
    </div>
  `;

  resultsContainer.innerHTML = html;
}

function updateCalculator(): void {
  const { valid, values } = validateInputsCalc();
  if (!valid) return;
  const result = calculate(values);
  displayResults(result, values);
}

export function initCalculator(): void {
  for (const [key, input] of Object.entries(calcInputs)) {
    input.addEventListener('input', () => {
      if ((SHARED_KEYS as readonly string[]).includes(key)) {
        syncSharedInput(key as typeof SHARED_KEYS[number], 'calc');
      }
      updateCalculator();
    });
  }

  updateCalculator();
}
