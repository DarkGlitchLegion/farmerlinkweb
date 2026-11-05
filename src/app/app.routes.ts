import { Routes } from '@angular/router';
import { AdminPage } from './app';
import { adminGuard, loginGuard } from './admin-api';
import { Authentication } from './pages/authentication/authentication';

export const routes: Routes = [
  { path: 'login', component: Authentication, canActivate: [loginGuard] },
  {
    path: 'admin', canActivate: [adminGuard], children: [
      { path: '', component: AdminPage },
      { path: ':section', component: AdminPage },
      { path: ':section/new', component: AdminPage },
      { path: ':section/:id', component: AdminPage },
      { path: ':section/:id/edit', component: AdminPage },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'admin' },
  { path: '**', redirectTo: 'admin' },
];
