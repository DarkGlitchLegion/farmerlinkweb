import { Component, Input } from '@angular/core';

@Component({
  selector:'app-stat-card', standalone:true,
  template:`<article class="stat-card"><div class="stat-top"><span class="stat-icon" [class]="'stat-icon '+tone">{{icon}}</span><span class="stat-trend">{{context}}</span></div><strong>{{value}}</strong><span class="stat-label">{{label}}</span></article>`,
  styles:[`.stat-card{padding:15px 16px;border:1px solid var(--border,#e7ece8);border-radius:12px;background:var(--surface,#fff)}.stat-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:13px}.stat-icon{display:grid;place-items:center;width:32px;height:32px;border-radius:9px;background:var(--green-100,#e8f3ec);color:var(--green-700,#176b45);font-size:15px}.stat-icon.gold{background:#fbf3df;color:#997633}.stat-icon.blue{background:#eaf2f7;color:#49768c}.stat-icon.rose{background:#f8eee8;color:#a56845}.stat-trend{color:var(--text-muted,#9aa59d);font-size:9px}.stat-card strong{display:block;color:var(--text,#202a24);font-size:23px;letter-spacing:-.04em}.stat-label{display:block;margin-top:4px;color:var(--text-secondary,#748078);font-size:10px;font-weight:650}`]
})
export class StatCardComponent {
  @Input() label=''; @Input() value='—'; @Input() icon='•'; @Input() tone='green'; @Input() context='';
}
