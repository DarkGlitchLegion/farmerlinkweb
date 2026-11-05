import { Injectable, inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export interface AdminUser {
  id: number;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string | null;
  status?: string;
}

declare global {
  interface Window { FARMERLINK_CONFIG?: { apiUrl?: string }; }
}

@Injectable({ providedIn: 'root' })
export class AdminApi {
  readonly user = signal<AdminUser | null>(null);
  readonly apiUrl = typeof window !== 'undefined'
    ? (window.FARMERLINK_CONFIG?.apiUrl || '/api/v1').replace(/\/$/, '')
    : '/api/v1';
  private token: string | null = null;
  private restored?: Promise<boolean>;

  async restore(): Promise<boolean> {
    if (this.user()) return true;
    if (this.restored) return this.restored;
    this.restored = (async () => {
      if (typeof sessionStorage === 'undefined') return false;
      this.token = sessionStorage.getItem('farmerlink_admin_token');
      if (!this.token) return false;
      try {
        const user = await this.request<AdminUser>('/users/me');
        if (user.role !== 'admin') { this.logout(); return false; }
        this.user.set(user);
        return true;
      } catch { this.logout(); return false; }
    })();
    const result = await this.restored;
    this.restored = undefined;
    return result;
  }

  async login(email: string, password: string): Promise<void> {
    const result = await this.request<{access_token: string; user: AdminUser}>('/auth/login', {
      method: 'POST', body: { email, password }, anonymous: true,
    });
    if (!result.access_token || result.user?.role !== 'admin') {
      throw new Error('This account does not have administrator access.');
    }
    this.token = result.access_token;
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('farmerlink_admin_token', this.token);
    this.user.set(result.user);
  }

  logout(): void {
    this.token = null;
    this.user.set(null);
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('farmerlink_admin_token');
  }

  async request<T = any>(path: string, options: { method?: string; body?: unknown; anonymous?: boolean } = {}): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (options.body !== undefined) headers['Content-Type'] = 'application/json';
    if (!options.anonymous && this.token) headers['Authorization'] = `Bearer ${this.token}`;
    let response: Response;
    try {
      response = await fetch(`${this.apiUrl}${path}`, {
        method: options.method ?? 'GET', headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
      });
    } catch {
      throw new Error(`Could not connect to FarmerLink API at ${this.apiUrl}. Check the API URL and server connection.`);
    }
    if (response.status === 401) { this.logout(); throw new Error('Your session has expired. Please sign in again.'); }
    if (!response.ok) {
      let message = `Request failed (${response.status}).`;
      try { const data = await response.json(); message = typeof data.detail === 'string' ? data.detail : data.message ?? message; } catch { /* response has no JSON body */ }
      throw new Error(message);
    }
    if (response.status === 204) return undefined as T;
    return await response.json() as T;
  }
}

export const adminGuard: CanActivateFn = async (_route, state) => {
  const api = inject(AdminApi);
  const router = inject(Router);
  return await api.restore() ? true : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export const loginGuard: CanActivateFn = async () => {
  const api = inject(AdminApi);
  const router = inject(Router);
  return await api.restore() ? router.createUrlTree(['/admin']) : true;
};
