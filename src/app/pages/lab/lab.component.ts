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

  updateInstitutionForm: FormGroup;
  updateInstitutionMessage: string = '';

  updateCampusForm: FormGroup;
  updateCampusMessage: string = '';

  updateSpecialtyForm: FormGroup;
  updateSpecialtyMessage: string = '';

  updateLocationForm: FormGroup;
  updateLocationMessage: string = '';

  updateDescriptionForm: FormGroup;
  updateDescriptionMessage: string = '';

  updateAbilityForm: FormGroup;
  updateAbilityMessage: string = '';



  constructor( fb: FormBuilder) {
    this.reservationForm = new FormGroup({});

    this.updateInstitutionForm = new FormGroup ({
      institution: new FormControl('',[Validators.required])
    });

    this.updateCampusForm = new FormGroup({
      campus: new FormControl('',[Validators.required])
    });

    this.updateSpecialtyForm = new FormGroup({
      specialty: new FormControl('',[Validators.required])
    });

    this.updateLocationForm = new FormGroup({
      location: new FormControl('',[Validators.required])
    });

    this.updateDescriptionForm = new FormGroup({
      description: new FormControl('')
    });

    this.updateAbilityForm = new FormGroup({
      ability: new FormControl('')
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
  
  async updateInstitution() {}
  async updateCampus() {}

  async updateSpecialty() {}

  async updateLocation() {}

  async updateDescription() {}

  async updateAbility() {}

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
