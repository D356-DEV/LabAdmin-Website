import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; 
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import { BannerComponent } from "../../components/banner/banner.component";

@Component({
  selector: 'app-recovery',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, BannerComponent],
  templateUrl: './recovery.component.html',
  styleUrl: './recovery.component.css',
  encapsulation: ViewEncapsulation.None
})
export class RecoveryComponent {

  recoveryForm = new FormGroup({
    email: new FormControl('')
  });

  recovery() {
    console.log(this.recoveryForm.value);
  }
}
