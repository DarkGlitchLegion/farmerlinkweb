import { Injectable, inject } from '@angular/core';
import { ApiService } from './api_service';
import { PageQuery } from './category_service';
import { AuthUser } from './auth_service';

@Injectable({providedIn:'root'})
export class ProfileService {
  private readonly api=inject(ApiService);
  private list(path:string,query:PageQuery={}){return this.api.get<Record<string,unknown>[]>(path,{offset:query.offset??0,limit:query.limit??25});}
  listUsers(query:PageQuery={}){return this.list('/users',query);}
  getUser(id:number){return this.api.get<Record<string,unknown>>(`/users/${id}`);}
  createUser(data:Record<string,unknown>){return this.api.post<Record<string,unknown>>('/users',data);}
  updateUser(id:number,data:Record<string,unknown>&{password?:string}){return this.api.patch<AuthUser>(`/users/${id}`,data);}
  removeUser(id:number){return this.api.delete(`/users/${id}`);}
  listFarmerProfiles(query:PageQuery={}){return this.list('/farmer-profiles',query);}
  myFarmerProfile(){return this.api.get<Record<string,unknown>>('/farmer-profiles/me');}
  getFarmerProfile(id:number){return this.api.get<Record<string,unknown>>(`/farmer-profiles/${id}`);}
  createFarmerProfile(data:Record<string,unknown>){return this.api.post<Record<string,unknown>>('/farmer-profiles',data);}
  updateFarmerProfile(id:number,data:Record<string,unknown>){return this.api.patch<Record<string,unknown>>(`/farmer-profiles/${id}`,data);}
  removeFarmerProfile(id:number){return this.api.delete(`/farmer-profiles/${id}`);}
  listBusinessProfiles(query:PageQuery={}){return this.list('/business-buyer-profiles',query);}
  myBusinessProfile(){return this.api.get<Record<string,unknown>>('/business-buyer-profiles/me');}
  getBusinessProfile(id:number){return this.api.get<Record<string,unknown>>(`/business-buyer-profiles/${id}`);}
  createBusinessProfile(data:Record<string,unknown>){return this.api.post<Record<string,unknown>>('/business-buyer-profiles',data);}
  updateBusinessProfile(id:number,data:Record<string,unknown>){return this.api.patch<Record<string,unknown>>(`/business-buyer-profiles/${id}`,data);}
  removeBusinessProfile(id:number){return this.api.delete(`/business-buyer-profiles/${id}`);}
}
