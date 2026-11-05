import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from '../app-icon/app-icon';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <article class="stat-card" [class]="'tone-' + tone">
      <div class="stat-header">
        <span class="stat-icon-wrap" [class]="tone">
          @if (isIconName(icon)) {
            <app-icon [name]="icon" [size]="18" />
          } @else {
            <span class="icon-fallback">{{ icon }}</span>
          }
        </span>
        @if (context) {
          <span class="stat-context" [title]="context">{{ context }}</span>
        }
      </div>
      <div class="stat-body">
        <strong class="stat-value">{{ value }}</strong>
        <span class="stat-label">{{ label }}</span>
      </div>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .stat-card {
        padding: 16px 18px;
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-card);
        transition:
          border-color 0.15s ease,
          box-shadow 0.15s ease,
          background-color 0.18s ease;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 116px;
      }
      .stat-card:hover {
        border-color: var(--color-border-hover);
        box-shadow: var(--shadow-hover);
      }
      .stat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 12px;
      }
      .stat-icon-wrap {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        border-radius: 8px;
        flex-shrink: 0;
        background: var(--color-primary-light);
        color: var(--color-primary);
      }
      .stat-icon-wrap.green {
        background: var(--color-primary-light);
        color: var(--color-primary);
      }
      .stat-icon-wrap.gold {
        background: var(--color-warning-bg);
        color: var(--color-warning);
      }
      .stat-icon-wrap.blue {
        background: var(--color-info-bg);
        color: var(--color-info);
      }
      .stat-icon-wrap.rose {
        background: var(--color-danger-bg);
        color: var(--color-danger);
      }
      .icon-fallback {
        font-size: 14px;
        line-height: 1;
      }
      .stat-context {
        font-size: 11px;
        color: var(--color-text-secondary);
        background: var(--color-bg-secondary);
        padding: 2px 7px;
        border-radius: 6px;
        border: 1px solid var(--color-border-subtle);
        max-width: 140px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .stat-body {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .stat-value {
        font-size: 24px;
        font-weight: 700;
        letter-spacing: -0.03em;
        color: var(--color-text-primary);
        line-height: 1.15;
      }
      .stat-label {
        font-size: 12px;
        font-weight: 500;
        color: var(--color-text-secondary);
        line-height: 1.3;
      }
    `,
  ],
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value = '—';
  @Input() icon = 'dashboard';
  @Input() tone = 'green';
  @Input() context = '';

  isIconName(icon: string): boolean {
    const knownIcons = [
      'dashboard',
      'analytics',
      'users',
      'farmer-profiles',
      'business-buyer-profiles',
      'products',
      'categories',
      'harvest-batches',
      'orders',
      'catalog',
      'market-prices',
      'advisories',
      'crop-reports',
      'notifications',
      'settings',
      'signout',
      'search',
      'leaf',
      'sprout',
      'package',
      'tag',
      'dollar',
      'bell',
      'calendar',
      'refresh',
      'check',
      'check-circle',
    ];
    return knownIcons.includes(icon);
  }
}
