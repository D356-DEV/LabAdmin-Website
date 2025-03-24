import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { UserData } from '../../interfaces/UserInterfaces';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, BannerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent {
  registerForm: FormGroup<UserData | any>;
  showPassword: boolean = false;
  usersService = inject(UsersService);

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      birth_date: ['', Validators.required],
      institution: ['', Validators.required],
      campus: ['', Validators.required],
      student_code: [''],
      student_carrer: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    });
  }

  async register() {
    if (this.registerForm.invalid) {
      return;
    }

    const response = await this.usersService.registerUser(
      this.registerForm.value
    );
    if (response) {
      alert('Usuario registrado correctamente');
    } else {
      alert('Error al registrar al usuario');
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
