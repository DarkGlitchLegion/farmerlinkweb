import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span class="badge" [class]="tone">
      <span class="badge-dot" aria-hidden="true"></span>
      <span class="badge-label">{{ displayLabel }}</span>
    </span>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        vertical-align: middle;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 8px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 550;
        letter-spacing: 0.01em;
        line-height: 1.3;
        white-space: nowrap;
        background: #f0f4f1;
        color: #556259;
        border: 1px solid transparent;
      }
      .badge-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
        flex-shrink: 0;
      }
      .badge.good {
        background: #e8f5ec;
        color: #147146;
        border-color: #d1ebd8;
      }
      .badge.wait {
        background: #fef5e7;
        color: #a46408;
        border-color: #fae4c2;
      }
      .badge.bad {
        background: #fdf0f0;
        color: #be3939;
        border-color: #f7d2d2;
      }
      .badge.info {
        background: #edf5fc;
        color: #276ea9;
        border-color: #d4e7f8;
      }
      .badge.neutral {
        background: #f1f4f2;
        color: #5f6e63;
        border-color: #e2e8e4;
      }
    `,
  ],
})
export class StatusBadgeComponent {
  @Input() label = '';

  get displayLabel(): string {
    if (!this.label) return '—';
    return String(this.label)
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  get tone(): string {
    const value = String(this.label || '').toLowerCase();
    if (
      [
        'active',
        'approved',
        'published',
        'read',
        'delivered',
        'resolved',
        'paid',
        'available',
        'completed',
        'verified',
      ].includes(value)
    ) {
      return 'good';
    }
    if (
      [
        'pending',
        'unread',
        'submitted',
        'reviewing',
        'draft',
        'unpaid',
        'reserved',
        'upcoming',
      ].includes(value)
    ) {
      return 'wait';
    }
    if (
      [
        'rejected',
        'suspended',
        'cancelled',
        'expired',
        'refund',
        'critical',
        'high',
        'danger',
        'out_of_stock',
      ].includes(value)
    ) {
      return 'bad';
    }
    if (
      [
        'processing',
        'confirmed',
        'shipped',
        'farmer',
        'business_buyer',
        'buyer',
        'admin',
        'medium',
        'low',
        'organic',
      ].includes(value)
    ) {
      return 'info';
    }
    return 'neutral';
  }
}
