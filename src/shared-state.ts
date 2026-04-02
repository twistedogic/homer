export const SHARED_KEYS = [
  'price', 'size', 'rentSqft', 'managementFee', 'mortgageRate',
  'apprecRate', 'rentApprecRate', 'discountRate', 'propertyTaxRate', 'monthsRenters', 'capex',
] as const;

export type SharedKey = typeof SHARED_KEYS[number];

export type SharedPanel = 'calc' | 'opt' | 'scr';

type SharedState = Record<SharedKey, number>;
type SharedInputMap = Record<SharedKey, Record<SharedPanel, HTMLInputElement | null>>;

const sharedState: SharedState = {} as SharedState;
const sharedInputs: SharedInputMap = {} as SharedInputMap;

function getPanelInput(id: string, prefix: string): HTMLInputElement | null {
  const elId = prefix ? prefix + '-' + id : id;
  return document.getElementById(elId) as HTMLInputElement | null;
}

export function initSharedState(): void {
  SHARED_KEYS.forEach(key => {
    const calcEl = getPanelInput(key, '');
    const optEl = getPanelInput(key, 'opt');
    const scrEl = getPanelInput(key, 'scr');
    const first = calcEl || optEl || scrEl;
    sharedState[key] = parseFloat(first!.value);
    sharedInputs[key] = { calc: calcEl, opt: optEl, scr: scrEl };
  });
}

export function syncSharedInput(key: SharedKey, sourcePanel: SharedPanel): void {
  const val = parseFloat(sharedInputs[key][sourcePanel]!.value);
  sharedState[key] = val;
  const panels: SharedPanel[] = ['calc', 'opt', 'scr'];
  for (const panel of panels) {
    if (panel !== sourcePanel && sharedInputs[key][panel]) {
      sharedInputs[key][panel]!.value = String(val);
    }
  }
}

export function getSharedValues(): SharedState {
  return { ...sharedState };
}

export function getSharedInputs(): SharedInputMap {
  return sharedInputs;
}
