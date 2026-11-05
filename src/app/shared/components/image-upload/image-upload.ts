import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from '../app-icon/app-icon';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <div class="image-upload-wrapper">
      @if (value) {
        <div class="preview-container">
          <img [src]="value" alt="Selected upload preview" class="preview-img" />
          <div class="preview-overlay">
            <label class="action-btn" title="Replace image">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                (change)="select($event)"
                class="hidden-input"
              />
              <app-icon name="edit" [size]="14" />
              <span>Replace</span>
            </label>
            <button type="button" class="action-btn danger" (click)="clear()" title="Remove image">
              <app-icon name="trash" [size]="14" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      } @else {
        <label class="drop-zone" [class.has-error]="!!error">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            (change)="select($event)"
            class="hidden-input"
          />
          <div class="upload-icon-circle">
            <app-icon name="plus" [size]="18" />
          </div>
          <div class="upload-text">
            <span class="upload-prompt">Click to upload an image</span>
            <span class="upload-hint">PNG, JPG, WebP or GIF up to 5 MiB</span>
          </div>
        </label>
      }
      @if (error) {
        <p class="error-text" role="alert">
          <app-icon name="alert-triangle" [size]="13" />
          <span>{{ error }}</span>
        </p>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
      .hidden-input {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
      }
      .drop-zone {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 16px;
        border: 1.5px dashed var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-bg-main);
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .drop-zone:hover {
        border-color: var(--color-primary-fresh);
        background: var(--color-bg-secondary);
      }
      .drop-zone.has-error {
        border-color: var(--color-danger);
        background: var(--color-danger-bg);
      }
      .upload-icon-circle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: 8px;
        background: var(--color-primary-light);
        color: var(--color-primary);
        flex-shrink: 0;
      }
      .upload-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .upload-prompt {
        font-size: 13px;
        font-weight: 600;
        color: var(--color-primary);
      }
      .upload-hint {
        font-size: 11px;
        color: var(--color-text-secondary);
      }
      .preview-container {
        position: relative;
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 10px;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-bg-card);
      }
      .preview-img {
        width: 72px;
        height: 72px;
        border-radius: 8px;
        object-fit: cover;
        border: 1px solid var(--color-border);
        flex-shrink: 0;
      }
      .preview-overlay {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .action-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: var(--radius-xs);
        font-size: 12px;
        font-weight: 550;
        cursor: pointer;
        background: var(--color-bg-secondary);
        color: var(--color-text-primary);
        border: 1px solid var(--color-border);
        transition: all 0.15s ease;
      }
      .action-btn:hover {
        background: var(--color-bg-subtle);
        border-color: var(--color-border-hover);
      }
      .action-btn.danger {
        background: var(--color-danger-bg);
        color: var(--color-danger);
        border-color: rgba(220, 76, 76, 0.2);
      }
      .action-btn.danger:hover {
        background: rgba(220, 76, 76, 0.2);
      }
      .error-text {
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 6px 0 0;
        font-size: 11px;
        color: var(--color-danger);
      }
    `,
  ],
})
export class ImageUploadComponent {
  @Input() value: string | null = null;
  @Output() valueChange = new EventEmitter<string | null>();
  error = '';

  select(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.error = '';
    if (!file) return;

    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      this.error = 'Please select a PNG, JPEG, WebP, or GIF image.';
      input.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.error = 'Image must be 5 MiB or smaller.';
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => this.valueChange.emit(String(reader.result));
    reader.onerror = () => (this.error = 'Could not read image file.');
    reader.readAsDataURL(file);
  }

  clear(): void {
    this.value = null;
    this.error = '';
    this.valueChange.emit(null);
  }
}
