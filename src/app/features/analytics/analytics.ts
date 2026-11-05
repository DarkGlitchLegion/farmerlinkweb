import { Component, Input } from '@angular/core';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';

@Component({selector:'app-analytics-page',standalone:true,imports:[StatCardComponent,EmptyStateComponent],styleUrl:'./analytics.css',templateUrl:'./analytics.html'})
export class AnalyticsPageComponent {
  @Input() data:any={};@Input() metrics:any[]=[];
  entries(value:unknown):[string,number][]{return value&&typeof value==='object'?Object.entries(value as Record<string,number>):[];}
  values(value:unknown){return this.entries(value).map(entry=>Number(entry[1]));}
  barWidth(value:number,values:number[]){return Number(value)/Math.max(1,...values)*100;}
  label(value:any){return String(value??'—').replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase());}
  number(value:any){return value===null||value===undefined?'—':Number(value).toLocaleString('en-PH');}
  money(value:any){return value===null||value===undefined?'—':Number(value).toLocaleString('en-PH',{maximumFractionDigits:2});}
}

export { AnalyticsPageComponent as Analytics };
