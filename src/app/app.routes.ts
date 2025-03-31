import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RecoveryComponent } from './pages/recovery/recovery.component';
import { HomeComponent } from './pages/home/home.component';
import { AccountComponent } from './pages/account/account.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { LabComponent } from './pages/lab/lab.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'LabAdmin | Ingresar' },
  { path: 'register', component: RegisterComponent, title: 'LabAdmin | Registro' },
  { path: 'recovery', component: RecoveryComponent, title: 'LabAdmin | Recuperar contraseña' },
  { path: 'home', component: HomeComponent, title: 'LabAdmin | Inicio'},
  { path: 'account', component: AccountComponent, title: 'LabAdmin | Cuenta'},
  { path: 'chatbot',component:ChatbotComponent,title:'LabAdmin | Chatbot' },
  {path: 'labs',component: LabComponent,title:'LabAdmin | Laboratorio'}
];
