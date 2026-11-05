import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';
import { UserAvatarComponent } from '../../shared/components/user-avatar/user-avatar';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { AppIconComponent } from '../../shared/components/app-icon/app-icon';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    StatCardComponent,
    StatusBadgeComponent,
    UserAvatarComponent,
    EmptyStateComponent,
    AppIconComponent,
  ],
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class DashboardPageComponent {
  @Input() metrics: any[] = [];
  @Input() analytics: any = {};
  @Input() orders: any[] = [];
  @Input() pendingProfiles: any[] = [];
  @Input() reports: any[] = [];
  @Input() recentUsers: any[] = [];
  @Input() firstName = 'Administrator';
  @Output() refresh = new EventEmitter<void>();

  readonly today = new Intl.DateTimeFormat('en-PH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  greeting(): string {
    const h = new Date().getHours();
    return `${h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'}, ${this.firstName}`;
  }

  date(value: any): string {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.valueOf())
      ? '—'
      : new Intl.DateTimeFormat('en-PH', {
          month: 'short',
          day: 'numeric',
        }).format(date);
  }

  label(value: any): string {
    return String(value ?? '—')
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  orderStatuses(): [string, number][] {
    const value = this.analytics?.orders?.by_status;
    return value && typeof value === 'object'
      ? Object.entries(value).map(([key, count]) => [key, Number(count)])
      : [];
  }

  orderStatusWidth(value: number): number {
    const max = Math.max(1, ...this.orderStatuses().map(([, count]) => count));
    return Math.max(8, (value / max) * 100);
  }

  count(value: any): string {
    return Number(value ?? 0).toLocaleString('en-PH');
  }

  money(value: any): string {
    return Number(value ?? 0).toLocaleString('en-PH', { maximumFractionDigits: 2 });
  }
}
