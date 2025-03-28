import { Injectable } from '@angular/core';
import { CreateUser } from '../interfaces/UserInterfaces';


@Injectable({
  providedIn: 'root'
})

export class UsersService {

  private url:string = 'https://api.d356.dev/users';

  constructor() { }

  public async registerUser(user: CreateUser): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/create_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        throw new Error('Error al registrar al usuario');
      }

      const json = await response.json();

      if (json.status === 'success') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

}
