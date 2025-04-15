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