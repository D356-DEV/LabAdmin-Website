import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  loginForm: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  showPassword = false;
  isLoading = false;
  isError = false;
  errorMessage = '';

  constructor( private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      identifier: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async logIn() {
    this.isLoading = true;
    this.isError = false;
    this.errorMessage = '';
  
    if (this.loginForm.invalid) {
      this.isLoading = false;
      this.isError = true;
      this.errorMessage = 'Por favor, llene todos los campos.';
      return;
    }
  
    const identifier = this.loginForm.get('identifier')?.value?.trim() ?? '';
    const password = this.loginForm.get('password')?.value ?? '';
  
    try {

      const success = await this.authService.logIn(identifier, password);
  
      if (success) {
        await this.router.navigate(['/home']);
        window.location.reload();
      } else {
        this.isLoading = false;
        this.isError = true;
        this.errorMessage = 'Credenciales incorrectas. Inténtelo de nuevo.';
      }
    } catch (error) {
      console.error('[LOGIN] - Error during login:', error);
      this.isLoading = false;
      this.isError = true;
      this.errorMessage = 'Ocurrió un error. Inténtelo más tarde.';
    }
  }
}
  