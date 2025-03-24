import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserData } from '../interfaces/UserInterfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url:string = 'https://labadmin.mx/api/users';

  constructor( private cookieService: CookieService) { }

  async logIn(identifier:string, password:string): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/login_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'identifier': identifier,
          'password': password
        })
      })

      const json = await response.json();

      if (!response.ok || json.status === 'error') {
        throw new Error('[AUTH SERVICE] - Error al iniciar sesión');
      }

      if (json.data?.session_token && json.data?.user_id) {
        this.cookieService.set('session_token', json.data.session_token, {path: '/'});
        this.cookieService.set('user_id', json.data.user_id, {path: '/'});
        return true;
      } 
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async verifyToken(user_id: string, session_token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/verify_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session_token}`,
        },
        body: JSON.stringify({ user_id: user_id }),
      });

      const json = await response.json();

      if (!response.ok || json.status === 'error') {
        throw new Error('[AUTH SERVICE] - Error al verificar token');
      }

      if (json.data?.status === 'success') {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async verifySession(): Promise<boolean> {
    const session_token = this.cookieService.get('session_token');
    const user_id = this.cookieService.get('user_id');

    if (session_token && user_id) {
      return await this.verifyToken(user_id, session_token);
    }
    return false;
  }

  async logOut(): Promise<boolean> {
    try {
      this.cookieService.delete('session_token');
      this.cookieService.delete('user_id');
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private getStoredSessionToken(): string | null {
    return this.cookieService.get('session_token') || null;
  }

  private getStoredUserId(): string | null {
    return this.cookieService.get('user_id') || null;
  }

  public cookieExists(): boolean {
    return this.getStoredSessionToken() !== null && this.getStoredUserId() !== null;
  }

  public removeCookies(): void {
    this.cookieService.delete('session_token');
    this.cookieService.delete('user_id');
    this.cookieService.deleteAll();
  }
}
