import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { AppIconComponent } from '../../shared/components/app-icon/app-icon';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [CommonModule, StatCardComponent, EmptyStateComponent, AppIconComponent, PageHeaderComponent],
  styleUrl: './analytics.css',
  templateUrl: './analytics.html',
})
export class AnalyticsPageComponent {
  @Input() data: any = {};
  @Input() metrics: any[] = [];

  entries(value: unknown): [string, number][] {
    return value && typeof value === 'object'
      ? Object.entries(value as Record<string, number>).map(([k, v]) => [k, Number(v)])
      : [];
  }

  values(value: unknown): number[] {
    return this.entries(value).map((entry) => Number(entry[1]));
  }

  barWidth(value: number, values: number[]): number {
    const max = Math.max(1, ...values);
    return Math.max(6, (Number(value) / max) * 100);
  }

  label(value: any): string {
    return String(value ?? '—')
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  number(value: any): string {
    return value === null || value === undefined ? '—' : Number(value).toLocaleString('en-PH');
  }

  money(value: any): string {
    return value === null || value === undefined
      ? '—'
      : Number(value).toLocaleString('en-PH', { maximumFractionDigits: 2 });
  }
}

export { AnalyticsPageComponent as Analytics };
