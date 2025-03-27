import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';  
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import { BannerComponent } from "../../components/banner/banner.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, BannerComponent],  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {

  authService = inject(AuthService);
  
  loginForm = new FormGroup({
    identifier: new FormControl(''),
    password: new FormControl('')
  });

  showPassword = false;

  constructor(private router: Router) {} 

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async logIn(){
    if (this.loginForm.invalid){
      console.log('Log In form invalid');
      return;
    }
  
    const identifier = this.loginForm.get('identifier')?.value ?? '';
    const password = this.loginForm.get('password')?.value ?? '';

    if(await this.authService.logIn(identifier, password)){
      this.router.navigate(['/home']);
    }
  }
}
