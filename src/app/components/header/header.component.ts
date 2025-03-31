import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [ RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  
  authService = inject(AuthService);
  public isLoggedIn: boolean = false;

  constructor() {}

  async ngOnInit() {
    this.isLoggedIn = await this.authService.verifySession();
    console.log('HeaderComponent: isLoggedIn', this.isLoggedIn);
  }
}

