import { Injectable } from '@angular/core';
import { Laboratory } from '../interfaces/labinterfaces';

@Injectable({
  providedIn: 'root'
})
export class LabService {
  private apiUrl: string = 'https://api.d356.dev';

  constructor() { }

  async getLabs(): Promise<Laboratory[]> {
    console.log('[LabService] Getting labs from:', `${this.apiUrl}/labs/get_labs`);
    try {
      const response = await fetch(`${this.apiUrl}/labs/get_lab`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('[LabService] GetLabs response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[LabService] GetLabs error response:', errorText);
        throw new Error(`Failed to fetch laboratories: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('[LabService] GetLabs received data:', data);
      return data;
    } catch (error) {
      console.error('[LabService] Error in getLabs:', error);
      throw error;
    }
  }

  async getLab(labId: number): Promise<Laboratory> {
    console.log(`[LabService] Getting lab ${labId} from:`, `${this.apiUrl}/labs/get_lab/${labId}`);
    try {
      const response = await fetch(`${this.apiUrl}/labs/get_lab/${labId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`[LabService] GetLab ${labId} response status:`, response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[LabService] GetLab ${labId} error response:`, errorText);
        throw new Error(`Failed to fetch laboratory: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`[LabService] GetLab ${labId} received data:`, data);
      return data;
    } catch (error) {
      console.error(`[LabService] Error in getLab ${labId}:`, error);
      throw error;
    }
  }

  async createLab(lab: Laboratory): Promise<Laboratory> {
    console.log('[LabService] Creating lab with data:', lab);
    try {
      const response = await fetch(`${this.apiUrl}/labs/create_lab`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(lab)
      });
      
      console.log('[LabService] CreateLab response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[LabService] CreateLab error response:', errorText);
        throw new Error(`Failed to create laboratory: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('[LabService] CreateLab response data:', data);
      return data;
    } catch (error) {
      console.error('[LabService] Error in createLab:', error);
      throw error;
    }
  }

  async updateLab(lab: Laboratory): Promise<Laboratory> {
    console.log(`[LabService] Updating lab ${lab.lab_id} with data:`, lab);
    try {
      const response = await fetch(`${this.apiUrl}/labs/update_lab/${lab.lab_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(lab)
      });
      
      console.log(`[LabService] UpdateLab ${lab.lab_id} response status:`, response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[LabService] UpdateLab ${lab.lab_id} error response:`, errorText);
        throw new Error(`Failed to update laboratory: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`[LabService] UpdateLab ${lab.lab_id} response data:`, data);
      return data;
    } catch (error) {
      console.error(`[LabService] Error in updateLab ${lab.lab_id}:`, error);
      throw error;
    }
  }

  async deleteLab(labId: number): Promise<void> {
    console.log(`[LabService] Deleting lab ${labId}`);
    try {
      const response = await fetch(`${this.apiUrl}/labs/delete_lab/${labId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`[LabService] DeleteLab ${labId} response status:`, response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[LabService] DeleteLab ${labId} error response:`, errorText);
        throw new Error(`Failed to delete laboratory: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error(`[LabService] Error in deleteLab ${labId}:`, error);
      throw error;
    }
  }

  async uploadLabImage(labId: number, imageFile: File): Promise<any> {
    console.log(`[LabService] Uploading image for lab ${labId}`);
    try {
      const formData = new FormData();
      formData.append('lab_image', imageFile);
      
      const response = await fetch(`${this.apiUrl}/labs/upload_image/${labId}`, {
        method: 'POST',
        body: formData
      });
      
      console.log(`[LabService] UploadImage ${labId} response status:`, response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[LabService] UploadImage ${labId} error response:`, errorText);
        throw new Error(`Failed to upload laboratory image: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`[LabService] UploadImage ${labId} response data:`, data);
      return data;
    } catch (error) {
      console.error(`[LabService] Error in uploadLabImage ${labId}:`, error);
      throw error;
    }
  }
}