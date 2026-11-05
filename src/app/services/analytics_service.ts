import { Injectable, inject } from '@angular/core';
import { ApiService } from './api_service';

@Injectable({providedIn:'root'})
export class AnalyticsService {
  private readonly api=inject(ApiService);
  overview(){return this.api.get<Record<string,unknown>>('/analytics/overview');}
}
