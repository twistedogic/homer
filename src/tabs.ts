import { runParetoSolver } from './pareto-table';

export function initTabs(): void {
  const tabBtns = document.querySelectorAll<HTMLButtonElement>('.tab-btn');
  const tabPanels = document.querySelectorAll<HTMLElement>('.tab-panel');

  function switchTab(tabName: string): void {
    tabBtns.forEach(btn => {
      const isActive = btn.dataset.tab === tabName;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });
    tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === tabName + '-panel');
    });
    if (tabName === 'optimize') {
      runParetoSolver();
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab!));
  });
}
