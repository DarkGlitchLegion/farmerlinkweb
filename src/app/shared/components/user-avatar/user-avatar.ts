import { Component, Input } from '@angular/core';

@Component({selector:'app-user-avatar',standalone:true,template:`@if(image){<img class="avatar-image" [src]="image" [alt]="name" [style.width.px]="size" [style.height.px]="size">}@else{<span class="avatar-fallback" [style.width.px]="size" [style.height.px]="size">{{initials}}</span>}`,styles:[`.avatar-image,.avatar-fallback{display:inline-grid;flex:none;place-items:center;border-radius:50%;object-fit:cover}.avatar-fallback{background:#e5edda;color:#2a613d;font-size:11px;font-weight:800}`]})
export class UserAvatarComponent {@Input() name='FarmerLink user';@Input() image:string|null|undefined;@Input() size=34;get initials(){return this.name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'U';}}
