import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';


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
export class AuthService{
  private readonly TOKEN_KEY: string = 'auth-token';

  private router = inject(Router);

  isAuthenticated(): boolean {
    return localStorage.getItem(this.TOKEN_KEY) !== null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  login(credentials: AuthCredentials): AuthResponse {
    localStorage.setItem(this.TOKEN_KEY, '123456');
    return {token: '12345'}
  }

  register(credentials: AuthCredentials): any {
    localStorage.setItem(this.TOKEN_KEY, '123456');
    return {token: '12345'}
  }
}
