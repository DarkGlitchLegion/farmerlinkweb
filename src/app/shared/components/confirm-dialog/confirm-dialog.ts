import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from '../app-icon/app-icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <div class="scrim" (click)="cancel.emit()">
      <div
        class="dialog-card"
        role="alertdialog"
        aria-modal="true"
        [attr.aria-label]="title"
        (click)="$event.stopPropagation()"
      >
        <div class="dialog-header">
          <div class="icon-danger-wrap">
            <app-icon name="alert-triangle" [size]="20" />
          </div>
          <div class="dialog-titles">
            <h2 class="dialog-title">{{ title }}</h2>
            <p class="dialog-message">{{ message }}</p>
          </div>
        </div>
        <div class="dialog-actions">
          <button type="button" class="btn btn-secondary" [disabled]="busy" (click)="cancel.emit()">
            Cancel
          </button>
          <button type="button" class="btn btn-danger" [disabled]="busy" (click)="confirm.emit()">
            @if (busy) {
              <span class="btn-spinner"></span>
              <span>Deleting…</span>
            } @else {
              <span>{{ confirmLabel }}</span>
            }
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .scrim {
        position: fixed;
        z-index: 999;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: rgba(0, 0, 0, 0.65);
        backdrop-filter: blur(4px);
        animation: fadeIn 0.15s ease-out;
      }
      .dialog-card {
        width: 100%;
        max-width: 420px;
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-popover);
        padding: 24px;
        animation: scaleUp 0.15s ease-out;
      }
      .dialog-header {
        display: flex;
        gap: 16px;
        align-items: flex-start;
      }
      .icon-danger-wrap {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: var(--color-danger-bg);
        color: var(--color-danger);
        flex-shrink: 0;
      }
      .dialog-titles {
        flex: 1;
        min-width: 0;
      }
      .dialog-title {
        margin: 0 0 6px;
        font-size: 16px;
        font-weight: 650;
        color: var(--color-text-primary);
        letter-spacing: -0.01em;
      }
      .dialog-message {
        margin: 0;
        font-size: 13px;
        color: var(--color-text-secondary);
        line-height: 1.5;
      }
      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 24px;
      }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: var(--radius-sm);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
        border: 1px solid transparent;
        line-height: 1.4;
      }
      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .btn-secondary {
        background: var(--color-bg-card);
        border-color: var(--color-border);
        color: var(--color-text-primary);
      }
      .btn-secondary:hover:not(:disabled) {
        background: var(--color-bg-secondary);
        border-color: var(--color-border-hover);
      }
      .btn-danger {
        background: var(--color-danger);
        color: #ffffff;
      }
      .btn-danger:hover:not(:disabled) {
        background: #c53a3a;
      }
      .btn-spinner {
        width: 14px;
        height: 14px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #ffffff;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes scaleUp {
        from {
          transform: scale(0.96);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  @Input() title = 'Confirm action';
  @Input() message = 'Are you sure you want to proceed? This action cannot be undone.';
  @Input() confirmLabel = 'Confirm';
  @Input() busy = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.busy) {
      this.cancel.emit();
    }
  }
}
