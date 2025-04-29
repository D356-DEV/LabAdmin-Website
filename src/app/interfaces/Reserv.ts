export interface ResData{
    reserv_id: number;
    creation_date: string;
    reserv_date: string;
    start_time:string;
    end_time: string;
    lab_id: number;
    user_id: number;
    admin_id:number;
    description:string;
    status:string;
}

export interface CreateRes{
    reserv_date:string;
    start_time:string;
    end_time:string;
    lab_id:number;
    user_id:number;
    description:string;
}

