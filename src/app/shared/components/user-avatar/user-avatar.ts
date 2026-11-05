import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  template: `
    @if (image && !imageError) {
      <img
        class="avatar-image"
        [src]="image"
        [alt]="name"
        [style.width.px]="size"
        [style.height.px]="size"
        (error)="imageError = true"
      />
    } @else {
      <span
        class="avatar-fallback"
        [style.width.px]="size"
        [style.height.px]="size"
        [style.font-size.px]="fontSize"
        [attr.aria-label]="name"
      >
        {{ initials }}
      </span>
    }
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        vertical-align: middle;
        flex-shrink: 0;
      }
      .avatar-image,
      .avatar-fallback {
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .avatar-image {
        object-fit: cover;
        border: 1px solid var(--color-border);
      }
      .avatar-fallback {
        background: var(--color-primary-light);
        color: var(--color-primary);
        font-weight: 600;
        letter-spacing: 0.02em;
        user-select: none;
        border: 1px solid var(--color-border);
      }
    `,
  ],
})
export class UserAvatarComponent {
  @Input() name = 'FarmerLink user';
  @Input() image: string | null | undefined;
  @Input() size = 32;

  imageError = false;

  get initials(): string {
    const parts = (this.name || 'User')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!parts.length) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  get fontSize(): number {
    return Math.max(10, Math.round(this.size * 0.38));
  }
}
