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
export type PublicRole = 'farmer' | 'buyer' | 'business_buyer';
export interface RegistrationData {
  first_name: string; middle_name: string; last_name: string; email: string;
  phone: string; password: string; role: PublicRole; avatar?: string | null;
}

@Injectable({ providedIn:'root' })
export class AuthService {
  private readonly api=inject(ApiService);

  register(data:RegistrationData, avatarFile?:File):Promise<AuthUser>{
    if (avatarFile) {
      const form = new FormData();
      Object.entries(data).forEach(([key,value]) => {
        if (key !== 'avatar' && value !== undefined && value !== null) form.append(key, String(value));
      });
      form.append('avatar', avatarFile, avatarFile.name);
      return this.api.request<AuthUser>('/auth/register',{method:'POST',body:form,anonymous:true});
    }
    return this.api.request<AuthUser>('/auth/register/base64',{method:'POST',body:data,anonymous:true});
  }

  login(email:string,password:string):Promise<LoginResponse>{
    return this.api.request<LoginResponse>('/auth/login',{method:'POST',body:{email,password},anonymous:true}).then(result=>{
      this.api.setToken(result.access_token);
      return result;
    });
  }
  currentUser():Promise<AuthUser>{return this.api.get<AuthUser>('/users/me');}
  updateUser(id:number,changes:Partial<AuthUser>&{password?:string}):Promise<AuthUser>{
    return this.api.patch<AuthUser>(`/users/${id}`,changes);
  }
  logout():void { this.api.setToken(null); }
}
