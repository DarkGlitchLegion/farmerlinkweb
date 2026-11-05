import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';
import { AppIconComponent } from '../../shared/components/app-icon/app-icon';

export type CatalogKind = 'categories' | 'products';

@Component({
  selector: 'app-catalog-grid',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, AppIconComponent],
  styleUrl: './catalog-grid.css',
  templateUrl: './catalog-grid.html',
})
export class CatalogGridComponent {
  @Input({ required: true }) kind!: CatalogKind;
  @Input() records: any[] = [];
  @Input() deletable = true;
  @Output() view = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();

  money(value: unknown): string {
    return Number(value ?? 0).toLocaleString('en-PH', { maximumFractionDigits: 2 });
  }

  number(value: unknown): string {
    return value === null || value === undefined ? '—' : Number(value).toLocaleString('en-PH');
  }
}
