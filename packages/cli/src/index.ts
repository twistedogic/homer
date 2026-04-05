import { Command } from "commander";
import { calculate } from "../../../src/calculator";
import type { CalcValues } from "../../../src/calculator";
import { CALC_VALUES_DEFAULTS, getThresholdsFromFlags, type PresetName } from "./defaults";
import { formatMarkdown, formatJSON } from "./format";

const VALID_PRESETS: PresetName[] = ['conservative', 'moderate', 'aggressive'];

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
  .option("--preset <name>", `Threshold preset: ${VALID_PRESETS.join('|')}`, "conservative")
  .option("--t-gross-yield-pass <number>", "Gross yield pass threshold (%)")
  .option("--t-gross-yield-marginal <number>", "Gross yield marginal threshold (%)")
  .option("--t-net-yield-pass <number>", "Net yield pass threshold (%)")
  .option("--t-net-yield-marginal <number>", "Net yield marginal threshold (%)")
  .option("--t-cap-rate-pass <number>", "Cap rate pass threshold (%)")
  .option("--t-cap-rate-marginal <number>", "Cap rate marginal threshold (%)")
  .option("--t-cash-on-cash-pass <number>", "Cash-on-cash pass threshold (%)")
  .option("--t-cash-on-cash-marginal <number>", "Cash-on-cash marginal threshold (%)")
  .option("--t-irr-pass <number>", "IRR pass threshold (%)")
  .option("--t-irr-marginal <number>", "IRR marginal threshold (%)")
  .option("--json", "Output as JSON", false);

program.parse();

const opts = program.opts();

// Validate preset
const preset = (opts.preset as string) as PresetName;
if (!VALID_PRESETS.includes(preset)) {
  console.error(`Invalid preset: ${opts.preset}. Valid options: ${VALID_PRESETS.join(', ')}`);
  process.exit(1);
}

// Get thresholds from preset and CLI overrides
const thresholdFlags = {
  't-gross-yield-pass': opts.tGrossYieldPass,
  't-gross-yield-marginal': opts.tGrossYieldMarginal,
  't-net-yield-pass': opts.tNetYieldPass,
  't-net-yield-marginal': opts.tNetYieldMarginal,
  't-cap-rate-pass': opts.tCapRatePass,
  't-cap-rate-marginal': opts.tCapRateMarginal,
  't-cash-on-cash-pass': opts.tCashOnCashPass,
  't-cash-on-cash-marginal': opts.tCashOnCashMarginal,
  't-irr-pass': opts.tIrrPass,
  't-irr-marginal': opts.tIrrMarginal,
};
const thresholds = getThresholdsFromFlags(preset, thresholdFlags);

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
  const result = calculate(vals, thresholds);

  if (opts.json) {
    console.log(formatJSON(result));
  } else {
    console.log(formatMarkdown(result));
  }
} catch (err) {
  console.error("Calculation error:", err);
  process.exit(1);
}