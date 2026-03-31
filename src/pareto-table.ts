import { formatCurrency, formatPercent } from './formatting';
import { evaluateCombination, extractParetoFrontier, DP_VALUES, HP_VALUES, MP_VALUES, ParetoRow } from './pareto-solver';
import { getSharedValues, SHARED_KEYS, getSharedInputs, syncSharedInput, SharedKey } from './shared-state';

let currentSort = { column: 'npv', ascending: false };
let expandedRows = new Set<number>();
let cachedPareto: ParetoRow[] = [];

export function runParetoSolver(): void {
  const shared = getSharedValues();
  if (isNaN(shared.price) || isNaN(shared.size) || isNaN(shared.rentSqft) || shared.price <= 0 || shared.size <= 0 || shared.rentSqft <= 0) {
    document.getElementById('optimize-table-container')!.innerHTML =
      '<div class="optimize-status">Enter valid property inputs to see Pareto-optimal solutions</div>';
    return;
  }

  document.getElementById('optimize-table-container')!.innerHTML =
    '<div class="optimize-status">Calculating optimal solutions...</div>';

  setTimeout(() => {
    const t0 = performance.now();

    const allResults: ParetoRow[] = [];
    for (const dp of DP_VALUES) {
      for (const hp of HP_VALUES) {
        for (const mp of MP_VALUES) {
          allResults.push(evaluateCombination(dp, hp, mp, shared));
        }
      }
    }

    const pareto = extractParetoFrontier(allResults);
    pareto.sort((a, b) => b.npv - a.npv);

    cachedPareto = pareto;

    const elapsed = performance.now() - t0;
    console.log(`Pareto solved: ${allResults.length} combos, ${pareto.length} frontier points, ${elapsed.toFixed(0)}ms`);

    renderParetoTable(pareto);
  }, 10);
}

export function renderParetoTable(pareto: ParetoRow[]): void {
  const container = document.getElementById('optimize-table-container')!;

  if (pareto.length === 0) {
    container.innerHTML = '<div class="optimize-status">No Pareto-optimal solutions found</div>';
    return;
  }

  const sorted = [...pareto].sort((a, b) => {
    const col = currentSort.column as keyof ParetoRow;
    const mult = currentSort.ascending ? 1 : -1;
    return mult * ((a[col] as number) - (b[col] as number));
  });

  let html = `
    <div class="optimize-table-wrapper">
      <table class="optimize-table" id="pareto-table">
        <thead>
          <tr>
            <th data-col="dpPct" class="${currentSort.column === 'dpPct' ? (currentSort.ascending ? 'sort-asc' : 'sort-desc') : ''}">Down%</th>
            <th data-col="hp" title="Holding Period (years)" class="${currentSort.column === 'hp' ? (currentSort.ascending ? 'sort-asc' : 'sort-desc') : ''}">Holding Period</th>
            <th data-col="mp" title="Mortgage Period (years)" class="${currentSort.column === 'mp' ? (currentSort.ascending ? 'sort-asc' : 'sort-desc') : ''}">Mortgage Period</th>
            <th data-col="npv" class="${currentSort.column === 'npv' ? (currentSort.ascending ? 'sort-asc' : 'sort-desc') : ''}">NPV</th>
            <th data-col="irr" class="${currentSort.column === 'irr' ? (currentSort.ascending ? 'sort-asc' : 'sort-desc') : ''}">IRR</th>
            <th data-col="pl" class="${currentSort.column === 'pl' ? (currentSort.ascending ? 'sort-asc' : 'sort-desc') : ''}">P/L</th>
          </tr>
        </thead>
        <tbody>
  `;

  sorted.forEach((sol, idx) => {
    const npvClass = sol.npv < 0 ? 'negative' : '';
    const irrClass = isNaN(sol.irr) ? 'undefined' : (sol.irr < 0 ? 'negative' : '');
    const plClass = sol.pl < 0 ? 'negative' : (sol.pl > 0 ? 'positive' : '');
    const isExpanded = expandedRows.has(idx);

    html += `
      <tr data-idx="${idx}" class="${isExpanded ? 'expanded' : ''}">
        <td>${sol.dpPct}%</td>
        <td>${sol.hp}</td>
        <td>${sol.mp}</td>
        <td class="${npvClass}">${formatCurrency(sol.npv)}</td>
        <td class="${irrClass}">${isNaN(sol.irr) ? '—' : formatPercent(sol.irr)}</td>
        <td class="${plClass}">${formatCurrency(sol.pl)}</td>
      </tr>
      <tr class="expanded-cf ${isExpanded ? 'visible' : ''}" data-expanded-idx="${idx}">
        <td colspan="6">
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Annual Rent</th>
                <th>Property Tax</th>
                <th>Mortgage</th>
                <th>Net CF</th>
              </tr>
            </thead>
            <tbody>
    `;

    for (let year = 1; year <= sol.hp; year++) {
      const annualRent = sol.annualRents[year - 1];
      const propertyTax = sol.propertyTaxes[year - 1];
      const mortgagePayment = sol.mortgagePayments[year - 1];
      const cf = sol.cashFlows[year - 1];
      const cfClass = cf >= 0 ? 'positive' : 'negative';

      html += `
              <tr>
                <td>${year}</td>
                <td>${formatCurrency(annualRent)}</td>
                <td>${formatCurrency(propertyTax)}</td>
                <td>${formatCurrency(mortgagePayment)}</td>
                <td class="${cfClass}">${cf >= 0 ? '+' : ''}${formatCurrency(cf)}</td>
              </tr>
      `;
    }

    html += `
            </tbody>
          </table>
        </td>
      </tr>
    `;
  });

  html += '</tbody></table></div>';
  container.innerHTML = html;

  container.querySelectorAll<HTMLElement>('.optimize-table th[data-col]').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.col!;
      if (currentSort.column === col) {
        currentSort.ascending = !currentSort.ascending;
      } else {
        currentSort.column = col;
        currentSort.ascending = false;
      }
      expandedRows.clear();
      renderParetoTable(cachedPareto);
    });
  });

  container.querySelectorAll<HTMLElement>('.optimize-table tbody tr[data-idx]').forEach(row => {
    row.addEventListener('click', () => {
      const idx = parseInt(row.dataset.idx!);
      if (expandedRows.has(idx)) {
        expandedRows.delete(idx);
      } else {
        expandedRows.add(idx);
      }
      renderParetoTable(cachedPareto);
    });
  });
}

export function initParetoTableListeners(): void {
  const sharedInputs = getSharedInputs();
  SHARED_KEYS.forEach(key => {
    const optEl = sharedInputs[key].opt;
    if (optEl) {
      optEl.addEventListener('input', () => {
        syncSharedInput(key as SharedKey, 'opt');
        if (document.getElementById('optimize-panel')!.classList.contains('active')) {
          runParetoSolver();
        }
      });
    }
  });
}
