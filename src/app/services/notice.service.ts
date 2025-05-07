  import { Injectable } from '@angular/core';
  import { createNotice, deleteNotice, NoticeData } from '../interfaces/NoticeInterfaces';

  @Injectable({
    providedIn: 'root'
  })
  export class NoticeService {
    private url = 'https://api.d356.dev/notices';
    constructor() { }
    async createNotice(createNotice: createNotice):Promise<boolean>{
      try{
        const response = await fetch(`${this.url}/create_notice`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify( createNotice ),
        });
        if(!response.ok){
          const errorText = await response.text();
          throw new Error(`Error al crear noticia: ${response.status} ${errorText}`);
        }

        const json = await response.json();
        return json.status === 'success';
      } catch (error) {
        console.error('[NoticeServices] Error en createNotice:', error);
        throw error;
      }

      }

    async deleteNotice(deleteNotice:deleteNotice):Promise<boolean>{
      try{
        const response = await fetch(`${this.url}/delete_notice`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify( deleteNotice ),
        });
        if(!response.ok){
          const errorText = await response.text();
          throw new Error(`Error al borrar noticia: ${response.status} ${errorText}`);
        }

        const json = await response.json();
        return json.status === 'success';
      } catch (error) {
        console.error('[NoticeServices] Error en deleteNotice:', error);
        throw error;
      }
    }
    async getbyLab(lab_id:number):Promise<NoticeData[]>{
      try{
        const response = await fetch(`${this.url}/get_by_lab?lab_id=${lab_id}`,{
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al obtener noticia por lab_id: ${response.status} ${errorText}`);
              }
              
              const json = await response.json();
              console.log('[NoticeService] Respuesta JSON:', json);
        
              return json.data as NoticeData[];
            } catch (error) {
              console.error('[NoticeService] Error en getByLab:', error);
              return [];
            }
      }

      async getbyAdmin(admin_id:number):Promise<NoticeData[]>{
        try{
          const response = await fetch(`${this.url}/get_by_admin?admin_id=${admin_id}`,{
            method: 'GET',
            headers:{'Content-Type': 'application/json'},
          });
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al obtener noticia por admin_id: ${response.status} ${errorText}`);
          }
          
          const json = await response.json();
          console.log('[NoticeService] Respuesta JSON:', json);
    
          return json.data as NoticeData[];
        } catch (error) {
          console.error('[NoticeService] Error en getByAdmin:', error);
          return [];
        }
        }
      }
    
