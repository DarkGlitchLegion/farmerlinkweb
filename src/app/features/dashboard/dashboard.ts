import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';
import { UserAvatarComponent } from '../../shared/components/user-avatar/user-avatar';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';

@Component({selector:'app-dashboard-page',standalone:true,imports:[CommonModule,RouterLink,StatCardComponent,StatusBadgeComponent,UserAvatarComponent,EmptyStateComponent],styleUrl:'./dashboard.css',templateUrl:'./dashboard.html'})
export class DashboardPageComponent {
  @Input() metrics:any[]=[];@Input() orders:any[]=[];@Input() pendingProfiles:any[]=[];@Input() reports:any[]=[];@Input() recentUsers:any[]=[];@Input() firstName='Administrator';@Output() refresh=new EventEmitter<void>();
  readonly today=new Intl.DateTimeFormat('en-PH',{weekday:'long',month:'long',day:'numeric',year:'numeric'}).format(new Date());
  greeting(){const h=new Date().getHours();return `${h<12?'GOOD MORNING':h<18?'GOOD AFTERNOON':'GOOD EVENING'}, ADMINISTRATOR`;}
  date(value:any){if(!value)return '—';const date=new Date(value);return Number.isNaN(date.valueOf())?'—':new Intl.DateTimeFormat('en-PH',{month:'short',day:'numeric',year:'numeric'}).format(date);}
  label(value:any){return String(value??'—').replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase());}
}
