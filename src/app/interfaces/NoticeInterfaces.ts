export interface createNotice {
    admin_id:number;
    lab_id:number;
    title:string;
    message:string;
}

export interface deleteNotice{
    admin_id:number;
    notice_id:number;
}

export interface NoticeData{
    notice_id:number;
    creation_date:string;
    admin_id:number;
    lab_id:number;
    title:string;
    message:string;
}