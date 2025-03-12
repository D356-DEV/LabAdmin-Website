import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://labadmin.ct.ws/api';
  constructor(private http:HttpClient) { }
  login(credenciales: { email:string, password:string}):Observable<any> { 
    return this.http.post(`${this.apiUrl}/users/login`,credenciales);
  }
  register(userData: { email: string, password: string, name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, userData);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/logout`, {});
  }
}
