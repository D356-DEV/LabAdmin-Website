import { Injectable } from '@angular/core';
import { ScheduleData } from '../interfaces/LabInterfaces';
@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private apiUrl = 'https://api.d356.dev/schedule';

  constructor() { }
  async labSchedule(ScheduleData: ScheduleData){
    try {
      const response = await fetch(`${this.apiUrl}/create_schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ScheduleData
        })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create schedule: ${response.status} ${errorText}`);
      }
  
      const json = await response.json();
  
      return json.status === 'success';
    } catch (error) {
      console.error(`[LabService] Error in labSchedule:`, error);
      throw error;
    }

  }
}
