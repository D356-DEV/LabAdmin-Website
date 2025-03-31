import { Injectable } from '@angular/core';
import { LabData } from '../interfaces/LabInterfaces';

@Injectable({
  providedIn: 'root'
})
export class LabService {
  private apiUrl: string = 'https://api.d356.dev/labs';

  constructor() { }

  async getLabs(): Promise<LabData[]> {

    try {
      const response = await fetch(`${this.apiUrl}/get_labs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[LabService] GetLabs error response:', errorText);
        throw new Error(`Failed to fetch laboratories: ${response.status} ${errorText}`);
      }
      
      const json = await response.json();

      return json.data as LabData[];
    } catch (error) {
      console.error('[LabService] Error in getLabs:', error);
      throw error;
    }
  }

  async getLab(lab_id: number): Promise<LabData> {
    try {
      const response = await fetch(`${this.apiUrl}/labs/get_lab/lab_id=${lab_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch laboratory: ${response.status} ${errorText}`);
      }
      
      const json = await response.json();

      return json.data as LabData;

    } catch (error) {
      console.error(`[LabService] Error in getLab:`, error);
      throw error;
    }
  }
}