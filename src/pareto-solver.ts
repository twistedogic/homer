import { calculateMortgagePayment, calculateRemainingBalance, calculatePropertyTax, calculateNPV, calculateIRR } from './calculator';

export interface SharedValues {
  price: number;
  size: number;
  rentSqft: number;
  managementFee: number;
  mortgageRate: number;
  apprecRate: number;
  rentApprecRate: number;
  discountRate: number;
  propertyTaxRate: number;
  monthsRenters: number;
}

export interface ParetoRow {
  dpPct: number;
  hp: number;
  mp: number;
  npv: number;
  irr: number;
  pl: number;
  cashFlows: number[];
  annualRents: number[];
  propertyTaxes: number[];
  mortgagePayments: number[];
}

export const DP_VALUES = [30, 40, 50, 60, 70];
export const HP_VALUES = [5, 10, 15, 20];
export const MP_VALUES = [5, 10, 15, 20, 25, 30];

export function evaluateCombination(dpPct: number, hp: number, mp: number, shared: SharedValues): ParetoRow {
  const priceM = shared.price * 1000000;
  const downPaymentM = priceM * (dpPct / 100);
  const principal = priceM - downPaymentM;
  const monthlyPayment = calculateMortgagePayment(principal, shared.mortgageRate, mp);
  const annualMortgage = monthlyPayment * 12;

  const cashFlows: number[] = [];
  const annualRents: number[] = [];
  const propertyTaxes: number[] = [];
  const mortgagePayments: number[] = [];
  for (let year = 1; year <= hp; year++) {
    const netRentPerSqft = shared.rentSqft - shared.managementFee;
    const annualRent = shared.size * netRentPerSqft * shared.monthsRenters * Math.pow(1 + shared.rentApprecRate / 100, year - 1);
    const propertyTax = calculatePropertyTax(annualRent, shared.propertyTaxRate);
    const mortgagePayment = year <= mp ? annualMortgage : 0;
    annualRents.push(annualRent);
    propertyTaxes.push(propertyTax);
    mortgagePayments.push(mortgagePayment);
    cashFlows.push(annualRent - propertyTax - mortgagePayment);
  }

  const monthsHeld = hp * 12;
  const remainingBalance = monthsHeld > mp * 12 ? 0 : calculateRemainingBalance(principal, shared.mortgageRate, mp, monthsHeld);
  const propertySale = priceM * Math.pow(1 + shared.apprecRate / 100, hp);
  const sellingCosts = propertySale * 0.07;
  const terminalValue = propertySale - remainingBalance - sellingCosts;
  const initialInvestment = downPaymentM;
  const npv = calculateNPV(cashFlows, shared.discountRate, initialInvestment, terminalValue, hp);
  const irr = calculateIRR(cashFlows, initialInvestment, terminalValue, hp);

  const totalPL = cashFlows.reduce((s, c) => s + c, 0) + terminalValue - initialInvestment;

  return { dpPct, hp, mp, npv, irr, pl: totalPL, cashFlows, annualRents, propertyTaxes, mortgagePayments };
}

export function extractParetoFrontier(results: ParetoRow[]): ParetoRow[] {
  const pareto: ParetoRow[] = [];
  for (const a of results) {
    let dominated = false;
    for (const b of results) {
      if (a === b) continue;
      if (b.npv >= a.npv && b.irr >= a.irr && b.pl >= a.pl) {
        if (b.npv > a.npv || b.irr > a.irr || b.pl > a.pl) {
          dominated = true;
          break;
        }
      }
    }
    if (!dominated) {
      pareto.push(a);
    }
  }
  return pareto;
}
