import { Injectable, inject } from '@angular/core';
import { ApiService } from './api_service';
import { PageQuery } from './category_service';

@Injectable({providedIn:'root'})
export class OrderItemService {
  private readonly api=inject(ApiService);
  listForOrder(orderId:number,query:PageQuery={}){
    return this.api.get<Record<string,unknown>[]>(`/orders/${orderId}/items`,{offset:query.offset??0,limit:query.limit??100});
  }
  get(id:number){return this.api.get<Record<string,unknown>>(`/order-items/${id}`);}
}
