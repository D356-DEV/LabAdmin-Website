import { Component, inject, OnInit } from '@angular/core';
import { LabData, ReservationData } from '../../interfaces/LabInterfaces';
import { AuthService } from '../../services/auth.service';
import { LabService } from '../../services/lab.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { FormGroup, FormControlName, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-lab',
  imports: [ NgTemplateOutlet, RouterLink, ReactiveFormsModule],
  templateUrl: './lab.component.html',
  styleUrl: './lab.component.css'
})
export class LabComponent implements OnInit {
  
  private labService = inject(LabService);
  private authService = inject(AuthService);
  //private quoteService = inject(QuotesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  user_id: string | null = null;
  lab_id: number = 0;
  lab: LabData | undefined;
  
  isLoading: boolean = true;
  quoteSent: boolean = false;
  requestingQuote: boolean = false;
  errorSending: boolean = false;

  reservationForm: FormGroup;
  reservationMessage: string = '';


  constructor() {
    this.reservationForm = new FormGroup({});
  }
  async ngOnInit() {
    this.lab_id = Number(this.route.snapshot.paramMap.get('lab_id'));
    this.user_id = this.authService.getStoredUserId();

    try {
      this.lab = await this.labService.getLab(this.lab_id);
      if (!this.lab) {
        this.router.navigate(['/labs']);
        return;
      }
      /*
      if (this.user_id) {
        this.quoteSent = await this.quoteService.quoteExists(this.artwork_id, this.user_id);
      }
      */
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
          this.reservationMessage = 'No se pudo crear la solicitud. Intenta nuevamente.';
          console.error('Respuesta nula o inválida al generar la solicitud de reservación.');
        }
    
      } catch (error) {
        console.error('Error al crear la reservacion:', error);
        this.reservationMessage = 'Ocurrió un error inesperado al generar la reservacion.';
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