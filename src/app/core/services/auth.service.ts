import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(data: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.api}/login`, data).pipe(
      tap(res => this.saveAuth(res))
    );
  }

  register(data: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.api}/register`, data).pipe(
      tap(res => this.saveAuth(res))
    );
  }

  forgotPassword(email: string): Observable<{ message: string; resetToken?: string; resetUrl?: string }> {
    return this.http.post<{ message: string; resetToken?: string; resetUrl?: string }>(`${this.api}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/reset-password`, { token, newPassword });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    return this.getStoredUser()?.roleName ?? null;
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value || this.getStoredUser();
  }

  private saveAuth(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res));
    this.currentUserSubject.next(res);
  }

  private getStoredUser(): AuthResponse | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }
}
