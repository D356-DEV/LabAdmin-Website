import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RecoveryComponent } from './pages/recovery/recovery.component';
import { HomeComponent } from './pages/home/home.component';
import { AccountComponent } from './pages/account/account.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { LabsComponent } from './pages/labs/labs.component';
import { authGuard } from './auth/auth.guard';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { LabComponent } from './pages/lab/lab.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ContactComponent } from './pages/contact/contact.component';
import { InventaryregisterComponent } from './pages/inventaryregister/inventaryregister.component';
import { AdminListComponent } from './pages/admin-list/admin-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'LabAdmin | Ingresar' },
  { path: 'register', component: RegisterComponent, title: 'LabAdmin | Registro' },
  { path: 'recovery', component: RecoveryComponent, title: 'LabAdmin | Recuperar contraseña' },
  { path: 'terms', component: TermsComponent, title: 'LabAdmin | Terminos del Servicio' },
  { path: 'privacy', component: PrivacyComponent, title: 'LabAdmin | Politica de Privacidad ' },
  { path: 'faq', component: FaqComponent, title: 'LabAdmin | FAQ' },
  { path: 'contact', component: ContactComponent, title: 'LabAdmin | Contacto' },
  { path: 'inventaryregister', component: InventaryregisterComponent, title: 'LabAdmin | Registro de Inventario'},
  { path: 'home', component: HomeComponent, title: 'LabAdmin | Inicio', canActivate: [authGuard] },
  { path: 'account', component: AccountComponent, title: 'LabAdmin | Cuenta', canActivate: [authGuard] },
  { path: 'chatbot',component:ChatbotComponent,title:'LabAdmin | Chatbot', canActivate: [authGuard] },
  { path: 'labs',component: LabsComponent, title:'LabAdmin | Laboratorios', canActivate: [authGuard] },
  { path: 'lab/:lab_id', component: LabComponent, title: 'LabAdmin | Laboratorio', canActivate: [authGuard] },
  { path: 'admin/list', component: AdminListComponent, title: 'LabAdmin | admin-list',canActivate:[authGuard] },
];
