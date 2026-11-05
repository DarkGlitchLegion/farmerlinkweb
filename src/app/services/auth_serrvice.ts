import { Injectable, inject } from '@angular/core';
import { ApiService } from './api_service';

export interface AuthUser {
  id: number;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string | null;
  status?: string;
}

export interface LoginResponse { access_token: string; expires_in?: number; user: AuthUser; }

@Injectable({ providedIn:'root' })
export class AuthService {
  private readonly api=inject(ApiService);

  login(email:string,password:string):Promise<LoginResponse>{
    return this.api.request<LoginResponse>('/auth/login',{method:'POST',body:{email,password},anonymous:true});
  }
  currentUser():Promise<AuthUser>{return this.api.get<AuthUser>('/users/me');}
  updateUser(id:number,changes:Partial<AuthUser>&{password?:string}):Promise<AuthUser>{
    return this.api.patch<AuthUser>(`/users/${id}`,changes);
  }
  logout():void { this.api.setToken(null); }
}
