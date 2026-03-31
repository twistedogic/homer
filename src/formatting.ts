export const CURRENCY_PREFIX = 'HKD ';

export function formatCurrency(num: number): string {
  const absNum = Math.abs(num);
  const formatted = absNum.toLocaleString('en-HK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return (num < 0 ? '-' : '') + CURRENCY_PREFIX + formatted;
}

export function formatPercent(decimal: number): string {
  return (decimal * 100).toFixed(1) + '%';
}

export function parseNumber(val: any): number {
  if (typeof val === 'number') return val;
  if (!val) return NaN;
  const cleaned = val.toString().replace(/HKD\s*/gi, '').replace(/,/g, '').trim();
  return parseFloat(cleaned);
}
