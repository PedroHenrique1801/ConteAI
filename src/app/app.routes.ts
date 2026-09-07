import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ExpenseRecorder } from './pages/expense-recorder/expense-recorder';
import { ExpenseSuccess } from './pages/expense-success/expense-success';
import { Analysis } from './pages/analysis/analysis';
import { Assistant } from './pages/assistant/assistant';
import { History } from './pages/history/history';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'registrar-despesa',
    component: ExpenseRecorder,
  },
  {
    path: 'despesa-registrada',
    component: ExpenseSuccess,
  },
  {
    path: 'analises',
    component: Analysis,
  },
  {
    path: 'assistente',
    component: Assistant,
  },

    {
    path: 'historico',
    component: History,
  },

  {
    path: '**',
    redirectTo: '',
  },
];