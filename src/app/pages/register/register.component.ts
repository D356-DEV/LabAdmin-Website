import { Component, inject } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { Validators } from '@angular/forms';
import { CreateUser, UserData } from '../../interfaces/UserInterfaces';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgTemplateOutlet],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent {
  usersService = inject(UsersService);
  registerForm: FormGroup<CreateUser | any>;
  showPassword: boolean = false;
  isLoading: boolean = false;
  formError: boolean = false;
  requestSuccess: boolean = false;
  formErrorText: string = '';

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      birth_date: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      institution: new FormControl('', [Validators.required]),
      campus: new FormControl('', [Validators.required]),
      student_carreer: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required
      ]),
    });
  }

  async register() {
    this.isLoading = true;
    this.formError = false;
    this.requestSuccess = false;
    
    // Validación de campos vacíos
    if (this.registerForm.invalid) {
      this.isLoading = false;
      this.formError = true;
      this.formErrorText = 'Por favor, complete todos los campos.';
      return;
    }
  
    try {
      const response = await this.usersService.registerUser(this.registerForm.value);
  
      if (response) {
        this.requestSuccess = true;
        this.registerForm.reset();
      } else {
        this.isLoading = false;
        this.formError = true;
        this.formErrorText = 'Ocurrió un error, por favor intente nuevamente.';
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      this.isLoading = false;
      this.formError = true;
      this.formErrorText = 'Error de red o del servidor. Intente nuevamente más tarde.';
    } finally {
      this.isLoading = false;
    }
  }
  
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
