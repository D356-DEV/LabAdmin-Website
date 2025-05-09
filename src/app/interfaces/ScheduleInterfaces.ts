export interface ScheduleData {
    schedule_id: number;        
    lab_id: number;              
  
    active_monday?: boolean;
    start_time_monday?: string;
    end_time_monday?: string;
  
    active_tuesday?: boolean;
    start_time_tuesday?: string;
    end_time_tuesday?: string;
  
    active_wednesday?: boolean;
    start_time_wednesday?: string;
    end_time_wednesday?: string;
  
    active_thursday?: boolean;
    start_time_thursday?: string;
    end_time_thursday?: string;
  
    active_friday?: boolean;
    start_time_friday?: string;
    end_time_friday?: string;
  
    active_saturday?: boolean;
    start_time_saturday?: string;
    end_time_saturday?: string;
  
    active_sunday?: boolean;
    start_time_sunday?: string;
    end_time_sunday?: string;
  
    creation_date: string;
    update_date: string;
  }

  export interface CreateSchedule {     
    lab_id: number;              
  
    active_monday?: number;
    start_time_monday?: string;
    end_time_monday?: string;
  
    active_tuesday?: number;
    start_time_tuesday?: string;
    end_time_tuesday?: string;
  
    active_wednesday?: number;
    start_time_wednesday?: string;
    end_time_wednesday?: string;
  
    active_thursday?: number;
    start_time_thursday?: string;
    end_time_thursday?: string;
  
    active_friday?: number;
    start_time_friday?: string;
    end_time_friday?: string;
  
    active_saturday?: number;
    start_time_saturday?: string;
    end_time_saturday?: string;
  
    active_sunday?: number;
    start_time_sunday?: string;
    end_time_sunday?: string;
  }
  
  export interface UpdateSchedule {     
    schedule_id: number;        
    lab_id: number;              
  
    active_monday?: number;
    start_time_monday?: string;
    end_time_monday?: string;
  
    active_tuesday?: number;
    start_time_tuesday?: string;
    end_time_tuesday?: string;
  
    active_wednesday?: number;
    start_time_wednesday?: string;
    end_time_wednesday?: string;
  
    active_thursday?: number;
    start_time_thursday?: string;
    end_time_thursday?: string;
  
    active_friday?: number;
    start_time_friday?: string;
    end_time_friday?: string;
  
    active_saturday?: number;
    start_time_saturday?: string;
    end_time_saturday?: string;
  
    active_sunday?: number;
    start_time_sunday?: string;
    end_time_sunday?: string;
  }
  