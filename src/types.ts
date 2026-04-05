export interface MetricThreshold {
  pass: number;
  marginal: number;
}

export interface Thresholds {
  grossYield: MetricThreshold;
  netYield: MetricThreshold;
  capRate: MetricThreshold;
  cashOnCash: MetricThreshold;
  irr: MetricThreshold;
}

export type PresetName = 'conservative' | 'moderate' | 'aggressive';

export interface ThresholdConfig {
  preset: PresetName | 'custom';
  custom?: Partial<Thresholds>;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export interface StoredConfig {
  version: 1;
  preset: PresetName | 'custom';
  custom?: Thresholds;
}