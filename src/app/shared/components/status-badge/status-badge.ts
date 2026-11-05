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
        background: var(--color-bg-secondary);
        color: var(--color-text-secondary);
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
        background: var(--color-success-bg);
        color: var(--color-success);
        border-color: rgba(72, 199, 142, 0.2);
      }
      .badge.wait {
        background: var(--color-warning-bg);
        color: var(--color-warning);
        border-color: rgba(242, 184, 75, 0.2);
      }
      .badge.bad {
        background: var(--color-danger-bg);
        color: var(--color-danger);
        border-color: rgba(240, 120, 120, 0.2);
      }
      .badge.info {
        background: var(--color-info-bg);
        color: var(--color-info);
        border-color: rgba(106, 168, 237, 0.2);
      }
      .badge.neutral {
        background: var(--color-bg-secondary);
        color: var(--color-text-secondary);
        border-color: var(--color-border);
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
