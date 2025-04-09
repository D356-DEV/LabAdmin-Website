import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';  

@Component({
  selector: 'app-contact',
  standalone: true,  
  imports: [CommonModule, ReactiveFormsModule],  
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],  
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name_contact: ['', Validators.required],
      email_contact: ['', [Validators.required, Validators.email]],
      subject_contact: ['', Validators.required],
      message_contact: ['', Validators.required],
    });
  }

  onSubmitContact() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    
    const formData = JSON.stringify(this.contactForm.value);

    
    console.log(formData);

   
    this.contactForm.reset();
  }
}
