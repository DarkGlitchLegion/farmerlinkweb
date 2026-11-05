import { Component, Input } from '@angular/core';

@Component({
  selector:'app-status-badge', standalone:true,
  template:`<span class="badge" [class]="'badge '+tone">{{label || '—'}}</span>`,
  styles:[`.badge{display:inline-flex;align-items:center;width:max-content;padding:5px 9px;border-radius:999px;background:#eef2ed;color:#637064;font-size:9px;font-weight:750;text-transform:capitalize}.badge.good{background:#eaf4e7;color:#47733e}.badge.wait{background:#fbf2dd;color:#96742c}.badge.bad{background:#faeae7;color:#aa5146}.badge.info{background:#eaf1f7;color:#507891}`]
})
export class StatusBadgeComponent {
  @Input() label='';
  get tone(){const value=this.label.toLowerCase();if(['active','approved','published','read','delivered','resolved','paid'].includes(value))return 'good';if(['pending','unread','submitted','reviewing','draft','unpaid'].includes(value))return 'wait';if(['rejected','suspended','cancelled','expired','refund','critical'].includes(value))return 'bad';if(['processing','confirmed','shipped','available'].includes(value))return 'info';return '';}
}
