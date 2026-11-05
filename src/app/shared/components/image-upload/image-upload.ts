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
        border: 1.5px dashed #cfd9d2;
        border-radius: 10px;
        background: #fafcfb;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .drop-zone:hover {
        border-color: #2f9d65;
        background: #f4f8f5;
      }
      .drop-zone.has-error {
        border-color: #dc4c4c;
        background: #fff8f8;
      }
      .upload-icon-circle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: 8px;
        background: #e8f3ec;
        color: #176b45;
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
        color: #176b45;
      }
      .upload-hint {
        font-size: 11px;
        color: #748078;
      }
      .preview-container {
        position: relative;
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 10px;
        border: 1px solid #e7ece8;
        border-radius: 10px;
        background: #ffffff;
      }
      .preview-img {
        width: 72px;
        height: 72px;
        border-radius: 8px;
        object-fit: cover;
        border: 1px solid #e7ece8;
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
        border-radius: 6px;
        font-size: 12px;
        font-weight: 550;
        cursor: pointer;
        background: #f0f4f1;
        color: #435147;
        border: 1px solid #e2e8e4;
        transition: all 0.15s ease;
      }
      .action-btn:hover {
        background: #e5ece7;
        color: #202a24;
      }
      .action-btn.danger {
        background: #fdf0f0;
        color: #be3939;
        border-color: #f7d2d2;
      }
      .action-btn.danger:hover {
        background: #fce4e4;
        color: #a82e2e;
      }
      .error-text {
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 6px 0 0;
        font-size: 11px;
        color: #dc4c4c;
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
