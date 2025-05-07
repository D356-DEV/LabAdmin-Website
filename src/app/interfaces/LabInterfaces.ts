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
  active_monday: number;
  start_time_monday: string;
  end_time_monday: string;
  active_tuesday: number;
  start_time_tuesday: string;
  end_time_tuesday: string;
  active_wednesday: number;
  start_time_wednesday: string;
  end_time_wednesday: string;
  active_thursday: number;
  start_time_thursday: string;
  end_time_thursday: string;
  active_friday: number;
  start_time_friday: string;
  end_time_friday: string;
  active_saturday: number;
  start_time_saturday: string;
  end_time_saturday: string;
  active_sunday: number;
  start_time_sunday: string;
  end_time_sunday: string;
}