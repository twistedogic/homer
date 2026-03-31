export interface CalcValues {
  price: number;
  size: number;
  rentSqft: number;
  managementFee: number;
  mortgageRate: number;
  mortgagePeriod: number;
  downPayment: number;
  holdingPeriod: number;
  monthsRenters: number;
  apprecRate: number;
  rentApprecRate: number;
  discountRate: number;
  propertyTaxRate: number;
}

export interface CalcResult {
  cashFlows: number[];
  terminalValue: number;
  propertyEndValue: number;
  initialInvestment: number;
  npv: number;
  irr: number;
  annualMortgage: number;
  monthlyPayment: number;
}

export function calculateMortgagePayment(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function calculateRemainingBalance(principal: number, annualRate: number, years: number, monthsElapsed: number): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal * (1 - monthsElapsed / n);
  const powN = Math.pow(1 + r, n);
  const powP = Math.pow(1 + r, monthsElapsed);
  return principal * (powN - powP) / (powN - 1);
}

export function calculatePropertyTax(grossRent: number, taxRate: number): number {
  const netRent = grossRent * 0.80;
  return netRent * (taxRate / 100);
}

export function calculateTerminalValue(
  price: number,
  aprecRate: number,
  holdingPeriod: number,
  principal: number,
  mortgageRate: number,
  mortgagePeriod: number,
): number {
  const propertySale = price * Math.pow(1 + aprecRate / 100, holdingPeriod);
  const monthsHeld = holdingPeriod * 12;
  const remainingBalance = monthsHeld > mortgagePeriod * 12
    ? 0
    : calculateRemainingBalance(principal, mortgageRate, mortgagePeriod, monthsHeld);
  const sellingCosts = propertySale * 0.07;
  return propertySale - remainingBalance - sellingCosts;
}

export function calculateNPV(
  cashFlows: number[],
  discountRate: number,
  initialInvestment: number,
  terminalValue: number,
  holdingPeriod: number,
): number {
  const r = discountRate / 100;
  let npv = -initialInvestment;
  for (let t = 1; t <= holdingPeriod; t++) {
    if (t === holdingPeriod) {
      npv += (cashFlows[t - 1] + terminalValue) / Math.pow(1 + r, t);
    } else {
      npv += cashFlows[t - 1] / Math.pow(1 + r, t);
    }
  }
  return npv;
}

export function calculateIRR(
  cashFlows: number[],
  initialInvestment: number,
  terminalValue: number,
  holdingPeriod: number,
): number {
  let lower = 0;
  let upper = 2.0;
  const tolerance = 0.001;
  const maxIterations = 50;

  for (let i = 0; i < maxIterations; i++) {
    const mid = (lower + upper) / 2;
    let npv = -initialInvestment;
    const r = mid;
    for (let t = 1; t <= holdingPeriod; t++) {
      if (t === holdingPeriod) {
        npv += (cashFlows[t - 1] + terminalValue) / Math.pow(1 + r, t);
      } else {
        npv += cashFlows[t - 1] / Math.pow(1 + r, t);
      }
    }

    if (Math.abs(npv) < tolerance) {
      return mid;
    }

    if (npv > 0) {
      lower = mid;
    } else {
      upper = mid;
    }
  }

  return NaN;
}

export function calculate(vals: CalcValues): CalcResult {
  const priceM = vals.price * 1000000;
  const downPaymentM = vals.downPayment * 1000000;
  const principal = priceM - downPaymentM;
  const monthlyPayment = calculateMortgagePayment(principal, vals.mortgageRate, vals.mortgagePeriod);
  const annualMortgage = monthlyPayment * 12;

  const cashFlows: number[] = [];
  for (let year = 1; year <= vals.holdingPeriod; year++) {
    const netRentPerSqft = vals.rentSqft - vals.managementFee;
    const annualRent = vals.size * netRentPerSqft * vals.monthsRenters * Math.pow(1 + vals.rentApprecRate / 100, year - 1);
    const propertyTax = calculatePropertyTax(annualRent, vals.propertyTaxRate);
    const mortgagePayment = year <= vals.mortgagePeriod ? annualMortgage : 0;
    const netCashFlow = annualRent - propertyTax - mortgagePayment;
    cashFlows.push(netCashFlow);
  }

  const terminalValue = calculateTerminalValue(
    priceM,
    vals.apprecRate,
    vals.holdingPeriod,
    principal,
    vals.mortgageRate,
    vals.mortgagePeriod,
  );

  const initialInvestment = downPaymentM;
  const propertyEndValue = priceM * Math.pow(1 + vals.apprecRate / 100, vals.holdingPeriod);

  const npv = calculateNPV(cashFlows, vals.discountRate, initialInvestment, terminalValue, vals.holdingPeriod);
  const irr = calculateIRR(cashFlows, initialInvestment, terminalValue, vals.holdingPeriod);

  return {
    cashFlows,
    terminalValue,
    propertyEndValue,
    initialInvestment,
    npv,
    irr,
    annualMortgage,
    monthlyPayment,
  };
}
