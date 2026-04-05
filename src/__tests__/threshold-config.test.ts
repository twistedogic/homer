import { describe, it, expect, beforeEach } from 'vitest';
import {
  PRESETS,
  DEFAULT_THRESHOLDS,
  getThresholds,
  validateThresholds,
  loadConfig,
  saveConfig,
  resetConfig,
  mergeCustomThresholds,
} from '../threshold-config';
import type { ThresholdConfig, Thresholds, StoredConfig } from '../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('PRESETS', () => {
  it('conservative has all required metrics', () => {
    expect(PRESETS.conservative).toHaveProperty('grossYield');
    expect(PRESETS.conservative).toHaveProperty('netYield');
    expect(PRESETS.conservative).toHaveProperty('capRate');
    expect(PRESETS.conservative).toHaveProperty('cashOnCash');
    expect(PRESETS.conservative).toHaveProperty('irr');
  });

  it('conservative thresholds are higher than moderate', () => {
    expect(PRESETS.conservative.grossYield.pass).toBeGreaterThan(PRESETS.moderate.grossYield.pass);
    expect(PRESETS.conservative.netYield.pass).toBeGreaterThan(PRESETS.moderate.netYield.pass);
    expect(PRESETS.conservative.capRate.pass).toBeGreaterThan(PRESETS.moderate.capRate.pass);
    expect(PRESETS.conservative.cashOnCash.pass).toBeGreaterThan(PRESETS.moderate.cashOnCash.pass);
    expect(PRESETS.conservative.irr.pass).toBeGreaterThan(PRESETS.moderate.irr.pass);
  });

  it('moderate thresholds are higher than aggressive', () => {
    expect(PRESETS.moderate.grossYield.pass).toBeGreaterThan(PRESETS.aggressive.grossYield.pass);
    expect(PRESETS.moderate.netYield.pass).toBeGreaterThan(PRESETS.aggressive.netYield.pass);
    expect(PRESETS.moderate.capRate.pass).toBeGreaterThan(PRESETS.aggressive.capRate.pass);
    expect(PRESETS.moderate.cashOnCash.pass).toBeGreaterThan(PRESETS.aggressive.cashOnCash.pass);
    expect(PRESETS.moderate.irr.pass).toBeGreaterThan(PRESETS.aggressive.irr.pass);
  });

  it('pass is always >= marginal in all presets', () => {
    for (const preset of Object.values(PRESETS)) {
      expect(preset.grossYield.pass).toBeGreaterThanOrEqual(preset.grossYield.marginal);
      expect(preset.netYield.pass).toBeGreaterThanOrEqual(preset.netYield.marginal);
      expect(preset.capRate.pass).toBeGreaterThanOrEqual(preset.capRate.marginal);
      expect(preset.cashOnCash.pass).toBeGreaterThanOrEqual(preset.cashOnCash.marginal);
      expect(preset.irr.pass).toBeGreaterThanOrEqual(preset.irr.marginal);
    }
  });
});

describe('DEFAULT_THRESHOLDS', () => {
  it('equals conservative preset', () => {
    expect(DEFAULT_THRESHOLDS).toEqual(PRESETS.conservative);
  });
});

describe('getThresholds', () => {
  it('returns conservative for conservative preset', () => {
    const config: ThresholdConfig = { preset: 'conservative' };
    expect(getThresholds(config)).toEqual(PRESETS.conservative);
  });

  it('returns moderate for moderate preset', () => {
    const config: ThresholdConfig = { preset: 'moderate' };
    expect(getThresholds(config)).toEqual(PRESETS.moderate);
  });

  it('returns aggressive for aggressive preset', () => {
    const config: ThresholdConfig = { preset: 'aggressive' };
    expect(getThresholds(config)).toEqual(PRESETS.aggressive);
  });

  it('returns conservative base for custom preset without custom values', () => {
    const config: ThresholdConfig = { preset: 'custom' };
    expect(getThresholds(config)).toEqual(PRESETS.conservative);
  });

  it('merges custom values on top of conservative for custom preset', () => {
    const config: ThresholdConfig = {
      preset: 'custom',
      custom: {
        grossYield: { pass: 5.0, marginal: 4.0 },
      },
    };
    const result = getThresholds(config);
    expect(result.grossYield).toEqual({ pass: 5.0, marginal: 4.0 });
    expect(result.netYield).toEqual(PRESETS.conservative.netYield);
    expect(result.capRate).toEqual(PRESETS.conservative.capRate);
    expect(result.cashOnCash).toEqual(PRESETS.conservative.cashOnCash);
    expect(result.irr).toEqual(PRESETS.conservative.irr);
  });
});

describe('validateThresholds', () => {
  it('returns valid for correct thresholds', () => {
    const t: Partial<Thresholds> = {
      grossYield: { pass: 4.0, marginal: 3.0 },
    };
    const result = validateThresholds(t);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('returns invalid when pass < marginal', () => {
    const t: Partial<Thresholds> = {
      grossYield: { pass: 2.0, marginal: 3.0 },
    };
    const result = validateThresholds(t);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Gross Yield: Pass must be ≥ Marginal');
  });

  it('returns invalid when pass = 0', () => {
    const t: Partial<Thresholds> = {
      grossYield: { pass: 0, marginal: 3.0 },
    };
    const result = validateThresholds(t);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Gross Yield Pass: must be > 0');
  });

  it('returns invalid when pass < 0', () => {
    const t: Partial<Thresholds> = {
      grossYield: { pass: -1, marginal: 3.0 },
    };
    const result = validateThresholds(t);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Gross Yield Pass: must be > 0');
  });

  it('returns invalid when marginal = 0', () => {
    const t: Partial<Thresholds> = {
      grossYield: { pass: 4.0, marginal: 0 },
    };
    const result = validateThresholds(t);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Gross Yield Marginal: must be > 0');
  });

  it('returns invalid when pass < marginal for any metric', () => {
    const t: Partial<Thresholds> = {
      grossYield: { pass: 4.0, marginal: 3.0 },
      netYield: { pass: 1.5, marginal: 2.0 }, // invalid
    };
    const result = validateThresholds(t);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Net Yield: Pass must be ≥ Marginal');
  });

  it('returns valid when threshold is not provided', () => {
    const t: Partial<Thresholds> = {};
    const result = validateThresholds(t);
    expect(result.valid).toBe(true);
  });

  it('allows pass = marginal (edge case)', () => {
    const t: Partial<Thresholds> = {
      grossYield: { pass: 3.0, marginal: 3.0 },
    };
    const result = validateThresholds(t);
    expect(result.valid).toBe(true);
  });
});

describe('loadConfig', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns conservative when localStorage is empty', () => {
    const config = loadConfig();
    expect(config).toEqual({ preset: 'conservative' });
  });

  it('loads valid saved config', () => {
    const saved: StoredConfig = { version: 1, preset: 'moderate' };
    localStorage.setItem('homer-thresholds-v1', JSON.stringify(saved));
    const config = loadConfig();
    expect(config).toEqual({ preset: 'moderate' });
  });

  it('loads saved config with custom values', () => {
    const saved = {
      version: 1,
      preset: 'custom' as const,
      custom: { grossYield: { pass: 5.0, marginal: 4.0 } },
    };
    localStorage.setItem('homer-thresholds-v1', JSON.stringify(saved));
    const config = loadConfig();
    expect(config.preset).toBe('custom');
    expect(config.custom).toBeDefined();
    if (config.custom) {
      expect(config.custom.grossYield).toEqual({ pass: 5.0, marginal: 4.0 });
    }
  });

  it('returns conservative for corrupted localStorage', () => {
    localStorage.setItem('homer-thresholds-v1', 'not valid json');
    const config = loadConfig();
    expect(config).toEqual({ preset: 'conservative' });
  });

  it('returns conservative for wrong version', () => {
    localStorage.setItem('homer-thresholds-v1', JSON.stringify({ version: 2, preset: 'moderate' }));
    const config = loadConfig();
    expect(config).toEqual({ preset: 'conservative' });
  });

  it('returns conservative for invalid preset', () => {
    localStorage.setItem('homer-thresholds-v1', JSON.stringify({ version: 1, preset: 'invalid' }));
    const config = loadConfig();
    expect(config).toEqual({ preset: 'conservative' });
  });
});

describe('saveConfig', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves config to localStorage', () => {
    const config: ThresholdConfig = { preset: 'moderate' };
    saveConfig(config);
    const stored = localStorage.getItem('homer-thresholds-v1');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.version).toBe(1);
    expect(parsed.preset).toBe('moderate');
  });

  it('saves custom values', () => {
    const config: ThresholdConfig = {
      preset: 'custom',
      custom: { grossYield: { pass: 5.0, marginal: 4.0 } },
    };
    saveConfig(config);
    const stored = localStorage.getItem('homer-thresholds-v1');
    const parsed = JSON.parse(stored!);
    expect(parsed.preset).toBe('custom');
    expect(parsed.custom).toEqual({ grossYield: { pass: 5.0, marginal: 4.0 } });
  });
});

describe('resetConfig', () => {
  it('returns conservative preset', () => {
    const config = resetConfig();
    expect(config).toEqual({ preset: 'conservative' });
  });
});

describe('mergeCustomThresholds', () => {
  it('merges custom values onto base', () => {
    const base = PRESETS.conservative;
    const custom: Partial<Thresholds> = {
      grossYield: { pass: 5.0, marginal: 4.0 },
    };
    const result = mergeCustomThresholds(base, custom);
    expect(result.grossYield).toEqual({ pass: 5.0, marginal: 4.0 });
    expect(result.netYield).toEqual(base.netYield);
  });

  it('preserves base values for unchanged metrics', () => {
    const base = PRESETS.conservative;
    const custom: Partial<Thresholds> = {
      irr: { pass: 15.0, marginal: 12.0 },
    };
    const result = mergeCustomThresholds(base, custom);
    expect(result.grossYield).toEqual(base.grossYield);
    expect(result.netYield).toEqual(base.netYield);
    expect(result.capRate).toEqual(base.capRate);
    expect(result.cashOnCash).toEqual(base.cashOnCash);
    expect(result.irr).toEqual({ pass: 15.0, marginal: 12.0 });
  });

  it('handles empty custom', () => {
    const base = PRESETS.conservative;
    const result = mergeCustomThresholds(base, {});
    expect(result).toEqual(base);
  });
});