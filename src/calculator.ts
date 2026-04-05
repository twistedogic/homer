import { getThresholds, DEFAULT_THRESHOLDS } from './threshold-config';
import type { ThresholdConfig, ThresholdConfig as ThresholdConfigImport } from './types';

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
  capex: number;
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
  screening: ScreeningMetrics;
}

export interface ScreeningMetrics {
  grossYield: number;
  netYield: number;
  capRate: number;
  cashOnCash: number;
  score: ScreeningScore;
}

export interface ScreeningScore {
  grossYield: MetricScore;
  netYield: MetricScore;
  capRate: MetricScore;
  cashOnCash: MetricScore;
  irr: MetricScore;
  overall: "pass" | "marginal" | "fail";
  passCount: number;
  totalChecks: number;
}

export type MetricScore = {
  value: number;
  pass: boolean;
  marginal: boolean;
  threshold: number;
};

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

function metricScore(value: number, passThreshold: number, marginalThreshold: number): MetricScore {
  return {
    value,
    pass: value >= passThreshold,
    marginal: value >= marginalThreshold && value < passThreshold,
    threshold: passThreshold,
  };
}

export function calculateGrossYield(annualRent: number, purchasePrice: number): number {
  if (purchasePrice === 0) return 0;
  return (annualRent / purchasePrice) * 100;
}

export function calculateNetYield(
  annualRent: number,
  annualCosts: number,
  totalInvestment: number,
): number {
  if (totalInvestment === 0) return 0;
  return ((annualRent - annualCosts) / totalInvestment) * 100;
}

export function calculateCapRate(noi: number, purchasePrice: number): number {
  if (purchasePrice === 0) return 0;
  return (noi / purchasePrice) * 100;
}

export function calculateCashOnCash(annualPreTaxCashFlow: number, totalCashInvested: number): number {
  if (totalCashInvested === 0) return 0;
  return (annualPreTaxCashFlow / totalCashInvested) * 100;
}

export function calculateScreening(
  annualRent: number,
  annualCosts: number,
  annualMortgage: number,
  purchasePrice: number,
  downPayment: number,
  irr: number,
  thresholds?: ThresholdConfigImport,
): ScreeningMetrics {
  const t = thresholds ? getThresholds(thresholds) : DEFAULT_THRESHOLDS;
  const noi = annualRent - annualCosts;
  const preTaxCashFlow = noi - annualMortgage;

  const grossYield = calculateGrossYield(annualRent, purchasePrice);
  const netYield = calculateNetYield(annualRent, annualCosts, downPayment);
  const capRate = calculateCapRate(noi, purchasePrice);
  const cashOnCash = calculateCashOnCash(preTaxCashFlow, downPayment);

  const irrPct = isNaN(irr) ? 0 : irr * 100;

  const scores = {
    grossYield: metricScore(grossYield, t.grossYield.pass, t.grossYield.marginal),
    netYield: metricScore(netYield, t.netYield.pass, t.netYield.marginal),
    capRate: metricScore(capRate, t.capRate.pass, t.capRate.marginal),
    cashOnCash: metricScore(cashOnCash, t.cashOnCash.pass, t.cashOnCash.marginal),
    irr: metricScore(irrPct, t.irr.pass, t.irr.marginal),
  };

  const checks = Object.values(scores);
  const passCount = checks.filter(s => s.pass).length;
  const totalChecks = checks.length;

  let overall: ScreeningScore["overall"];
  if (passCount === totalChecks) {
    overall = "pass";
  } else if (passCount >= Math.ceil(totalChecks / 2)) {
    overall = "marginal";
  } else {
    overall = "fail";
  }

  return {
    grossYield,
    netYield,
    capRate,
    cashOnCash,
    score: { ...scores, overall, passCount, totalChecks },
  };
}

export function calculate(
  vals: CalcValues,
  thresholds?: ThresholdConfigImport,
): CalcResult {
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
    const annualCapex = vals.capex * vals.size / 10;
    const netCashFlow = annualRent - propertyTax - mortgagePayment - annualCapex;
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

  const year1NetRentPerSqft = vals.rentSqft - vals.managementFee;
  const year1GrossRent = vals.size * vals.rentSqft * vals.monthsRenters;
  const year1Rent = vals.size * year1NetRentPerSqft * vals.monthsRenters;
  const year1PropertyTax = calculatePropertyTax(year1GrossRent, vals.propertyTaxRate);
  const year1Capex = vals.capex * vals.size / 10;
  const year1Costs = year1PropertyTax + year1Capex;

  const screening = calculateScreening(
    year1Rent,
    year1Costs,
    annualMortgage,
    priceM,
    downPaymentM,
    irr,
    thresholds,
  );

  return {
    cashFlows,
    terminalValue,
    propertyEndValue,
    initialInvestment,
    npv,
    irr,
    annualMortgage,
    monthlyPayment,
    screening,
  };
}