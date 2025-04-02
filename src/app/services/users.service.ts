import { Injectable } from '@angular/core';
import { CreateUser, UserData } from '../interfaces/UserInterfaces';
import { first } from 'rxjs';

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
        body: JSON.stringify({
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          birth_date: user.birth_date,
          password: user.password,
          institution: user.institution,
          campus: user.campus,
          student_carreer: user.student_carreer,
          email: user.email,
          phone: user.phone,
        })
      });

      if (!response.ok) {
        throw new Error('Error al registrar al usuario');
      }

      const json = await response.json();

      console.log(json);

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
