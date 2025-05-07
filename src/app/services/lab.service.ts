import { Injectable } from '@angular/core';
import { LabData, ScheduleData } from '../interfaces/LabInterfaces';
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

  async createLab(CreateLab: CreateLab): Promise<boolean> {
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

      return json.status === 'success';
    } catch (error) {
      console.error(`[LabService] Error in createLab:`, error);
      throw error;
    }
  }

 
  
  async updateName(lab_id: number, name: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/update_name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lab_id: lab_id,
          name: name
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update name: ${response.status} ${errorText}`);
      }
      
      const json = await response.json();

      return json.status === 'success';
    }
    catch (error) {
      console.error(`[LabService] Error in updateName:`, error);
      throw error;
    }
  }

  async updateInstitution(lab_id: number,institution: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/update_institution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lab_id: lab_id,
          institution: institution
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update institution: ${response.status} ${errorText}`);
      }
      
      const json = await response.json();

      return json.status === 'success';
    } catch (error) {
      console.error(`[LabService] Error in updateInstitution:`, error);
      throw error;
    }
  }
  async updateCampus(lab_id: number, campus: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/update_campus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lab_id: lab_id,
          campus: campus
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update campus: ${response.status} ${errorText}`);
      }
      
      const json = await response.json();

      return json.status === 'success';
    } catch (error) {
      console.error(`[LabService] Error in updateCampus:`, error);
      throw error;
    }
  }
  async updateSpecialization(lab_id: number, specialization: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/update_specialization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lab_id: lab_id,
          specialization: specialization
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update specialty: ${response.status} ${errorText}`);
      }
      
      const json = await response.json();

      return json.status === 'success';
    } catch (error) {
      console.error(`[LabService] Error in updateSpecialization:`, error);
      throw error;
    }
  }

  async updateLocation(lab_id: number, location: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/update_location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lab_id: lab_id,
          location: location
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update location: ${response.status} ${errorText}`);
      }
      
      const json = await response.json();

      return json.status === 'success';
    } catch (error) {
      console.error(`[LabService] Error in updateLocation:`, error);
      throw error;
    }
  }

  async updateDescription(lab_id: number, description: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/update_description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lab_id: lab_id,
          description: description
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update description: ${response.status} ${errorText}`);
      }
      
      const json = await response.json();

      return json.status === 'success';
    } catch (error) {
      console.error(`[LabService] Error in updateDescription:`, error);
      throw error;
    }
  }
  async updateCapacity(lab_id: number, capacity: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/update_capacity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lab_id: lab_id,
          capacity: capacity
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update capacity: ${response.status} ${errorText}`);
      }
      
      const json = await response.json();

      return json.status === 'success';
    } catch (error) {
      console.error(`[LabService] Error in update capacity:`, error);
      throw error;
    }
  }

  async deleteLab(lab_id: number, creator_id: number): Promise<boolean> {
    try {
      
      const response = await fetch(`${this.apiUrl}/delete_lab`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lab_id: lab_id,
          creator_id: creator_id
        })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error al eliminar laboratorio: ${response.status} ${errorText}`);
        throw new Error(`Failed to delete laboratory: ${response.status} ${errorText}`);
      }
  
      const json = await response.json();
      console.log('Respuesta JSON del servidor:', json);
  
      return json.status === 'success'; 
    } catch (error) {
      console.error(`[LabService] Error en deleteLab:`, error);
      throw error;
    }
  }

  
  
}