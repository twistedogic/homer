import type { Thresholds, MetricThreshold, PresetName, ThresholdConfig, ValidationResult, StoredConfig } from './types';

const STORAGE_KEY = 'homer-thresholds-v1';

export const PRESETS: Record<PresetName, Thresholds> = {
  conservative: {
    grossYield:  { pass: 4.0, marginal: 3.0 },
    netYield:    { pass: 2.5, marginal: 2.0 },
    capRate:     { pass: 4.5, marginal: 3.5 },
    cashOnCash:  { pass: 10.0, marginal: 6.0 },
    irr:         { pass: 10.0, marginal: 7.0 },
  },
  moderate: {
    grossYield:  { pass: 3.5, marginal: 2.5 },
    netYield:    { pass: 2.0, marginal: 1.5 },
    capRate:     { pass: 4.0, marginal: 3.0 },
    cashOnCash:  { pass: 8.0, marginal: 4.0 },
    irr:         { pass: 8.0, marginal: 5.0 },
  },
  aggressive: {
    grossYield:  { pass: 3.0, marginal: 2.0 },
    netYield:    { pass: 1.5, marginal: 1.0 },
    capRate:     { pass: 3.0, marginal: 2.0 },
    cashOnCash:  { pass: 6.0, marginal: 3.0 },
    irr:         { pass: 6.0, marginal: 4.0 },
  },
};

export const DEFAULT_THRESHOLDS = PRESETS.conservative;

export function getThresholds(config: ThresholdConfig): Thresholds {
  if (config.preset === 'custom' && config.custom) {
    return { ...PRESETS.conservative, ...config.custom } as Thresholds;
  }
  if (config.preset === 'custom') {
    return PRESETS.conservative;
  }
  return PRESETS[config.preset as PresetName];
}

export function validateThresholds(t: Partial<Thresholds>): ValidationResult {
  const errors: string[] = [];

  const metricKeys: (keyof Thresholds)[] = ['grossYield', 'netYield', 'capRate', 'cashOnCash', 'irr'];

  for (const key of metricKeys) {
    const metric = t[key];
    if (metric) {
      // Check pass >= marginal
      if (metric.pass < metric.marginal) {
        errors.push(`${formatMetricName(key)}: Pass must be ≥ Marginal`);
      }
      // Check all values > 0
      if (metric.pass <= 0) {
        errors.push(`${formatMetricName(key)} Pass: must be > 0`);
      }
      if (metric.marginal <= 0) {
        errors.push(`${formatMetricName(key)} Marginal: must be > 0`);
      }
    }
  }

  return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
}

function formatMetricName(key: keyof Thresholds): string {
  const names: Record<keyof Thresholds, string> = {
    grossYield: 'Gross Yield',
    netYield: 'Net Yield',
    capRate: 'Cap Rate',
    cashOnCash: 'Cash-on-Cash',
    irr: 'IRR',
  };
  return names[key];
}

function validateConfig(parsed: unknown): parsed is StoredConfig {
  if (typeof parsed !== 'object' || parsed === null) return false;
  const obj = parsed as Record<string, unknown>;
  if (obj.version !== 1) return false;
  if (typeof obj.preset !== 'string') return false;
  const validPresets = ['conservative', 'moderate', 'aggressive', 'custom'];
  if (!validPresets.includes(obj.preset)) return false;
  // custom is valid even without custom field
  if (obj.preset === 'custom' && obj.custom === undefined) return true;
  // if custom exists, validate its structure
  if (obj.custom && typeof obj.custom !== 'object') return false;
  return true;
}

export function loadConfig(): ThresholdConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (validateConfig(parsed)) {
        return { preset: parsed.preset, custom: parsed.custom as Thresholds | undefined };
      }
    }
  } catch { /* fall through */ }
  return { preset: 'conservative' };
}

export function saveConfig(config: ThresholdConfig): void {
  const stored: StoredConfig = {
    version: 1,
    preset: config.preset,
    custom: config.custom as StoredConfig['custom'],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

export function resetConfig(): ThresholdConfig {
  return { preset: 'conservative' };
}

export function mergeCustomThresholds(base: Thresholds, custom: Partial<Thresholds>): Thresholds {
  const result: Thresholds = { ...base };
  for (const key of Object.keys(custom) as (keyof Thresholds)[]) {
    if (custom[key]) {
      result[key] = { ...result[key], ...custom[key] };
    }
  }
  return result;
}