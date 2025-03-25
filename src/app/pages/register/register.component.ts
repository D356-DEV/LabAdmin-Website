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
import { BannerComponent } from '../../components/banner/banner.component';
import { Validators } from '@angular/forms';
import { CreateUser, UserData } from '../../interfaces/UserInterfaces';
import { UsersService } from '../../services/users.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, BannerComponent, NgTemplateOutlet],
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
      confirm_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      institution: new FormControl('', [Validators.required]),
      campus: new FormControl('', [Validators.required]),
      student_carrer: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required
      ]),
    });
  }

  async register() {
    this.isLoading = true;
    this.formError = false;
    this.requestSuccess = false;
  
    if (this.registerForm.invalid) {
      this.formError = true;
      this.formErrorText = 'Please fill out all fields';
      return;
    }
  
    this.registerForm.removeControl('confirm_password');
  
    try {
      const response = await this.usersService.registerUser(
        this.registerForm.value as UserData
      );
  
      this.requestSuccess = !!response;
      if (!response) {
        this.formError = true;
        this.formErrorText = 'An error occurred, please try again.';
      }
    } catch (error) {
      console.error('Registration error:', error);
      this.formError = true;
      this.formErrorText = 'A network or server error occurred. Please try again later.';
    } finally {
      this.isLoading = false;
    }
  }
  
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
