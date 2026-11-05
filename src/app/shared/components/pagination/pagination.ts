import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from '../app-icon/app-icon';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <nav class="pagination-bar" aria-label="Pagination">
      <span class="pagination-info">
        @if (totalCount !== undefined && totalCount !== null) {
          Showing <span class="num">{{ offset + 1 }}</span>–<span class="num">{{ offset + currentCount }}</span> of
          <span class="num">{{ totalCount }}</span>
        } @else {
          Showing <span class="num">{{ currentCount ? offset + 1 : 0 }}</span>–<span class="num">{{ offset + currentCount }}</span> records
        }
      </span>
      <div class="pagination-nav">
        <button
          type="button"
          class="page-btn"
          [disabled]="offset === 0"
          (click)="pageChange.emit(-1)"
          aria-label="Previous page"
        >
          <app-icon name="chevron-left" [size]="14" />
          <span>Previous</span>
        </button>
        <button
          type="button"
          class="page-btn"
          [disabled]="!hasNext"
          (click)="pageChange.emit(1)"
          aria-label="Next page"
        >
          <span>Next</span>
          <app-icon name="chevron-right" [size]="14" />
        </button>
      </div>
    </nav>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
      .pagination-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 18px;
        border-top: 1px solid var(--color-border-subtle);
        font-size: 12px;
        color: var(--color-text-secondary);
        background: var(--color-bg-card);
        border-radius: 0 0 12px 12px;
      }
      .num {
        font-weight: 600;
        color: var(--color-text-primary);
      }
      .pagination-nav {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .page-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-xs);
        color: var(--color-text-primary);
        font-size: 12px;
        font-weight: 550;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .page-btn:hover:not(:disabled) {
        background: var(--color-bg-secondary);
        border-color: var(--color-border-hover);
      }
      .page-btn:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      @media (max-width: 480px) {
        .pagination-bar {
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }
        .pagination-nav {
          width: 100%;
          justify-content: space-between;
        }
      }
    `,
  ],
})
export class PaginationComponent {
  @Input() offset = 0;
  @Input() currentCount = 0;
  @Input() totalCount?: number;
  @Input() hasNext = false;
  @Output() pageChange = new EventEmitter<number>();
}
