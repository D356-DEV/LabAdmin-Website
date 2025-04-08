import { Component, inject } from '@angular/core';
import { UserData } from '../../interfaces/UserInterfaces';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AdminsService } from '../../services/admins.service';
import { AdminData } from '../../interfaces/AdminInterfaces';
import { LabService } from '../../services/lab.service';
import { LabData } from '../../interfaces/LabInterfaces';
@Component({
  selector: 'app-account',
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  authService = inject(AuthService);
  adminService = inject(AdminsService);
  labService = inject(LabService);

  router = inject(Router);

  user: UserData | undefined;
  admin: AdminData | undefined;
  labs: LabData[] | undefined;

  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor() {}

  async ngOnInit() {
    
    this.user = await this.authService.getUserData();
    if (!this.user) {
      await this.router.navigate(['/login']);
      return;
    }
    
    this.isAdmin = await this.adminService.isUserAdmin(this.user.user_id);
    if (this.isAdmin){
      this.admin = await this.adminService.getByUser(this.user.user_id);
      this.labs = await this.labService.getLabs();
    }
  }

  formatDate(dateString: string | undefined): string {
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
}
