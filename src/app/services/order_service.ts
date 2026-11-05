import { Injectable, inject } from '@angular/core';
import { ApiService } from './api_service';
import { PageQuery } from './category_service';

@Injectable({providedIn:'root'})
export class OrderService {
  private readonly api=inject(ApiService); private readonly path='/orders';
  list(query:PageQuery={}){return this.api.get<Record<string,unknown>[]>(this.path,{offset:query.offset??0,limit:query.limit??25});}
  get(id:number){return this.api.get<Record<string,unknown>>(`${this.path}/${id}`);}
  update(id:number,data:Record<string,unknown>){return this.api.patch<Record<string,unknown>>(`${this.path}/${id}`,data);}
}
