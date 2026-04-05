import type { CalcValues } from "../../../src/calculator";
import { PRESETS } from "../../../src/threshold-config";
import type { ThresholdConfig, Thresholds } from "../../../src/types";

export const CALC_VALUES_DEFAULTS: CalcValues = {
  price: 3.5,
  size: 200,
  rentSqft: 40,
  managementFee: 5,
  mortgageRate: 3.5,
  mortgagePeriod: 30,
  downPayment: 0.7,
  holdingPeriod: 10,
  monthsRenters: 11,
  apprecRate: 3,
  rentApprecRate: 2,
  discountRate: 7,
  propertyTaxRate: 15,
  capex: 300,
};

export type PresetName = 'conservative' | 'moderate' | 'aggressive';

export const THRESHOLD_PRESETS: Record<PresetName, Thresholds> = {
  conservative: PRESETS.conservative,
  moderate: PRESETS.moderate,
  aggressive: PRESETS.aggressive,
};

export interface ThresholdOptions {
  preset: PresetName;
  custom?: Partial<Thresholds>;
}

export function getThresholdsFromFlags(preset: PresetName, flags: Record<string, string | undefined>): ThresholdConfig {
  const base = THRESHOLD_PRESETS[preset];
  const custom: Partial<Thresholds> = {};

  // Map CLI flag names to threshold keys
  const flagMap: Record<string, keyof Thresholds> = {
    't-gross-yield-pass': 'grossYield',
    't-gross-yield-marginal': 'grossYield',
    't-net-yield-pass': 'netYield',
    't-net-yield-marginal': 'netYield',
    't-cap-rate-pass': 'capRate',
    't-cap-rate-marginal': 'capRate',
    't-cash-on-cash-pass': 'cashOnCash',
    't-cash-on-cash-marginal': 'cashOnCash',
    't-irr-pass': 'irr',
    't-irr-marginal': 'irr',
  };

  // Apply overrides
  for (const [flag, key] of Object.entries(flagMap)) {
    const value = flags[flag];
    if (value !== undefined) {
      const numValue = parseFloat(value);
      if (!Number.isNaN(numValue)) {
        if (!custom[key]) {
          custom[key] = { ...base[key] };
        }
        if (flag.endsWith('-pass')) {
          custom[key]!.pass = numValue;
        } else {
          custom[key]!.marginal = numValue;
        }
      }
    }
  }

  const hasOverrides = Object.keys(custom).length > 0;
  return hasOverrides
    ? { preset: 'custom', custom }
    : { preset };
}