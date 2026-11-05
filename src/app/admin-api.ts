import { Injectable, inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from './services/api_service';
import { AuthService, AuthUser } from './services/auth_serrvice';

export interface AdminUser extends AuthUser {}

@Injectable({ providedIn: 'root' })
export class AdminApi {
  private readonly http=inject(ApiService);
  private readonly auth=inject(AuthService);
  readonly user = signal<AdminUser | null>(null);
  private token: string | null = null;
  private restored?: Promise<boolean>;

  constructor(){this.http.onUnauthorized(()=>this.logout());}

  async restore(): Promise<boolean> {
    if (this.user()) return true;
    if (this.restored) return this.restored;
    this.restored = (async () => {
      if (typeof sessionStorage === 'undefined') return false;
      this.token = sessionStorage.getItem('farmerlink_admin_token');
      if (!this.token) return false;
      this.http.setToken(this.token);
      try {
        const user = await this.auth.currentUser();
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
    const result = await this.auth.login(email,password);
    if (!result.access_token || result.user?.role !== 'admin') {
      throw new Error('This account does not have administrator access.');
    }
    this.token = result.access_token;
    this.http.setToken(this.token);
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('farmerlink_admin_token', this.token);
    this.user.set(result.user);
  }

  logout(): void {
    this.token = null;
    this.auth.logout();
    this.user.set(null);
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('farmerlink_admin_token');
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
