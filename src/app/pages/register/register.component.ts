import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IUser } from '../../interfaces/IUser';
import { ViewEncapsulation } from '@angular/core';
import { BannerComponent } from "../../components/banner/banner.component";
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, BannerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent {
registerForm = new FormGroup({
  username: new FormControl(''),
  first_name: new FormControl(''),
  last_name: new FormControl(''),
  birth_date: new FormControl(''),
  institution: new FormControl(''),
  campus: new FormControl(''),
  student_code: new FormControl(''),
  student_carreer: new FormControl(''),
  phone: new FormControl(''),
  email: new FormControl(''),
  password: new FormControl(''),
  confirm_password: new FormControl('')
})
  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  register() {
    const userData: IUser = this.registerForm.value as IUser;
    console.log(this.registerForm.value);
  }
}
