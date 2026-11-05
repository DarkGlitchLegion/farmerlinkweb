import { Component, Input } from '@angular/core';

@Component({
  selector:'app-stat-card', standalone:true,
  template:`<article class="stat-card"><div class="stat-top"><span class="stat-icon" [class]="'stat-icon '+tone">{{icon}}</span><span class="stat-trend">{{context}}</span></div><strong>{{value}}</strong><span class="stat-label">{{label}}</span></article>`,
  styles:[`.stat-card{padding:17px 18px;border:1px solid #e5ebe3;border-radius:12px;background:#fff}.stat-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}.stat-icon{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:#edf4eb;color:#39734a;font-size:17px}.stat-icon.gold{background:#fbf3df;color:#997633}.stat-icon.blue{background:#eaf2f7;color:#49768c}.stat-icon.rose{background:#f8eee8;color:#a56845}.stat-trend{color:#9ba69b;font-size:9px}.stat-card strong{display:block;color:#263e2e;font-size:25px;letter-spacing:-.04em}.stat-label{display:block;margin-top:4px;color:#657166;font-size:11px;font-weight:700}`]
})
export class StatCardComponent {
  @Input() label=''; @Input() value='—'; @Input() icon='•'; @Input() tone='green'; @Input() context='';
}
