import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from '../app-icon/app-icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <div class="empty-state">
      <div class="empty-icon-wrap">
        @if (isIconName(icon)) {
          <app-icon [name]="icon" [size]="24" />
        } @else {
          <span class="icon-fallback">{{ icon }}</span>
        }
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-description">{{ description }}</p>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        text-align: center;
        min-height: 200px;
      }
      .empty-icon-wrap {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: #f0f4f1;
        color: #748078;
        margin-bottom: 14px;
      }
      .icon-fallback {
        font-size: 20px;
        line-height: 1;
      }
      .empty-title {
        margin: 0 0 6px;
        font-size: 14px;
        font-weight: 600;
        color: #202a24;
      }
      .empty-description {
        margin: 0;
        font-size: 13px;
        color: #748078;
        max-width: 360px;
        line-height: 1.5;
      }
    `,
  ],
})
export class EmptyStateComponent {
  @Input() title = 'Nothing here yet';
  @Input() description = 'Records will appear here when available.';
  @Input() icon = 'search';

  isIconName(icon: string): boolean {
    const known = ['search', 'dashboard', 'analytics', 'users', 'products', 'categories', 'orders', 'leaf', 'package'];
    return known.includes(icon);
  }
}
