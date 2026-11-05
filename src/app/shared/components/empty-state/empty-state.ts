import { Component, Input } from '@angular/core';

@Component({selector:'app-empty-state',standalone:true,template:`<div class="empty-state"><span>{{icon}}</span><h3>{{title}}</h3><p>{{description}}</p></div>`,styles:[`.empty-state{display:flex;min-height:190px;flex-direction:column;align-items:center;justify-content:center;color:#91a092;text-align:center}.empty-state>span{font-size:26px}.empty-state h3{margin:11px 0 4px;color:#4b5b4e;font-size:14px}.empty-state p{max-width:320px;margin:0;color:#8f998f;font-size:11px;line-height:1.55}`]})
export class EmptyStateComponent {@Input() title='Nothing here yet';@Input() description='Records will appear here when available.';@Input() icon='⌕';}
