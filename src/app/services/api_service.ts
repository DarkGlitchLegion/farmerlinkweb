import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  anonymous?: boolean;
}

export class ApiError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly baseUrl = environment.apiUrl.replace(/\/$/, '');
  private accessToken: string | null = null;
  private unauthorizedHandler?: () => void;

  setToken(token: string | null): void { this.accessToken = token; }
  onUnauthorized(handler: () => void): void { this.unauthorizedHandler = handler; }

  get<T>(path: string, query?: Record<string, string | number>): Promise<T> {
    const suffix = query ? `?${new URLSearchParams(Object.entries(query).map(([k,v]) => [k, String(v)]))}` : '';
    return this.request<T>(`${path}${suffix}`);
  }
  post<T>(path: string, body: unknown): Promise<T> { return this.request<T>(path, { method:'POST', body }); }
  patch<T>(path: string, body: unknown): Promise<T> { return this.request<T>(path, { method:'PATCH', body }); }
  delete<T = void>(path: string): Promise<T> { return this.request<T>(path, { method:'DELETE' }); }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const headers: Record<string,string> = { Accept:'application/json' };
    if(options.body !== undefined) headers['Content-Type']='application/json';
    if(!options.anonymous && this.accessToken) headers['Authorization']=`Bearer ${this.accessToken}`;
    let response: Response;
    try {
      response=await fetch(`${this.baseUrl}${path}`,{
        method:options.method ?? 'GET',headers,
        body:options.body === undefined ? undefined : JSON.stringify(options.body),
      });
    } catch {
      throw new ApiError(`Could not connect to FarmerLink API at ${this.baseUrl}. Check the API URL and server connection.`,0);
    }
    if(response.status===401){this.unauthorizedHandler?.();throw new ApiError('Your session has expired. Please sign in again.',401);}
    if(!response.ok){
      let message=`Request failed (${response.status}).`;
      try {const data=await response.json();message=typeof data.detail==='string'?data.detail:data.message??message;} catch { /* response has no JSON body */ }
      throw new ApiError(message,response.status);
    }
    if(response.status===204)return undefined as T;
    return await response.json() as T;
  }
}
