import { Component, inject } from '@angular/core';
import { UserData } from '../../interfaces/UserInterfaces';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AdminsService } from '../../services/admins.service';
import { AdminData } from '../../interfaces/AdminInterfaces';
import { LabService } from '../../services/lab.service';
import { CreateLab, LabData } from '../../interfaces/LabInterfaces';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms'; // Se puede incluir Validators si deseas validaciones

@Component({
  selector: 'app-account',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  loadingState: 'loading' | 'loaded' | 'error' = 'loading';
  authService = inject(AuthService);
  adminService = inject(AdminsService);
  labService = inject(LabService);
  router = inject(Router);
  labForm: FormGroup<CreateLab | any>;
  user: UserData | undefined;
  admin: AdminData | undefined;
  labs: LabData[] | undefined;

  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(private fb: FormBuilder) {
    this.labForm = this.fb.group({
      name: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      capacity: new FormControl('', Validators.required),
      description: new FormControl(''),
      institution: new FormControl('', Validators.required),
      campus: new FormControl('', Validators.required),
      specialization: new FormControl('')
      
    });
  }

  async createLab() {
   
    if (this.labForm.invalid || !this.admin?.admin_id) {
      console.warn("Formulario incompleto o administrador no disponible.");
      return;
    }

   
    const labData: CreateLab = this.labForm.value;
    labData.creator_id = this.admin.admin_id;

    try {
      const response = await this.labService.createLab(labData);
      if (response) {
        console.log('Laboratorio creado exitosamente:', response);

       
        this.labForm.reset();

      } else {
        console.error('Error al crear el laboratorio');
      }
    }
    catch (error) {
      console.error('Error al crear el laboratorio:', error);
    }
  }

  async ngOnInit() {
    this.user = await this.authService.getUserData();
    if (!this.user) {
      await this.router.navigate(['/login']);
      return;
    }

    this.isAdmin = await this.adminService.isUserAdmin(this.user.user_id);

    if (this.isAdmin) {
      this.admin = await this.adminService.getByUser(this.user.user_id);

      if (this.admin) {
        this.labs = await this.labService.creatorLabs(this.admin.admin_id);
      }
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

  async logOut() {
    const logout = await this.authService.logOutSecurely();
    if (logout) {
      this.isLoggedIn = false;
      window.location.reload();
    }
  }
}
