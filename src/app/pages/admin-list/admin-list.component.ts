import { Component, inject} from '@angular/core';
import { UserData } from '../../interfaces/UserInterfaces';
import { Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { AdminsService } from '../../services/admins.service';
import { AdminData } from '../../interfaces/AdminInterfaces';
import { AuthService } from '../../services/auth.service';
import { FormGroup,FormBuilder,FormsModule } from '@angular/forms';
interface Prestador {//SOLO PARA EL EJEMPLO DESPUES RETIRAR Y AÑADIRLO 
  id: number;
  nombre: string;
  especialidad: string;
  contacto: string;
  activo: boolean;
}
@Component({
  selector: 'app-admin-list',
  imports: [NgClass,FormsModule,CommonModule],
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.css'
  
})
export class AdminListComponent {
  
  adminService = inject(AdminsService);
  router = inject(Router);
  authService = inject(AuthService);

  admin: AdminData | undefined;
  user: UserData | undefined;
  editingId: number | null = null;
  editForm = {
    nombre: '',
    especialidad: '',
    contacto: ''
  };
  isAdmin: boolean = false;
  noAdminmessage: string = ""
  prestadores: Prestador[] = [
    { id: 1, nombre: 'Clínica ABC', especialidad: 'Análisis clínicos', contacto: 'clinica@abc.com', activo: true },
    { id: 2, nombre: 'Laboratorio XYZ', especialidad: 'Pruebas especiales', contacto: 'contacto@xyzlab.com', activo: false }
  ];//TODO ESTO COMO EJEMPLO
  
  // Datos de administradores 
  administradores: AdminData[] = [
    { admin_id: 1, creation_date: '2023-01-15', user_id: 101, description: 'Administrador principal' },
    { admin_id: 2, creation_date: '2023-03-22', lab_id: 5, user_id: 102, description: 'Administrador de laboratorio' }
  ];
  async ngOnInit() {
    this.user = await this.authService.getUserData();
    if (!this.user) {
      await this.router.navigate(['/login']);
      return;
    }

    this.isAdmin = await this.adminService.isUserAdmin(this.user.user_id);

    if (this.isAdmin) {
      this.admin = await this.adminService.getByUser(this.user.user_id);

      if (!this.admin) {
         this.noAdminmessage='No eres administrador no puedes usar esta opcion';
        await this.router.navigate(['/home']);
        return;
      }
    }
  }
  
  updatePrestador(){
  console.log ("Actualizar prestador");
}
eliminarPrestador(){
  console.log("Eliminar Prestador")
}
nuevoPrestador(){
  console.log("Nuevo prestador.")
}


startEdit(prestador: Prestador) {
  this.editingId = prestador.id;
  this.editForm = {
    nombre: prestador.nombre,
    especialidad: prestador.especialidad,
    contacto: prestador.contacto
  };
}
cancelEdit() {
  this.editingId = null;
}
saveEdit(id: number) {
  const index = this.prestadores.findIndex(p => p.id === id);
  if (index !== -1) {
    this.prestadores[index] = {
      ...this.prestadores[index],
      ...this.editForm
    };
  }
  this.cancelEdit();
}
deletePrestador(id: number) {
  this.prestadores = this.prestadores.filter(p => p.id !== id);
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
}
