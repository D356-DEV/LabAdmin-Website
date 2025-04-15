import { Component, inject } from '@angular/core';
import { UserData } from '../../interfaces/UserInterfaces';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AdminsService } from '../../services/admins.service';
import { AdminData } from '../../interfaces/AdminInterfaces';
import { LabService } from '../../services/lab.service';
import { LabData } from '../../interfaces/LabInterfaces';

@Component({
  selector: 'app-account',
  imports: [CommonModule, FormsModule],
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
  isCreatingLab: boolean = false;

  // New lab form data model
  newLab = {
    name: '',
    location: '',
    capacity: 1,
    description: '',
    institution: 'Universidad de Guadalajara',
    campus: '',
    specialization: ''
  };

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
      
      if (this.admin){
        await this.loadLabs();
      }
    }
  }

  async loadLabs() {
    if (this.admin) {
      this.labs = await this.labService.creatorLabs(this.admin.admin_id);
    }
  }

  async createLab() {
    try {
      if (!this.admin) {
        console.error('[AccountComponent] Cannot create lab: No admin data available');
        return;
      }

      this.isCreatingLab = true;
      
      const result = await this.labService.createLab(
        this.admin.admin_id, 
        this.newLab
      );
      
      if (result.status === 'success') {
        this.newLab = {
          name: '',
          location: '',
          capacity: 1,
          description: '',
          institution: 'Universidad de Guadalajara',
          campus: '',
          specialization: ''
        };
        
        document.getElementById('closeLabModal')?.click();
        
        await this.loadLabs();
      } else {
        console.error('[AccountComponent] Failed to create lab:', result.message);
      }
    } catch (error) {
      console.error('[AccountComponent] Error creating lab:', error);
    } finally {
      this.isCreatingLab = false;
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