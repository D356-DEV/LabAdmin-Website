import { Component, inject, OnInit } from '@angular/core';
import { LabData } from '../../interfaces/LabInterfaces';
import { AuthService } from '../../services/auth.service';
import { LabService } from '../../services/lab.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-lab',
  imports: [ NgTemplateOutlet ],
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

   console.log('Lab ID:', this.lab_id);
   console.log('User ID:', this.user_id);
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