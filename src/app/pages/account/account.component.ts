import { Component, inject } from '@angular/core';
import { UserData } from '../../interfaces/UserInterfaces';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AdminsService } from '../../services/admins.service';
import { AdminData } from '../../interfaces/AdminInterfaces';
import { LabService } from '../../services/lab.service';
import { CreateLab, LabData } from '../../interfaces/LabInterfaces';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { UsersService } from '../../services/users.service';
import { ReservData } from '../../interfaces/ReservInterfaces';
import { ReservService } from '../../services/reserv.service';

@Component({
  selector: 'app-account',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  
  activeScreen: 'information' | 'security' | 'reservations' = 'information';
  
  authService = inject(AuthService);
  adminService = inject(AdminsService);
  labService = inject(LabService);
  userService = inject(UsersService);
  router = inject(Router);
  reservService = inject(ReservService);

  labForm: FormGroup<CreateLab | any>;
  labMessage: string = '';
  
  passwordForm: FormGroup;
  passwordMessage: string = '';

  emailForm: FormGroup;
  emailMessage: string = '';

  phoneForm: FormGroup;
  phoneMessage: string = '';

  nameForm: FormGroup;
  nameMessage: string = '';

  lastNameForm: FormGroup;
  lastNameMessage: string = '';

  institutionForm: FormGroup;
  institutionMessage: string = '';

  campusForm: FormGroup;
  campusMessage: string = '';

  carreerForm: FormGroup;
  carreerMessage: string = '';

  codeForm: FormGroup;
  codeMessage: string = '';

  birthForm: FormGroup;
  birthMessage: string = '';

  user: UserData | undefined;
  admin: AdminData | undefined;
  labs: LabData[] | undefined;
  reservs: ReservData[] | undefined;

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

    this.emailForm = this.fb.group({
      email: new FormControl('', [Validators.required])
    })

    this.phoneForm = this.fb.group({
      phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)])
    })

    this.nameForm = this.fb.group({
      first_name: new FormControl('', [Validators.required]),

    })

    this.lastNameForm = this.fb.group({
      last_name: new FormControl('', [Validators.required]),
    })

    this.institutionForm = this.fb.group({
      institution: new FormControl('', [Validators.required]),
    })

    this.campusForm = this.fb.group({
      campus: new FormControl('', [Validators.required]), 

  })

  this.carreerForm = this.fb.group({
    student_carreer: new FormControl('', [Validators.required]),
  } )
  this.codeForm =this.fb.group({
    student_code: new FormControl('',[Validators.required]),
  })
  this.birthForm = this.fb.group({  
    birth_date: new FormControl('', [Validators.required]),

  })
  }
  async ngOnInit() {
    this.user = await this.authService.getUserData();
    if (!this.user) {
      await this.router.navigate(['/login']);
      return;
    }
    this.reservs = await this.reservService.getByUser(this.user.user_id);
    await this.loadReservations();
    this.isAdmin = await this.adminService.isUserAdmin(this.user.user_id);
    

    if (this.isAdmin) {
      this.admin = await this.adminService.getByUser(this.user.user_id);

      if (this.admin) {
        this.labs = await this.labService.creatorLabs(this.admin.admin_id);
      }
    }
  }
  async loadReservations() {
    if (this.user) {
      try {
        this.reservs = await this.reservService.getByUser(this.user.user_id);
      } catch (error) {
        console.error('Error al cargar reservaciones:', error);
      }
    }
  }
  async acceptReservation(reservId: number) {
    if (!this.admin) return;
    
    try {
      const result = await this.reservService.acceptReserv(reservId, this.admin.admin_id);
      
      if (result) {
        await this.loadReservations();
        
        alert('Reservación aceptada correctamente');
      }
    } catch (error) {
      console.error('Error al aceptar la reservación:', error);
      alert('Error al aceptar la reservación');
    }
  }
  async rejectReservation(reservId: number) {
    if (!this.admin) return;
    
    try {
      const result = await this.reservService.rejectReserv(reservId, this.admin.admin_id);
      
      if (result) {
        await this.loadReservations();
        
        alert('Reservación rechazada correctamente');
      }
    } catch (error) {
      console.error('Error al rechazar la reservación:', error);
      alert('Error al rechazar la reservación');
    }
  }
  switchScreen(screen: 'information' | 'security' | 'reservations') {
    this.activeScreen = screen;
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
        window.location.reload()
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
        window.location.reload();
      } else {
        this.passwordMessage = 'No se pudo actualizar la contraseña. Intenta nuevamente.';
      }
  
    } catch (error) {
      console.error('Error actualizando la contraseña:', error);
      this.passwordMessage = 'Ocurrió un error inesperado. Intenta más tarde.';
    }
  }
  
  async updateEmail() {
    if (this.emailForm.invalid) {
      this.passwordMessage = 'El correo electrónico no es válido.';
      return;
    }
    const newEmail = this.emailForm.controls['email'].value.trim();
    const sessionToken = this.user?.session_token || '';
    const userId = this.user?.user_id || 0;
    try {
      const success = await this.userService.updateEmail(newEmail, userId, sessionToken);
      if (success) {
        this.emailMessage = 'El correo electrónico se actualizó correctamente.';
        this.emailForm.reset();
        window.location.reload();
      }
      else {
        this.emailMessage = 'No se pudo actualizar el correo electrónico. Intenta nuevamente.';
      }
  }
    catch (error) {
      console.error('Error actualizando el correo electrónico:', error);
      this.emailMessage = 'Ocurrió un error inesperado. Intenta más tarde.';
    }
  }

  async updatePhone() {
    if (this.phoneForm.invalid) {
      this.phoneMessage = 'El número de teléfono no es válido.';
      return;
    }
    const newPhone = this.phoneForm.controls['phone'].value.trim();
    const sessionToken = this.user?.session_token || '';
    const userId = this.user?.user_id || 0;
    try {
      const success = await this.userService.updatePhone(newPhone, userId, sessionToken);
      if (success) {
        this.phoneMessage = 'El número de teléfono se actualizó correctamente.';
        this.phoneForm.reset();
        window.location.reload();
      }
      else {
        this.phoneMessage = 'No se pudo actualizar el número de teléfono. Intenta nuevamente.';
      }
    }
    catch (error) {
      console.error('Error actualizando el número de teléfono:', error);
      this.phoneMessage = 'Ocurrió un error inesperado. Intenta más tarde.';
    }
  }

  async updateName() {
    if (this.nameForm.invalid) {
      this.nameMessage = 'El nombre no es válido.';
      return;
    }
    const firstName = this.nameForm.controls['first_name'].value.trim();
    try {
      const success = await this.userService.updateName(firstName, this.user?.user_id || 0, this.user?.session_token || '');
      if (success) {
        this.nameMessage = 'El nombre se actualizó correctamente.';
        this.nameForm.reset();
        window.location.reload(); 
      }
      else {
        this.nameMessage = 'No se pudo actualizar el nombre. Intenta nuevamente.';
      }
    }
    catch (error) {
      console.error('Error actualizando el nombre:', error);
      this.nameMessage = 'Ocurrió un error inesperado. Intenta más tarde.';
    }
  }
 
  async updateLastName() {
    if (this.lastNameForm.invalid) {
      this.lastNameMessage = 'El apellido no es válido.';
      return;
    }
  
    const lastName = this.lastNameForm.controls['last_name'].value.trim();
    const sessionToken = this.user?.session_token || '';
    const userId = this.user?.user_id || 0;

    try {
      const success = await this.userService.updateLastName(
        lastName,
        userId,
        sessionToken
      );
  
      if (success) {
        this.lastNameMessage = 'El apellido se actualizó correctamente.';
        this.lastNameForm.reset();
        window.location.reload();
      } else {
        this.lastNameMessage = 'No se pudo actualizar el apellido. Intenta nuevamente.';
      }
    } catch (error) {
      console.error('Error actualizando el apellido:', error);
      this.lastNameMessage = 'Ocurrió un error inesperado. Intenta más tarde.';
    }
  }
  
  async updateInstitution() {
    if (this.institutionForm.invalid) {
      this.institutionMessage = 'La institución no es válida.';
      return;
    }
    const newInstitution = this.institutionForm.controls['institution'].value.trim();
    try {
      const success = await this.userService.updateInstitution(newInstitution, this.user?.user_id || 0, this.user?.session_token || '');
      if (success) {
        this.institutionMessage = 'La institución se actualizó correctamente.';
        this.institutionForm.reset();
        window.location.reload();
      }
      else {
        this.institutionMessage = 'No se pudo actualizar la institución. Intenta nuevamente.';
      }
    }
    catch (error) {
      console.error('Error actualizando la institución:', error);
      this.institutionMessage = 'Ocurrió un error inesperado. Intenta más tarde.';
    }
  }
  
  async updateCampus() {
    if (this.campusForm.invalid) {
      this.campusMessage = 'El campus no es válido.';
      return;
    }
    const newCampus = this.campusForm.controls['campus'].value.trim();
    try {
      const success = await this.userService.updateCampus(newCampus, this.user?.user_id || 0, this.user?.session_token || '');
      if (success) {
        this.campusMessage = 'El campus se actualizó correctamente.';
        this.campusForm.reset();
        window.location.reload();
      }
      else {
        this.campusMessage = 'No se pudo actualizar el campus. Intenta nuevamente.';
      }
    }
    catch (error) {
      console.error('Error actualizando el campus:', error);
      this.campusMessage = 'Ocurrió un error inesperado. Intenta más tarde.';
    }
  }

  async updateCarreer() {
    if (this.carreerForm.invalid) {
      this.carreerMessage = 'La carrera no es válida.';
      return;
    }
    const newCarreer = this.carreerForm.controls['student_carreer'].value;
    try {
      const success = await this.userService.updateCarreer(newCarreer, this.user?.user_id || 0, this.user?.session_token || '');
      if (success) {
        this.carreerMessage = 'La carrera se actualizó correctamente.';
        this.carreerForm.reset();
        window.location.reload();
      }
      else {
        this.carreerMessage = 'No se pudo actualizar la carrera. Intenta nuevamente.';
      }
    }
    catch (error) {
      console.error('Error actualizando la carrera:', error);
      this.carreerMessage = 'Ocurrió un error inesperado. Intenta más tarde.';
    }
  }

  async updateCode(){
    if(this.codeForm.invalid){
      this.codeMessage ='El codigo no es valido';
      return;
    }
    const newCode = this.codeForm.controls['student_code'].value.trim();
    const sessionToken = this.user?.session_token || '';
    const userId = this.user?.user_id || 0;
    try {
      const success = await this.userService.updateCode( newCode,
        userId,
        sessionToken);
        
      if (success) {
        this.codeMessage = 'El Codigo se actualizó correctamente.';
        this.codeForm.reset();
        window.location.reload();
      } else {
        this.codeMessage = 'No se pudo actualizar el codigo. Intenta nuevamente.';
      }
    }catch (error) {
      console.error('Error actualizando el codigo:', error);
      this.codeMessage = 'Ocurrió un error inesperado. Intenta más tarde.';
  }
  }
  async updateBirth() {
    if (this.birthForm.invalid) {
      this.birthMessage = 'La fecha de nacimiento no es válida.';
      return;
    }
    const birth_date = this.birthForm.controls['birth_date'].value.trim();
    try {
      const success = await this.userService.updateBirth(birth_date, this.user?.user_id || 0, this.user?.session_token || '');
      if (success) {
        this.birthMessage = 'La fecha de nacimiento se actualizó correctamente.';
        this.birthForm.reset();
      }
      else {
        this.birthMessage = 'No se pudo actualizar la fecha de nacimiento. Intenta nuevamente.';
      }
    }
    catch (error) {
      console.error('Error actualizando la fecha de nacimiento:', error);
      this.birthMessage = 'Ocurrió un error inesperado. Intenta más tarde.';
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
