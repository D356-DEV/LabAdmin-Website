import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ChatbotService } from '../../services/chatbot.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface ChatMessage {
  sender: string;
  text: string;
  time: string;
  isError?: boolean;
}


@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    DatePipe
  ],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  @ViewChild('chatBox') chatBox!: ElementRef;
  
  userInput = '';
  conversation: ChatMessage[] = [];
  isTyping = false;
  currentTime = new Date();

  constructor(
    private chatbotService: ChatbotService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.showInitialMessages();
  }

  private showInitialMessages() {
    const initialMessages = [
      'Hola, soy tu asistente de turnos. Puedes preguntarme cosas como:',
      '• ¿A qué hora trabaja [nombre]?',
      '• ¿Quién está de turno en la [mañana/tarde/noche]?',
      '• ¿Quién trabaja hoy a las [hora]?'
    ];

    initialMessages.forEach((msg, index) => {
      setTimeout(() => {
        this.addBotMessage(msg);
      }, 500 * (index + 1));
    });
  }

  async sendMessage() {
    const message = this.userInput.trim();
    if (!message) return;

    this.addMessage('user', message);
    this.userInput = '';
    
    this.isTyping = true;
    
    try {
      // Paso 1: Procesar con Wit.ai
      const witResponse = await this.chatbotService.processMessage(message).toPromise();
      
      // Paso 2: Consultar BD
      const dbResponse = await this.chatbotService.queryDatabase(
        witResponse.data?.intent?.name || '',
        witResponse.data?.entities || {}
      ).toPromise();

      this.handleDatabaseResponse(dbResponse);

    } catch (error) {
      this.addBotMessage('Error: ' + (error as Error).message, true);
    }
    
    this.isTyping = false;
  }

  private handleDatabaseResponse(response: any) {
    if (response.status === 'success') {
      if (response.data && response.data.length > 0) {
        response.data.forEach((encargado: any) => {
          const inicio = encargado.Turno_inicio.substring(0, 5);
          const fin = encargado.Turno_Fin.substring(0, 5);
          this.addBotMessage(`${encargado.nombre}: ${inicio} - ${fin}`);
        });
      } else {
        this.addBotMessage(response.message || 'No se encontraron resultados');
      }
    } else {
      this.addBotMessage(response.message || 'Error al obtener datos', true);
    }
  }

  private addMessage(sender: string, text: string, isError = false) {
    this.conversation.push({
      sender,
      text,
      time: this.datePipe.transform(new Date(), 'HH:mm') || '',
      isError
    });
    this.scrollToBottom();
  }

  private addBotMessage(text: string, isError = false) {
    this.addMessage('bot', text, isError);
  }

  private scrollToBottom() {
    setTimeout(() => {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    }, 100);
  }
}