import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  
  private apiUrl = 'https://api.allorigins.win/raw?url=http://pruebabot.free.nf/procesar.php'; 

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
  sendMessage(message: string) {
  return this.http.post(this.apiUrl, { mensaje: message }).pipe(
    catchError((error) => {
      // Manejo detallado de errores
      let errorMessage = 'Error desconocido';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error del cliente: ${error.error.message}`;
      } else if (error.status === 0) {
        errorMessage = 'No hay conexión con el servidor';
      } else {
        errorMessage = `Error ${error.status}: ${error.error?.message || error.message}`;
      }
      throw new Error(errorMessage);
    })
  );
}
}