import { Component, inject, OnInit } from '@angular/core';
import { LabData, ReservationData, ScheduleData } from '../../interfaces/LabInterfaces';
import { AuthService } from '../../services/auth.service';
import { LabService } from '../../services/lab.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AdminData } from '../../interfaces/AdminInterfaces';
import { AdminsService } from '../../services/admins.service';
import { CreateReserv, ReservData } from '../../interfaces/ReservInterfaces';
import { ReservService } from '../../services/reserv.service';
import { ScheduleService } from '../../services/schedule.service';
import { CreateSchedule } from '../../interfaces/ScheduleInterfaces';

@Component({
  selector: 'app-lab',
  imports: [NgTemplateOutlet, ReactiveFormsModule],
  templateUrl: './lab.component.html',
  styleUrl: './lab.component.css',
})
export class LabComponent implements OnInit {
  private labService = inject(LabService);
  private authService = inject(AuthService);
  private adminService = inject(AdminsService);
  private scheduleService = inject(ScheduleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reservService = inject(ReservService);

  

  user_id: number = 0;
  lab_id: number = 0;
  admin_id: number = 0;
  reservs: ReservData [] | any;
  lab: LabData | undefined;
  admin: AdminData | undefined;
  scheduleData: ScheduleData [] | undefined;

  isLoading: boolean = true;
  isAdmin: boolean = false;
  isOwner: boolean = false;

  quoteSent: boolean = false;
  requestingQuote: boolean = false;
  errorSending: boolean = false;

  reservationForm: FormGroup;
  reservationMessage: string = '';

  updateNameForm: FormGroup;
  updateNameMessage: string = '';

  updateInstitutionForm: FormGroup;
  updateInstitutionMessage: string = '';

  updateCampusForm: FormGroup;
  updateCampusMessage: string = '';

  updateSpecializationForm: FormGroup;
  updateSpecialtyMessage: string = '';

  updateLocationForm: FormGroup;
  updateLocationMessage: string = '';

  updateDescriptionForm: FormGroup;
  updateDescriptionMessage: string = '';

  updateCapacityForm: FormGroup;
  updateCapacityMessage: string = '';

  deleteLabMessage: string = '';

  scheduleForm: FormGroup;
  scheduleMessage: string ='';

 
  constructor( fb: FormBuilder) {
    this.reservationForm = new FormGroup({
      reserv_date: new FormControl('', [Validators.required, this.minDateValidator()]),
      start_time: new FormControl('', [Validators.required]),
      end_time: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required])
    }, { validators: this.timeRangeValidator() });  
    

    this.updateNameForm = new FormGroup({
      name: new FormControl('',[Validators.required]) 
    });

    this.updateInstitutionForm = new FormGroup ({
      institution: new FormControl('',[Validators.required])
    });

    this.updateCampusForm = new FormGroup({
      campus: new FormControl('',[Validators.required])
    });

    this.updateSpecializationForm = new FormGroup({
      specialization: new FormControl('',[Validators.required])
    });

    this.updateLocationForm = new FormGroup({
      location: new FormControl('',[Validators.required])
    });

    this.updateDescriptionForm = new FormGroup({
      udescription: new FormControl('',[Validators.required])
    });

    this.updateCapacityForm = new FormGroup({
      capacity: new FormControl('' ,[Validators.required,Validators.min(1)])
    });

    this.scheduleForm = new FormGroup({
        active_monday: new FormControl (false),
        start_time_monday: new FormControl(''),
        end_time_monday: new FormControl (''),
      
        active_tuesday: new FormControl(false),
        start_time_tuesday: new FormControl(''),
        end_time_tuesday: new FormControl (''),
     
      active_wednesday: new FormControl(false),
        start_time_wednesday: new FormControl(''),
        end_time_wednesday: new FormControl (''),
      
      active_thursday: new FormControl(false),
        start_time_thursday: new FormControl(''),
        end_time_thursday: new FormControl (''),
      
      active_friday: new FormControl(false),
        start_time_friday: new FormControl(''),
        end_time_friday: new FormControl (''),
     
      active_saturday: new FormControl(false),
        start_time_saturday: new FormControl(''),
        end_time_saturday: new FormControl (''),
      
      active_sunday: new FormControl (false),
        start_time_sunday: new FormControl(''),
        end_time_sunday: new FormControl ('')
     
      
    })

  }
  minDateValidator() {
    return (control: AbstractControl) => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Eliminar la hora para comparar solo fecha
  
      if (!control.value) return null;
  
      return selectedDate < today ? { minDate: true } : null;
    };
  }

  timeRangeValidator() {
    return (group: AbstractControl) => {
      const start = group.get('start_time')?.value;
      const end = group.get('end_time')?.value;
      if (!start || !end) return null;

      const [startH, startM] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);
      const startTotal = startH * 60 + startM;
      const endTotal = endH * 60 + endM;

      return endTotal > startTotal ? null : { invalidTimeRange: true };
    };}

    

    

  async ngOnInit() {
    window.scroll({ top: 0, behavior: 'smooth' });
    try {
      this.lab_id = Number(this.route.snapshot.paramMap.get('lab_id'));
      this.user_id = Number(this.authService.getStoredUserId());
      

      if (!this.lab_id || this.lab_id < 1) {
        this.router.navigate(['/labs']);
        return;
      } else {
        this.lab = await this.labService.getLab(this.lab_id);
        if (!this.lab) {
          this.router.navigate(['/labs']);
          return;
        }
      }
     

      this.reservs = await this.reservService.getByLab(this.lab_id);
      console.log('Reservaciones cargadas:', this.reservs);


      if (!this.user_id || this.user_id < 1) {
        this.router.navigate(['/labs']);
        return;
      }

      if (await this.adminService.isUserAdmin(this.user_id)) {
        this.isAdmin = true;
        this.admin = await this.adminService.getByUser(this.user_id);
        if (this.admin) {
          this.admin_id = this.admin.admin_id;
        }
        if (this.admin_id === this.lab?.creator_id) {
          this.isOwner = true;
        }
      }
    } catch (error) {
      console.error('Error fetching artwork details:', error);
      this.router.navigate(['/labs']);
    } finally {
      this.isLoading = false;
    }

    
  }

  async createReserv() {
    const dateControl = this.reservationForm.get('reserv_date');
    const startTimeControl = this.reservationForm.get('start_time');
    const endTimeControl = this.reservationForm.get('end_time');
  
    
    this.reservationForm.markAllAsTouched();
  
    if (this.reservationForm.invalid) {
      if (dateControl?.errors) {
        if (dateControl.errors['required']) {
          this.reservationMessage = 'La fecha es obligatoria.';
        } else if (dateControl.errors['minDate']) {
          this.reservationMessage = 'La fecha no puede ser anterior a hoy.';
        } else {
          this.reservationMessage = 'Error en el campo de fecha.';
        }
      } else if (startTimeControl?.errors) {
        if (startTimeControl.errors['required']) {
          this.reservationMessage = 'La hora de inicio es obligatoria.';
        } else {
          this.reservationMessage = 'Error en la hora de inicio.';
        }
      } else if (endTimeControl?.errors) {
        if (endTimeControl.errors['required']) {
          this.reservationMessage = 'La hora de fin es obligatoria.';
        } else {
          this.reservationMessage = 'Error en la hora de fin.';
        }
      } else if (this.reservationForm.errors?.['invalidTimeRange']) {
        this.reservationMessage = 'La hora de fin debe ser posterior a la hora de inicio.';
      } else {
        this.reservationMessage = 'Formulario incompleto o con errores.';
      }
      return;
    }
  
    
    const reservData: CreateReserv = {
      ...this.reservationForm.value,
      lab_id: this.lab_id,
      user_id: this.user_id,
    };
  
    try {
      const response = await this.reservService.createReserv(reservData);
      if (response) {
        this.reservationMessage = 'Solicitud creada exitosamente.';
        this.reservationForm.reset();
        window.location.reload();
      } else {
        this.reservationMessage = 'No se pudo crear la solicitud. Intenta nuevamente.';
        console.error('Respuesta nula o inválida al generar la solicitud de reservación.');
      }
    } catch (error) {
      console.error('Error al crear la reservación:', error);
      this.reservationMessage = 'Ocurrió un error inesperado al generar la reservación.';
    }
  }
  
  
  

  async updateName() {
    if (this.updateNameForm.invalid) {
      this.updateNameMessage = 'Formulario incompleto.';
      return;
    }
    const nameData = this.updateNameForm.value;
    try {
      const response = await this.labService.updateName(this.lab_id, nameData.name);
      if (response) {
        this.updateNameMessage = 'Nombre actualizado exitosamente.';
        window.location.reload();
      } else {
        this.updateNameMessage = 'No se pudo actualizar el nombre.';
        console.error('Error al actualizar el nombre:', response);
      }
    }
    catch (error) {
      console.error('Error al actualizar el nombre:', error);
      this.updateNameMessage = 'Ocurrió un error inesperado.';
    }
  }

  async updateInstitution() {
    if (this.updateInstitutionForm.invalid) {
      this.updateInstitutionMessage = 'Formulario incompleto.';
      return;
    }

    const institutionData = this.updateInstitutionForm.value;

    try {
      const response = await this.labService.updateInstitution(this.lab_id, institutionData.institution);
      if (response) {
        this.updateInstitutionMessage = 'Institución actualizada exitosamente.';
        window.location.reload();
      } else {
        this.updateInstitutionMessage = 'No se pudo actualizar la institución.';
        console.error('Error al actualizar la institución:', response);
      }
    } catch (error) {
      console.error('Error al actualizar la institución:', error);
      this.updateInstitutionMessage = 'Ocurrió un error inesperado.';
    }
  }

  async updateCampus() {
    if (this.updateCampusForm.invalid) {
      this.updateCampusMessage = 'Formulario incompleto.';
      return;
    }

    const campusData = this.updateCampusForm.value;

    try {
      const response = await this.labService.updateCampus(this.lab_id, campusData.campus);
      if (response) {
        this.updateCampusMessage = 'Campus actualizado exitosamente.';
        this.updateCampusForm.reset();
        window.location.reload();
      } else {
        this.updateCampusMessage = 'No se pudo actualizar el campus.';
        console.error('Error al actualizar el campus:', response);
      }
    } catch (error) {
      console.error('Error al actualizar el campus:', error);
      this.updateCampusMessage = 'Ocurrió un error inesperado.';
    }
  }

  async updateSpecialization() {
    if (this.updateSpecializationForm.invalid) {
      this.updateSpecialtyMessage = 'Formulario incompleto.';
      return;
    }

    const specializationData = this.updateSpecializationForm.value;

    try {
      const response = await this.labService.updateSpecialization(this.lab_id, specializationData.specialization);
      if (response) {
        this.updateSpecialtyMessage = 'Especialización actualizada exitosamente.';
        window.location.reload();
      } else {
        this.updateSpecialtyMessage = 'No se pudo actualizar la especialización.';
        console.error('Error al actualizar la especialización:', response);
      }
    } catch (error) {
      console.error('Error al actualizar la especialización:', error);
      this.updateSpecialtyMessage = 'Ocurrió un error inesperado.';
    }
  }

  async updateLocation() {
    if (this.updateLocationForm.invalid) {
      this.updateLocationMessage = 'Formulario incompleto.';
      return;
    }

    const locationData = this.updateLocationForm.value;

    try {
      const response = await this.labService.updateLocation(this.lab_id, locationData.location);
      if (response) {
        this.updateLocationMessage = 'Ubicación actualizada exitosamente.';
        window.location.reload();
      } else {
        this.updateLocationMessage = 'No se pudo actualizar la ubicación.';
        console.error('Error al actualizar la ubicación:', response);
      }
    } catch (error) {
      console.error('Error al actualizar la ubicación:', error);
      this.updateLocationMessage = 'Ocurrió un error inesperado.';
    }
  }

  async updateDescription() {
    if (this.updateDescriptionForm.invalid) {
      this.updateDescriptionMessage = 'Formulario incompleto.';
      return;
    }

    const descriptionData = this.updateDescriptionForm.value;

    try {
      const response = await this.labService.updateDescription(this.lab_id, descriptionData.udescription);
      if (response) {
        this.updateDescriptionMessage = 'Descripción actualizada exitosamente.';
        window.location.reload();
      } else {
        this.updateDescriptionMessage = 'No se pudo actualizar la descripción.';
        console.error('Error al actualizar la descripción:', response);
      }
    } catch (error) {
      console.error('Error al actualizar la descripción:', error);
      this.updateDescriptionMessage = 'Ocurrió un error inesperado.';
    }
  }

  async updateCapacity() {
    if (this.updateCapacityForm.invalid) {
      this.updateCapacityMessage = 'Formulario incompleto.';
      return;
    }

    const capacityData = this.updateCapacityForm.value;

    try {
      const response = await this.labService.updateCapacity(this.lab_id, capacityData.capacity);
      if (response) {
        this.updateCapacityMessage = 'Capacidad actualizada exitosamente.';
        window.location.reload();
      } else {
        this.updateCapacityMessage = 'No se pudo actualizar la capacidad.';
        console.error('Error al actualizar la capacidad:', response);
      }
    } catch (error) {
      console.error('Error al actualizar la capacidad:', error);
      this.updateCapacityMessage = 'Ocurrió un error inesperado.';
    }
  }

  async deleteLab() {
    try {
      if (!this.lab?.creator_id) {
        this.deleteLabMessage = 'No se pudo obtener el creador del laboratorio.';
        console.log('creator_id no está disponible');
        return;
      }
  
      console.log('Eliminando laboratorio...', this.lab_id, this.lab.creator_id);
  
      const deleted = await this.labService.deleteLab(this.lab_id, this.lab.creator_id);
  
      if (deleted) {
        
        this.deleteLabMessage = 'Laboratorio eliminado exitosamente.';
        this.router.navigate(['/labs']); 
      } else {
        
        this.deleteLabMessage = 'No se pudo eliminar el laboratorio.';
      }
  
    } catch (error) {
      console.error( 'Error al eliminar el laboratorio:', error);
      this.deleteLabMessage = 'Ocurrió un error inesperado al eliminar el laboratorio.';
    }
  }

  async createSchedule() {
    let scheduleData: CreateSchedule = {
      lab_id: this.lab_id,
      active_monday: this.scheduleForm.controls['active_monday'].value,
      start_time_monday: this.scheduleForm.controls['start_time_monday'].value? 
      end_time_monday: this.scheduleForm.controls['end_time_monday'].value?
    } 
    const activeMondayControl = this.scheduleForm.controls['active_monday'].value;
    console.log(activeMondayControl);
    if (this.scheduleForm.invalid) {
      this.scheduleMessage = 'Formulario incompleto.';
      return;
    }
    
    const scheduleData: ScheduleData = {
      lab_id: this.lab_id,
      ...this.scheduleForm.value,
    };
  
    try {
      const response = await this.scheduleService.labSchedule(scheduleData);
      if (response) {
        this.scheduleMessage = 'Horario actualizado exitosamente.';
        window.location.reload();
      } else {
        this.scheduleMessage = 'No se pudo actualizar el horario.';
        console.error('Error al actualizar el horario:', response);
      }
    } catch (error) {
      console.error('Error al actualizar el horario:', error);
      this.scheduleMessage = 'Ocurrió un error inesperado.';
    }
  }
  
  
  


  capitalizeString(str: string | undefined): string {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  
  

  
  
  
  /*
  async sendQuote() {
    if (!this.user_id) return;
    this.requestingQuote = true;

    try {
      const response = await this.quoteService.createQuote(this.artwork_id, this.user_id);
      if (!response) throw new Error('Error sending quote');
      this.quoteSent = true;
    } catch (error) {
      console.error('Error sending quote:', error);
      this.errorSending = true;
    } finally {
      this.requestingQuote = false;
    }
  }
    */
 
}
