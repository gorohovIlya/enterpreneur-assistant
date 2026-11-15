import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: 'Помощник предпринимателя — выбор ОПФ',
  },
  {
    path: 'recommend',
    loadComponent: () => import('./pages/recommend/recommend').then((m) => m.Recommend),
    title: 'Подбор ОПФ — Помощник предпринимателя',
  },
  {
    path: 'ai',
    loadComponent: () => import('./pages/ai/ai').then((m) => m.Ai),
    title: 'Ответ модели — Помощник предпринимателя',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
