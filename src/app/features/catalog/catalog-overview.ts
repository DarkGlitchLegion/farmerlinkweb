import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card';

@Component({
  selector: 'app-catalog-overview',
  standalone: true,
  imports: [RouterLink, StatCardComponent, EmptyStateComponent],
  styleUrl: './catalog-overview.css',
  templateUrl:'./catalog-overview.html',
})
export class CatalogOverviewComponent {
  @Input() analytics: any = null;
  @Input() products: any[] = [];
  @Input() categories: any[] = [];
  @Input() batches: any[] = [];
  metric(value: unknown) { return value === null || value === undefined ? '—' : Number(value).toLocaleString('en-PH'); }
  number(value: unknown) { return value === null || value === undefined ? '—' : Number(value).toLocaleString('en-PH'); }
  money(value: unknown) { return value === null || value === undefined ? '—' : Number(value).toLocaleString('en-PH', { maximumFractionDigits: 2 }); }
}
