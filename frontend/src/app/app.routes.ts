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
    title: 'Объяснение от ИИ — Помощник предпринимателя',
  },
  {
    path: 'how-it-works',
    loadComponent: () => import('./pages/how-it-works/how-it-works').then((m) => m.HowItWorks),
    title: 'Как это работает — Помощник предпринимателя',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
