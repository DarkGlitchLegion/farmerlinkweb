import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from '../app-icon/app-icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <header class="page-header">
      <div class="header-titles">
        @if (eyebrow) {
          <span class="eyebrow">{{ eyebrow }}</span>
        }
        <h1 class="header-title">{{ title }}</h1>
        @if (description) {
          <p class="header-desc">{{ description }}</p>
        }
      </div>
      <div class="header-actions">
        <ng-content select="[actions]" />
        @if (actionLabel) {
          <button type="button" class="btn btn-primary" (click)="action.emit()">
            <app-icon name="plus" [size]="16" />
            <span>{{ actionLabel }}</span>
          </button>
        }
      </div>
    </header>
  `,
  styles: [
    `
      :host {
        display: block;
        margin-bottom: 22px;
      }
      .page-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
      }
      .header-titles {
        flex: 1;
        min-width: 240px;
      }
      .eyebrow {
        display: block;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--color-primary);
        margin-bottom: 4px;
      }
      .header-title {
        margin: 0 0 6px;
        font-size: 24px;
        font-weight: 700;
        letter-spacing: -0.03em;
        color: var(--color-text-primary);
        line-height: 1.2;
      }
      .header-desc {
        margin: 0;
        font-size: 13px;
        color: var(--color-text-secondary);
        line-height: 1.5;
        max-width: 640px;
      }
      .header-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
      }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 8px 14px;
        border-radius: var(--radius-sm);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
        border: 1px solid transparent;
        white-space: nowrap;
      }
      .btn-primary {
        background: var(--color-primary);
        color: var(--color-primary-text);
      }
      .btn-primary:hover {
        background: var(--color-primary-hover);
        box-shadow: 0 2px 6px rgba(23, 107, 69, 0.2);
      }
      @media (max-width: 640px) {
        .header-title {
          font-size: 20px;
        }
        .header-actions {
          width: 100%;
        }
        .header-actions .btn {
          width: 100%;
        }
      }
    `,
  ],
})
export class PageHeaderComponent {
  @Input() eyebrow = '';
  @Input({ required: true }) title!: string;
  @Input() description = '';
  @Input() actionLabel = '';
  @Output() action = new EventEmitter<void>();
}
