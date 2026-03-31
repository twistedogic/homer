export const SHARED_KEYS = [
  'price', 'size', 'rentSqft', 'managementFee', 'mortgageRate',
  'apprecRate', 'rentApprecRate', 'discountRate', 'propertyTaxRate', 'monthsRenters',
] as const;

export type SharedKey = typeof SHARED_KEYS[number];

type SharedState = Record<SharedKey, number>;
type SharedInputMap = Record<SharedKey, { calc: HTMLInputElement | null; opt: HTMLInputElement | null }>;

const sharedState: SharedState = {} as SharedState;
const sharedInputs: SharedInputMap = {} as SharedInputMap;

function getCalcInput(id: string): HTMLInputElement | null {
  return document.getElementById(id) as HTMLInputElement | null;
}

function getOptInput(id: string): HTMLInputElement | null {
  return document.getElementById('opt-' + id) as HTMLInputElement | null;
}

export function initSharedState(): void {
  SHARED_KEYS.forEach(key => {
    const calcEl = getCalcInput(key);
    const optEl = getOptInput(key);
    sharedState[key] = parseFloat((calcEl || optEl)!.value);
    sharedInputs[key] = { calc: calcEl, opt: optEl };
  });
}

export function syncSharedInput(key: SharedKey, sourcePanel: 'calc' | 'opt'): void {
  const val = parseFloat(sharedInputs[key][sourcePanel]!.value);
  sharedState[key] = val;
  const other = sourcePanel === 'calc' ? 'opt' : 'calc';
  if (sharedInputs[key][other]) {
    sharedInputs[key][other]!.value = sharedInputs[key][sourcePanel]!.value;
  }
}

export function getSharedValues(): SharedState {
  return { ...sharedState };
}

export function getSharedInputs(): SharedInputMap {
  return sharedInputs;
}
