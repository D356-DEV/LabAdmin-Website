import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminsService } from '../../services/admins.service';
import { AuthService } from '../../services/auth.service';
import { UserData } from '../../interfaces/UserInterfaces';

interface NewsItem {
  news_id: number;
  title: string;
  content: string;
  creation_date: Date;
  author_id: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  authService = inject(AuthService);
  adminsService = inject(AdminsService);
  router = inject(Router);

  newsFeed: NewsItem[] = [
    {
      news_id: 1,
      title: 'Mantenimiento programado',
      content: 'El laboratorio 3 estará en mantenimiento el próximo viernes. Durante este tiempo, se realizarán actualizaciones de software y hardware para mejorar la experiencia de los usuarios. Recomendamos planificar sus actividades considerando esta interrupción temporal del servicio.',
      creation_date: new Date('2023-11-20'),
      author_id: 1
    },
    {
      news_id: 2,
      title: 'Nuevos equipos disponibles',
      content: 'Hemos añadido 10 nuevas computadoras al laboratorio 2. Estos equipos cuentan con procesadores de última generación, 16GB de RAM y tarjetas gráficas dedicadas, ideales para proyectos de diseño 3D y desarrollo de software. Invitamos a todos los estudiantes a aprovechar estos nuevos recursos.',
      creation_date: new Date('2023-11-15'),
      author_id: 2
    },
    {
      news_id: 3,
      title: 'Nuevos horarios de atención',
      content: 'A partir del próximo mes, los laboratorios estarán disponibles en horario extendido de lunes a viernes, desde las 7:00 am hasta las 8:00 pm. Esta medida busca dar mayor flexibilidad a los estudiantes que tienen horarios variados de clases.',
      creation_date: new Date('2023-11-10'),
      author_id: 1
    },
    {
      news_id: 4,
      title: 'Taller de programación',
      content: 'El próximo sábado se realizará un taller introductorio de programación en Python. El evento es gratuito y abierto a todos los estudiantes. Los interesados deben registrarse en la recepción del laboratorio principal antes del jueves.',
      creation_date: new Date('2023-11-05'),
      author_id: 2
    }
  ];

  user: UserData | undefined;
  isAdmin: boolean = false;
  isLoading: boolean = true;
  expandedNews: number[] = []; 
  showNewsSidebar: boolean = false;

  async ngOnInit() {
    this.user = await this.authService.getUserData();
    
    if (!this.user) {
      await this.router.navigate(['/login']);
      return;
    }

    this.isAdmin = await this.adminsService.isUserAdmin(this.user.user_id);
    this.isLoading = false;
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    if (this.showNewsSidebar) {
      this.showNewsSidebar = false;
    }
  }

  toggleNewsSidebar(): void {
    this.showNewsSidebar = !this.showNewsSidebar;
  }

  toggleNews(newsId: number): void {
    if (this.expandedNews.includes(newsId)) {
      this.expandedNews = this.expandedNews.filter(id => id !== newsId);
    } else {
      this.expandedNews.push(newsId);
    }
  }

  openAddNewsModal(): void {
    console.log('Función para añadir noticia (solo admin)');
  }

  editNews(news_id: number): void {
    console.log(`Editar noticia ${news_id} (solo admin)`);
  }

  deleteNews(news_id: number): void {
    console.log(`Eliminar noticia ${news_id} (solo admin)`);
    if (confirm('¿Estás seguro de eliminar esta noticia?')) {
      this.newsFeed = this.newsFeed.filter(news => news.news_id !== news_id);
    }
  }
}