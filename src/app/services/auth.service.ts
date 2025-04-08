import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserData } from '../interfaces/UserInterfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url: string = 'https://api.d356.dev/users';

  constructor(private cookieService: CookieService) {}

  async logIn(identifier: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/login_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ identifier, password })
      });

      if (!response.ok) {
        throw new Error(`[AUTH SERVICE] - HTTP error: ${response.status}`);
      }

      let json;
      
      try {
        json = await response.json();
      } catch (err) {
        throw new Error('[AUTH SERVICE] - Invalid JSON response');
      }

      if (json.status === 'error') {
        throw new Error(`[AUTH SERVICE] - Error al iniciar sesión: ${json.message}`);
      }

      if (json.data?.session_token && json.data?.user_id) {
        this.cookieService.set('session_token', json.data.session_token, { path: '/' });
        this.cookieService.set('user_id', json.data.user_id, { path: '/' });
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
        body: JSON.stringify({ user_id }),
      });

      if (!response.ok) {
        throw new Error(`[AUTH SERVICE] - HTTP error: ${response.status}`);
      }

      let json;
      try {
        json = await response.json();
      } catch (err) {
        throw new Error('[AUTH SERVICE] - Invalid JSON response');
      }

      if (json.status === 'error') {
        throw new Error(`[AUTH SERVICE] - Error al verificar token: ${json.message}`);
      }

      return json.status === 'success';
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

  logOut(): void {
    this.cookieService.delete('session_token');
    this.cookieService.delete('user_id');
  }

  cookieExists(): boolean {
    return !!this.cookieService.get('session_token') && !!this.cookieService.get('user_id');
  }

  getStoredUserId(): string | null {
    return this.cookieService.get('user_id') || null;
  }

  removeCookies(): void {
    this.cookieService.deleteAll();
  }

  async getUserData(): Promise<UserData | undefined> {
    try {
      const response = await fetch(`${this.url}/get_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.cookieService.get('session_token')}`,
        },
        body: JSON.stringify({ user_id: this.cookieService.get('user_id') }),
      });

      if (!response.ok) {
        throw new Error(`[AUTH SERVICE] - HTTP error: ${response.status}`);
      }

      let json;

      try {
        json = await response.json();
      } catch (err) {
        throw new Error('[AUTH SERVICE] - Invalid JSON response');
      }

      if (json.status === 'error') {
        throw new Error(`[AUTH SERVICE] - Error al obtener datos del usuario: ${json.message}`);
      }

      return json.data as UserData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async logOutSecurely(): Promise<boolean> {
    return new Promise((resolve) => {
      this.logOut();

      // Wait a short time to ensure cookies are deleted
      setTimeout(() => {
        const tokenDeleted = !this.cookieService.get('session_token');
        const userDeleted = !this.cookieService.get('user_id');

        resolve(tokenDeleted && userDeleted);
      }, 100); // Small delay to let the cookies delete
    });
  }
}
