import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminApi } from '../../admin-api';

@Component({
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-authentication',
  styleUrl: './authentication.css',
  templateUrl: './authentication.html',
})
export class Authentication {
  private readonly admin = inject(AdminApi);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  email = '';
  password = '';
  readonly currentYear = new Date().getFullYear();
  passwordVisible = signal(false);
  busy = signal(false);
  error = signal('');

  async signIn(): Promise<void> {
    this.error.set('');
    this.busy.set(true);
    try {
      await this.admin.login(this.email.trim(), this.password);
      const requested = this.route.snapshot.queryParamMap.get('returnUrl');
      const destination = requested?.startsWith('/admin') ? requested : '/admin';
      await this.router.navigateByUrl(destination);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Unable to sign in. Please try again.');
    } finally {
      this.busy.set(false);
    }
  }
}
