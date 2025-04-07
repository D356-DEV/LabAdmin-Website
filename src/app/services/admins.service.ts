import { Injectable } from '@angular/core';
import { AdminData } from '../interfaces/AdminInterfaces';

@Injectable({
  providedIn: 'root'
})
export class AdminsService {

  private url : string = "https://api.d356.dev/admins";

  constructor() { }

  async isUserAdmin(user_id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/is_admin?user_id=${user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`[ADMINS SERVICE] - HTTP error: ${response.status}`);
      }
      
      
      const json = await response.json();
      console.log(json);
  
      return json.status === 'success';
      
    } catch (error) {
      console.error('[ADMINS SERVICE] -', error);
      return false;
    }
  }
  
  async getByUser(user_id: number): Promise<AdminData | undefined> {
    try {
      const response = await fetch(`${this.url}/get_by_user?user_id=${user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`[ADMINS SERVICE] - HTTP error: ${response.status}`);
      }
  
      const json = await response.json();
  
      if (json.status === 'success') {
        return json.data as AdminData;
      }
  
      return undefined;
  
    } catch (error) {
      console.error('[ADMINS SERVICE] -', error);
      return undefined;
    }
  }  

}
