import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  
  private apiUrl = 'https://api.d356.dev/bot/handle_question'; 

  constructor(private http: HttpClient) { }

  processMessage(message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/procesar.php`, { mensaje: message })
      .pipe(
        catchError(this.handleError)
      );
  }

  queryDatabase(intent: string, entities: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/consultar.php`, {
      intent,
      entities
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Error en la solicitud:', error);
    return throwError(() => new Error(error.message || 'Error del servidor'));
  }
  sendMessage(message: string): Observable<any> {
    if (!message || message.trim() === '') {
      return throwError(() => new Error('El mensaje no puede estar vacío'));
    }

    return this.http.post(this.apiUrl, { message: message.trim() }).pipe(
      catchError((error) => {
        let errorMessage = 'Error desconocido';
        
        if (error.status === 400) {
          errorMessage = error.error?.message || 'Petición incorrecta';
        } else if (error.error instanceof ErrorEvent) {
          errorMessage = `Error del cliente: ${error.error.message}`;
        } else if (error.status === 0) {
          errorMessage = 'No hay conexión con el servidor';
        } else {
          errorMessage = `Error ${error.status}: ${error.error?.message || error.message}`;
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}