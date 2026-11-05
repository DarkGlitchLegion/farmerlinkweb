import { Routes } from '@angular/router';
import { AdminPage } from './app';
import { adminGuard, loginGuard } from './admin-api';
import { Authentication } from './features/authentication/authentication';

export const routes: Routes = [
  { path: 'login', component: Authentication, canActivate: [loginGuard] },
  {
    path: 'admin', canActivate: [adminGuard], children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: AdminPage },
      { path: 'agriculture', pathMatch: 'full', redirectTo: 'advisories' },
      { path: 'reports', pathMatch: 'full', redirectTo: 'crop-reports' },
      { path: ':section', component: AdminPage },
      { path: ':section/new', component: AdminPage },
      { path: ':section/:id', component: AdminPage },
      { path: ':section/:id/edit', component: AdminPage },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'admin' },
  { path: '**', redirectTo: 'admin' },
];
