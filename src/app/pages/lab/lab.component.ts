import { Component, inject, OnInit } from '@angular/core';
import { LabData, ReservationData } from '../../interfaces/LabInterfaces';
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
} from '@angular/forms';
import { AdminData } from '../../interfaces/AdminInterfaces';
import { AdminsService } from '../../services/admins.service';

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
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  user_id: number = 0;
  lab_id: number = 0;
  admin_id: number = 0;

  lab: LabData | undefined;
  admin: AdminData | undefined;

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



  constructor( fb: FormBuilder) {
    this.reservationForm = new FormGroup({
      startTime: new FormControl(''),
      endTime: new FormControl(''),
      description: new FormControl('')

    });

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

  }
  
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

  async reservationLab() {
    if (this.reservationForm.invalid) {
      this.reservationMessage = 'Formulario incompleto.';
      return;
    }

    const reservData: ReservationData = this.reservationForm.value;

    try {
      const response = await this.labService.reservationLab(reservData);

      if (response) {
        this.reservationMessage = 'Solicitud creada exitosamente.';
        this.reservationForm.reset();
        window.location.reload();
      } else {
        this.reservationMessage =
          'No se pudo crear la solicitud. Intenta nuevamente.';
        console.error(
          'Respuesta nula o inválida al generar la solicitud de reservación.'
        );
      }
    } catch (error) {
      console.error('Error al crear la reservacion:', error);
      this.reservationMessage =
        'Ocurrió un error inesperado al generar la reservacion.';
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
