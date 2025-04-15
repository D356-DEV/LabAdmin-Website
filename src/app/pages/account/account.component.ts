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
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-account',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  
  activeScreen: 'information' | 'security' = 'information';
  
  authService = inject(AuthService);
  adminService = inject(AdminsService);
  labService = inject(LabService);
  userService = inject(UsersService);
  router = inject(Router);
  
  labForm: FormGroup<CreateLab | any>;
  labMessage: string = '';
  
  passwordForm: FormGroup;
  passwordMessage: string = '';

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

    this.passwordForm = this.fb.group({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    })
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

  async createLab() {
    if (this.labForm.invalid) {
      this.labMessage = 'Formulario incompleto.';
      return;
    }

    if (!this.admin?.admin_id) {
      this.labMessage = 'Administrador no disponible.';
      return;
    }
  
    const labData: CreateLab = this.labForm.value;
    labData.creator_id = this.admin.admin_id;
  
    try {
      const response = await this.labService.createLab(labData);
  
      if (response) {
        this.labMessage = 'Laboratorio creado exitosamente.';
        this.labForm.reset();
      } else {
        this.labMessage = 'No se pudo crear el laboratorio. Intenta nuevamente.';
        console.error('Respuesta nula o inválida al crear el laboratorio');
      }
  
    } catch (error) {
      console.error('Error al crear el laboratorio:', error);
      this.labMessage = 'Ocurrió un error inesperado al crear el laboratorio.';
    }
  }
  
  async updatePassword() {
    if (this.passwordForm.invalid) {
      this.passwordMessage = 'Las contraseñas deben coincidir y ser más largas de 8 caracteres.';
      return;
    }
  
    const newPassword = this.passwordForm.controls['newPassword'].value.trim();
    const confirmPassword = this.passwordForm.controls['confirmPassword'].value.trim();
  
    if (newPassword !== confirmPassword) {
      this.passwordMessage = 'Las contraseñas no coinciden.';
      return;
    }
  
    const sessionToken = this.user?.session_token || '';
    const userId = this.user?.user_id || 0;
  
    try {
      const success = await this.userService.updatePassword(newPassword, userId, sessionToken);
      
      if (success) {
        this.passwordMessage = 'La contraseña se actualizó correctamente.';
        this.passwordForm.reset();
      } else {
        this.passwordMessage = 'No se pudo actualizar la contraseña. Intenta nuevamente.';
      }
  
    } catch (error) {
      console.error('Error actualizando la contraseña:', error);
      this.passwordMessage = 'Ocurrió un error inesperado. Intenta más tarde.';
    }
  }
  
  setActiveScreen(screen:string){
    window.scrollTo({top: 0, behavior: "smooth"});
    this.activeScreen = screen as 'information' | 'security';
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
