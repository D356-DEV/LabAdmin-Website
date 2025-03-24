import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';  
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import { BannerComponent } from "../../components/banner/banner.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, BannerComponent],  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });



  showPassword = false;

  constructor(private router: Router) {} 

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  
  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  login() {
    console.log(this.loginForm.value);
  }

}
