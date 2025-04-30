import { Injectable } from '@angular/core';
import { CreateReserv, ReservData } from '../interfaces/ReservInterfaces';

@Injectable({
  providedIn: 'root',
})
export class ReservService {
  private url = 'https://api.d356.dev/reservs';

  constructor() {}

  async createReserv(createReserv: CreateReserv): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( createReserv ),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear reserva: ${response.status} ${errorText}`);
      }

      const json = await response.json();
      return json.status === 'success';
    } catch (error) {
      console.error('[ReservService] Error en createReserv:', error);
      throw error;
    }
  }

  async acceptReserv(reserv_id: number, admin_id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reserv_id, admin_id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al aceptar reserva: ${response.status} ${errorText}`);
      }

      const json = await response.json();
      return json.status === 'success';
    } catch (error) {
      console.error('[ReservService] Error en acceptReserv:', error);
      throw error;
    }
  }

  async rejectReserv(reserv_id: number, admin_id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reserv_id, admin_id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al rechazar reserva: ${response.status} ${errorText}`);
      }

      const json = await response.json();
      return json.status === 'success';
    } catch (error) {
      console.error('[ReservService] Error en rejectReserv:', error);
      throw error;
    }
  }

  async getAll(): Promise<ReservData[]> {
    try {
      const response = await fetch(`${this.url}/get_all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener todas las reservas: ${response.status} ${errorText}`);
      }

      const json = await response.json();
      return json.data as ReservData[];
    } catch (error) {
      console.error('[ReservService] Error en getAll:', error);
      throw error;
    }
  }

  async getById(reserv_id: number): Promise<ReservData | undefined> {
    try {
      const response = await fetch(`${this.url}/get_by_id?reserv_id=${reserv_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener reserva por ID: ${response.status} ${errorText}`);
      }

      const json = await response.json();
      return json.data as ReservData;
    } catch (error) {
      console.error('[ReservService] Error en getById:', error);
      return undefined;
    }
  }

  async getByLab(reserv_id: number): Promise<ReservData[]> {
    try {
      const response = await fetch(`${this.url}/by_lab?lab_id=${reserv_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener reservas por laboratorio: ${response.status} ${errorText}`);
      }
      
      const json = await response.json();
      console.log('[ReservService] Respuesta JSON:', json);

      return json.data as ReservData[];
    } catch (error) {
      console.error('[ReservService] Error en getByLab:', error);
      return [];
    }
  }

  async getByLabAndStatus(lab_id: number, status: string): Promise<ReservData[]> {
    try {
      const response = await fetch(`${this.url}/get_by_id?reserv_id=${lab_id}&status=${status}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener reservas por laboratorio y estado: ${response.status} ${errorText}`);
      }

      const json = await response.json();
      return json.data as ReservData[];
    } catch (error) {
      console.error('[ReservService] Error en getByLabAndStatus:', error);
      return [];
    }
  }

  async getByUser(user_id: number): Promise<ReservData[]> {
    try {
      const response = await fetch(`${this.url}/by_user?user_id=${user_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener reservas por usuario: ${response.status} ${errorText}`);
      }

      const json = await response.json();
      return json.data as ReservData[];
    } catch (error) {
      console.error('[ReservService] Error en getByUser:', error);
      return [];
    }
  }
}
