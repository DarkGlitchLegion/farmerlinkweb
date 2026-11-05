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
        background: #ffffff;
        border: 1px solid #e7ece8;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(32, 42, 36, 0.04);
        transition:
          border-color 0.15s ease,
          box-shadow 0.15s ease,
          transform 0.15s ease;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 116px;
      }
      .stat-card:hover {
        border-color: #d3ded6;
        box-shadow: 0 4px 12px rgba(32, 42, 36, 0.06);
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
        background: #e8f3ec;
        color: #176b45;
      }
      .stat-icon-wrap.green {
        background: #e8f3ec;
        color: #176b45;
      }
      .stat-icon-wrap.gold {
        background: #fef5e7;
        color: #a46408;
      }
      .stat-icon-wrap.blue {
        background: #edf5fc;
        color: #276ea9;
      }
      .stat-icon-wrap.rose {
        background: #fdf0f0;
        color: #be3939;
      }
      .icon-fallback {
        font-size: 14px;
        line-height: 1;
      }
      .stat-context {
        font-size: 11px;
        color: #748078;
        background: #f7f9f7;
        padding: 2px 7px;
        border-radius: 6px;
        border: 1px solid #edf1ee;
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
        color: #202a24;
        line-height: 1.15;
      }
      .stat-label {
        font-size: 12px;
        font-weight: 500;
        color: #748078;
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
