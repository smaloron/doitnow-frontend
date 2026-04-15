import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {API_URL} from '../../tokens/api.token';
import {Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';


export interface AuthResponse {
  token: string;
}

export interface AuthCredentials {
  email: string | null | undefined;
  password: string | null | undefined;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = inject(API_URL);
  private htpp = inject(HttpClient);


  private readonly TOKEN_KEY: string = 'auth-token';

  private router = inject(Router);

  isAuthenticated(): boolean {
    return localStorage.getItem(this.TOKEN_KEY) !== null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  deleteToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  login(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.htpp.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(res => {
          this.setToken(res.token);
        })
      );
  }

  register(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.htpp.post<AuthResponse>(`${this.API_URL}/auth/register`, credentials)
      .pipe(
        tap(res => {
          this.setToken(res.token);
        })
      );
  }
}
