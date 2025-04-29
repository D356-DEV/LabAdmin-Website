  import { Injectable } from '@angular/core';
  import { ResData,CreateRes } from '../interfaces/Reserv';
  @Injectable({
    providedIn: 'root'
  })
  export class ReservService {

    private url : string = "https://api.d356.dev/reservs";
    constructor() { }
    async createReserv(CreateRes: CreateRes): Promise<boolean>{
      try{
        const response = await fetch(`${this.url}/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({
            reserv_date:CreateRes.reserv_date,
            start_time:CreateRes.start_time,
            end_time:CreateRes.end_time,
            lab_id:CreateRes.lab_id,
            user_id:CreateRes.user_id,
            description:CreateRes.description,
          })
      });
      if(!response.ok){
        const errorText = await response.text();
        throw new Error(`Error al crear Laboratorio: ${response.status} ${errorText}`);
      }
      const json = await response.json();
      return json.status === 'success';
    }catch(error){
      console.error(`[LabServices]Error en crear Reserva:`,error);
      throw error;
    }
  }

  async acceptReserv(reserv_id:number,admin_id:number):Promise<boolean>{
    try{
      const response = await fetch(`${this.url}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          reserv_id:reserv_id,
          admin_id:admin_id
        })
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al aceptar reserva: ${response.status} ${errorText}`);
    }
    
    const json = await response.json();

    return json.status === 'success';
  }
  catch (error) {
    console.error(`[LabService] Error in acceptReserv:`, error);
    throw error;
      }
    }
    async rejectReserv(reserv_id:number,admin_id:number):Promise<boolean>{
      try{
        const response = await fetch(`${this.url}/reject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({
            reserv_id:reserv_id,
            admin_id:admin_id
          })
      });
      if(!response.ok){
        const errorText = await response.text();
        throw new Error(`Error al rechazar reserva: ${response.status} ${errorText}`);
      }
      
      const json = await response.json();
    
      return json.status === 'success';
      }
      catch(error){
        console.error(`[LabService] Error in rejectReserv:`, error);
        throw error;
      }
    }
    async allReserv():Promise<ResData[]>{
      try{
        const response = await fetch(`${this.url}/get_all`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('[LabService] Get All Reservs error response:', errorText);
          throw new Error(`Failed to fetch laboratories: ${response.status} ${errorText}`);
        }
        
        const json = await response.json();
  
        return json.data as ResData[];
      } catch (error) {
        console.error('[LabService] Error in AllReservs:', error);
        throw error;
      }
    }
    async reservId(reserv_id:number):Promise<boolean>{
      try{
        const response = await fetch(`${this.url}/get_by_id?reserv_id=${reserv_id}`,{
          method:'GET',
          headers:{
            'Content-Type':'application/json'
          }
        });
        if(!response.ok){
          const errorText = await response.text()
          throw new Error(`[Reserv SERVICES]:${response.status}${errorText}`)
        }
        const json=await response.json();
        console.log(json);
        return json.status =='success';
      }catch(error){
        console.error('[RESERV SERVICES]',error);
        return false;
      }
    }
    async reservLab(lab_id:number):Promise<boolean>{
      try{
        const response = await fetch(`${this.url}/get_by_id?lab_id=${lab_id}`,{
          method:'GET',
          headers:{
            'Content-Type':'application/json'
          }
        });
        if(!response.ok){
          const errorText = await response.text()
          throw new Error(`[Reserv SERVICES]:${response.status}${errorText}`)
        }
        const json=await response.json();
        console.log(json);
        return json.status =='success';
      }catch(error){
        console.error('[RESERV SERVICES]',error);
        return false;
      }
    }
    async reservStatus(lab_id:number, status:string):Promise<boolean>{
      try{
        const response = await fetch(`${this.url}/get_by_id?reserv_id=${lab_id}&status=${status}`,{
          method:'GET',
          headers:{
            'Content-Type':'application/json'
          }
        });
        if(!response.ok){
          const errorText = await response.text()
          throw new Error(`[Reserv SERVICES]:${response.status}${errorText}`)
        }
        const json=await response.json();
        console.log(json);
        return json.status =='success';
      }catch(error){
        console.error('[RESERV SERVICES]',error);
        return false;
      }
    }
    async reservUser(user_id:number):Promise<boolean>{
      try{
        const response = await fetch(`${this.url}/get_by_id?user_id=${user_id}`,{
          method:'GET',
          headers:{
            'Content-Type':'application/json'
          }
        });
        if(!response.ok){
          const errorText = await response.text()
          throw new Error(`[Reserv SERVICES]:${response.status}${errorText}`)
        }
        const json=await response.json();
        console.log(json);
        return json.status =='success';
      }catch(error){
        console.error('[RESERV SERVICES]',error);
        return false;
      }
    }
  }