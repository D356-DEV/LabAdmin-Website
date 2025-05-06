export interface LabData {
  lab_id: number;
  creation_date: string;
  name: string;
  location: string;
  capacity: number;
  description: string;
  institution: string;
  campus: string;
  specialization: string;
  manager_id?: number;
  creator_id: number;
  lab_image?: string;
}

export interface CreateLab {
  name: string;
  location: string;
  capacity: number;
  description: string;
  institution: string;
  campus: string;
  specialization: string;
  creator_id?: number;
}

export interface ReservationData {
  reservation_id?: number;
  lab_id?: number;
  user_id?: number;
  admin_id?: number;
  start_time: string;
  end_time: string;
  status: string;
  description: string;
}

export interface ScheduleData {
  lab_id: number;
  day_schedule: string;
  open_time: string;
  close_time: string;
  
}