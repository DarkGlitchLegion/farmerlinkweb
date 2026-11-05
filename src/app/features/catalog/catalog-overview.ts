import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card';
import { AppIconComponent } from '../../shared/components/app-icon/app-icon';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-catalog-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, StatCardComponent, EmptyStateComponent, AppIconComponent, PageHeaderComponent],
  styleUrl: './catalog-overview.css',
  templateUrl: './catalog-overview.html',
})
export class CatalogOverviewComponent {
  @Input() analytics: any = null;
  @Input() products: any[] = [];
  @Input() categories: any[] = [];
  @Input() batches: any[] = [];

  metric(value: unknown): string {
    return value === null || value === undefined ? '—' : Number(value).toLocaleString('en-PH');
  }

  number(value: unknown): string {
    return value === null || value === undefined ? '—' : Number(value).toLocaleString('en-PH');
  }

  money(value: unknown): string {
    return value === null || value === undefined
      ? '—'
      : Number(value).toLocaleString('en-PH', { maximumFractionDigits: 2 });
  }
}
