import { Component, inject } from '@angular/core';
import { UserData } from '../../interfaces/UserInterfaces';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-account',
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  authService = inject(AuthService);
  router = inject(Router);
  user: UserData | null = null;
  public isLoggedIn: boolean = false;

  constructor() {}

  async ngOnInit() {
    this.user = await this.authService.getUserData();
    if (!this.user) {
      await this.router.navigate(['/login']);
      return;
    }
  }

  formatDate(dateString: string|undefined): string {
    if (!dateString || dateString.startsWith("0000-00-00")) return "Fecha no disponible";

    const datePart = dateString.split(" ")[0];
    const date = new Date(datePart);

    return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
  }

  capitalizeString(str: string | undefined): string {
    if (!str) return "";
    return str
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }

  async logOut(){
    const logout = await this.authService.logOutSecurely();
    if(logout){
      this.isLoggedIn = false;
      window.location.reload();
    }
  }
  
  reservations = [
  { laboratory: 'Laboratorio A', date: '26 de marzo de 2025', time: '10:00 AM - 12:00 PM' },
  { laboratory: 'Laboratorio B', date: '27 de marzo de 2025', time: '02:00 PM - 04:00 PM' },
  { laboratory: 'Laboratorio C', date: '28 de marzo de 2025', time: '08:00 AM - 10:00 AM' }
];
}
