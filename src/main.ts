import './styles/base.css';
import './styles/tabs.css';
import './styles/calculator.css';
import './styles/pareto-table.css';
import './styles/pwa.css';

import { initSharedState } from './shared-state';
import { initTabs } from './tabs';
import { initCalculator } from './calculator-ui';
import { initParetoTableListeners } from './pareto-table';
import { initPWA } from './pwa';

initSharedState();
initTabs();
initCalculator();
initParetoTableListeners();
initPWA();
