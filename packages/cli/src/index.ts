import { Command } from "commander";
import { calculate } from "../../../src/calculator";
import type { CalcValues } from "../../../src/calculator";
import { CALC_VALUES_DEFAULTS } from "./defaults";
import { formatMarkdown, formatJSON } from "./format";

const program = new Command();

program
  .name("homer-cli")
  .description("CLI for IRR, NPV, and Total P/L calculations")
  .option("--price <number>", "Property price (M HKD)", String(CALC_VALUES_DEFAULTS.price))
  .option("--size <number>", "Size (sq ft)", String(CALC_VALUES_DEFAULTS.size))
  .option("--rent-sqft <number>", "Monthly rent per sq ft (HKD)", String(CALC_VALUES_DEFAULTS.rentSqft))
  .option("--management-fee <number>", "Management fee (HKD/sqft/mo)", String(CALC_VALUES_DEFAULTS.managementFee))
  .option("--mortgage-rate <number>", "Annual mortgage rate (%)", String(CALC_VALUES_DEFAULTS.mortgageRate))
  .option("--mortgage-period <number>", "Loan term (years)", String(CALC_VALUES_DEFAULTS.mortgagePeriod))
  .option("--down-payment <number>", "Down payment (M HKD)", String(CALC_VALUES_DEFAULTS.downPayment))
  .option("--holding-period <number>", "Investment horizon (years)", String(CALC_VALUES_DEFAULTS.holdingPeriod))
  .option("--months-renters <number>", "Months with tenants (0-12)", String(CALC_VALUES_DEFAULTS.monthsRenters))
  .option("--apprec-rate <number>", "Property appreciation rate (%)", String(CALC_VALUES_DEFAULTS.apprecRate))
  .option("--rent-apprec-rate <number>", "Rent appreciation rate (%)", String(CALC_VALUES_DEFAULTS.rentApprecRate))
  .option("--discount-rate <number>", "NPV discount rate (%)", String(CALC_VALUES_DEFAULTS.discountRate))
  .option("--property-tax-rate <number>", "Property tax rate (%)", String(CALC_VALUES_DEFAULTS.propertyTaxRate))
  .option("--capex <number>", "CAPEX (HKD/sqft/10yr)", String(CALC_VALUES_DEFAULTS.capex))
  .option("--json", "Output as JSON", false);

program.parse();

const opts = program.opts();

const vals: CalcValues = {
  price: Number(opts.price),
  size: Number(opts.size),
  rentSqft: Number(opts.rentSqft),
  managementFee: Number(opts.managementFee),
  mortgageRate: Number(opts.mortgageRate),
  mortgagePeriod: Number(opts.mortgagePeriod),
  downPayment: Number(opts.downPayment),
  holdingPeriod: Number(opts.holdingPeriod),
  monthsRenters: Number(opts.monthsRenters),
  apprecRate: Number(opts.apprecRate),
  rentApprecRate: Number(opts.rentApprecRate),
  discountRate: Number(opts.discountRate),
  propertyTaxRate: Number(opts.propertyTaxRate),
  capex: Number(opts.capex),
};

const invalid = Object.entries(vals).filter(([, v]) => Number.isNaN(v));
if (invalid.length > 0) {
  console.error(`Invalid values: ${invalid.map(([k]) => k).join(", ")}`);
  process.exit(1);
}

try {
  const result = calculate(vals);

  if (opts.json) {
    console.log(formatJSON(result));
  } else {
    console.log(formatMarkdown(result));
  }
} catch (err) {
  console.error("Calculation error:", err);
  process.exit(1);
}
