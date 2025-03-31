export interface Laboratory {
    lab_id?: number;
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
    creation_date?: string;
  }