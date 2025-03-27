import { Component } from '@angular/core';
import { UserData } from '../../interfaces/UserInterfaces';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-account',
  imports: [RouterLink, NavbarComponent, CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  public userData: UserData | undefined;
  
  reservations = [
  { laboratory: 'Laboratorio A', date: '26 de marzo de 2025', time: '10:00 AM - 12:00 PM' },
  { laboratory: 'Laboratorio B', date: '27 de marzo de 2025', time: '02:00 PM - 04:00 PM' },
  { laboratory: 'Laboratorio C', date: '28 de marzo de 2025', time: '08:00 AM - 10:00 AM' }
];
}
