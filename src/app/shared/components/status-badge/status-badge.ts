import { Component, Input } from '@angular/core';

@Component({
  selector:'app-status-badge', standalone:true,
  template:`<span class="badge" [class]="'badge '+tone">{{label || '—'}}</span>`,
  styles:[`.badge{display:inline-flex;align-items:center;width:max-content;padding:4px 8px;border-radius:999px;background:#f0f4f1;color:#59665e;font-size:9px;font-weight:700;text-transform:capitalize}.badge.good{background:#e9f5ee;color:#14754d}.badge.wait{background:#fff4df;color:#9b6814}.badge.bad{background:#fcebec;color:#b43f3f}.badge.info{background:#eaf2fa;color:#316fa8}`]
})
export class StatusBadgeComponent {
  @Input() label='';
  get tone(){const value=this.label.toLowerCase();if(['active','approved','published','read','delivered','resolved','paid'].includes(value))return 'good';if(['pending','unread','submitted','reviewing','draft','unpaid'].includes(value))return 'wait';if(['rejected','suspended','cancelled','expired','refund','critical'].includes(value))return 'bad';if(['processing','confirmed','shipped','available'].includes(value))return 'info';return '';}
}
