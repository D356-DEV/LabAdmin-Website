import { Injectable } from '@angular/core';
import { LabData } from '../interfaces/LabInterfaces';
import { CreateLab } from '../interfaces/LabInterfaces';

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
      const response = await fetch(`${this.apiUrl}/get_lab?lab_id=${lab_id}`, {
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

  async creatorLabs(admin_id: number): Promise<LabData[]> {
    try {
      const response = await fetch(`${this.apiUrl}/creator_labs?admin_id=${admin_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch creator labs: ${response.status} ${errorText}`);
      }
      
      const json = await response.json();

      return json.data as LabData[];

    } catch (error) {
      console.error(`[LabService] Error in getLab:`, error);
      throw error;
    }
  }
  async createLab(CreateLab: CreateLab): Promise<CreateLab> {
    try {
      const response = await fetch(`${this.apiUrl}/create_lab`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: CreateLab.name,
          location: CreateLab.location,
          capacity: CreateLab.capacity,
          description: CreateLab.description,
          institution: CreateLab.institution,
          campus: CreateLab.campus,
          specialization: CreateLab.specialization,
          creator_id: CreateLab.creator_id,
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create laboratory: ${response.status} ${errorText}`);
      }
      
      const json = await response.json();

      return json.data as LabData;
    } catch (error) {
      console.error(`[LabService] Error in createLab:`, error);
      throw error;
    }
  }
}