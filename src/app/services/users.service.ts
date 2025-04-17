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
      console.log('Datos enviados para crear usuario:', user);
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
  
  async verifyUsername(username: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/verify_username?username=${encodeURIComponent(username)}`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      // Retorna true si el status es "success" (username disponible)
      return data.status === "success";
    } catch (error) {
      console.error('Error verificando nombre de usuario:', error);
      return false; // En caso de error, asumimos que no está disponible
    }
  }

  async verifyEmail(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/verify_email?email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      // Retorna true si el status es "success" (email disponible)
      return data.status === "success";
    } catch (error) {
      console.error('Error verificando correo electrónico:', error);
      return false; // En caso de error, asumimos que no está disponible
    }
  }

  async updatePassword(password: string, user_id: number, session_token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/update_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${session_token}`
        },
        body: JSON.stringify({
          user_id: user_id,
          password: password
        })
      });
  
      if (!response.ok) {
        return false;
      }
  
      const json = await response.json();
      return json.status === 'success';
  
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  }

  async updateEmail(email: string, user_id: number, session_token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/update_email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${session_token}`
        },
        body: JSON.stringify({
          user_id: user_id,
          email: email
        })
      });
  
      if (!response.ok) {
        return false;
      }
  
      const json = await response.json();
      return json.status === 'success';
  
    } catch (error) {
      console.error('Error updating email:', error);
      return false;
    }
  }

  async updatePhone(phone: string, user_id: number, session_token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/update_phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${session_token}`
        },
        body: JSON.stringify({
          user_id: user_id,
          phone: phone
        })
      });
  
      if (!response.ok) {
        return false;
      }
  
      const json = await response.json();
      return json.status === 'success';
  
    } 
    catch (error) {
      console.error('Error updating phone:', error);
      return false;
    }
  }

  async updateName(first_name: string, user_id: number, session_token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/update_first_name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${session_token}`
        },
        body: JSON.stringify({
          user_id: user_id,
          first_name: first_name
        })
      });
  
      if (!response.ok) {
        return false;
      }
  
      const json = await response.json();
      console.log(json);
      // Verifica si la respuesta es exitosa
      return json.status === 'success';
  
    } catch (error) {
      console.error('Error updating name:', error);
      return false;
    }
  }

  async updateLastName(last_name: string, user_id: number, session_token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/update_last_name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${session_token}`
        },
        body: JSON.stringify({
          user_id: user_id,
          last_name: last_name
        })
      });
  
      if (!response.ok) {
        return false;
      }
  
      const json = await response.json();
      return json.status === 'success';
  
    } catch (error) {
      console.error('Error updating last name:', error);
      return false;
    }
  }

  async updateInstitution(institution: string, user_id: number, session_token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/update_institution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${session_token}`
        },
        body: JSON.stringify({
          user_id: user_id,
          institution: institution
        })
      });
  
      if (!response.ok) {
        return false;
      }
  
      const json = await response.json();
      return json.status === 'success';
  
    } catch (error) {
      console.error('Error updating institution:', error);
      return false;
    }
  }

  async updateCampus(campus: string, user_id: number, session_token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/update_campus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${session_token}`
        },
        body: JSON.stringify({
          user_id: user_id,
          campus: campus
        })
      });
  
      if (!response.ok) {
        return false;
      }
  
      const json = await response.json();
      return json.status === 'success';
  
    } catch (error) {
      console.error('Error updating campus:', error);
      return false;
    }
  }
   async updateCarreer(student_carreer: string, user_id: number, session_token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/update_student_carreer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${session_token}`
        },
        body: JSON.stringify({
          user_id: user_id,
          student_carreer: student_carreer
        })
      });
  
      if (!response.ok) {
        console.log(response.text())
        return false;
      }
  
      const json = await response.json();
      console.log(json);
      return json.status === 'success';
  
    } catch (error) {
      console.error('Error updating career:', error);
      return false;
    }
  }

  async updateCode(student_code: string, user_id: number, session_token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/update_student_code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${session_token}`
        },
        body: JSON.stringify({
          user_id: user_id,
          student_code: student_code
        })
      });
  
      if (!response.ok) {
        return false;
      }
  
      const json = await response.json();
      console.log(json);
      // Verifica si la respuesta es exitosa
      return json.status === 'success';
  
    } catch (error) {
      console.error('Error updating name:', error);
      return false;
    }
  }

  async updateBirth(birth_date: string, user_id: number, session_token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/update_birth_date`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${session_token}`
        },
        body: JSON.stringify({
          user_id: user_id,
          birth_date: birth_date
        })
      });
  
      if (!response.ok) {
        return false;
      }
  
      const json = await response.json();
      return json.status === 'success';
  
    } catch (error) {
      console.error('Error updating birth date:', error);
      return false;
    }
  }

  async resetPassword(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/reset_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'email' : email }),
      });

      if (!response.ok) {
        throw new Error(`El servidor respondió con estado: ${response.status}`);
      }

      const json = await response.json();
      if (!json) {
        throw new Error('La respuesta del servidor no es un JSON válido.');
      }

      return json.status === 'success';
    } catch (error) {
      console.error('Error al restaurar contraseña:', error);
      return false;
    }
  }
}