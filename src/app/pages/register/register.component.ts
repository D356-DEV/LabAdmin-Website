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
import { CreateUser, UserData } from '../../interfaces/UserInterfaces';
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
  registerForm: FormGroup<CreateUser | any>;
  showPassword: boolean = false;
  usersService = inject(UsersService);

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
