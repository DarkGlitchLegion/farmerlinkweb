import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="spinner-container" role="status" aria-live="polite">
      <svg class="spinner-ring" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
        <path
          class="spinner-head"
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
      <span class="spinner-label">{{ label }}</span>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
      .spinner-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        min-height: 220px;
        color: #748078;
        font-size: 13px;
        font-weight: 500;
      }
      .spinner-ring {
        width: 28px;
        height: 28px;
        animation: spin 0.75s linear infinite;
        color: #176b45;
      }
      .spinner-track {
        opacity: 0.15;
      }
      .spinner-head {
        opacity: 0.9;
      }
      .spinner-label {
        color: #748078;
        font-size: 13px;
      }
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoadingSpinnerComponent {
  @Input() label = 'Loading data…';
}
