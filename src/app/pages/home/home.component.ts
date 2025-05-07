import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminsService } from '../../services/admins.service';
import { AuthService } from '../../services/auth.service';
import { UserData } from '../../interfaces/UserInterfaces';

interface NewsItem {
  news_id: number;
  title: string;
  content: string;
  creation_date: Date;
  author_id: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  authService = inject(AuthService);
  adminsService = inject(AdminsService);
  router = inject(Router);
  user: UserData | undefined;
  isAdmin: boolean = false;
  isLoading: boolean = true;
  async ngOnInit() {
    this.user = await this.authService.getUserData();
    
    if (!this.user) {
      await this.router.navigate(['/login']);
      return;
    }

    this.isAdmin = await this.adminsService.isUserAdmin(this.user.user_id);
    this.isLoading = false;
  }

}