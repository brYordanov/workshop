import { Routes } from '@angular/router';
import { Home } from './features/home/home';

export const routes: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./features/list/list').then((m) => m.List),
  },
  {
    path: 'news/:id',
    loadComponent: () => import('./features/news/news').then((m) => m.News),
  },
  {
    path: '',
    pathMatch: 'full',
    component: Home,
  },
];
