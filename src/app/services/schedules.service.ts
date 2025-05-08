import { Injectable } from '@angular/core';
import { CreateSchedule, ScheduleData, UpdateSchedule } from '../interfaces/ScheduleInterfaces';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {

  private url: string = 'https://api.d356.dev/schedules';

  constructor() { }

  async createSchedule(schedule: CreateSchedule): Promise<boolean> {
    try {
      const response = await fetch(this.url + '/create_schedule', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(schedule)
      })

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create schedule: ${response.status} ${errorText}`);
      }

      const json = await response.json();
      console.log(json);
      return json.status === 'success' 
    } catch (error) {
      console.error('[SchedulesService] Error in createSchedule:', error);
      return false;
    }
  }

  async updateSchedule(schedule: UpdateSchedule): Promise<boolean> {
    try {
      const response = await fetch(this.url + '/update_schedule', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(schedule)
      })

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update schedule: ${response.status} ${errorText}`);
      }

      const json = await response.json();
      return json.status === 'success' 
    } catch (error) {
      console.error('[SchedulesService] Error in updateSchedule:', error);
      return false;
    }
  }

  async getByLabId(lab_id: number): Promise<ScheduleData | undefined> {
    try {
      const response = await fetch(this.url + '/get_by_lab?lab_id=' + lab_id, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      })

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get schedule by lab id: ${response.status} ${errorText}`);
      }

      const json = await response.json();
      console.log(json);
      return json.data as ScheduleData;
    } catch (error) {
      console.error('[SchedulesService] Error in getByLabId:', error);
      return undefined;
    }
  }

  async getById(schedule_id: number): Promise<ScheduleData | undefined> {
    try {
      const response = await fetch(this.url + '/get_by_id?schedule_id=' + schedule_id, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      })

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get schedule by id: ${response.status} ${errorText}`);
      }

      const json = await response.json();
      return json.data as ScheduleData;
    } catch (error) {
      console.error('[SchedulesService] Error in getById:', error);
      return undefined;
    }
  }
}


