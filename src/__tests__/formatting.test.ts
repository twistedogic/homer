import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercent, parseNumber, CURRENCY_PREFIX } from '../formatting';

describe('formatCurrency', () => {
  it('formats positive integers with HKD prefix', () => {
    expect(formatCurrency(1000000)).toBe('HKD 1,000,000');
  });

  it('formats negative numbers with minus sign before prefix', () => {
    expect(formatCurrency(-500000)).toBe('-HKD 500,000');
  });

  it('rounds to 0 decimal places', () => {
    expect(formatCurrency(1234.56)).toBe('HKD 1,235');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('HKD 0');
  });
});

describe('formatPercent', () => {
  it('converts decimal to percent with 1 decimal place', () => {
    expect(formatPercent(0.075)).toBe('7.5%');
  });

  it('handles zero', () => {
    expect(formatPercent(0)).toBe('0.0%');
  });

  it('handles values > 1', () => {
    expect(formatPercent(1.5)).toBe('150.0%');
  });

  it('handles negative values', () => {
    expect(formatPercent(-0.05)).toBe('-5.0%');
  });
});

describe('parseNumber', () => {
  it('returns number as-is', () => {
    expect(parseNumber(42)).toBe(42);
  });

  it('parses plain string number', () => {
    expect(parseNumber('3.5')).toBe(3.5);
  });

  it('strips HKD prefix', () => {
    expect(parseNumber('HKD 1,000,000')).toBe(1000000);
  });

  it('strips commas', () => {
    expect(parseNumber('1,234,567')).toBe(1234567);
  });

  it('returns NaN for empty string', () => {
    expect(parseNumber('')).toBeNaN();
  });

  it('returns NaN for null', () => {
    expect(parseNumber(null)).toBeNaN();
  });
});
