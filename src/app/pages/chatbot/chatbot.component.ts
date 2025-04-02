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
  isThinking?: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
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
      'Hola, soy tu asistente de laboratorios. Puedes preguntarme cosas como:',
      '• ¿Quién supervisa Biología Molecular?',
      '• ¿A qué hora abre Química Orgánica?',
      '• ¿Está abierto el laboratorio de Nanotecnología a las 10:00?',
      '• ¿En qué laboratorio trabaja Carlos Perez?'
    ];

    initialMessages.forEach((msg, index) => {
      setTimeout(() => {
        this.addBotMessage(msg);
      }, 500 * (index + 1));
    });
  }

  async sendMessage() {
    const message = this.userInput.trim();
    
    // Validación adicional en el componente
    if (!message) {
      this.addBotMessage('Por favor escribe tu pregunta', true);
      return;
    }
  
    this.addMessage('user', message);
    this.userInput = '';
    
    // Mostrar mensaje de "pensando..."
    const thinkingMsg = this.addMessage('bot', '...', false, true);
    
    try {
      const response = await this.chatbotService.sendMessage(message).toPromise();
      
      // Eliminar el mensaje de "pensando..."
      this.conversation = this.conversation.filter(msg => msg !== thinkingMsg);
      
      if (response.status === 'success') {
        // Procesar la respuesta y dividir las líneas
        const respuesta = response.data.respuesta;
        if (respuesta) {
          const lineas = respuesta.split('\n');
          
          for (let i = 0; i < lineas.length; i++) {
            await new Promise(resolve => setTimeout(resolve, i * 300));
            if (i === 0) {
              this.addBotMessage(lineas[i]);
            } else {
              const lastMsg = this.conversation[this.conversation.length - 1];
              if (lastMsg.sender === 'bot') {
                lastMsg.text += '\n' + lineas[i];
              }
            }
          }
        } else {
          this.addBotMessage('No recibí una respuesta válida', true);
        }
      } else {
        this.addBotMessage(response.message || 'Error al procesar tu solicitud', true);
      }
    } catch (error) {
      this.conversation = this.conversation.filter(msg => msg !== thinkingMsg);
      
      // Manejo específico para errores conocidos
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('400')) {
        this.addBotMessage('Error: La solicitud no fue válida. Por favor intenta con otra pregunta.', true);
      } else {
        this.addBotMessage('Error: ' + errorMessage, true);
      }
    }
  }

  private addMessage(sender: string, text: string, isError = false, isThinking = false): ChatMessage {
    const msg: ChatMessage = {
      sender,
      text,
      time: this.datePipe.transform(new Date(), 'HH:mm') || '',
      isError,
      isThinking
    };
    this.conversation.push(msg);
    this.scrollToBottom();
    return msg;
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