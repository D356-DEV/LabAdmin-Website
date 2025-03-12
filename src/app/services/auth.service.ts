import { Injectable } from '@angular/core';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  constructor(private apiService: ApiService) {
    this.checkAuthentication();
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.apiService.login(credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  register(userData: { email: string, password: string, name: string }): Observable<any> {
    return this.apiService.register(userData).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): Observable<any> {
    return this.apiService.logout().pipe(
      tap(() => {
        localStorage.removeItem('token');
        this.isAuthenticatedSubject.next(false);
      })
    );
  }
  private checkAuthentication(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }else { 
      this.isAuthenticatedSubject.next(false);
    }
  }
}